import { Booking, BookingEvent, PriceConfig, User, Vehicle, Review } from '../types';

export const INITIAL_PRICE_CONFIGS: PriceConfig[] = [
  {
    id: 'pc-two-wheeler',
    city: 'Lucknow',
    zone: 'Lucknow & Surrounding Areas',
    vehicleType: 'two_wheeler',
    vehicleLabel: 'Two-wheeler',
    baseFare: 50,
    perKmRate: 8,
    minFare: 50,
    helperFee: 0,
    capacityDesc: 'Up to 20 kg • Documents, food, medicine & small parcels',
    active: true,
  },
  {
    id: 'pc-e-loader',
    city: 'Lucknow',
    zone: 'Lucknow & Surrounding Areas',
    vehicleType: 'e_loader',
    vehicleLabel: 'E-loader',
    baseFare: 180,
    perKmRate: 10,
    minFare: 180,
    helperFee: 0,
    capacityDesc: 'Up to 350 kg • Eco-friendly electric cargo, boxes & cartons',
    active: true,
  },
  {
    id: 'pc-compact-3w',
    city: 'Lucknow',
    zone: 'Lucknow & Surrounding Areas',
    vehicleType: 'compact_three_wheeler',
    vehicleLabel: 'Compact three-wheeler',
    baseFare: 220,
    perKmRate: 12,
    minFare: 220,
    helperFee: 0,
    capacityDesc: 'Up to 500 kg • Agile city logistics, small appliances & stock',
    active: true,
  },
  {
    id: 'pc-3w-goods',
    city: 'Lucknow',
    zone: 'Lucknow & Surrounding Areas',
    vehicleType: 'three_wheeler_goods',
    vehicleLabel: 'Three-wheeler goods loader',
    baseFare: 250,
    perKmRate: 13,
    minFare: 250,
    helperFee: 0,
    capacityDesc: 'Up to 600 kg • Standard cargo auto, commercial goods & parcels',
    active: true,
  },
  {
    id: 'pc-tata-ace',
    city: 'Lucknow',
    zone: 'Lucknow & Surrounding Areas',
    vehicleType: 'tata_ace',
    vehicleLabel: 'Tata Ace',
    baseFare: 300,
    perKmRate: 14,
    minFare: 300,
    helperFee: 0,
    capacityDesc: 'Up to 750 kg • 1BHK house shifting, furniture & bulk inventory',
    active: true,
  },
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin',
    name: 'PATGOLITO Dispatch Desk',
    email: 'dispatch@patgolito.com',
    phone: '+91 92784 99882',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr-guest',
    name: '',
    email: '',
    phone: '',
    role: 'customer',
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'veh-tata-ace-1',
    vehicleNumber: 'UP-32-LKO-4521',
    vehicleType: 'tata_ace',
    capacityKg: 750,
    seats: 2,
    active: true,
  },
  {
    id: 'veh-3w-goods-1',
    vehicleNumber: 'UP-32-LKO-8820',
    vehicleType: 'three_wheeler_goods',
    capacityKg: 600,
    seats: 1,
    active: true,
  },
  {
    id: 'veh-compact-3w-1',
    vehicleNumber: 'UP-32-LKO-3312',
    vehicleType: 'compact_three_wheeler',
    capacityKg: 500,
    seats: 1,
    active: true,
  },
  {
    id: 'veh-eloader-1',
    vehicleNumber: 'UP-32-LKO-9104',
    vehicleType: 'e_loader',
    capacityKg: 350,
    seats: 1,
    active: true,
  },
  {
    id: 'veh-2w-1',
    vehicleNumber: 'UP-32-LKO-1205',
    vehicleType: 'two_wheeler',
    capacityKg: 20,
    seats: 1,
    active: true,
  },
];

// Production starts with an empty list of bookings (no simulated test orders)
export const INITIAL_BOOKINGS: Booking[] = [];

export const INITIAL_EVENTS: BookingEvent[] = [];

export const INITIAL_REVIEWS: Review[] = [];
