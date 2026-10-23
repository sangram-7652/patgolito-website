import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Truck,
  Users,
  MapPin,
  Phone,
  Calendar,
  FileText,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Navigation,
  Loader2,
  Info,
  ArrowUpDown,
  Plus,
  Trash2,
  Lightbulb,
  PhoneCall,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import { store } from '../lib/store';
import { ItemType, VehicleType } from '../types';
import { LocationAutocompleteInput } from './LocationAutocompleteInput';
import { calculateRouteDistance } from '../lib/maps';

const BookingRouteMap = lazy(() =>
  import('./BookingRouteMap').then((m) => ({ default: m.BookingRouteMap }))
);

interface NewBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (bookingId: string) => void;
  defaultVehicleType?: VehicleType;
  defaultNeedsHelper?: boolean;
}

// Indian mobile number validation & normalization helpers
const normalizePhone = (input: string): string => {
  const digits = input.replace(/\D/g, '');
  if (digits.length === 10) return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  if (digits.length === 12 && digits.startsWith('91')) {
    const core = digits.slice(2);
    return `+91 ${core.slice(0, 5)} ${core.slice(5)}`;
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    const core = digits.slice(1);
    return `+91 ${core.slice(0, 5)} ${core.slice(5)}`;
  }
  return input.trim();
};

const isValidIndianPhone = (input: string): boolean => {
  const digits = input.replace(/\D/g, '');
  if (digits.length === 10) {
    return /^[6-9]\d{9}$/.test(digits);
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return /^[6-9]\d{9}$/.test(digits.slice(2));
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return /^[6-9]\d{9}$/.test(digits.slice(1));
  }
  return false;
};

export const NewBookingModal: React.FC<NewBookingModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultVehicleType = 'tata_ace',
  defaultNeedsHelper = true,
}) => {
  const priceConfigs = store.getPriceConfigs();

  // Clean, production-ready form state (ZERO prefilled sample data)
  const [pickupData, setPickupData] = useState<{
    address: string;
    lat: number | null;
    lng: number | null;
    placeId: string;
  }>({
    address: '',
    lat: null,
    lng: null,
    placeId: '',
  });

  const [dropData, setDropData] = useState<{
    address: string;
    lat: number | null;
    lng: number | null;
    placeId: string;
  }>({
    address: '',
    lat: null,
    lng: null,
    placeId: '',
  });

  const [pickupContactName, setPickupContactName] = useState('');
  const [pickupContactPhone, setPickupContactPhone] = useState('');
  const [dropContactName, setDropContactName] = useState('');
  const [dropContactPhone, setDropContactPhone] = useState('');

  const [vehicleType, setVehicleType] = useState<VehicleType>(defaultVehicleType);
  const [itemType, setItemType] = useState<ItemType>('furniture');
  const [needsHelper, setNeedsHelper] = useState<boolean>(defaultNeedsHelper);
  const [helperCount, setHelperCount] = useState<number>(1);

  // Intermediate stops state (optional multi-stop support)
  const [stops, setStops] = useState<
    Array<{ id: string; address: string; lat: number | null; lng: number | null; placeId: string }>
  >([]);

  // Floor details & special instructions
  const [pickupFloor, setPickupFloor] = useState('Ground Floor');
  const [dropFloor, setDropFloor] = useState('Ground Floor');
  const [liftAvailable, setLiftAvailable] = useState(true);
  const [heavyItems, setHeavyItems] = useState(false);
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online' | 'upi'>('upi');

  // Scheduled time (defaults to 1 hour ahead)
  const [scheduledAt, setScheduledAt] = useState(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() + 60);
    return d.toISOString().slice(0, 16);
  });

  // Dynamic Routing & Distance Calculation
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [estimatedDistanceKm, setEstimatedDistanceKm] = useState<number | null>(null);
  const [durationMinutes, setDurationMinutes] = useState<number | null>(null);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Submission / Enquiry State
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEnquiryId, setSubmittedEnquiryId] = useState<string | null>(null);

  // Sync default vehicle when prop changes
  useEffect(() => {
    if (defaultVehicleType) setVehicleType(defaultVehicleType);
  }, [defaultVehicleType]);

  useEffect(() => {
    if (defaultNeedsHelper !== undefined) setNeedsHelper(defaultNeedsHelper);
  }, [defaultNeedsHelper]);

  // Reset modal when opened
  useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false);
      setSubmittedEnquiryId(null);
      setValidationErrors({});
    }
  }, [isOpen]);

  // Swap pickup & drop locations
  const handleSwapLocations = () => {
    const temp = { ...pickupData };
    setPickupData({ ...dropData });
    setDropData(temp);
  };

  // Add intermediate stop
  const handleAddStop = () => {
    if (stops.length >= 3) return;
    setStops((prev) => [
      ...prev,
      {
        id: `stop_${Date.now()}`,
        address: '',
        lat: null,
        lng: null,
        placeId: '',
      },
    ]);
  };

  const handleRemoveStop = (id: string) => {
    setStops((prev) => prev.filter((s) => s.id !== id));
  };

  const handleUpdateStop = (
    id: string,
    loc: { address: string; lat: number; lng: number; placeId: string }
  ) => {
    setStops((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...loc } : s))
    );
  };

  const stopsJson = JSON.stringify(
    stops.map((s) => ({ lat: s.lat, lng: s.lng, address: s.address }))
  );

  // Recalculate distance only when both pickup and drop coordinates are valid
  useEffect(() => {
    if (!pickupData.lat || !pickupData.lng || !dropData.lat || !dropData.lng) {
      setEstimatedDistanceKm(null);
      setDurationMinutes(null);
      setRouteError(null);
      return;
    }

    let isMounted = true;
    const fetchRoute = async () => {
      setIsCalculatingRoute(true);
      setRouteError(null);
      try {
        const intermediatePoints = stops
          .filter((s) => s.lat !== null && s.lng !== null && !isNaN(s.lat) && !isNaN(s.lng))
          .map((s) => ({
            lat: s.lat as number,
            lng: s.lng as number,
          }));

        const result = await calculateRouteDistance(
          { lat: pickupData.lat!, lng: pickupData.lng! },
          { lat: dropData.lat!, lng: dropData.lng! },
          intermediatePoints
        );

        if (isMounted) {
          setEstimatedDistanceKm(result.distanceKm);
          setDurationMinutes(result.durationMinutes);
        }
      } catch (err: any) {
        console.error('Route calculation error:', err);
        if (isMounted) {
          // Explains problem without substituting fake distance
          setRouteError(
            'Unable to compute exact road distance for these points automatically. You can still submit this enquiry and our Lucknow dispatch desk will calculate the exact route distance for you.'
          );
          setEstimatedDistanceKm(null);
          setDurationMinutes(null);
        }
      } finally {
        if (isMounted) {
          setIsCalculatingRoute(false);
        }
      }
    };

    fetchRoute();
    return () => {
      isMounted = false;
    };
  }, [pickupData.lat, pickupData.lng, dropData.lat, dropData.lng, stopsJson]);

  // Dynamic Fare Calculation based on exact formula
  const currentConfig = priceConfigs.find((c) => c.vehicleType === vehicleType) || priceConfigs[0] || {
    baseFare: 300,
    perKmRate: 14,
    helperFee: 0,
    vehicleLabel: 'Tata Ace',
  };

  const distanceVal = estimatedDistanceKm ?? 0;
  const baseFare = currentConfig.baseFare;
  const perKmRate = currentConfig.perKmRate;
  const distanceFare = Math.round(distanceVal * perKmRate);
  const helperFeeUnit = 0;
  const helperFeeTotal = 0;
  const totalEstimatedFare = baseFare + distanceFare;

  // Smart vehicle recommendation helper
  const getRecommendedVehicle = (item: ItemType): { vehicle: VehicleType; reason: string; label: string } => {
    switch (item) {
      case 'house_shifting':
        return {
          vehicle: 'tata_ace',
          label: 'Tata Ace',
          reason: 'Best for 1-2 BHK house shifting with large furniture & bulky appliances.',
        };
      case 'commercial_goods':
        return {
          vehicle: 'three_wheeler_goods',
          label: 'Three-wheeler goods loader',
          reason: 'High city mobility and strong payload for cartons, goods & materials.',
        };
      case 'fragile_goods':
        return {
          vehicle: 'tata_ace',
          label: 'Tata Ace',
          reason: 'Sturdy cargo bed and smooth suspension for safe, secure transit.',
        };
      case 'furniture':
        return {
          vehicle: 'tata_ace',
          label: 'Tata Ace',
          reason: 'Ample cargo bed length for beds, almirahs, tables, and sofas.',
        };
      case 'appliance':
        return {
          vehicle: 'compact_three_wheeler',
          label: 'Compact three-wheeler',
          reason: 'Perfect for washing machines, single/double door fridges, and water heaters.',
        };
      default:
        return {
          vehicle: 'two_wheeler',
          label: 'Two-wheeler',
          reason: 'Fast, cost-effective transport for parcels, boxes & urgent packets.',
        };
    }
  };

  const recommendedInfo = getRecommendedVehicle(itemType);

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors: Record<string, string> = {};

    if (!pickupData.address.trim()) {
      errors.pickup = 'Please select a valid pickup location.';
    }
    if (!dropData.address.trim()) {
      errors.drop = 'Please select a valid drop location.';
    }
    if (!pickupContactName.trim()) {
      errors.pickupName = 'Please enter pickup contact name.';
    }
    if (!isValidIndianPhone(pickupContactPhone)) {
      errors.pickupPhone = 'Please enter a valid 10-digit Indian mobile number (e.g., 9278499882).';
    }
    if (!dropContactName.trim()) {
      errors.dropName = 'Please enter drop contact name.';
    }
    if (!isValidIndianPhone(dropContactPhone)) {
      errors.dropPhone = 'Please enter a valid 10-digit Indian mobile number.';
    }
    if (!scheduledAt) {
      errors.scheduledAt = 'Please choose a preferred pickup date & time.';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});

    const enquiryId = `PAT-ENQ-${Math.floor(1000 + Math.random() * 9000)}`;

    // Persist as a booking enquiry in the local store
    store.createBooking({
      customerId: 'usr-guest',
      customerName: pickupContactName,
      customerPhone: normalizePhone(pickupContactPhone),
      pickupAddress: pickupData.address,
      pickupLat: pickupData.lat || 26.8467,
      pickupLng: pickupData.lng || 80.9462,
      dropAddress: dropData.address,
      dropLat: dropData.lat || 26.8467,
      dropLng: dropData.lng || 80.9462,
      pickupContactName,
      pickupContactPhone: normalizePhone(pickupContactPhone),
      dropContactName,
      dropContactPhone: normalizePhone(dropContactPhone),
      vehicleType,
      itemType,
      needsHelper,
      helperCount: needsHelper ? helperCount : 0,
      pickupFloor,
      dropFloor,
      liftAvailable,
      heavyItems,
      notes,
      scheduledAt,
      estimatedDistanceKm: estimatedDistanceKm || 0,
      baseFare,
      perKmRate,
      helperFeeUnit,
      helperFeeTotal,
      totalFare: totalEstimatedFare,
      paymentMethod,
      paymentStatus: 'pending',
    });

    setSubmittedEnquiryId(enquiryId);
    setIsSubmitted(true);

    if (onSuccess) {
      onSuccess(enquiryId);
    }
  };

  // WhatsApp enquiry draft message link generator
  const getWhatsAppEnquiryUrl = () => {
    const lines = [
      `Hello PATGOLITO, I would like to confirm my booking enquiry #${submittedEnquiryId || 'NEW'}:`,
      `• Vehicle: ${currentConfig.vehicleLabel}`,
      `• Pickup: ${pickupData.address}`,
      `• Drop: ${dropData.address}`,
      estimatedDistanceKm ? `• Est. Distance: ${estimatedDistanceKm} km` : '',
      needsHelper ? `• Helpers: ${helperCount} Helper(s) (₹${helperFeeUnit}/helper)` : '• Helpers: None',
      estimatedDistanceKm ? `• Est. Fare: ₹${totalEstimatedFare}` : '',
      `• Preferred Time: ${scheduledAt ? new Date(scheduledAt).toLocaleString('en-IN') : 'ASAP'}`,
      `• Sender: ${pickupContactName} (${normalizePhone(pickupContactPhone)})`,
      `Please confirm vehicle availability and arrival time.`,
    ].filter(Boolean);

    const message = encodeURIComponent(lines.join('\n'));
    return `https://wa.me/919278499882?text=${message}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white text-black w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-zinc-300 my-auto max-h-[92vh] flex flex-col relative z-10"
          >
            {/* Modal Header */}
            <div className="bg-black text-white p-4 sm:p-5 flex items-center justify-between shrink-0 border-b border-zinc-800">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-1 border border-emerald-500/30">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>PATGOLITO • Lucknow Transport & Logistics</span>
                </div>
                <h2 className="text-xl font-black tracking-tight text-white">
                  {isSubmitted ? 'Booking Enquiry Received' : 'Instant Fleet Fare Estimate'}
                </h2>
                <p className="text-xs text-zinc-300 font-medium">
                  {isSubmitted
                    ? 'Our Lucknow dispatch team will verify vehicle availability with you'
                    : 'Transparent Road Distance Fares • Verified Commercial Fleet • Zero Driver Bargaining'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center justify-center transition cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            {isSubmitted ? (
              /* ENQUIRY CONFIRMATION STATE (Transparent, no simulated assignment) */
              <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
                <div className="bg-emerald-50 border-2 border-emerald-500/40 rounded-2xl p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-7 h-7 text-white" />
                  </div>
                  <span className="inline-block bg-emerald-100 text-emerald-900 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full">
                    Enquiry Reference #{submittedEnquiryId}
                  </span>
                  <h3 className="text-2xl font-black text-zinc-950">
                    Booking Enquiry Successfully Submitted!
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-700 max-w-md mx-auto leading-relaxed">
                    This is a booking enquiry for confirmation, not an instant automated booking. Our Lucknow operations team is reviewing vehicle availability in your pickup area.
                  </p>
                </div>

                {/* Enquiry Details Card */}
                <div className="bg-zinc-50 rounded-2xl p-5 border border-zinc-200 space-y-3 text-xs">
                  <h4 className="font-bold text-zinc-900 uppercase tracking-wider text-[11px]">
                    Trip Summary
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-zinc-700">
                    <div>
                      <p className="font-semibold text-zinc-500">Vehicle Selected</p>
                      <p className="font-bold text-zinc-950 text-sm">{currentConfig.vehicleLabel}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-500">Helpers Requested</p>
                      <p className="font-bold text-zinc-950 text-sm">
                        {needsHelper ? `${helperCount} Helper(s) (+₹${helperFeeTotal})` : 'No Helpers'}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-500">Pickup Location</p>
                      <p className="font-medium text-zinc-900 line-clamp-2">{pickupData.address}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-500">Drop-off Location</p>
                      <p className="font-medium text-zinc-900 line-clamp-2">{dropData.address}</p>
                    </div>
                    {estimatedDistanceKm && (
                      <div>
                        <p className="font-semibold text-zinc-500">Road Distance</p>
                        <p className="font-bold text-zinc-900">{estimatedDistanceKm} km</p>
                      </div>
                    )}
                    {estimatedDistanceKm && (
                      <div>
                        <p className="font-semibold text-zinc-500">Estimated Upfront Fare</p>
                        <p className="font-black text-emerald-700 text-base">₹{totalEstimatedFare}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Direct Action Hotlines */}
                <div className="space-y-3">
                  <p className="text-xs font-bold text-zinc-900 text-center">
                    Want an instant confirmation right now?
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <a
                      href="tel:9278499882"
                      className="w-full bg-black hover:bg-zinc-800 text-white font-bold text-sm py-3.5 px-4 rounded-xl transition shadow-md flex items-center justify-center gap-2.5"
                    >
                      <PhoneCall className="w-4 h-4 text-emerald-400" />
                      <span>Call Dispatch (9278499882)</span>
                    </a>

                    <a
                      href={getWhatsAppEnquiryUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm py-3.5 px-4 rounded-xl transition shadow-md flex items-center justify-center gap-2.5"
                    >
                      <MessageSquare className="w-4 h-4 text-white" />
                      <span>Send via WhatsApp</span>
                    </a>
                  </div>
                  <p className="text-[11px] text-zinc-500 text-center leading-normal">
                    WhatsApp will open with your enquiry details pre-drafted so you can review and send whenever ready.
                  </p>
                </div>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-xs font-bold text-zinc-600 hover:text-black underline cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            ) : (
              /* BOOKING ENQUIRY FORM */
              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6 overflow-y-auto">
                {/* Notice Banner explaining enquiry model */}
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-950">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>Manual Booking Enquiry:</strong> Enter your route and details below to calculate the upfront fare. Submitting sends an enquiry to our Lucknow dispatch desk, who will call you to confirm vehicle availability and arrival time.
                  </p>
                </div>

                {/* 1. LOCATIONS SECTION */}
                <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-zinc-900 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-black" />
                      <span>Route & Addresses</span>
                    </span>
                    <span className="text-[11px] text-zinc-500 font-medium">Lucknow & Surrounding Areas</span>
                  </div>

                  {/* Pickup Autocomplete */}
                  <div>
                    <LocationAutocompleteInput
                      label="Pickup Location (Type locality or landmark in Lucknow)"
                      placeholder="e.g., Nishatganj, Gomti Nagar, Aliganj, Hazratganj..."
                      value={pickupData.address}
                      onChange={(val) => setPickupData({ address: val, lat: null, lng: null, placeId: '' })}
                      onSelectLocation={(loc) => {
                        setPickupData({
                          address: loc.address,
                          lat: loc.lat,
                          lng: loc.lng,
                          placeId: loc.placeId,
                        });
                        if (validationErrors.pickup) {
                          setValidationErrors((prev) => ({ ...prev, pickup: '' }));
                        }
                      }}
                      iconColor="text-emerald-600"
                      selectedCoordinates={{ lat: pickupData.lat, lng: pickupData.lng }}
                      showCurrentLocationButton={true}
                    />
                    {validationErrors.pickup && (
                      <p className="text-[11px] text-rose-600 font-bold mt-1">{validationErrors.pickup}</p>
                    )}
                  </div>

                  {/* Swap & Add Stop Controls */}
                  <div className="flex items-center justify-between px-1">
                    <button
                      type="button"
                      onClick={handleSwapLocations}
                      disabled={!pickupData.address && !dropData.address}
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold text-zinc-900 hover:bg-zinc-100 bg-white border border-zinc-300 px-3 py-1 rounded-xl transition shadow-2xs disabled:opacity-40"
                    >
                      <ArrowUpDown className="w-3.5 h-3.5" />
                      <span>Swap Pickup & Drop</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleAddStop}
                      disabled={stops.length >= 3}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-zinc-900 hover:bg-zinc-100 bg-white border border-zinc-300 px-3 py-1 rounded-xl transition disabled:opacity-40 shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{stops.length > 0 ? `Add Stop (${stops.length}/3)` : '+ Add Intermediate Stop'}</span>
                    </button>
                  </div>

                  {/* Optional Intermediate Stops */}
                  {stops.map((stop, index) => (
                    <div key={stop.id} className="relative bg-white p-2.5 rounded-xl border border-zinc-300 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold text-zinc-900">
                        <span>Via Stop {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveStop(stop.id)}
                          className="text-zinc-400 hover:text-rose-600 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <LocationAutocompleteInput
                        label={`Via Stop ${index + 1}`}
                        placeholder="Type stop locality or landmark..."
                        value={stop.address}
                        onChange={(val) =>
                          setStops((prev) =>
                            prev.map((s) => (s.id === stop.id ? { ...s, address: val, lat: null, lng: null, placeId: '' } : s))
                          )
                        }
                        onSelectLocation={(loc) => handleUpdateStop(stop.id, loc)}
                        iconColor="text-zinc-900"
                        selectedCoordinates={{ lat: stop.lat, lng: stop.lng }}
                      />
                    </div>
                  ))}

                  {/* Drop Autocomplete */}
                  <div>
                    <LocationAutocompleteInput
                      label="Drop-off Location (Type locality or landmark in Lucknow)"
                      placeholder="e.g., Hazratganj, Indira Nagar, Transport Nagar, Ashiyana..."
                      value={dropData.address}
                      onChange={(val) => setDropData({ address: val, lat: null, lng: null, placeId: '' })}
                      onSelectLocation={(loc) => {
                        setDropData({
                          address: loc.address,
                          lat: loc.lat,
                          lng: loc.lng,
                          placeId: loc.placeId,
                        });
                        if (validationErrors.drop) {
                          setValidationErrors((prev) => ({ ...prev, drop: '' }));
                        }
                      }}
                      iconColor="text-black"
                      selectedCoordinates={{ lat: dropData.lat, lng: dropData.lng }}
                    />
                    {validationErrors.drop && (
                      <p className="text-[11px] text-rose-600 font-bold mt-1">{validationErrors.drop}</p>
                    )}
                  </div>

                  {/* Route Status Card: Only shows calculated distance when both points are resolved */}
                  {pickupData.lat && dropData.lat ? (
                    <div className="p-3 bg-white rounded-xl border border-zinc-200 flex flex-wrap items-center justify-between gap-2 text-xs shadow-2xs">
                      <div className="flex items-center gap-2">
                        <Navigation className="w-4 h-4 text-black" />
                        <span className="font-bold text-zinc-800">Actual Road Route:</span>
                      </div>

                      <div className="flex items-center gap-3">
                        {isCalculatingRoute ? (
                          <div className="flex items-center gap-1.5 text-xs text-zinc-900 font-bold">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Calculating driving distance...</span>
                          </div>
                        ) : estimatedDistanceKm !== null ? (
                          <>
                            <span className="text-base font-black text-black font-mono">
                              {estimatedDistanceKm} km
                            </span>
                            {durationMinutes && (
                              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                                ~{durationMinutes} min drive (traffic permitting)
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-zinc-500 font-medium">Route calculation pending</span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-zinc-100/80 rounded-xl border border-zinc-200/80 text-[11px] text-zinc-600 font-medium flex items-center gap-2">
                      <Navigation className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      <span>Select pickup and drop locations from suggestions to view live road distance.</span>
                    </div>
                  )}

                  {routeError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 space-y-2">
                      <p className="font-medium flex items-start gap-1.5">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <span>{routeError}</span>
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <a
                          href="tel:9278499882"
                          className="bg-black text-white text-[11px] font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5"
                        >
                          <Phone className="w-3 h-3 text-emerald-400" />
                          <span>Call Dispatch 9278499882</span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Map Preview (Loaded only when locations are active) */}
                {(pickupData.lat || dropData.lat) && (
                  <Suspense
                    fallback={
                      <div className="h-48 w-full rounded-2xl bg-zinc-100 border border-zinc-200 flex flex-col items-center justify-center gap-2 text-zinc-400 animate-pulse">
                        <Navigation className="w-6 h-6 text-zinc-400 animate-spin" />
                        <span className="text-xs font-semibold">Loading route map...</span>
                      </div>
                    }
                  >
                    <BookingRouteMap
                      pickup={pickupData}
                      drop={dropData}
                      stops={stops}
                      distanceKm={estimatedDistanceKm || 0}
                      durationMinutes={durationMinutes || 0}
                    />
                  </Suspense>
                )}

                {/* 2. CONTACT DETAILS (Zero sample data, clear placeholders) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-zinc-50 p-3.5 rounded-2xl border border-zinc-200 space-y-2">
                    <p className="text-xs font-bold text-zinc-900 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Sender / Pickup Contact</span>
                    </p>
                    <div>
                      <input
                        type="text"
                        required
                        value={pickupContactName}
                        onChange={(e) => {
                          setPickupContactName(e.target.value);
                          if (validationErrors.pickupName) {
                            setValidationErrors((prev) => ({ ...prev, pickupName: '' }));
                          }
                        }}
                        placeholder="Sender Name (e.g., Rajesh Kumar)"
                        className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-black"
                      />
                      {validationErrors.pickupName && (
                        <p className="text-[10px] text-rose-600 font-bold mt-0.5">{validationErrors.pickupName}</p>
                      )}
                    </div>
                    <div>
                      <input
                        type="tel"
                        required
                        value={pickupContactPhone}
                        onChange={(e) => {
                          setPickupContactPhone(e.target.value);
                          if (validationErrors.pickupPhone) {
                            setValidationErrors((prev) => ({ ...prev, pickupPhone: '' }));
                          }
                        }}
                        placeholder="10-digit Phone Number (e.g., 9278499882)"
                        className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-black"
                      />
                      {validationErrors.pickupPhone && (
                        <p className="text-[10px] text-rose-600 font-bold mt-0.5">{validationErrors.pickupPhone}</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-zinc-50 p-3.5 rounded-2xl border border-zinc-200 space-y-2">
                    <p className="text-xs font-bold text-zinc-900 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-black" />
                      <span>Receiver / Drop Contact</span>
                    </p>
                    <div>
                      <input
                        type="text"
                        required
                        value={dropContactName}
                        onChange={(e) => {
                          setDropContactName(e.target.value);
                          if (validationErrors.dropName) {
                            setValidationErrors((prev) => ({ ...prev, dropName: '' }));
                          }
                        }}
                        placeholder="Receiver Name (e.g., Sunita Sharma)"
                        className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-black"
                      />
                      {validationErrors.dropName && (
                        <p className="text-[10px] text-rose-600 font-bold mt-0.5">{validationErrors.dropName}</p>
                      )}
                    </div>
                    <div>
                      <input
                        type="tel"
                        required
                        value={dropContactPhone}
                        onChange={(e) => {
                          setDropContactPhone(e.target.value);
                          if (validationErrors.dropPhone) {
                            setValidationErrors((prev) => ({ ...prev, dropPhone: '' }));
                          }
                        }}
                        placeholder="10-digit Phone Number"
                        className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-black"
                      />
                      {validationErrors.dropPhone && (
                        <p className="text-[10px] text-rose-600 font-bold mt-0.5">{validationErrors.dropPhone}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. VEHICLE & GOODS SELECTION (Approved 5 vehicles) */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-600 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-black" />
                    <span>Select Vehicle Fleet & Cargo Type</span>
                  </h3>

                  {/* Recommendation helper */}
                  <div className="bg-zinc-100 p-2.5 rounded-xl border border-zinc-300 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                      <p className="text-[11px] text-zinc-950 font-medium truncate">
                        <strong className="text-zinc-900">Recommended for {itemType}:</strong> {recommendedInfo.reason}
                      </p>
                    </div>
                    {vehicleType !== recommendedInfo.vehicle && (
                      <button
                        type="button"
                        onClick={() => setVehicleType(recommendedInfo.vehicle)}
                        className="text-[10px] font-bold text-zinc-900 hover:bg-zinc-300 bg-zinc-200 px-2.5 py-1 rounded-lg border border-zinc-400 transition shrink-0 cursor-pointer"
                      >
                        Select {recommendedInfo.label.split(' ')[0]}
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-zinc-800 mb-1">
                        Cargo / Item Category
                      </label>
                      <select
                        value={itemType}
                        onChange={(e) => setItemType(e.target.value as ItemType)}
                        className="w-full bg-white border border-zinc-300 rounded-xl p-2.5 text-xs font-semibold text-zinc-900 focus:outline-none focus:border-black cursor-pointer"
                      >
                        <option value="furniture">Furniture & Sofas</option>
                        <option value="appliance">Home Appliances (Fridge, Washing Machine)</option>
                        <option value="house_shifting">1BHK / 2BHK House Shifting</option>
                        <option value="commercial_goods">Commercial / Office Boxes & Cargo</option>
                        <option value="fragile_goods">Fragile & Glassware</option>
                        <option value="other">Other Packets & Parcels</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-800 mb-1">
                        Approved Fleet Vehicle
                      </label>
                      <select
                        value={vehicleType}
                        onChange={(e) => setVehicleType(e.target.value as VehicleType)}
                        className="w-full bg-white border border-zinc-300 rounded-xl p-2.5 text-xs font-semibold text-zinc-900 focus:outline-none focus:border-black cursor-pointer"
                      >
                        {priceConfigs.map((cfg) => (
                          <option key={cfg.id} value={cfg.vehicleType}>
                            {cfg.vehicleLabel} (Base ₹{cfg.baseFare} + ₹{cfg.perKmRate}/km)
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* 4. FLOOR, LIFT & SPECIAL INSTRUCTIONS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200">
                    <label className="block font-bold text-zinc-700 mb-1">Pickup Floor</label>
                    <select
                      value={pickupFloor}
                      onChange={(e) => setPickupFloor(e.target.value)}
                      className="w-full bg-white border border-zinc-300 rounded-lg p-1.5 text-zinc-900 font-medium"
                    >
                      <option value="Ground Floor">Ground Floor</option>
                      <option value="1st Floor">1st Floor</option>
                      <option value="2nd Floor">2nd Floor</option>
                      <option value="3rd Floor">3rd Floor</option>
                      <option value="4th Floor or Higher">4th Floor or Higher</option>
                    </select>
                  </div>

                  <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200">
                    <label className="block font-bold text-zinc-700 mb-1">Drop-off Floor</label>
                    <select
                      value={dropFloor}
                      onChange={(e) => setDropFloor(e.target.value)}
                      className="w-full bg-white border border-zinc-300 rounded-lg p-1.5 text-zinc-900 font-medium"
                    >
                      <option value="Ground Floor">Ground Floor</option>
                      <option value="1st Floor">1st Floor</option>
                      <option value="2nd Floor">2nd Floor</option>
                      <option value="3rd Floor">3rd Floor</option>
                      <option value="4th Floor or Higher">4th Floor or Higher</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-zinc-800">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={liftAvailable}
                      onChange={(e) => setLiftAvailable(e.target.checked)}
                      className="accent-black w-4 h-4 rounded"
                    />
                    <span>Elevator / Lift Available at Premises</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={heavyItems}
                      onChange={(e) => setHeavyItems(e.target.checked)}
                      className="accent-black w-4 h-4 rounded"
                    />
                    <span>Includes Bulky / Extra-Heavy Items (&gt;50kg)</span>
                  </label>
                </div>

                {/* Preferred Time & Special Instructions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-800 mb-1">
                      Preferred Pickup Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={scheduledAt}
                      onChange={(e) => setScheduledAt(e.target.value)}
                      className="w-full bg-white border border-zinc-300 rounded-xl p-2 text-xs font-medium text-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-800 mb-1">
                      Specific Notes / Instructions (Optional)
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g., Narrow lane entrance, carry ropes"
                      className="w-full bg-white border border-zinc-300 rounded-xl p-2 text-xs font-medium text-zinc-900 placeholder:text-zinc-400"
                    />
                  </div>
                </div>

                {/* Payment Option */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-zinc-800">Payment Mode</label>
                  <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                        paymentMethod === 'upi'
                          ? 'border-black bg-black text-white'
                          : 'border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50'
                      }`}
                    >
                      UPI / QR Code
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cash')}
                      className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                        paymentMethod === 'cash'
                          ? 'border-emerald-600 bg-emerald-600 text-white'
                          : 'border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50'
                      }`}
                    >
                      Cash on Delivery
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('online')}
                      className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                        paymentMethod === 'online'
                          ? 'border-zinc-900 bg-zinc-900 text-white'
                          : 'border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50'
                      }`}
                    >
                      NetBanking / Card
                    </button>
                  </div>
                </div>

                {/* 5. UPFRONT FARE BREAKDOWN & SUBMISSION */}
                <div className="bg-black text-white p-4 sm:p-5 rounded-2xl space-y-3 shadow-lg border border-zinc-800">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="text-xs font-bold text-zinc-300">Transparent Fare Calculation</span>
                    <span className="text-[11px] text-emerald-400 font-mono">
                      ₹{baseFare} Base + ₹{perKmRate}/km
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-zinc-300">
                    <div className="flex justify-between">
                      <span>Vehicle Base Fare ({currentConfig.vehicleLabel}):</span>
                      <span>₹{baseFare}</span>
                    </div>

                    {estimatedDistanceKm !== null ? (
                      <div className="flex justify-between">
                        <span>Road Distance ({estimatedDistanceKm} km × ₹{perKmRate}/km):</span>
                        <span>₹{distanceFare}</span>
                      </div>
                    ) : (
                      <div className="flex justify-between text-zinc-400 italic">
                        <span>Distance Fare (₹{perKmRate}/km):</span>
                        <span>Select pickup & drop points</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-zinc-800 pt-3 flex flex-wrap justify-between items-center gap-3">
                    <div>
                      <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">
                        Estimated Fare
                      </p>
                      <p className="text-2xl font-black text-emerald-400">
                        ₹{totalEstimatedFare}
                        {estimatedDistanceKm === null && (
                          <span className="text-xs font-normal text-zinc-400 ml-1.5">(Base Fare)</span>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="submit"
                        disabled={isCalculatingRoute}
                        className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black text-xs sm:text-sm px-6 py-3 rounded-xl transition shadow-lg flex items-center gap-2 cursor-pointer"
                      >
                        <span>Send Booking Enquiry</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                      </button>
                    </div>
                  </div>

                  <p className="text-[10px] text-zinc-400 text-center leading-normal pt-1">
                    * Final fare confirmed by dispatch team based on verified route distance. Toll charges or government permits (if applicable) are paid as per actual receipts.
                  </p>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
