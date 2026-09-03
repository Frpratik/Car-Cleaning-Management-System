import { 
  Society, 
  BuildingTower, 
  ParkingSlot, 
  Vehicle, 
  ServicePlan, 
  Subscription, 
  ServiceJob, 
  ProviderProfile, 
  User, 
  DashboardMetricSummary,
  PaymentTransaction,
  ComplaintTicket
} from '../types';

// ==========================================
// SEED DATA (Isolated & High-Fidelity Indian Context)
// ==========================================

export const INITIAL_SOCIETIES: Society[] = [
  {
    id: 'soc_plh_01',
    name: 'Prestige Lakeside Habitat',
    code: 'PLH-BLR',
    addressLine: 'SH 35, Varthur, Whitefield',
    locality: 'Whitefield',
    city: 'Bengaluru',
    pincode: '560087',
    waterPolicy: 'WATERLESS_ONLY',
    totalApartments: 3400,
    activeCarsCount: 84
  },
  {
    id: 'soc_sda_02',
    name: 'Sobha Dream Acres',
    code: 'SDA-BLR',
    addressLine: 'Panathur Main Road, Balagere',
    locality: 'Panathur',
    city: 'Bengaluru',
    pincode: '560087',
    waterPolicy: 'WATERLESS_ONLY',
    totalApartments: 6500,
    activeCarsCount: 142
  },
  {
    id: 'soc_gde_03',
    name: 'Godrej Eternity',
    code: 'GDE-BLR',
    addressLine: 'Holiday Village Road, Kanakapura Road',
    locality: 'Kanakapura Road',
    city: 'Bengaluru',
    pincode: '560062',
    waterPolicy: 'LOW_WATER',
    totalApartments: 800,
    activeCarsCount: 46
  }
];

export const INITIAL_TOWERS: BuildingTower[] = [
  { id: 'tow_plh_t1', societyId: 'soc_plh_01', name: 'Tower 1 (Oak)', totalFloors: 29 },
  { id: 'tow_plh_t2', societyId: 'soc_plh_01', name: 'Tower 2 (Cedar)', totalFloors: 29 },
  { id: 'tow_plh_t3', societyId: 'soc_plh_01', name: 'Tower 3 (Maple)', totalFloors: 29 },
  { id: 'tow_sda_w1', societyId: 'soc_sda_02', name: 'Wing 1 (Rainforest)', totalFloors: 14 },
  { id: 'tow_sda_w2', societyId: 'soc_sda_02', name: 'Wing 2 (Pine)', totalFloors: 14 }
];

export const INITIAL_SLOTS: ParkingSlot[] = [
  { id: 'slot_01', towerId: 'tow_plh_t1', towerName: 'Tower 1 (Oak)', level: 'Basement 2', slotNumber: 'B2-104', walkingSequence: 1 },
  { id: 'slot_02', towerId: 'tow_plh_t1', towerName: 'Tower 1 (Oak)', level: 'Basement 2', slotNumber: 'B2-108', walkingSequence: 2 },
  { id: 'slot_03', towerId: 'tow_plh_t1', towerName: 'Tower 1 (Oak)', level: 'Basement 2', slotNumber: 'B2-112', walkingSequence: 3 },
  { id: 'slot_04', towerId: 'tow_plh_t1', towerName: 'Tower 1 (Oak)', level: 'Basement 1', slotNumber: 'B1-042', walkingSequence: 4 },
  { id: 'slot_05', towerId: 'tow_plh_t2', towerName: 'Tower 2 (Cedar)', level: 'Basement 2', slotNumber: 'B2-205', walkingSequence: 5 },
  { id: 'slot_06', towerId: 'tow_plh_t2', towerName: 'Tower 2 (Cedar)', level: 'Basement 2', slotNumber: 'B2-210', walkingSequence: 6 }
];

export const SERVICE_PLANS: ServicePlan[] = [
  {
    id: 'plan_daily_pro',
    name: 'Daily Pure-Gloss Care',
    code: 'DAILY_PRO',
    frequency: 'DAILY',
    frequencyLabel: 'Daily (26 days/mo)',
    description: 'Complete daily exterior wipe, dust-removal, window de-greasing, and tyre gloss dressing before 8:00 AM.',
    pricing: {
      HATCHBACK: 699,
      SEDAN: 799,
      COMPACT_SUV: 899,
      SUV_LUXURY: 1099
    },
    inclusions: [
      'Daily electro-static microfiber dusting',
      'Scratch-free waterless lubricated exterior wipe',
      'Windshield & mirror de-grease',
      'Tyre sidewall conditioning (Weekly)',
      '100% Morning Timestamped Photo Proof'
    ],
    recommended: true
  },
  {
    id: 'plan_alternate',
    name: 'Alternate Day Care',
    code: 'ALT_DAYS',
    frequency: 'ALTERNATE_DAYS',
    frequencyLabel: 'Alternate Days (14 days/mo)',
    description: 'Perfect for garaged or low-commute cars. Cleaned on Mon-Wed-Fri or Tue-Thu-Sat.',
    pricing: {
      HATCHBACK: 499,
      SEDAN: 549,
      COMPACT_SUV: 599,
      SUV_LUXURY: 749
    },
    inclusions: [
      'Alternate day microfiber dusting & wipe',
      'Windshield cleaning',
      'Tyre sidewall clean',
      'Photo Proof Verification'
    ]
  },
  {
    id: 'plan_weekend_deep',
    name: 'Weekly Care',
    code: 'WEEKLY',
    frequency: 'WEEKLY',
    frequencyLabel: 'Weekly (4 days/mo)',
    description: 'Thorough weekly exterior upkeep for weekend drivers.',
    pricing: {
      HATCHBACK: 299,
      SEDAN: 349,
      COMPACT_SUV: 399,
      SUV_LUXURY: 499
    },
    inclusions: [
      'Comprehensive exterior waterless wash',
      'Full glass cleaning & polish',
      'Tyre shine dressing',
      'Wheel arch dirt removal'
    ]
  }
];

export const INITIAL_PROVIDERS: ProviderProfile[] = [
  {
    id: 'prov_ramesh_01',
    userId: 'usr_prov_01',
    fullName: 'Ramesh Kumar',
    phoneNumber: '9845012345',
    badgeNumber: 'AC-104',
    assignedSocietyId: 'soc_plh_01',
    assignedSocietyName: 'Prestige Lakeside Habitat',
    ratingAverage: 4.92,
    totalJobsDone: 1420,
    isOnline: true,
    checkInTime: '05:42 AM'
  },
  {
    id: 'prov_suresh_02',
    userId: 'usr_prov_02',
    fullName: 'Suresh Gowda',
    phoneNumber: '9845098765',
    badgeNumber: 'AC-108',
    assignedSocietyId: 'soc_sda_02',
    assignedSocietyName: 'Sobha Dream Acres',
    ratingAverage: 4.88,
    totalJobsDone: 980,
    isOnline: true,
    checkInTime: '05:50 AM'
  }
];

export const INITIAL_CUSTOMERS: User[] = [
  {
    id: 'usr_cust_01',
    phoneNumber: '9876543210',
    fullName: 'Arjun Nambiar',
    email: 'arjun.nambiar@gmail.com',
    role: 'CUSTOMER',
    isActive: true,
    createdAt: '2026-08-15'
  }
];

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'veh_01',
    customerId: 'usr_cust_01',
    make: 'Toyota',
    model: 'Fortuner 4x4',
    color: 'Pearl White',
    registrationNo: 'KA 03 MX 4492',
    type: 'SUV_LUXURY',
    societyId: 'soc_plh_01',
    societyName: 'Prestige Lakeside Habitat',
    slotId: 'slot_01',
    slotName: 'Tower 1 • Basement 2 • Slot #B2-104',
    notes: 'Parked near Pillar C-14. Please wipe roof rack.',
    isActive: true
  },
  {
    id: 'veh_02',
    customerId: 'usr_cust_01',
    make: 'Honda',
    model: 'City ZX',
    color: 'Lunar Silver',
    registrationNo: 'KA 51 ML 9021',
    type: 'SEDAN',
    societyId: 'soc_plh_01',
    societyName: 'Prestige Lakeside Habitat',
    slotId: 'slot_02',
    slotName: 'Tower 1 • Basement 2 • Slot #B2-108',
    notes: 'Covered parking.',
    isActive: true
  }
];

export const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub_01',
    customerId: 'usr_cust_01',
    vehicleId: 'veh_01',
    vehicle: INITIAL_VEHICLES[0],
    servicePlanId: 'plan_daily_pro',
    plan: SERVICE_PLANS[0],
    status: 'ACTIVE',
    monthlyAmount: 1099,
    startDate: '2026-08-15',
    nextBillingDate: '2026-09-15',
    preferredWindow: '06:00 - 08:00 AM',
    assignedProviderId: 'prov_ramesh_01',
    assignedProviderName: 'Ramesh Kumar (Badge #AC-104)'
  }
];

export const INITIAL_JOBS: ServiceJob[] = [
  {
    id: 'job_01',
    subscriptionId: 'sub_01',
    vehicleId: 'veh_01',
    vehicle: INITIAL_VEHICLES[0],
    societyId: 'soc_plh_01',
    societyName: 'Prestige Lakeside Habitat',
    slotId: 'slot_01',
    slotDetails: 'Tower 1 • Basement 2 • #B2-104',
    walkingSequence: 1,
    providerId: 'prov_ramesh_01',
    providerName: 'Ramesh Kumar',
    serviceDate: '2026-09-03',
    timeWindow: '06:00 - 08:00 AM',
    status: 'COMPLETED',
    startedAt: '06:34 AM',
    completedAt: '06:51 AM',
    proof: {
      id: 'prf_01',
      jobId: 'job_01',
      beforePhotoUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      afterPhotoUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
      beforeTakenAt: '06:34 AM',
      afterTakenAt: '06:51 AM',
      syncTimestamp: '2026-09-03 06:52 AM',
      durationMinutes: 17,
      watermarkHash: 'SHA256:PLH-B2-104:20260903-0651'
    },
    ratingScore: 5,
    ratingFeedback: 'Spotless cleaning on the alloys and windshield. Very satisfied!'
  },
  {
    id: 'job_02',
    subscriptionId: 'sub_02',
    vehicleId: 'veh_02',
    vehicle: INITIAL_VEHICLES[1],
    societyId: 'soc_plh_01',
    societyName: 'Prestige Lakeside Habitat',
    slotId: 'slot_02',
    slotDetails: 'Tower 1 • Basement 2 • #B2-108',
    walkingSequence: 2,
    providerId: 'prov_ramesh_01',
    providerName: 'Ramesh Kumar',
    serviceDate: '2026-09-03',
    timeWindow: '06:00 - 08:00 AM',
    status: 'IN_PROGRESS',
    startedAt: '06:54 AM'
  },
  {
    id: 'job_03',
    subscriptionId: 'sub_03',
    vehicleId: 'veh_03',
    vehicle: {
      id: 'veh_03',
      customerId: 'usr_cust_02',
      make: 'Hyundai',
      model: 'Creta SX(O)',
      color: 'Abyss Black',
      registrationNo: 'KA 04 NM 2831',
      type: 'COMPACT_SUV',
      societyId: 'soc_plh_01',
      societyName: 'Prestige Lakeside Habitat',
      slotId: 'slot_03',
      slotName: 'Tower 1 • Basement 2 • #B2-112',
      isActive: true
    },
    societyId: 'soc_plh_01',
    societyName: 'Prestige Lakeside Habitat',
    slotId: 'slot_03',
    slotDetails: 'Tower 1 • Basement 2 • #B2-112',
    walkingSequence: 3,
    providerId: 'prov_ramesh_01',
    providerName: 'Ramesh Kumar',
    serviceDate: '2026-09-03',
    timeWindow: '06:00 - 08:00 AM',
    status: 'SCHEDULED'
  },
  {
    id: 'job_04',
    subscriptionId: 'sub_04',
    vehicleId: 'veh_04',
    vehicle: {
      id: 'veh_04',
      customerId: 'usr_cust_03',
      make: 'Tata',
      model: 'Nexon EV',
      color: 'Daytona Grey',
      registrationNo: 'KA 01 EV 1099',
      type: 'COMPACT_SUV',
      societyId: 'soc_plh_01',
      societyName: 'Prestige Lakeside Habitat',
      slotId: 'slot_04',
      slotName: 'Tower 1 • Basement 1 • #B1-042',
      isActive: true
    },
    societyId: 'soc_plh_01',
    societyName: 'Prestige Lakeside Habitat',
    slotId: 'slot_04',
    slotDetails: 'Tower 1 • Basement 1 • #B1-042',
    walkingSequence: 4,
    providerId: 'prov_ramesh_01',
    providerName: 'Ramesh Kumar',
    serviceDate: '2026-09-03',
    timeWindow: '06:00 - 08:00 AM',
    status: 'SCHEDULED'
  }
];

export const INITIAL_PAYMENTS: PaymentTransaction[] = [
  {
    id: 'pay_01',
    subscriptionId: 'sub_01',
    customerId: 'usr_cust_01',
    amount: 1099,
    currency: 'INR',
    status: 'CAPTURED',
    razorpayPaymentId: 'pay_N8zL90kOpl42',
    razorpayOrderId: 'order_N8zK11jH78',
    invoiceNumber: 'INV-2026-08-0104',
    paymentMethod: 'UPI_AUTOPAY',
    createdAt: '2026-08-15 09:30 AM'
  }
];

export const INITIAL_COMPLAINTS: ComplaintTicket[] = [
  {
    id: 'comp_01',
    jobId: 'job_01',
    jobSlot: 'Tower 1 • Basement 2 • #B2-104',
    vehicleName: 'Toyota Fortuner',
    vehiclePlate: 'KA 03 MX 4492',
    customerId: 'usr_cust_01',
    customerName: 'Arjun Nambiar',
    category: 'MISSED_SPOTS',
    description: 'Minor water streaks on driver-side window corner.',
    status: 'RESOLVED',
    resolutionNote: 'Specialist re-buffed glass at 7:15 AM with yellow microfiber.',
    resolvedAt: '2026-09-03 07:20 AM',
    createdAt: '2026-09-03 07:05 AM',
    proof: INITIAL_JOBS[0].proof
  }
];

// ==========================================
// STATE STORE & REACTIVE API LAYER
// ==========================================

class DataStore {
  private societies: Society[] = [...INITIAL_SOCIETIES];
  private towers: BuildingTower[] = [...INITIAL_TOWERS];
  private slots: ParkingSlot[] = [...INITIAL_SLOTS];
  private servicePlans: ServicePlan[] = [...SERVICE_PLANS];
  private providers: ProviderProfile[] = [...INITIAL_PROVIDERS];
  private vehicles: Vehicle[] = [...INITIAL_VEHICLES];
  private subscriptions: Subscription[] = [...INITIAL_SUBSCRIPTIONS];
  private jobs: ServiceJob[] = [...INITIAL_JOBS];
  private payments: PaymentTransaction[] = [...INITIAL_PAYMENTS];
  private complaints: ComplaintTicket[] = [...INITIAL_COMPLAINTS];
  private currentUser: User = INITIAL_CUSTOMERS[0];
  private listeners: (() => void)[] = [];

  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage() {
    try {
      const savedVehicles = localStorage.getItem('auracar_vehicles');
      if (savedVehicles) this.vehicles = JSON.parse(savedVehicles);

      const savedSubs = localStorage.getItem('auracar_subscriptions');
      if (savedSubs) this.subscriptions = JSON.parse(savedSubs);

      const savedJobs = localStorage.getItem('auracar_jobs');
      if (savedJobs) this.jobs = JSON.parse(savedJobs);
    } catch {
      // Fallback to memory defaults
    }
  }

  private saveToLocalStorage() {
    try {
      localStorage.setItem('auracar_vehicles', JSON.stringify(this.vehicles));
      localStorage.setItem('auracar_subscriptions', JSON.stringify(this.subscriptions));
      localStorage.setItem('auracar_jobs', JSON.stringify(this.jobs));
    } catch {
      // Ignore in restricted environments
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.saveToLocalStorage();
    this.listeners.forEach(l => l());
  }

  // Auth / Role State
  public getCurrentUser(): User {
    return this.currentUser;
  }

  public setCurrentUser(user: User) {
    this.currentUser = user;
    this.notify();
  }

  public switchRole(role: User['role']) {
    if (role === 'CUSTOMER') {
      this.currentUser = INITIAL_CUSTOMERS[0];
    } else if (role === 'PROVIDER') {
      this.currentUser = {
        id: 'usr_prov_01',
        phoneNumber: '9845012345',
        fullName: 'Ramesh Kumar',
        role: 'PROVIDER',
        isActive: true,
        createdAt: '2026-08-01'
      };
    } else if (role === 'ADMIN') {
      this.currentUser = {
        id: 'usr_admin_01',
        phoneNumber: '9900011223',
        fullName: 'Operations Command',
        role: 'ADMIN',
        isActive: true,
        createdAt: '2026-07-01'
      };
    }
    this.notify();
  }

  // Societies & Slots
  public getSocieties(): Society[] {
    return this.societies;
  }

  public getTowers(societyId: string): BuildingTower[] {
    return this.towers.filter(t => t.societyId === societyId);
  }

  public addTower(societyId: string, name: string, totalFloors: number = 24): BuildingTower {
    const newTower: BuildingTower = {
      id: `tow_${Date.now()}`,
      societyId,
      name,
      totalFloors
    };
    this.towers.push(newTower);
    this.notify();
    return newTower;
  }

  public getSlots(towerId: string): ParkingSlot[] {
    return this.slots.filter(s => s.towerId === towerId);
  }

  public addSlot(towerId: string, level: string, slotNumber: string, walkingSequence: number = 0): ParkingSlot {
    const newSlot: ParkingSlot = {
      id: `slot_${Date.now()}`,
      towerId,
      level,
      slotNumber,
      walkingSequence
    };
    this.slots.push(newSlot);
    this.notify();
    return newSlot;
  }

  public getServicePlans(): ServicePlan[] {
    return this.servicePlans;
  }

  // Vehicles
  public getCustomerVehicles(customerId: string): Vehicle[] {
    return this.vehicles.filter(v => v.customerId === customerId);
  }

  public addVehicle(data: Omit<Vehicle, 'id' | 'isActive'>): Vehicle {
    const newVehicle: Vehicle = {
      ...data,
      id: `veh_${Date.now()}`,
      isActive: true
    };
    this.vehicles.unshift(newVehicle);
    this.notify();
    return newVehicle;
  }

  // Subscriptions
  public getCustomerSubscriptions(customerId: string): Subscription[] {
    return this.subscriptions.filter(s => s.customerId === customerId);
  }

  public createSubscription(params: {
    customerId: string;
    vehicleId: string;
    planId: string;
    preferredWindow?: string;
  }): Subscription {
    const vehicle = this.vehicles.find(v => v.id === params.vehicleId);
    const plan = this.servicePlans.find(p => p.id === params.planId);
    if (!vehicle || !plan) throw new Error('Invalid vehicle or plan');

    const amount = plan.pricing[vehicle.type] || plan.pricing.SEDAN;
    const newSub: Subscription = {
      id: `sub_${Date.now()}`,
      customerId: params.customerId,
      vehicleId: params.vehicleId,
      vehicle: vehicle,
      servicePlanId: plan.id,
      plan: plan,
      status: 'ACTIVE',
      monthlyAmount: amount,
      startDate: new Date().toISOString().split('T')[0],
      nextBillingDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      preferredWindow: params.preferredWindow || '06:00 - 08:00 AM',
      assignedProviderId: 'prov_ramesh_01',
      assignedProviderName: 'Ramesh Kumar (Badge #AC-104)'
    };

    this.subscriptions.unshift(newSub);

    // Automatically generate tomorrow's scheduled job
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const newJob: ServiceJob = {
      id: `job_${Date.now()}`,
      subscriptionId: newSub.id,
      vehicleId: vehicle.id,
      vehicle: vehicle,
      societyId: vehicle.societyId,
      societyName: vehicle.societyName,
      slotId: vehicle.slotId,
      slotDetails: vehicle.slotName,
      walkingSequence: 99,
      providerId: 'prov_ramesh_01',
      providerName: 'Ramesh Kumar',
      serviceDate: tomorrow,
      timeWindow: newSub.preferredWindow,
      status: 'SCHEDULED'
    };
    this.jobs.push(newJob);

    this.notify();
    return newSub;
  }

  public togglePauseSubscription(subId: string): Subscription {
    const sub = this.subscriptions.find(s => s.id === subId);
    if (!sub) throw new Error('Subscription not found');

    if (sub.status === 'ACTIVE') {
      sub.status = 'PAUSED';
      sub.pausedUntil = '2026-09-10';
    } else if (sub.status === 'PAUSED') {
      sub.status = 'ACTIVE';
      delete sub.pausedUntil;
    }
    this.notify();
    return sub;
  }

  // Jobs & Provider Workflow
  public getProviderJobs(providerId: string): ServiceJob[] {
    return this.jobs
      .filter(j => j.providerId === providerId)
      .sort((a, b) => a.walkingSequence - b.walkingSequence);
  }

  public getAllJobs(): ServiceJob[] {
    return this.jobs.sort((a, b) => a.walkingSequence - b.walkingSequence);
  }

  public startServiceJob(jobId: string) {
    const job = this.jobs.find(j => j.id === jobId);
    if (job && job.status === 'SCHEDULED') {
      job.status = 'IN_PROGRESS';
      job.startedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      this.notify();
    }
  }

  public completeServiceJob(jobId: string, proofData: { beforeUrl: string; afterUrl: string }) {
    const job = this.jobs.find(j => j.id === jobId);
    if (job) {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      job.status = 'COMPLETED';
      job.completedAt = now;
      job.proof = {
        id: `prf_${Date.now()}`,
        jobId: job.id,
        beforePhotoUrl: proofData.beforeUrl,
        afterPhotoUrl: proofData.afterUrl,
        beforeTakenAt: job.startedAt || '06:30 AM',
        afterTakenAt: now,
        syncTimestamp: new Date().toLocaleString(),
        durationMinutes: 16,
        watermarkHash: `SHA256:${job.slotId}:${Date.now()}`
      };
      this.notify();
    }
  }

  public markJobUnableToService(jobId: string, reason: string) {
    const job = this.jobs.find(j => j.id === jobId);
    if (job) {
      job.status = 'UNABLE_TO_SERVICE';
      job.exceptionReason = reason;
      this.notify();
    }
  }

  public getProviders(): ProviderProfile[] {
    return this.providers;
  }

  public getPayments(customerId?: string): PaymentTransaction[] {
    if (customerId) {
      return this.payments.filter(p => p.customerId === customerId);
    }
    return this.payments;
  }

  public getComplaints(): ComplaintTicket[] {
    return this.complaints;
  }

  public fileComplaint(data: {
    jobId: string;
    category: ComplaintTicket['category'];
    description: string;
  }): ComplaintTicket {
    const job = this.jobs.find(j => j.id === data.jobId);
    const user = this.currentUser;

    const newComplaint: ComplaintTicket = {
      id: `comp_${Date.now()}`,
      jobId: data.jobId,
      jobSlot: job?.slotDetails || 'Basement Slot',
      vehicleName: job ? `${job.vehicle.make} ${job.vehicle.model}` : 'Vehicle',
      vehiclePlate: job?.vehicle.registrationNo || 'KA 03',
      customerId: user.id,
      customerName: user.fullName,
      category: data.category,
      description: data.description,
      status: 'OPEN',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      proof: job?.proof
    };

    this.complaints.unshift(newComplaint);
    this.notify();
    return newComplaint;
  }

  public resolveComplaint(complaintId: string, resolutionNote: string, status: 'RESOLVED' | 'REFUNDED' | 'REJECTED') {
    const comp = this.complaints.find(c => c.id === complaintId);
    if (comp) {
      comp.status = status;
      comp.resolutionNote = resolutionNote;
      comp.resolvedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      this.notify();
    }
  }

  public submitRating(jobId: string, score: number, feedback: string) {
    const job = this.jobs.find(j => j.id === jobId);
    if (job) {
      job.ratingScore = score;
      job.ratingFeedback = feedback;
      this.notify();
    }
  }

  public reassignJob(jobId: string, newProviderId: string) {
    const job = this.jobs.find(j => j.id === jobId);
    const provider = this.providers.find(p => p.id === newProviderId);
    if (job && provider) {
      job.providerId = provider.id;
      job.providerName = provider.fullName;
      this.notify();
    }
  }

  // Metrics for Admin Operations Center
  public getMetricsSummary(): DashboardMetricSummary {
    const totalScheduled = this.jobs.length;
    const completed = this.jobs.filter(j => j.status === 'COMPLETED').length;
    const inProgress = this.jobs.filter(j => j.status === 'IN_PROGRESS').length;
    const missed = this.jobs.filter(j => j.status === 'MISSED' || j.status === 'UNABLE_TO_SERVICE').length;
    const activeSubs = this.subscriptions.filter(s => s.status === 'ACTIVE').length;
    const revenue = this.subscriptions.reduce((acc, curr) => acc + curr.monthlyAmount, 0);
    const openComplaints = this.complaints.filter(c => c.status === 'OPEN' || c.status === 'UNDER_REVIEW').length;
    const refunds = this.complaints.filter(c => c.status === 'REFUNDED').length * 200;

    return {
      totalActiveSubscriptions: activeSubs,
      todayScheduledJobs: totalScheduled,
      todayCompletedJobs: completed,
      todayInProgressJobs: inProgress,
      todayMissedOrDelayed: missed,
      completionRate: totalScheduled > 0 ? Math.round((completed / totalScheduled) * 100) : 0,
      activeProvidersOnDuty: this.providers.filter(p => p.isOnline).length,
      totalMonthlyRevenue: revenue,
      openComplaintsCount: openComplaints,
      totalRefundsIssued: refunds
    };
  }
}

export const store = new DataStore();
