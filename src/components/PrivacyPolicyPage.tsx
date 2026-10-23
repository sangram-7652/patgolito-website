import React from 'react';
import { Lock, Phone, Mail, MapPin, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Breadcrumb } from './Breadcrumb';

interface PrivacyPolicyPageProps {
  onNavigate?: (tab: 'landing' | 'about' | 'terms' | 'privacy' | 'delete-account') => void;
  onOpenBooking: () => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({
  onNavigate,
  onOpenBooking,
}) => {
  return (
    <div className="bg-white text-zinc-950 min-h-screen">
      {/* Breadcrumb */}
      <Breadcrumb
        id="privacy-breadcrumb"
        items={[
          { label: 'Home', href: '/', tab: 'landing' },
          { label: 'Privacy Policy', href: '/privacy', active: true },
        ]}
        onNavigate={onNavigate as any}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-10">
        {/* Header */}
        <div className="space-y-4 border-b border-zinc-200 pb-8">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold border border-emerald-300">
            <Lock className="w-3.5 h-3.5" />
            <span>Official Privacy Policy</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-black">
            PRIVACY POLICY – PATGOLITO
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-600">
            <span className="font-bold text-black">Entity: Zoago Logistics Solutions Private Limited</span>
            <span>•</span>
            <span>Brand: PATGOLITO</span>
            <span>•</span>
            <span>Jurisdiction: Lucknow, Uttar Pradesh, India</span>
          </div>
        </div>

        {/* Preamble / Introduction */}
        <div className="p-5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs sm:text-sm text-zinc-800 leading-relaxed space-y-2">
          <p className="font-bold text-zinc-950 uppercase tracking-wider text-[11px]">
            Privacy Policy Overview
          </p>
          <p>
            This Privacy Policy describes how Patgolito (operated by Zoago Logistics Solutions Private Limited) collects, uses, stores, shares, and protects personal information when users access our website, mobile services, or transportation platform. By using Patgolito services, you acknowledge and agree to the practices described in this Privacy Policy.
          </p>
        </div>

        {/* Policy Content - Official 14 Sections */}
        <div className="space-y-7 text-sm text-zinc-700 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-2">
            <h2 className="text-lg font-black text-black">1. Information We Collect</h2>
            <p>
              Patgolito may collect personal information including name, mobile number, email address, pickup and delivery locations, transaction details, and communication records. Such information may be collected when users create bookings, contact support, submit enquiries, or use our services.
            </p>
            <p>
              Information may also be collected where required for legal, operational, or compliance purposes.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h2 className="text-lg font-black text-black">2. Purpose of Collection and Use</h2>
            <p>
              Information collected by Patgolito is used for processing bookings, coordinating transportation services, facilitating communication, improving operational efficiency, and enhancing user experience. Information may also be used for fraud prevention, dispute resolution, legal compliance, and service improvement initiatives.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <h2 className="text-lg font-black text-black">3. Sharing and Disclosure of Information</h2>
            <p>
              Patgolito may share information with drivers, vehicle owners, logistics partners, payment service providers, technology vendors, and government authorities where necessary. Such sharing is limited to legitimate business, operational, or legal requirements. Patgolito does not sell personal information to unrelated third parties.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-2">
            <h2 className="text-lg font-black text-black">4. Data Protection and Security</h2>
            <p>
              Patgolito implements reasonable technical, administrative, and organizational safeguards to protect personal information against unauthorized access, alteration, disclosure, misuse, or destruction. While reasonable efforts are made to secure information, no electronic transmission or storage system can be guaranteed as completely secure.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-2">
            <h2 className="text-lg font-black text-black">5. Cookies and Analytics</h2>
            <p>
              Our website may use cookies, analytics tools, and similar technologies to improve functionality, monitor performance, and understand user preferences. Users may modify browser settings to restrict or disable cookies; however, certain features of the website may not function properly.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-2">
            <h2 className="text-lg font-black text-black">6. Location Information</h2>
            <p>
              Location information may be collected to facilitate transportation services, optimize routes, verify service requests, and improve operational efficiency. Such information is used only for legitimate service-related purposes and business operations.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-2">
            <h2 className="text-lg font-black text-black">7. Data Retention</h2>
            <p>
              Patgolito may retain personal information for as long as necessary to provide services, comply with legal obligations, maintain business records, resolve disputes, enforce agreements, and protect legitimate business interests. Retention periods may vary depending on applicable laws and operational requirements.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-2">
            <h2 className="text-lg font-black text-black">8. Third-Party Services and Links</h2>
            <p>
              The Patgolito platform may contain links to third-party websites, applications, or services. These entities operate independently and maintain their own policies. Patgolito is not responsible for the content, privacy practices, security measures, or activities of third-party platforms.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-3">
            <h2 className="text-lg font-black text-black">9. User Rights & Account Deletion</h2>
            <p>
              Subject to applicable laws, users may request correction, updating, or review of personal information maintained by Patgolito. Users also maintain the right to delete their registered account and request permanent erasure of associated personal data.
            </p>
            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-black flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Google Play Account & Data Deletion Portal</span>
                </p>
                <p className="text-[11px] text-zinc-600">
                  Users can initiate account closure and request permanent erasure of personal identifiers, saved locations, and trip logs.
                </p>
              </div>
              <a
                href="/delete-account"
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigate) onNavigate('delete-account');
                }}
                className="px-3.5 py-2 bg-black hover:bg-zinc-800 text-white text-xs font-bold rounded-xl transition cursor-pointer shrink-0 inline-block"
              >
                Request Account Deletion
              </a>
            </div>
          </section>

          {/* Section 10 */}
          <section className="space-y-2">
            <h2 className="text-lg font-black text-black">10. Legal Compliance</h2>
            <p>
              Patgolito may disclose information where required by applicable laws, court orders, government directives, law enforcement requests, or regulatory requirements. Such disclosures shall be made in accordance with applicable legal obligations and procedures.
            </p>
          </section>

          {/* Section 11 */}
          <section className="space-y-2">
            <h2 className="text-lg font-black text-black">11. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Patgolito shall not be liable for unauthorized access, data breaches, service interruptions, or losses arising from circumstances beyond its reasonable control. Users acknowledge the inherent risks associated with internet-based services.
            </p>
          </section>

          {/* Section 12 */}
          <section className="space-y-2">
            <h2 className="text-lg font-black text-black">12. Children's Privacy</h2>
            <p>
              Patgolito services are not directed toward children. We do not knowingly collect personal information from minors without appropriate authorization where required by law. If such information is identified, reasonable steps may be taken to remove it.
            </p>
          </section>

          {/* Section 13 */}
          <section className="space-y-2">
            <h2 className="text-lg font-black text-black">13. Policy Updates</h2>
            <p>
              Patgolito reserves the right to modify, amend, or update this Privacy Policy at any time. Updated versions will be published on the website and become effective upon publication unless otherwise specified.
            </p>
          </section>

          {/* Section 14 */}
          <section className="space-y-3">
            <h2 className="text-lg font-black text-black">14. Contact Information</h2>
            <p>
              For questions, requests, or concerns relating to privacy matters, users may contact Patgolito through its official email address, phone number, or website contact channels. We will make reasonable efforts to address legitimate privacy-related enquiries.
            </p>

            <div className="mt-4 p-5 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-3 text-xs">
              <div className="flex items-center gap-2 font-bold text-zinc-950 text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Official Privacy & Compliance Desk</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <span className="text-zinc-500 font-medium">Corporate Entity:</span>
                  <p className="font-bold text-zinc-900">Zoago Logistics Solutions Private Limited</p>
                </div>
                <div className="space-y-1">
                  <span className="text-zinc-500 font-medium">Brand & Platform:</span>
                  <p className="font-bold text-zinc-900">PATGOLITO</p>
                </div>
                <div className="space-y-1">
                  <span className="text-zinc-500 font-medium">Jurisdiction & Location:</span>
                  <p className="font-bold text-zinc-900 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                    <span>Lucknow, Uttar Pradesh, India</span>
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-zinc-500 font-medium">Support & Privacy Phone:</span>
                  <p className="font-bold text-zinc-900 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                    <span>+91 9278499882</span>
                  </p>
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <span className="text-zinc-500 font-medium">Official Privacy Emails:</span>
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
          </section>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-zinc-200 flex flex-wrap gap-4">
          <button
            onClick={() => onNavigate && onNavigate('landing')}
            className="bg-black hover:bg-zinc-800 text-white font-bold text-xs px-5 py-3 rounded-xl transition flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </button>
          <button
            onClick={onOpenBooking}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-3 rounded-xl transition flex items-center gap-2 cursor-pointer"
          >
            <span>Book a Vehicle & Helpers</span>
          </button>
        </div>
      </div>
    </div>
  );
};

