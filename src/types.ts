export type UserRole = 'customer' | 'driver' | 'helper' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: string;
}

export interface DriverProfile {
  id: string;
  userId: string;
  licenseNumber: string;
  vehicleId?: string;
  status: 'pending' | 'approved' | 'blocked';
  rating: number;
}

export interface HelperProfile {
  id: string;
  userId: string;
  status: 'pending' | 'approved' | 'blocked';
  rating: number;
  skillsNotes: string;
}

export type VehicleType =
  | 'two_wheeler'
  | 'e_loader'
  | 'compact_three_wheeler'
  | 'three_wheeler_goods'
  | 'tata_ace'
  // Legacy aliases for backward compatibility:
  | 'mini_pickup'
  | 'pickup'
  | '3_seater'
  | 'tempo'
  | 'other';

export interface Vehicle {
  id: string;
  driverId?: string;
  driverName?: string;
  vehicleNumber: string;
  vehicleType: VehicleType;
  capacityKg: number;
  seats: number;
  active: boolean;
}

export type ItemType = 
  | 'furniture'
  | 'appliance'
  | 'house_shifting'
  | 'commercial_goods'
  | 'fragile_goods'
  | 'other';

export type BookingStatus =
  | 'REQUESTED'
  | 'ACCEPTED'
  | 'DRIVER_ASSIGNED'
  | 'HELPER_ASSIGNED'
  | 'DRIVER_EN_ROUTE_PICKUP'
  | 'REACHED_PICKUP'
  | 'LOADING_STARTED'
  | 'LOADING_COMPLETED'
  | 'IN_TRANSIT'
  | 'REACHED_DROP'
  | 'UNLOADING_STARTED'
  | 'UNLOADING_COMPLETED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface LocationData {
  address: string;
  lat: number | null;
  lng: number | null;
  placeId?: string;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  pickupAddress: string;
  dropAddress: string;
  pickupLat?: number;
  pickupLng?: number;
  pickupPlaceId?: string;
  dropLat?: number;
  dropLng?: number;
  dropPlaceId?: string;
  distanceMeters?: number;
  estimatedDurationMinutes?: number;
  estimatedDurationSeconds?: number;
  pickupContactName: string;
  pickupContactPhone: string;
  dropContactName: string;
  dropContactPhone: string;
  vehicleType: VehicleType;
  itemType: ItemType;
  needsHelper: boolean;
  helperCount: number;
  scheduledAt: string;
  notes?: string;
  pickupFloor?: string;
  dropFloor?: string;
  liftAvailable?: boolean;
  heavyItems?: boolean;
  estimatedDistanceKm: number;
  baseFare: number;
  perKmRate: number;
  helperFeeUnit: number;
  helperFeeTotal: number;
  totalFare: number;
  paymentMethod: 'cash' | 'upi' | 'online' | 'unpaid';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  status: BookingStatus;
  assignedDriverId?: string;
  assignedDriverName?: string;
  assignedDriverPhone?: string;
  assignedDriverVehicleNo?: string;
  assignedHelperIds?: string[];
  assignedHelperNames?: string[];
  cancelReason?: string;
  createdAt: string;
}

export interface BookingEvent {
  id: string;
  bookingId: string;
  status: BookingStatus;
  note: string;
  createdBy: string;
  createdAt: string;
}

export interface PriceConfig {
  id: string;
  city: string;
  zone: string;
  vehicleType: VehicleType;
  vehicleLabel: string;
  baseFare: number;
  perKmRate: number;
  minFare: number;
  helperFee: number; // default 63
  capacityDesc: string;
  active: boolean;
}

export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  driverId?: string;
  helperId?: string;
  rating: number;
  comment: string;
  createdAt: string;
}
