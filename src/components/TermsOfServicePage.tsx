import React from 'react';
import { FileText, Phone, Mail, MapPin, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Breadcrumb } from './Breadcrumb';

interface TermsOfServicePageProps {
  onNavigate?: (tab: 'landing' | 'about' | 'terms' | 'privacy' | 'delete-account') => void;
  onOpenBooking: () => void;
}

export const TermsOfServicePage: React.FC<TermsOfServicePageProps> = ({
  onNavigate,
  onOpenBooking,
}) => {
  return (
    <div className="bg-white text-zinc-950 min-h-screen">
      {/* Breadcrumb */}
      <Breadcrumb
        id="terms-breadcrumb"
        items={[
          { label: 'Home', href: '/', tab: 'landing' },
          { label: 'Terms & Conditions', href: '/terms', active: true },
        ]}
        onNavigate={onNavigate as any}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-10">
        {/* Header */}
        <div className="space-y-4 border-b border-zinc-200 pb-8">
          <div className="inline-flex items-center gap-2 bg-zinc-100 text-zinc-900 px-3 py-1 rounded-full text-xs font-bold border border-zinc-300">
            <FileText className="w-3.5 h-3.5" />
            <span>Official Legal Terms</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-black">
            TERMS & CONDITIONS – PATGOLITO
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-600">
            <span className="font-bold text-black">Entity: Zoago Logistics Solutions Private Limited</span>
            <span>•</span>
            <span>Brand: PATGOLITO</span>
            <span>•</span>
            <span>Jurisdiction: Lucknow, Uttar Pradesh, India</span>
          </div>
        </div>

        {/* Terms Sections */}
        <div className="space-y-8 text-sm text-zinc-700 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-2.5">
            <h2 className="text-lg font-black text-black">1. Platform Service</h2>
            <p>
              Zoago Logistics Solutions Private Limited ('PATGOLITO') operates as a technology-enabled logistics platform connecting customers with independent vehicle owners and drivers for transportation services. PATGOLITO facilitates booking, coordination, and communication between users and service providers. PATGOLITO does not own, lease, or operate transport vehicles unless expressly stated. All transportation services are performed by independent drivers. Users agree to use the platform in accordance with applicable Indian laws.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-2.5">
            <h2 className="text-lg font-black text-black">2. Independent Drivers</h2>
            <p>
              Drivers registered on the PATGOLITO platform are independent service providers and not employees, agents, partners, or representatives of PATGOLITO. Drivers are responsible for maintaining valid driving licences, vehicle permits, insurance, and other regulatory requirements. Drivers must comply with the Motor Vehicles Act, 1988 and applicable transport regulations. PATGOLITO may suspend or remove drivers who violate platform policies. Drivers remain responsible for their own conduct and operations.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-2.5">
            <h2 className="text-lg font-black text-black">3. Customer Responsibility</h2>
            <p>
              Customers must provide accurate pickup and delivery details while placing orders. Customers are responsible for ensuring that goods are properly packed and suitable for transportation. Incorrect information may result in delays, additional charges, or cancellation. Customers shall comply with applicable laws regarding transportation of goods. PATGOLITO reserves the right to refuse bookings containing false information.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-2.5">
            <h2 className="text-lg font-black text-black">4. Pricing and Payments</h2>
            <p>
              Service charges may include base fare, distance charges, waiting charges, tolls, taxes, and other applicable fees. Pricing may vary depending on demand, location, vehicle type, and operational conditions. All charges shall be communicated before or during booking confirmation. Users agree to pay all applicable charges. Taxes shall apply as per relevant GST laws where applicable.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-2.5">
            <h2 className="text-lg font-black text-black">5. Booking, Cancellation and Refunds</h2>
            <p>
              Customers may cancel bookings before commencement of transportation. Cancellation charges may apply if a driver has already been assigned or reached the pickup location. Refunds, where applicable, shall be processed through the original payment method. Refund requests shall be reviewed on a case-by-case basis. Additional terms may be provided in the Cancellation and Refund Policy.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-2.5">
            <h2 className="text-lg font-black text-black">6. Goods Ownership and Compliance</h2>
            <p>
              Customers represent that they have legal ownership, authority, or permission to transport the goods being booked. Users shall not transport stolen, prohibited, or illegally possessed items. Customers are responsible for compliance with applicable laws. PATGOLITO may cooperate with law enforcement authorities where legally required. Violations may lead to account suspension.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-2.5">
            <h2 className="text-lg font-black text-black">7. Prohibited Items</h2>
            <p>
              Users shall not transport hazardous chemicals, explosives, weapons, narcotic substances, counterfeit goods, wildlife products, or any item prohibited under Indian law. Restricted goods may require permits. PATGOLITO reserves the right to reject such shipments. Violations may be reported to authorities. Relevant laws include the NDPS Act, 1985 and other applicable laws.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-2.5">
            <h2 className="text-lg font-black text-black">8. Driver and Vehicle Responsibility</h2>
            <p>
              Drivers are responsible for operating vehicles safely and lawfully. Drivers must maintain valid registration certificates, permits, insurance policies, and driving licences. Drivers shall comply with the Motor Vehicles Act, 1988 and road safety regulations. PATGOLITO may verify documentation but is not responsible for a driver's legal obligations. Drivers remain solely responsible for vehicle operation.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-2.5">
            <h2 className="text-lg font-black text-black">9. Limitation of Liability</h2>
            <p>
              PATGOLITO acts solely as an intermediary platform facilitating transportation arrangements. PATGOLITO shall not be liable for loss, theft, damage, delay, deterioration, or consequential losses relating to transported goods. Transportation services are provided by independent drivers. Liability shall be limited to the extent required by applicable law. Users utilize the platform at their own risk.
            </p>
          </section>

          {/* Section 10 */}
          <section className="space-y-2.5">
            <h2 className="text-lg font-black text-black">10. Privacy and Data Protection</h2>
            <p>
              PATGOLITO may collect personal information such as names, phone numbers, addresses, and booking details to facilitate services. Information may be shared with drivers where necessary. PATGOLITO shall take reasonable measures to protect user information. Users consent to processing of information according to the Privacy Policy. Information may be disclosed where required by law.
            </p>
          </section>

          {/* Section 11 */}
          <section className="space-y-2.5">
            <h2 className="text-lg font-black text-black">11. Dispute Resolution and Jurisdiction</h2>
            <p>
              The parties shall attempt to resolve disputes amicably through discussion and negotiation. Unresolved disputes shall be subject to the exclusive jurisdiction of courts in Lucknow, Uttar Pradesh. These Terms shall be governed by the laws of India. Electronic records may be relied upon where permitted by law. Users agree to this jurisdiction.
            </p>
          </section>

          {/* Section 12 */}
          <section className="space-y-2.5">
            <h2 className="text-lg font-black text-black">12. Modification of Terms</h2>
            <p>
              PATGOLITO reserves the right to amend, modify, or update these Terms and Conditions at any time. Updated versions shall be published on the website. Continued use of the platform constitutes acceptance of revised terms. Users should review the Terms periodically. Changes become effective upon publication unless otherwise stated.
            </p>
          </section>

          {/* Section 13 */}
          <section className="space-y-3">
            <h2 className="text-lg font-black text-black">13. Contact Information</h2>
            <p>
              For queries, complaints, legal notices, or support requests, users may contact PATGOLITO through its official communication channels. Contact details published on the website shall be considered valid. PATGOLITO will make reasonable efforts to respond promptly. Users should retain booking details for support purposes. Official communications may be sent electronically.
            </p>

            <div className="mt-4 p-5 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-3 text-xs">
              <div className="flex items-center gap-2 font-bold text-zinc-950 text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Official Contact Details</span>
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
                  <span className="text-zinc-500 font-medium">Support Hotline:</span>
                  <p className="font-bold text-zinc-900 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                    <span>+91 9278499882</span>
                  </p>
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <span className="text-zinc-500 font-medium">Official Emails:</span>
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

