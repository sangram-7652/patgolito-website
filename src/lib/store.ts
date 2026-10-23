import {
  Booking,
  BookingEvent,
  BookingStatus,
  PriceConfig,
  Review,
  User,
  UserRole,
  Vehicle,
} from '../types';
import {
  INITIAL_BOOKINGS,
  INITIAL_EVENTS,
  INITIAL_PRICE_CONFIGS,
  INITIAL_REVIEWS,
  INITIAL_USERS,
  INITIAL_VEHICLES,
} from '../data/seedData';

const KEYS = {
  USERS: 'patgolito_users',
  CURRENT_USER: 'patgolito_current_user',
  PRICE_CONFIGS: 'patgolito_price_configs',
  VEHICLES: 'patgolito_vehicles',
  BOOKINGS: 'patgolito_bookings',
  EVENTS: 'patgolito_events',
  REVIEWS: 'patgolito_reviews',
};

type Listener = () => void;

class PatgolitoStore {
  private listeners: Set<Listener> = new Set();

  constructor() {
    this.init();
  }

  private getItem<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      this.notify();
    } catch (e) {
      console.error('LocalStorage write error', e);
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((fn) => fn());
  }

  public init(reset: boolean = false): void {
    const existingConfigs = this.getItem<PriceConfig[]>(KEYS.PRICE_CONFIGS, []);
    const needsCatalogueSync = !existingConfigs.some(
      (c) => c.vehicleType === 'compact_three_wheeler' || c.vehicleType === 'e_loader'
    );

    if (reset || !localStorage.getItem(KEYS.USERS) || needsCatalogueSync) {
      this.setItem(KEYS.USERS, INITIAL_USERS);
      this.setItem(KEYS.CURRENT_USER, INITIAL_USERS[1] || INITIAL_USERS[0]);
      this.setItem(KEYS.PRICE_CONFIGS, INITIAL_PRICE_CONFIGS);
      this.setItem(KEYS.VEHICLES, INITIAL_VEHICLES);
      this.setItem(KEYS.BOOKINGS, INITIAL_BOOKINGS);
      this.setItem(KEYS.EVENTS, INITIAL_EVENTS);
      this.setItem(KEYS.REVIEWS, INITIAL_REVIEWS);
    }
  }

  // Auth Methods
  public getUsers(): User[] {
    return this.getItem<User[]>(KEYS.USERS, INITIAL_USERS);
  }

  public getCurrentUser(): User {
    return this.getItem<User>(KEYS.CURRENT_USER, INITIAL_USERS[1]);
  }

  public setCurrentUser(user: User): void {
    this.setItem(KEYS.CURRENT_USER, user);
  }

  public switchRole(role: UserRole): User {
    const users = this.getUsers();
    let found = users.find((u) => u.role === role);
    if (!found) {
      found = {
        id: `usr-${role}-${Date.now()}`,
        name: `Demo ${role.toUpperCase()}`,
        email: `${role}@patgolito.local`,
        phone: '+91 99999 00000',
        role,
        createdAt: new Date().toISOString(),
      };
      this.setItem(KEYS.USERS, [...users, found]);
    }
    this.setCurrentUser(found);
    return found;
  }

  // Price Configs
  public getPriceConfigs(): PriceConfig[] {
    return this.getItem<PriceConfig[]>(KEYS.PRICE_CONFIGS, INITIAL_PRICE_CONFIGS);
  }

  public updatePriceConfig(id: string, updates: Partial<PriceConfig>): void {
    const configs = this.getPriceConfigs();
    const updated = configs.map((c) => (c.id === id ? { ...c, ...updates } : c));
    this.setItem(KEYS.PRICE_CONFIGS, updated);
  }

  // Vehicles
  public getVehicles(): Vehicle[] {
    return this.getItem<Vehicle[]>(KEYS.VEHICLES, INITIAL_VEHICLES);
  }

  public addVehicle(vehicle: Omit<Vehicle, 'id'>): Vehicle {
    const vehicles = this.getVehicles();
    const newVeh: Vehicle = {
      ...vehicle,
      id: `veh-${Date.now()}`,
    };
    this.setItem(KEYS.VEHICLES, [...vehicles, newVeh]);
    return newVeh;
  }

  // Bookings
  public getBookings(): Booking[] {
    return this.getItem<Booking[]>(KEYS.BOOKINGS, INITIAL_BOOKINGS);
  }

  public getBookingById(id: string): Booking | undefined {
    return this.getBookings().find((b) => b.id === id);
  }

  public calculateFare(params: {
    vehicleType: Booking['vehicleType'];
    distanceKm: number;
    needsHelper: boolean;
    helperCount: number;
  }): {
    baseFare: number;
    perKmRate: number;
    helperFeeUnit: number;
    helperFeeTotal: number;
    calculatedFare: number;
    finalFare: number;
  } {
    const configs = this.getPriceConfigs();
    const config = configs.find((c) => c.vehicleType === params.vehicleType) || configs[0];

    const baseFare = config.baseFare;
    const perKmRate = config.perKmRate;
    const helperFeeUnit = 0;
    const helperFeeTotal = 0;

    const distanceCost = params.distanceKm * perKmRate;
    const calculatedFare = baseFare + distanceCost;
    const finalFare = Math.max(calculatedFare, config.minFare);

    return {
      baseFare,
      perKmRate,
      helperFeeUnit,
      helperFeeTotal,
      calculatedFare: Math.round(calculatedFare),
      finalFare: Math.round(finalFare),
    };
  }

  public createBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>): Booking {
    const bookings = this.getBookings();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newBooking: Booking = {
      ...bookingData,
      id: `PAT-${randomNum}`,
      status: 'REQUESTED',
      createdAt: new Date().toISOString(),
    };

    this.setItem(KEYS.BOOKINGS, [newBooking, ...bookings]);

    // Create event log
    const currentUser = this.getCurrentUser();
    this.addBookingEvent(
      newBooking.id,
      'REQUESTED',
      `Booking requested by customer ${newBooking.customerName}. Helpers: ${
        newBooking.needsHelper ? `${newBooking.helperCount} (₹${newBooking.helperFeeTotal})` : 'None'
      }`,
      currentUser.name
    );

    return newBooking;
  }

  public updateBookingStatus(
    bookingId: string,
    newStatus: BookingStatus,
    note?: string,
    cancelReason?: string
  ): void {
    const bookings = this.getBookings();
    const currentUser = this.getCurrentUser();

    const updatedBookings = bookings.map((b) => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: newStatus,
          cancelReason: cancelReason || b.cancelReason,
          paymentStatus:
            newStatus === 'COMPLETED' && b.paymentMethod === 'cash' ? 'paid' : b.paymentStatus,
        };
      }
      return b;
    });

    this.setItem(KEYS.BOOKINGS, updatedBookings);

    this.addBookingEvent(
      bookingId,
      newStatus,
      note || `Status updated to ${newStatus}`,
      currentUser.name
    );
  }

  public assignDriverAndHelper(
    bookingId: string,
    driverId?: string,
    helperIds: string[] = []
  ): void {
    const bookings = this.getBookings();
    const users = this.getUsers();
    const vehicles = this.getVehicles();
    const currentUser = this.getCurrentUser();

    const driver = users.find((u) => u.id === driverId);
    const driverVeh = vehicles.find((v) => v.driverId === driverId);
    const helpers = users.filter((u) => helperIds.includes(u.id));

    let nextStatus: BookingStatus = 'ACCEPTED';
    if (driverId && helperIds.length > 0) {
      nextStatus = 'DRIVER_ASSIGNED';
    } else if (driverId) {
      nextStatus = 'DRIVER_ASSIGNED';
    } else if (helperIds.length > 0) {
      nextStatus = 'HELPER_ASSIGNED';
    }

    const updated = bookings.map((b) => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: nextStatus,
          assignedDriverId: driverId || b.assignedDriverId,
          assignedDriverName: driver?.name || b.assignedDriverName,
          assignedDriverPhone: driver?.phone || b.assignedDriverPhone,
          assignedDriverVehicleNo: driverVeh?.vehicleNumber || b.assignedDriverVehicleNo,
          assignedHelperIds: helperIds.length ? helperIds : b.assignedHelperIds,
          assignedHelperNames: helpers.length ? helpers.map((h) => h.name) : b.assignedHelperNames,
        };
      }
      return b;
    });

    this.setItem(KEYS.BOOKINGS, updated);

    const helperNamesStr = helpers.map((h) => h.name).join(', ');
    const noteText = `Assigned ${driver ? `Driver: ${driver.name}` : ''} ${
      helpers.length ? `| Helpers: ${helperNamesStr}` : ''
    }`;

    this.addBookingEvent(bookingId, nextStatus, noteText, currentUser.name);
  }

  // Events
  public getEvents(bookingId?: string): BookingEvent[] {
    const events = this.getItem<BookingEvent[]>(KEYS.EVENTS, INITIAL_EVENTS);
    if (bookingId) {
      return events.filter((e) => e.bookingId === bookingId);
    }
    return events;
  }

  public addBookingEvent(
    bookingId: string,
    status: BookingStatus,
    note: string,
    createdBy: string
  ): void {
    const events = this.getEvents();
    const newEvt: BookingEvent = {
      id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      bookingId,
      status,
      note,
      createdBy,
      createdAt: new Date().toISOString(),
    };
    this.setItem(KEYS.EVENTS, [newEvt, ...events]);
  }

  // Reviews
  public getReviews(): Review[] {
    return this.getItem<Review[]>(KEYS.REVIEWS, INITIAL_REVIEWS);
  }

  public addReview(reviewData: Omit<Review, 'id' | 'createdAt'>): Review {
    const reviews = this.getReviews();
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.setItem(KEYS.REVIEWS, [newReview, ...reviews]);
    return newReview;
  }
}

export const store = new PatgolitoStore();
