import React, { useState } from 'react';
import { 
  Trash2, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Smartphone, 
  Clock, 
  FileText, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowLeft, 
  Copy, 
  Search, 
  HelpCircle, 
  ChevronDown, 
  Check, 
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Info
} from 'lucide-react';
import { Breadcrumb } from './Breadcrumb';
import { submitAccountDeletionRequest, lookupAccountDeletionRequest, AccountDeletionRequest } from '../lib/firebase';
import { BlurText, SplitText } from './AnimatedText';
import BorderGlow from './BorderGlow';

interface DeleteAccountPageProps {
  onNavigate?: (tab: 'landing' | 'about' | 'terms' | 'privacy' | 'delete-account') => void;
  onOpenBooking: () => void;
}

export const DeleteAccountPage: React.FC<DeleteAccountPageProps> = ({
  onNavigate,
  onOpenBooking,
}) => {
  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [accountType, setAccountType] = useState<'customer' | 'driver_partner' | 'helper'>('customer');
  const [reasonCategory, setReasonCategory] = useState('no_longer_needed');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [confirmClearActiveOrders, setConfirmClearActiveOrders] = useState(false);
  const [confirmIrreversibleLoss, setConfirmIrreversibleLoss] = useState(false);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<AccountDeletionRequest | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Status Lookup State
  const [lookupQuery, setLookupQuery] = useState('');
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupResult, setLookupResult] = useState<AccountDeletionRequest | null | 'not_found'>(null);

  // Active Tab for Page Section
  const [activeSection, setActiveSection] = useState<'request_form' | 'status_lookup' | 'app_instructions'>('request_form');

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const generateRequestId = () => {
    const randomHex = Math.floor(100000 + Math.random() * 900000).toString();
    return `DEL-PAT-${randomHex}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setFormError('Please enter a valid 10-digit registered Indian mobile number.');
      return;
    }
    if (!email || !email.includes('@') || !email.includes('.')) {
      setFormError('Please enter a valid registered email address.');
      return;
    }
    if (!fullName.trim() || fullName.trim().length < 2) {
      setFormError('Please enter your full name as registered on the PATGOLITO account.');
      return;
    }
    if (!confirmClearActiveOrders || !confirmIrreversibleLoss) {
      setFormError('Please acknowledge both confirmation statements to proceed.');
      return;
    }

    setIsSubmitting(true);
    const newRequestId = generateRequestId();

    try {
      const result = await submitAccountDeletionRequest({
        requestId: newRequestId,
        fullName: fullName.trim(),
        phone: cleanPhone,
        email: email.trim().toLowerCase(),
        accountType,
        reasonCategory,
        additionalNotes: additionalNotes.trim(),
      });

      if (result.success) {
        const now = new Date();
        const purgeDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        setSubmissionSuccess({
          requestId: newRequestId,
          fullName: fullName.trim(),
          phone: cleanPhone,
          email: email.trim().toLowerCase(),
          accountType,
          reasonCategory,
          additionalNotes: additionalNotes.trim(),
          status: 'pending',
          createdAt: now.toISOString(),
          purgeTargetDate: purgeDate.toISOString(),
          source: 'web_portal',
        });
      } else {
        setFormError(result.error || 'Failed to submit request. Please try again or email official@patgolito.com.');
      }
    } catch (err) {
      setFormError('An unexpected error occurred. Please contact support@patgolito.com directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2500);
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupQuery.trim()) return;

    setIsLookingUp(true);
    setLookupResult(null);

    try {
      const res = await lookupAccountDeletionRequest(lookupQuery.trim());
      setLookupResult(res || 'not_found');
    } catch {
      setLookupResult('not_found');
    } finally {
      setIsLookingUp(false);
    }
  };

  const faqs = [
    {
      q: 'Why does Google Play require this Account Deletion page?',
      a: 'In accordance with Google Play Store User Data and Account Deletion policies, any application that allows users to create an account must also provide a public web resource where users can request deletion of their account and associated personal data without having to reinstall the app.',
    },
    {
      q: 'What happens immediately after submitting a deletion request?',
      a: 'Your account access is placed in suspension mode within 24 hours. You will no longer receive marketing communications, app notifications, or booking promotions. Active login sessions on mobile devices will be invalidated.',
    },
    {
      q: 'Can I cancel my account deletion request if I change my mind?',
      a: 'Yes. PATGOLITO provides a 7-day grace period. If you submitted the request by mistake or wish to continue using our Lucknow transport and helper services, simply send an email to official@patgolito.com or support@patgolito.com with your Reference ID within 7 days, and your request will be cancelled.',
    },
    {
      q: 'Why must certain financial and transaction records be retained?',
      a: 'Under Indian statutory regulations including Section 128 of the Companies Act 2013 and Section 35(1) of the Central Goods and Services Tax (CGST) Act 2017, registered commercial logistics entities are legally required to retain financial transaction records, tax invoices, and commercial ledgers for statutory audit periods (up to 7-8 years). These records cannot be purged immediately upon request.',
    },
    {
      q: 'What should I do if I have an active ride or pending wallet balance?',
      a: 'Please complete or cancel any active goods transport bookings prior to requesting account deletion. Any verified wallet balance or refundable deposits must be claimed or settled through our support team before the permanent purge date.',
    },
    {
      q: 'Who can I contact if I have further data privacy concerns?',
      a: 'You can write directly to our Data Protection & Grievance Officer at Zoago Logistics Solutions Private Limited (Brand: PATGOLITO) via official@patgolito.com or support@patgolito.com, or call our Lucknow operations center at +91 9278499882.',
    },
  ];

  return (
    <div className="bg-white text-zinc-950 min-h-screen">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        id="delete-account-breadcrumb"
        items={[
          { label: 'Home', href: '/', tab: 'landing' },
          { label: 'Account & Data Deletion', href: '/delete-account', active: true },
        ]}
        onNavigate={onNavigate as any}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12">
        {/* Header Banner */}
        <div className="space-y-4 border-b border-zinc-200 pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-zinc-900 text-white px-3 py-1 rounded-full text-xs font-bold border border-zinc-700">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Google Play Store Data Safety Compliance</span>
            </span>
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold border border-emerald-300">
              <Lock className="w-3.5 h-3.5" />
              <span>User Rights & Privacy Portal</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-black">
            <SplitText text="DELETE YOUR ACCOUNT & DATA" />
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-600">
            <span className="font-bold text-black">Operating Entity: Zoago Logistics Solutions Private Limited</span>
            <span>•</span>
            <span className="font-semibold text-zinc-900">Brand: PATGOLITO</span>
            <span>•</span>
            <span>Lucknow, Uttar Pradesh, India</span>
          </div>

          <p className="text-sm text-zinc-600 max-w-3xl leading-relaxed pt-1">
            <BlurText text="This official account and data deletion portal enables PATGOLITO users, shippers, driver partners, and loading helpers to request permanent deletion of their account credentials and associated personal data in full compliance with Google Play Developer Policies and applicable Indian data protection standards." delay={0.15} />
          </p>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-zinc-200 pb-2">
          <button
            onClick={() => setActiveSection('request_form')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeSection === 'request_form'
                ? 'bg-black text-white shadow-sm'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
            <span>Submit Deletion Request</span>
          </button>
          <button
            onClick={() => setActiveSection('app_instructions')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeSection === 'app_instructions'
                ? 'bg-black text-white shadow-sm'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>In-App Mobile Steps</span>
          </button>
          <button
            onClick={() => setActiveSection('status_lookup')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeSection === 'status_lookup'
                ? 'bg-black text-white shadow-sm'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-amber-400" />
            <span>Track Existing Request</span>
          </button>
        </div>

        {/* Section 1: Data Retention & Deletion Disclosures (Google Play Mandatory Disclosures) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-black">
              Data Handling & Deletion Disclosures
            </h2>
            <span className="text-xs text-zinc-500 font-semibold">Play Console Rule §4.8</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Box 1: What Data Is Permanently Deleted */}
            <BorderGlow
              edgeSensitivity={30}
              glowColor="40 80 80"
              backgroundColor="#fafafa"
              borderRadius={16}
              glowRadius={40}
              glowIntensity={1}
              coneSpread={25}
              animated={false}
              colors={['#10b981', '#34d399', '#f59e0b']}
            >
              <div className="border border-zinc-200 rounded-2xl p-6 bg-zinc-50/50 space-y-4 h-full">
                <div className="flex items-center gap-2 text-zinc-950 font-bold text-sm">
                  <div className="w-7 h-7 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </div>
                  <span>Data Permanently Purged & Erased</span>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  The following personal data will be irrevocably deleted from our active production database, cache systems, and operational mirrors within 30 calendar days:
                </p>
                <ul className="space-y-2 text-xs text-zinc-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                    <span><strong>Account Profile & Auth:</strong> Name, registered phone number, email address, password hashes, and profile images.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                    <span><strong>Saved Locations:</strong> Stored home, office, warehouse, and shop addresses, plus custom delivery notes.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                    <span><strong>Trip Logs & Preferences:</strong> Past pickup & drop route waypoints, vehicle selection records, and goods descriptions.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                    <span><strong>Helper Instructions:</strong> Specific loading and unloading preferences and customer ratings.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                    <span><strong>Device & Push Tokens:</strong> FCM device push tokens, marketing opt-ins, and active authorization sessions.</span>
                  </li>
                </ul>
              </div>
            </BorderGlow>

            {/* Box 2: What Data Is Retained & Legal Grounds */}
            <BorderGlow
              edgeSensitivity={30}
              glowColor="40 80 80"
              backgroundColor="#fafafa"
              borderRadius={16}
              glowRadius={40}
              glowIntensity={1}
              coneSpread={25}
              animated={false}
              colors={['#10b981', '#34d399', '#f59e0b']}
            >
              <div className="border border-zinc-200 rounded-2xl p-6 bg-zinc-50/50 space-y-4 h-full">
                <div className="flex items-center gap-2 text-zinc-950 font-bold text-sm">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span>Data Retained & Mandatory Statutory Grounds</span>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Under prevailing Indian statutes, logistics platforms are obligated to preserve specific historical business records for mandatory audit windows:
                </p>
                <ul className="space-y-2 text-xs text-zinc-700">
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Tax & Invoicing Records (7–8 Years):</strong> Mandated by Section 128 of the Indian Companies Act, 2013 and Section 35(1) of the CGST Act, 2017.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Driver & Helper Remittance Records:</strong> Mandated under Income Tax Act, 1961 for TDS filing and payment settlement compliance.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Dispute & Safety Inquiries:</strong> Unresolved claims, insurance disputes, or ongoing police inquiries under the Information Technology Act, 2000.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Anonymized Statistical Data:</strong> Aggregated, non-personally identifiable route metrics for city traffic and infrastructure planning.</span>
                  </li>
                </ul>
              </div>
            </BorderGlow>
          </div>

          {/* Timeline & Grace Period Highlight */}
          <BorderGlow
            edgeSensitivity={30}
            glowColor="40 80 80"
            backgroundColor="#09090b"
            borderRadius={16}
            glowRadius={40}
            glowIntensity={1}
            coneSpread={25}
            animated={false}
            colors={['#10b981', '#34d399', '#f59e0b']}
          >
            <div className="p-4 sm:p-5 bg-zinc-950 text-white rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 text-emerald-400 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">
                    30-Day Permanent Deletion Timeline • 7-Day Grace Cancellation Window
                  </p>
                  <p className="text-[11px] text-zinc-400">
                    Account is deactivated within 24h. If requested accidentally, email us within 7 days with your Reference ID to reinstate.
                  </p>
                </div>
              </div>
              <a
                href="mailto:official@patgolito.com?subject=Cancel%20Account%20Deletion%20Request"
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition shrink-0 border border-zinc-700 cursor-pointer"
              >
                Need to Cancel?
              </a>
            </div>
          </BorderGlow>
        </div>

        {/* SECTION VIEW: Web Request Form */}
        {activeSection === 'request_form' && (
          <div className="space-y-6">
            <BorderGlow
              edgeSensitivity={30}
              glowColor="40 80 80"
              backgroundColor="#ffffff"
              borderRadius={24}
              glowRadius={40}
              glowIntensity={1}
              coneSpread={25}
              animated={false}
              colors={['#10b981', '#34d399', '#f59e0b']}
            >
              <div className="border border-zinc-200 rounded-3xl p-6 sm:p-8 bg-white shadow-xs space-y-6">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Official Web Submission Flow
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-black mt-2">
                  Submit Account & Data Deletion Request
                </h2>
                <p className="text-xs sm:text-sm text-zinc-600 mt-1">
                  Please provide the registered details associated with your PATGOLITO account. Our compliance desk will verify the details and initiate the de-identification and deletion lifecycle.
                </p>
              </div>

              {submissionSuccess ? (
                /* Success Confirmation State */
                <div className="border-2 border-emerald-500 bg-emerald-50/40 rounded-2xl p-6 sm:p-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-black">
                        Deletion Request Received & Queued
                      </h3>
                      <p className="text-xs text-zinc-600">
                        Zoago Logistics Solutions Private Limited has received your official account deletion request.
                      </p>
                    </div>
                  </div>

                  {/* Reference ID Card */}
                  <div className="bg-white border border-zinc-300 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                        Official Request Reference ID
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                        Status: Pending Verification
                      </span>
                    </div>

                    <div className="flex items-center justify-between bg-zinc-50 p-3 rounded-xl border border-zinc-200">
                      <code className="text-lg sm:text-xl font-mono font-black text-black tracking-wider">
                        {submissionSuccess.requestId}
                      </code>
                      <button
                        onClick={() => handleCopyId(submissionSuccess.requestId)}
                        className="px-3 py-1.5 bg-black hover:bg-zinc-800 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                      >
                        {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedId ? 'Copied' : 'Copy ID'}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-zinc-700">
                      <div>
                        <span className="text-zinc-500 font-medium">Registered User:</span>
                        <p className="font-bold text-zinc-950">{submissionSuccess.fullName}</p>
                      </div>
                      <div>
                        <span className="text-zinc-500 font-medium">Phone / Email:</span>
                        <p className="font-bold text-zinc-950">+91 {submissionSuccess.phone} • {submissionSuccess.email}</p>
                      </div>
                      <div>
                        <span className="text-zinc-500 font-medium">Submission Timestamp:</span>
                        <p className="font-bold text-zinc-950">{new Date(submissionSuccess.createdAt).toLocaleString('en-IN')}</p>
                      </div>
                      <div>
                        <span className="text-zinc-500 font-medium">Estimated Permanent Purge Date:</span>
                        <p className="font-bold text-zinc-950">{new Date(submissionSuccess.purgeTargetDate).toLocaleDateString('en-IN')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Next Steps Guidance */}
                  <div className="space-y-2 text-xs text-zinc-700">
                    <p className="font-bold text-zinc-950">Next steps and what to expect:</p>
                    <ol className="list-decimal pl-4 space-y-1 text-zinc-600">
                      <li>Your mobile account sessions and push tokens will be invalidated within 24 hours.</li>
                      <li>You have a 7-day grace period. If you change your mind, email <strong>official@patgolito.com</strong> with your Reference ID (<code>{submissionSuccess.requestId}</code>).</li>
                      <li>Following the 7-day period, our data systems will permanently purge all non-statutory records within 30 days.</li>
                    </ol>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      onClick={() => {
                        window.print();
                      }}
                      className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Print Confirmation Slip</span>
                    </button>
                    <button
                      onClick={() => {
                        setSubmissionSuccess(null);
                        setFullName('');
                        setPhone('');
                        setEmail('');
                        setConfirmClearActiveOrders(false);
                        setConfirmIrreversibleLoss(false);
                      }}
                      className="px-4 py-2.5 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      Submit Another Request
                    </button>
                  </div>
                </div>
              ) : (
                /* The Interactive Request Form */
                <form onSubmit={handleSubmit} className="space-y-5">
                  {formError && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs flex items-center gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-zinc-900">
                        Full Legal Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-black focus:bg-white transition"
                      />
                    </div>

                    {/* Account Type */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-zinc-900">
                        Account Role <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={accountType}
                        onChange={(e) => setAccountType(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-black focus:bg-white transition"
                      >
                        <option value="customer">Customer / Shipper (Goods Transport)</option>
                        <option value="driver_partner">Driver Partner (Commercial Vehicle Owner)</option>
                        <option value="helper">Loading / Unloading Helper Partner</option>
                      </select>
                    </div>

                    {/* Registered Mobile Phone */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-zinc-900">
                        Registered Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-xs font-bold text-zinc-500">
                          +91
                        </span>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                          placeholder="9278499882"
                          className="w-full pl-11 pr-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-black focus:bg-white transition"
                        />
                      </div>
                      <span className="text-[11px] text-zinc-500">The 10-digit number used during app registration</span>
                    </div>

                    {/* Registered Email */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-zinc-900">
                        Registered Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-black focus:bg-white transition"
                      />
                      <span className="text-[11px] text-zinc-500">Used to send reference tracking confirmation</span>
                    </div>
                  </div>

                  {/* Reason for Deletion */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-900">
                      Primary Reason for Deletion <span className="text-zinc-500 font-normal">(Optional)</span>
                    </label>
                    <select
                      value={reasonCategory}
                      onChange={(e) => setReasonCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-black focus:bg-white transition"
                    >
                      <option value="no_longer_needed">I no longer need transport or moving services</option>
                      <option value="relocated_from_lucknow">I have relocated outside Lucknow / Uttar Pradesh</option>
                      <option value="privacy_concerns">Privacy or data collection concerns</option>
                      <option value="duplicate_account">Created duplicate or incorrect account</option>
                      <option value="switching_phone_number">Changing mobile number or device</option>
                      <option value="other">Other reason</option>
                    </select>
                  </div>

                  {/* Additional Notes */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-900">
                      Additional Notes or Comments
                    </label>
                    <textarea
                      rows={2}
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      placeholder="Optional feedback on why you are requesting account closure..."
                      className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-black focus:bg-white transition resize-none"
                    />
                  </div>

                  {/* Mandatory Acknowledgments */}
                  <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-3">
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-zinc-800">
                      <input
                        type="checkbox"
                        checked={confirmClearActiveOrders}
                        onChange={(e) => setConfirmClearActiveOrders(e.target.checked)}
                        className="mt-0.5 rounded-sm border-zinc-400 text-black focus:ring-black cursor-pointer"
                      />
                      <span>
                        I confirm that I have <strong>no active goods transport in transit</strong>, pending driver dues, or unresolved commercial chargebacks.
                      </span>
                    </label>

                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-zinc-800">
                      <input
                        type="checkbox"
                        checked={confirmIrreversibleLoss}
                        onChange={(e) => setConfirmIrreversibleLoss(e.target.checked)}
                        className="mt-0.5 rounded-sm border-zinc-400 text-black focus:ring-black cursor-pointer"
                      />
                      <span>
                        I understand that deleting my account permanently removes saved addresses, order logs, and helper preferences after the 7-day grace window, subject only to statutory tax retention laws.
                      </span>
                    </label>
                  </div>

                  {/* Submit Action */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-[11px] text-zinc-500 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Encrypted SSL Transmission • Lucknow Operations Desk</span>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-zinc-400 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Submitting Request...</span>
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4" />
                          <span>Permanently Request Account Deletion</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </BorderGlow>
        </div>
      )}

        {/* SECTION VIEW: In-App Mobile App Steps */}
        {activeSection === 'app_instructions' && (
          <div className="space-y-6">
            <div className="border border-zinc-200 rounded-3xl p-6 sm:p-8 bg-white shadow-xs space-y-6">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-zinc-800 bg-zinc-100 px-2.5 py-1 rounded-full border border-zinc-200">
                  Android & iOS Native App Workflow
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-black mt-2">
                  How to Delete Your Account in the PATGOLITO Mobile App
                </h2>
                <p className="text-xs sm:text-sm text-zinc-600 mt-1">
                  If you currently have the official PATGOLITO application installed on your Android smartphone, you can trigger instant account self-deletion directly from the user profile settings:
                </p>
              </div>

              {/* 5-Step Process Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border border-zinc-200 rounded-2xl p-5 bg-zinc-50 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-black text-white font-black text-xs flex items-center justify-center">
                    1
                  </div>
                  <h3 className="text-xs font-bold text-black">Launch & Login</h3>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Open the PATGOLITO app on your Android device and make sure you are logged into the account you want to delete.
                  </p>
                </div>

                <div className="border border-zinc-200 rounded-2xl p-5 bg-zinc-50 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-black text-white font-black text-xs flex items-center justify-center">
                    2
                  </div>
                  <h3 className="text-xs font-bold text-black">Tap Profile</h3>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Navigate to the bottom navigation bar and tap on the <strong>Profile / Account</strong> tab in the bottom right corner.
                  </p>
                </div>

                <div className="border border-zinc-200 rounded-2xl p-5 bg-zinc-50 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-black text-white font-black text-xs flex items-center justify-center">
                    3
                  </div>
                  <h3 className="text-xs font-bold text-black">Security & Privacy</h3>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Scroll down to the <strong>Account Settings</strong> section and select <strong>Security & Data Privacy</strong>.
                  </p>
                </div>

                <div className="border border-zinc-200 rounded-2xl p-5 bg-zinc-50 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-black text-white font-black text-xs flex items-center justify-center">
                    4
                  </div>
                  <h3 className="text-xs font-bold text-black">Tap 'Delete Account'</h3>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Scroll to the bottom of the security menu and tap the red <strong>Delete Account & Data</strong> button.
                  </p>
                </div>

                <div className="border border-zinc-200 rounded-2xl p-5 bg-zinc-50 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-black text-white font-black text-xs flex items-center justify-center">
                    5
                  </div>
                  <h3 className="text-xs font-bold text-black">OTP Verification</h3>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Enter the 6-digit one-time password (OTP) sent to your registered mobile number to confirm identity and execute deletion.
                  </p>
                </div>

                <div className="border border-emerald-200 bg-emerald-50 rounded-2xl p-5 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                    ✓
                  </div>
                  <h3 className="text-xs font-bold text-emerald-950">Immediate Deactivation</h3>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    Your session will be logged out immediately and your data queued for permanent purge in 30 days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION VIEW: Status Lookup Tool */}
        {activeSection === 'status_lookup' && (
          <div className="space-y-6">
            <BorderGlow
              edgeSensitivity={30}
              glowColor="40 80 80"
              backgroundColor="#ffffff"
              borderRadius={24}
              glowRadius={40}
              glowIntensity={1}
              coneSpread={25}
              animated={false}
              colors={['#10b981', '#34d399', '#f59e0b']}
            >
              <div className="border border-zinc-200 rounded-3xl p-6 sm:p-8 bg-white shadow-xs space-y-6">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-amber-900 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    Request Tracking Tool
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-black mt-2">
                    Track Account Deletion Status
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-600 mt-1">
                    Enter your Reference ID (e.g. <code>DEL-PAT-XXXXXX</code>) or your registered 10-digit mobile number to inspect the live status of your deletion request:
                  </p>
                </div>

                <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    required
                    value={lookupQuery}
                    onChange={(e) => setLookupQuery(e.target.value)}
                    placeholder="Enter Reference ID (DEL-PAT-...) or 10-digit Phone"
                    className="flex-1 px-4 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-black focus:bg-white transition"
                  />
                  <button
                    type="submit"
                    disabled={isLookingUp}
                    className="px-5 py-2.5 bg-black hover:bg-zinc-800 disabled:bg-zinc-400 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
                  >
                    {isLookingUp ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                    <span>Check Status</span>
                  </button>
                </form>

                {lookupResult === 'not_found' && (
                  <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs text-zinc-600 flex items-center gap-3">
                    <Info className="w-4 h-4 text-zinc-500 shrink-0" />
                    <span>
                      No deletion request found for "<strong>{lookupQuery}</strong>". Please verify your Reference ID or registered phone number, or submit a new request.
                    </span>
                  </div>
                )}

                {lookupResult && lookupResult !== 'not_found' && (
                  <div className="border border-zinc-200 bg-zinc-50 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-black">
                          {lookupResult.requestId}
                        </span>
                        <span className="text-xs text-zinc-500">
                          ({lookupResult.accountType === 'customer' ? 'Customer' : lookupResult.accountType === 'driver_partner' ? 'Driver Partner' : 'Helper'})
                        </span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        lookupResult.status === 'completed' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : lookupResult.status === 'scheduled_for_purge'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}>
                        Status: {lookupResult.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-700 pt-1">
                      <div>
                        <span className="text-zinc-500 font-medium">Registered User:</span>
                        <p className="font-bold text-zinc-950">{lookupResult.fullName}</p>
                      </div>
                      <div>
                        <span className="text-zinc-500 font-medium">Phone / Email:</span>
                        <p className="font-bold text-zinc-950">+91 {lookupResult.phone} • {lookupResult.email}</p>
                      </div>
                      <div>
                        <span className="text-zinc-500 font-medium">Submission Date:</span>
                        <p className="font-bold text-zinc-950">{new Date(lookupResult.createdAt).toLocaleString('en-IN')}</p>
                      </div>
                      <div>
                        <span className="text-zinc-500 font-medium">Scheduled Purge Date:</span>
                        <p className="font-bold text-zinc-950">{new Date(lookupResult.purgeTargetDate).toLocaleDateString('en-IN')}</p>
                      </div>
                    </div>

                    <p className="text-[11px] text-zinc-500 pt-1 border-t border-zinc-200">
                      To request immediate cancellation before the purge date, email <strong>official@patgolito.com</strong> or <strong>support@patgolito.com</strong> with your Reference ID.
                    </p>
                  </div>
                )}
              </div>
            </BorderGlow>
          </div>
        )}

        {/* Section: Frequently Asked Questions */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-zinc-700" />
            <h2 className="text-xl sm:text-2xl font-black text-black">
              Frequently Asked Questions (FAQ)
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="border border-zinc-200 rounded-2xl overflow-hidden transition"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-zinc-900 hover:bg-zinc-50 transition cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-zinc-500 transition-transform shrink-0 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 text-xs text-zinc-600 leading-relaxed border-t border-zinc-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Section: Official Corporate Governance & Grievance Contact */}
        <div className="border border-zinc-200 rounded-3xl p-6 sm:p-8 bg-zinc-50 space-y-5">
          <div className="flex items-center gap-2 font-bold text-zinc-950 text-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Corporate Entity & Data Grievance Officer</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-zinc-500 font-medium">Corporate Entity:</span>
              <p className="font-bold text-zinc-900">Zoago Logistics Solutions Private Limited</p>
            </div>
            <div className="space-y-1">
              <span className="text-zinc-500 font-medium">Brand & Platform:</span>
              <p className="font-bold text-zinc-900">PATGOLITO</p>
            </div>
            <div className="space-y-1">
              <span className="text-zinc-500 font-medium">Operations Center:</span>
              <p className="font-bold text-zinc-900 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                <span>Lucknow, Uttar Pradesh, India</span>
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-zinc-500 font-medium">Support Hotline:</span>
              <p className="font-bold text-zinc-900 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                <span>+91 9278499882</span>
              </p>
            </div>
            <div className="space-y-1 sm:col-span-2">
              <span className="text-zinc-500 font-medium">Official Grievance & Data Emails:</span>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-0.5">
                <a
                  href="mailto:official@patgolito.com"
                  className="font-bold text-zinc-900 hover:text-emerald-700 flex items-center gap-1 transition"
                >
                  <Mail className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                  <span>official@patgolito.com</span>
                </a>
                <span className="text-zinc-400 hidden sm:inline">•</span>
                <a
                  href="mailto:support@patgolito.com"
                  className="font-bold text-zinc-900 hover:text-emerald-700 flex items-center gap-1 transition"
                >
                  <Mail className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                  <span>support@patgolito.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-zinc-200 flex flex-wrap gap-4">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) onNavigate('landing');
            }}
            className="bg-black hover:bg-zinc-800 text-white font-bold text-xs px-5 py-3 rounded-xl transition flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </a>
          <a
            href="/privacy"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) onNavigate('privacy');
            }}
            className="bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-bold text-xs px-5 py-3 rounded-xl transition flex items-center gap-2 cursor-pointer"
          >
            <span>Review Privacy Policy</span>
          </a>
          <a
            href="/terms"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) onNavigate('terms');
            }}
            className="bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-bold text-xs px-5 py-3 rounded-xl transition flex items-center gap-2 cursor-pointer"
          >
            <span>Review Terms of Service</span>
          </a>
        </div>
      </div>
    </div>
  );
};
