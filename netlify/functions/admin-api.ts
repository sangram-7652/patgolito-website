import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import {
  checkLoginRateLimit,
  recordFailedLogin,
  resetLoginAttempts,
  validateAdminPassword,
  createAdminSessionToken,
  verifyAdminSessionToken,
  recordAuditLog,
  getAuditLogs,
  getAdminReviews,
  toggleReviewVerification,
  deleteReviewRecord,
  getAdminDeletionRequests,
  updateDeletionRequestStatus,
  executePermanentAccountPurge,
  lookupPublicDeletionStatus,
  getAdminDashboardStats,
} from '../../src/server/adminService';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-admin-token',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Content-Type': 'application/json',
};

function jsonResponse(statusCode: number, data: any) {
  return {
    statusCode,
    headers: corsHeaders,
    body: JSON.stringify(data),
  };
}

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  const rawPath = event.path || '';
  // Normalize path removing /.netlify/functions/admin-api or /api
  let subPath = rawPath
    .replace(/^\/\.netlify\/functions\/admin-api/, '')
    .replace(/^\/api/, '');
  if (!subPath.startsWith('/')) subPath = '/' + subPath;

  const clientIp =
    event.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    event.headers['client-ip'] ||
    '127.0.0.1';

  // Helper for admin auth verification
  const authenticateAdmin = () => {
    const authHeader = event.headers['authorization'] || event.headers['x-admin-token'];
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    return verifyAdminSessionToken(token);
  };

  try {
    // 1. POST /admin/login
    if (subPath === '/admin/login' && event.httpMethod === 'POST') {
      const rateLimit = checkLoginRateLimit(clientIp);
      if (!rateLimit.allowed) {
        return jsonResponse(429, {
          error: `Terminal locked for security due to multiple failed attempts. Please retry in ${rateLimit.retryAfterSeconds} seconds.`,
          retryAfterSeconds: rateLimit.retryAfterSeconds,
        });
      }

      const body = event.body ? JSON.parse(event.body) : {};
      const result = validateAdminPassword(body.password);

      if (!result.valid || !result.admin) {
        recordFailedLogin(clientIp);
        await recordAuditLog({
          adminUser: 'UNKNOWN_ATTEMPT',
          action: 'ADMIN_LOGIN_FAILED',
          details: `Failed authentication attempt from IP ${clientIp}`,
          ip: clientIp,
        });

        const updatedRate = checkLoginRateLimit(clientIp);
        return jsonResponse(401, {
          error: 'Invalid administrator password.',
          remainingAttempts: updatedRate.remaining,
        });
      }

      resetLoginAttempts(clientIp);
      const token = createAdminSessionToken(result.admin);

      await recordAuditLog({
        adminUser: result.admin.name,
        action: 'ADMIN_LOGIN_SUCCESS',
        details: `Administrator logged into operations terminal from IP ${clientIp}`,
        ip: clientIp,
      });

      return jsonResponse(200, { success: true, token, admin: result.admin });
    }

    // 2. Public lookup: GET /deletion-requests/status
    if (subPath === '/deletion-requests/status' && event.httpMethod === 'GET') {
      const queryText = event.queryStringParameters?.query || '';
      const result = await lookupPublicDeletionStatus(queryText);
      return jsonResponse(200, result);
    }

    // All subsequent /admin/* routes require authentication
    if (subPath.startsWith('/admin')) {
      const auth = authenticateAdmin();
      if (!auth.valid || !auth.admin) {
        return jsonResponse(401, { error: auth.error || 'Unauthorized administrative access.' });
      }
      const admin = auth.admin;

      // GET /admin/session
      if (subPath === '/admin/session' && event.httpMethod === 'GET') {
        return jsonResponse(200, { authenticated: true, admin });
      }

      // POST /admin/logout
      if (subPath === '/admin/logout' && event.httpMethod === 'POST') {
        await recordAuditLog({
          adminUser: admin.name,
          action: 'ADMIN_LOGOUT',
          details: 'Administrator signed out of operations terminal',
          ip: clientIp,
        });
        return jsonResponse(200, { success: true });
      }

      // GET /admin/stats
      if (subPath === '/admin/stats' && event.httpMethod === 'GET') {
        const stats = await getAdminDashboardStats();
        return jsonResponse(200, stats);
      }

      // GET /admin/reviews
      if (subPath === '/admin/reviews' && event.httpMethod === 'GET') {
        const search = event.queryStringParameters?.search || '';
        const rating = event.queryStringParameters?.rating ? Number(event.queryStringParameters.rating) : undefined;
        const verified = event.queryStringParameters?.verified !== undefined ? event.queryStringParameters.verified === 'true' : undefined;
        const sortBy = (event.queryStringParameters?.sortBy as any) || 'newest';
        const page = event.queryStringParameters?.page ? Number(event.queryStringParameters.page) : 1;
        const pageSize = event.queryStringParameters?.pageSize ? Number(event.queryStringParameters.pageSize) : 10;

        const data = await getAdminReviews({ search, rating, verified, sortBy, page, pageSize });
        return jsonResponse(200, data);
      }

      // PATCH /admin/reviews/:id/verify
      const reviewVerifyMatch = subPath.match(/^\/admin\/reviews\/([^/]+)\/verify$/);
      if (reviewVerifyMatch && event.httpMethod === 'PATCH') {
        const reviewId = reviewVerifyMatch[1];
        const body = event.body ? JSON.parse(event.body) : {};
        const result = await toggleReviewVerification(reviewId, Boolean(body.verified), admin.name, clientIp);
        return jsonResponse(result.success ? 200 : 400, result);
      }

      // DELETE /admin/reviews/:id
      const reviewDeleteMatch = subPath.match(/^\/admin\/reviews\/([^/]+)$/);
      if (reviewDeleteMatch && event.httpMethod === 'DELETE') {
        const reviewId = reviewDeleteMatch[1];
        const result = await deleteReviewRecord(reviewId, admin.name, clientIp);
        return jsonResponse(result.success ? 200 : 400, result);
      }

      // GET /admin/deletion-requests
      if (subPath === '/admin/deletion-requests' && event.httpMethod === 'GET') {
        const search = event.queryStringParameters?.search || '';
        const status = event.queryStringParameters?.status || 'all';
        const sortBy = (event.queryStringParameters?.sortBy as any) || 'newest';
        const page = event.queryStringParameters?.page ? Number(event.queryStringParameters.page) : 1;
        const pageSize = event.queryStringParameters?.pageSize ? Number(event.queryStringParameters.pageSize) : 10;

        const data = await getAdminDeletionRequests({ search, status, sortBy, page, pageSize });
        return jsonResponse(200, data);
      }

      // PATCH /admin/deletion-requests/:id/status
      const deletionStatusMatch = subPath.match(/^\/admin\/deletion-requests\/([^/]+)\/status$/);
      if (deletionStatusMatch && event.httpMethod === 'PATCH') {
        const docId = deletionStatusMatch[1];
        const body = event.body ? JSON.parse(event.body) : {};
        const result = await updateDeletionRequestStatus(docId, body.status, body.adminNotes, admin.name, clientIp);
        return jsonResponse(result.success ? 200 : 400, result);
      }

      // POST /admin/deletion-requests/:id/execute-purge
      const deletionPurgeMatch = subPath.match(/^\/admin\/deletion-requests\/([^/]+)\/execute-purge$/);
      if (deletionPurgeMatch && event.httpMethod === 'POST') {
        const docId = deletionPurgeMatch[1];
        const result = await executePermanentAccountPurge(docId, admin.name, clientIp);
        return jsonResponse(result.success ? 200 : 500, result);
      }

      // GET /admin/audit-logs
      if (subPath === '/admin/audit-logs' && event.httpMethod === 'GET') {
        const limitCount = event.queryStringParameters?.limit ? Number(event.queryStringParameters.limit) : 50;
        const logs = await getAuditLogs(limitCount);
        return jsonResponse(200, { logs });
      }
    }

    return jsonResponse(404, { error: 'Admin API endpoint not found.' });
  } catch (err: any) {
    console.error('Unhandled Admin API Error in Netlify Function:', err);
    return jsonResponse(500, { error: 'Internal server error processing admin operation.' });
  }
};
