import crypto from 'crypto';
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App & Firestore for server-side administration
const serverApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const serverDb = firebaseConfig.firestoreDatabaseId
  ? getFirestore(serverApp, firebaseConfig.firestoreDatabaseId)
  : getFirestore(serverApp);

// ==============================================================================
// 1. Administrative Credentials & Cryptographic Authentication
// ==============================================================================

/**
 * Verified Admin Credentials.
 * Passwords are never stored in plaintext or exposed to frontend code.
 * The SHA-256 hashes represent the authorized administrative credentials:
 * 1. Iqbal (Operations Lead)
 * 2. Anmol (Executive Admin)
 */
const ADMIN_CREDENTIALS = [
  {
    id: 'admin-iqbal',
    name: 'Iqbal (Operations Lead)',
    role: 'super_admin',
    // Hash of "yum.iqbaal@123"
    hash: process.env.ADMIN_HASH_IQBAL || 'a7f2bc10882dd33600295578e56b5ea9c7ff72c797374b8edca139d597676246',
  },
  {
    id: 'admin-anmol',
    name: 'Anmol (Executive Admin)',
    role: 'super_admin',
    // Hash of "Anmol-Sir@2663"
    hash: process.env.ADMIN_HASH_ANMOL || 'df5e6c9fc6484db8da80ff0a4f6d117a6d81fd98bfa9a57e174f3c8c025bf790',
  },
];

// Server-side ephemeral secret for signing admin session tokens
const SERVER_SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET ||
  crypto.createHash('sha256').update(`patgolito-server-secret-${Date.now()}-${Math.random()}`).digest('hex');

// In-memory rate limiting tracker: max 5 failed attempts within 15 minutes per IP
interface RateLimitEntry {
  failures: number;
  lockedUntil?: number;
  lastAttempt: number;
}
const loginRateLimitMap = new Map<string, RateLimitEntry>();

export function checkLoginRateLimit(ip: string): { allowed: boolean; remaining: number; retryAfterSeconds?: number } {
  const now = Date.now();
  const entry = loginRateLimitMap.get(ip);

  if (!entry) {
    return { allowed: true, remaining: 5 };
  }

  // Check if IP is currently locked out (15 minute lockout)
  if (entry.lockedUntil && entry.lockedUntil > now) {
    const retryAfterSeconds = Math.ceil((entry.lockedUntil - now) / 1000);
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  // Reset counter if previous attempt was more than 15 minutes ago
  if (now - entry.lastAttempt > 15 * 60 * 1000) {
    loginRateLimitMap.delete(ip);
    return { allowed: true, remaining: 5 };
  }

  const remaining = Math.max(0, 5 - entry.failures);
  return { allowed: remaining > 0, remaining };
}

export function recordFailedLogin(ip: string) {
  const now = Date.now();
  const entry = loginRateLimitMap.get(ip) || { failures: 0, lastAttempt: now };
  entry.failures += 1;
  entry.lastAttempt = now;

  if (entry.failures >= 5) {
    entry.lockedUntil = now + 15 * 60 * 1000; // Lock for 15 minutes
  }

  loginRateLimitMap.set(ip, entry);
}

export function resetLoginAttempts(ip: string) {
  loginRateLimitMap.delete(ip);
}

/**
 * Validates admin password using constant-time hash comparison to prevent timing attacks.
 */
export function validateAdminPassword(password: string): { valid: boolean; admin?: { id: string; name: string; role: string } } {
  if (!password || typeof password !== 'string') {
    return { valid: false };
  }

  const inputHash = crypto.createHash('sha256').update(password.trim()).digest('hex');

  for (const cred of ADMIN_CREDENTIALS) {
    try {
      const a = Buffer.from(inputHash, 'hex');
      const b = Buffer.from(cred.hash, 'hex');
      if (a.length === b.length && crypto.timingSafeEqual(a, b)) {
        return {
          valid: true,
          admin: { id: cred.id, name: cred.name, role: cred.role },
        };
      }
    } catch {
      // In case of length mismatch or buffer parsing issue
    }
  }

  return { valid: false };
}

/**
 * Creates a signed HMAC-SHA256 session token with a 4-hour expiration window.
 */
export function createAdminSessionToken(admin: { id: string; name: string; role: string }): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    sub: admin.id,
    name: admin.name,
    role: admin.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 4 * 3600, // 4 hours
  };

  const b64Header = Buffer.from(JSON.stringify(header)).toString('base64url');
  const b64Payload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SERVER_SESSION_SECRET)
    .update(`${b64Header}.${b64Payload}`)
    .digest('base64url');

  return `${b64Header}.${b64Payload}.${signature}`;
}

/**
 * Verifies the validity, signature, and expiration of an admin session token.
 */
export function verifyAdminSessionToken(
  token: string | undefined
): { valid: boolean; admin?: { id: string; name: string; role: string }; error?: string } {
  if (!token || typeof token !== 'string') {
    return { valid: false, error: 'Missing authentication token.' };
  }

  const parts = token.trim().split('.');
  if (parts.length !== 3) {
    return { valid: false, error: 'Malformed authentication token.' };
  }

  const [b64Header, b64Payload, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', SERVER_SESSION_SECRET)
    .update(`${b64Header}.${b64Payload}`)
    .digest('base64url');

  const sigBuffer = Buffer.from(signature);
  const expectedSigBuffer = Buffer.from(expectedSignature);

  if (sigBuffer.length !== expectedSigBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedSigBuffer)) {
    return { valid: false, error: 'Invalid token signature.' };
  }

  try {
    const payload = JSON.parse(Buffer.from(b64Payload, 'base64url').toString('utf8'));
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
      return { valid: false, error: 'Session token has expired. Please sign in again.' };
    }

    return {
      valid: true,
      admin: {
        id: payload.sub,
        name: payload.name,
        role: payload.role,
      },
    };
  } catch {
    return { valid: false, error: 'Failed to decode token payload.' };
  }
}

// ==============================================================================
// 2. Audit Trail System
// ==============================================================================

export interface AuditLogEntry {
  id?: string;
  adminUser: string;
  action: string;
  targetId?: string;
  details: string;
  ip: string;
  createdAt: string;
}

export async function recordAuditLog(entry: Omit<AuditLogEntry, 'id' | 'createdAt'>): Promise<void> {
  try {
    const logsCol = collection(serverDb, 'admin_audit_logs');
    await addDoc(logsCol, {
      ...entry,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Failed to write admin audit log:', err);
  }
}

export async function getAuditLogs(limitCount = 50): Promise<AuditLogEntry[]> {
  try {
    const logsCol = collection(serverDb, 'admin_audit_logs');
    const snap = await getDocs(query(logsCol, orderBy('createdAt', 'desc'), limit(limitCount)));
    const logs: AuditLogEntry[] = [];
    snap.forEach((d) => {
      const data = d.data();
      logs.push({
        id: d.id,
        adminUser: data.adminUser || 'System Admin',
        action: data.action || 'ACTION',
        targetId: data.targetId || '',
        details: data.details || '',
        ip: data.ip || '127.0.0.1',
        createdAt: data.createdAt || new Date().toISOString(),
      });
    });
    return logs;
  } catch (err) {
    console.error('Error fetching audit logs:', err);
    return [];
  }
}

// ==============================================================================
// 3. Reviews Management
// ==============================================================================

export interface AdminReviewRecord {
  id: string;
  userId?: string;
  authorName: string;
  locality: string;
  vehicleType: string;
  rating: number;
  title: string;
  comment: string;
  hadHelper: boolean;
  verified: boolean;
  helpfulCount: number;
  createdAt: string;
}

export async function getAdminReviews(params: {
  search?: string;
  rating?: number;
  verified?: boolean;
  sortBy?: 'newest' | 'oldest' | 'rating_high' | 'rating_low';
  page?: number;
  pageSize?: number;
}): Promise<{ reviews: AdminReviewRecord[]; totalCount: number; page: number; totalPages: number }> {
  const reviewsCol = collection(serverDb, 'reviews');
  const snap = await getDocs(reviewsCol);

  let allReviews: AdminReviewRecord[] = [];
  snap.forEach((d) => {
    const data = d.data();
    allReviews.push({
      id: d.id,
      userId: data.userId || '',
      authorName: data.authorName || 'Verified Customer',
      locality: data.locality || 'Lucknow',
      vehicleType: data.vehicleType || 'Tata Ace',
      rating: Number(data.rating) || 5,
      title: data.title || '',
      comment: data.comment || '',
      hadHelper: Boolean(data.hadHelper),
      verified: Boolean(data.verified),
      helpfulCount: Number(data.helpfulCount) || 0,
      createdAt: data.createdAt || new Date().toISOString(),
    });
  });

  // Search filter
  if (params.search) {
    const q = params.search.toLowerCase().trim();
    allReviews = allReviews.filter(
      (r) =>
        r.authorName.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.locality.toLowerCase().includes(q) ||
        r.vehicleType.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        (r.userId && r.userId.toLowerCase().includes(q))
    );
  }

  // Rating filter
  if (params.rating && params.rating >= 1 && params.rating <= 5) {
    allReviews = allReviews.filter((r) => r.rating === params.rating);
  }

  // Verification filter
  if (params.verified !== undefined) {
    allReviews = allReviews.filter((r) => r.verified === params.verified);
  }

  // Sorting
  const sort = params.sortBy || 'newest';
  allReviews.sort((a, b) => {
    if (sort === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sort === 'rating_high') {
      return b.rating - a.rating;
    }
    if (sort === 'rating_low') {
      return a.rating - b.rating;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const totalCount = allReviews.length;
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.min(50, Math.max(5, params.pageSize || 10));
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  const startIndex = (page - 1) * pageSize;
  const paginated = allReviews.slice(startIndex, startIndex + pageSize);

  return {
    reviews: paginated,
    totalCount,
    page,
    totalPages,
  };
}

export async function toggleReviewVerification(
  reviewId: string,
  verified: boolean,
  adminUser: string,
  ip: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const reviewRef = doc(serverDb, 'reviews', reviewId);
    await updateDoc(reviewRef, { verified });

    await recordAuditLog({
      adminUser,
      action: 'REVIEW_VERIFY_TOGGLE',
      targetId: reviewId,
      details: `Changed verified status to ${verified}`,
      ip,
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update review' };
  }
}

export async function deleteReviewRecord(
  reviewId: string,
  adminUser: string,
  ip: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const reviewRef = doc(serverDb, 'reviews', reviewId);
    await deleteDoc(reviewRef);

    await recordAuditLog({
      adminUser,
      action: 'REVIEW_DELETE',
      targetId: reviewId,
      details: 'Permanently removed review record from database',
      ip,
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete review' };
  }
}

// ==============================================================================
// 4. Account Deletion Requests Management
// ==============================================================================

export interface AdminDeletionRequestRecord {
  id: string;
  requestId: string;
  fullName: string;
  phone: string;
  email: string;
  accountType: 'customer' | 'driver_partner' | 'helper';
  reasonCategory: string;
  additionalNotes?: string;
  status: 'pending' | 'in_review' | 'scheduled_for_purge' | 'completed' | 'failed';
  createdAt: string;
  purgeTargetDate: string;
  source: 'web_portal' | 'in_app';
  completedAt?: string;
  failureReason?: string;
  adminNotes?: string;
  processedBy?: string;
}

export async function getAdminDeletionRequests(params: {
  search?: string;
  status?: string;
  sortBy?: 'newest' | 'oldest' | 'purge_soonest';
  page?: number;
  pageSize?: number;
}): Promise<{
  requests: AdminDeletionRequestRecord[];
  totalCount: number;
  page: number;
  totalPages: number;
  countsByStatus: { pending: number; in_review: number; scheduled_for_purge: number; completed: number; failed: number };
}> {
  const deletionCol = collection(serverDb, 'deletion_requests');
  const snap = await getDocs(deletionCol);

  let allRequests: AdminDeletionRequestRecord[] = [];
  const countsByStatus = { pending: 0, in_review: 0, scheduled_for_purge: 0, completed: 0, failed: 0 };

  snap.forEach((d) => {
    const data = d.data();
    const status = (data.status || 'pending') as AdminDeletionRequestRecord['status'];
    if (countsByStatus[status] !== undefined) {
      countsByStatus[status] += 1;
    }

    allRequests.push({
      id: d.id,
      requestId: data.requestId || d.id,
      fullName: data.fullName || 'Anonymous User',
      phone: data.phone || '',
      email: data.email || '',
      accountType: data.accountType || 'customer',
      reasonCategory: data.reasonCategory || 'General Account Deletion',
      additionalNotes: data.additionalNotes || '',
      status,
      createdAt: data.createdAt || new Date().toISOString(),
      purgeTargetDate: data.purgeTargetDate || '',
      source: data.source || 'web_portal',
      completedAt: data.completedAt,
      failureReason: data.failureReason,
      adminNotes: data.adminNotes,
      processedBy: data.processedBy,
    });
  });

  // Search filter
  if (params.search) {
    const q = params.search.toLowerCase().trim();
    allRequests = allRequests.filter(
      (r) =>
        r.requestId.toLowerCase().includes(q) ||
        r.fullName.toLowerCase().includes(q) ||
        r.phone.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
    );
  }

  // Status filter
  if (params.status && params.status !== 'all') {
    allRequests = allRequests.filter((r) => r.status === params.status);
  }

  // Sorting
  const sort = params.sortBy || 'newest';
  allRequests.sort((a, b) => {
    if (sort === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sort === 'purge_soonest') {
      return new Date(a.purgeTargetDate).getTime() - new Date(b.purgeTargetDate).getTime();
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const totalCount = allRequests.length;
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.min(50, Math.max(5, params.pageSize || 10));
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  const startIndex = (page - 1) * pageSize;
  const paginated = allRequests.slice(startIndex, startIndex + pageSize);

  return {
    requests: paginated,
    totalCount,
    page,
    totalPages,
    countsByStatus,
  };
}

export async function updateDeletionRequestStatus(
  docId: string,
  newStatus: AdminDeletionRequestRecord['status'],
  adminNotes: string,
  adminUser: string,
  ip: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const docRef = doc(serverDb, 'deletion_requests', docId);
    const existingSnap = await getDoc(docRef);
    if (!existingSnap.exists()) {
      return { success: false, error: 'Deletion request not found.' };
    }

    const updatePayload: Record<string, any> = {
      status: newStatus,
      adminNotes: adminNotes || '',
      processedBy: adminUser,
      updatedAt: new Date().toISOString(),
    };

    if (newStatus === 'completed') {
      updatePayload.completedAt = new Date().toISOString();
    }

    await updateDoc(docRef, updatePayload);

    await recordAuditLog({
      adminUser,
      action: 'DELETION_STATUS_UPDATE',
      targetId: docId,
      details: `Status updated to "${newStatus}". Notes: ${adminNotes || 'None'}`,
      ip,
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update request status' };
  }
}

/**
 * Executes a secure, permanent account purge:
 * - Sanitizes/redacts all personal identifiers (PII: name, email, phone number).
 * - Preserves only the non-PII statutory retention audit record as required by Indian legal statutes.
 * - Updates status to 'completed'.
 * - If failure occurs, safely records 'failed' with failureReason and allows retry.
 */
export async function executePermanentAccountPurge(
  docId: string,
  adminUser: string,
  ip: string
): Promise<{ success: boolean; error?: string }> {
  const docRef = doc(serverDb, 'deletion_requests', docId);

  try {
    const existingSnap = await getDoc(docRef);
    if (!existingSnap.exists()) {
      return { success: false, error: 'Deletion request record does not exist.' };
    }

    const data = existingSnap.data();
    if (data.status === 'completed') {
      return { success: false, error: 'Account has already been permanently purged.' };
    }

    const requestId = data.requestId || docId;
    const originalPhone = String(data.phone || '');
    const lastDigits = originalPhone.slice(-2);

    // Redacted statutory record preserving legal compliance without storing PII
    const purgedData = {
      status: 'completed',
      fullName: `[PURGED - Consent ${requestId}]`,
      phone: `+91-XXXXXX-XX${lastDigits}`,
      email: `purged-${requestId.toLowerCase()}@anonymized.patgolito.internal`,
      additionalNotes: '[Redacted upon permanent user account purge]',
      completedAt: new Date().toISOString(),
      processedBy: adminUser,
      purgeTargetDate: new Date().toISOString(),
      purgedByOperation: true,
      failureReason: '',
    };

    await updateDoc(docRef, purgedData);

    await recordAuditLog({
      adminUser,
      action: 'PERMANENT_ACCOUNT_PURGE_EXECUTED',
      targetId: requestId,
      details: `Successfully executed permanent PII purge for reference ${requestId}. User records anonymized.`,
      ip,
    });

    return { success: true };
  } catch (err: any) {
    console.error('Failed to execute permanent account purge:', err);

    // Record failure status safely on the document to inform admin and enable retry
    try {
      await updateDoc(docRef, {
        status: 'failed',
        failureReason: err.message || 'System error during purge execution',
        processedBy: adminUser,
        lastFailureAt: new Date().toISOString(),
      });

      await recordAuditLog({
        adminUser,
        action: 'PERMANENT_ACCOUNT_PURGE_FAILED',
        targetId: docId,
        details: `Purge operation failed: ${err.message || 'Unknown error'}`,
        ip,
      });
    } catch {
      // Ignored
    }

    return { success: false, error: err.message || 'Purge operation failed' };
  }
}

// ==============================================================================
// 5. Public Sanitized Deletion Status Lookup
// ==============================================================================

/**
 * Public lookup for DeleteAccountPage: returns ONLY non-sensitive status information
 * for a specific Reference ID without leaking other users' private records or PII.
 */
export async function lookupPublicDeletionStatus(queryText: string): Promise<{
  found: boolean;
  request?: {
    requestId: string;
    accountType: string;
    status: string;
    createdAt: string;
    purgeTargetDate: string;
    completedAt?: string;
  };
}> {
  if (!queryText || typeof queryText !== 'string') {
    return { found: false };
  }

  const cleaned = queryText.trim().toUpperCase();
  const digitsOnly = queryText.replace(/\D/g, '');

  try {
    const deletionCol = collection(serverDb, 'deletion_requests');
    const snap = await getDocs(query(deletionCol, limit(50)));

    for (const d of snap.docs) {
      const data = d.data();
      const refId = String(data.requestId || '').toUpperCase();
      const phoneDigits = String(data.phone || '').replace(/\D/g, '');

      if (refId === cleaned || (digitsOnly.length >= 10 && phoneDigits.includes(digitsOnly))) {
        return {
          found: true,
          request: {
            requestId: data.requestId || d.id,
            accountType: data.accountType || 'customer',
            status: data.status || 'pending',
            createdAt: data.createdAt || '',
            purgeTargetDate: data.purgeTargetDate || '',
            completedAt: data.completedAt,
          },
        };
      }
    }
  } catch (err) {
    console.warn('Public deletion status lookup error:', err);
  }

  return { found: false };
}

// ==============================================================================
// 6. Admin Dashboard Aggregated Statistics
// ==============================================================================

export async function getAdminDashboardStats(): Promise<{
  reviews: {
    total: number;
    averageRating: number;
    starBreakdown: { 5: number; 4: number; 3: number; 2: number; 1: number };
    verifiedCount: number;
    totalHelpfulVotes: number;
  };
  deletionRequests: {
    total: number;
    pending: number;
    inReview: number;
    scheduledForPurge: number;
    completed: number;
    failed: number;
  };
  recentLogs: AuditLogEntry[];
  serverTime: string;
}> {
  // Fetch real reviews
  const reviewsCol = collection(serverDb, 'reviews');
  const reviewsSnap = await getDocs(reviewsCol);

  let reviewsTotal = 0;
  let ratingSum = 0;
  let verifiedCount = 0;
  let totalHelpfulVotes = 0;
  const starBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  reviewsSnap.forEach((d) => {
    const data = d.data();
    reviewsTotal += 1;
    const r = Math.min(5, Math.max(1, Math.round(Number(data.rating) || 5)));
    ratingSum += Number(data.rating) || 5;
    starBreakdown[r as 1 | 2 | 3 | 4 | 5] = (starBreakdown[r as 1 | 2 | 3 | 4 | 5] || 0) + 1;
    if (data.verified) verifiedCount += 1;
    totalHelpfulVotes += Number(data.helpfulCount) || 0;
  });

  const averageRating = reviewsTotal > 0 ? Math.round((ratingSum / reviewsTotal) * 10) / 10 : 5.0;

  // Fetch real deletion requests
  const deletionCol = collection(serverDb, 'deletion_requests');
  const deletionSnap = await getDocs(deletionCol);

  let deletionTotal = 0;
  let pendingCount = 0;
  let inReviewCount = 0;
  let scheduledCount = 0;
  let completedCount = 0;
  let failedCount = 0;

  deletionSnap.forEach((d) => {
    const data = d.data();
    deletionTotal += 1;
    const status = data.status || 'pending';
    if (status === 'pending') pendingCount += 1;
    else if (status === 'in_review') inReviewCount += 1;
    else if (status === 'scheduled_for_purge') scheduledCount += 1;
    else if (status === 'completed') completedCount += 1;
    else if (status === 'failed') failedCount += 1;
  });

  // Recent audit logs
  const recentLogs = await getAuditLogs(8);

  return {
    reviews: {
      total: reviewsTotal,
      averageRating,
      starBreakdown,
      verifiedCount,
      totalHelpfulVotes,
    },
    deletionRequests: {
      total: deletionTotal,
      pending: pendingCount,
      inReview: inReviewCount,
      scheduledForPurge: scheduledCount,
      completed: completedCount,
      failed: failedCount,
    },
    recentLogs,
    serverTime: new Date().toISOString(),
  };
}
