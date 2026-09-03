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
  ComplaintTicket,
  SocietyEnquiry
} from '../types';

// ==========================================
// SEED DATA (Clean Production Baseline)
// ==========================================

export const INITIAL_SOCIETIES: Society[] = [];
export const INITIAL_TOWERS: BuildingTower[] = [];
export const INITIAL_SLOTS: ParkingSlot[] = [];

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

export const INITIAL_PROVIDERS: ProviderProfile[] = [];
export const INITIAL_CUSTOMERS: User[] = [];
export const INITIAL_VEHICLES: Vehicle[] = [];
export const INITIAL_SUBSCRIPTIONS: Subscription[] = [];
export const INITIAL_JOBS: ServiceJob[] = [];
export const INITIAL_PAYMENTS: PaymentTransaction[] = [];
export const INITIAL_COMPLAINTS: ComplaintTicket[] = [];

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
  private enquiries: SocietyEnquiry[] = [];
  private currentUser: User = {
    id: 'usr_guest',
    phoneNumber: '',
    fullName: 'Guest User',
    role: 'CUSTOMER',
    isActive: true,
    createdAt: '2026-09-03'
  };
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

      const savedEnquiries = localStorage.getItem('auracar_enquiries');
      if (savedEnquiries) this.enquiries = JSON.parse(savedEnquiries);

      const savedSocieties = localStorage.getItem('auracar_societies');
      if (savedSocieties) this.societies = JSON.parse(savedSocieties);
    } catch {
      // Fallback to memory defaults
    }
  }

  private saveToLocalStorage() {
    try {
      localStorage.setItem('auracar_vehicles', JSON.stringify(this.vehicles));
      localStorage.setItem('auracar_subscriptions', JSON.stringify(this.subscriptions));
      localStorage.setItem('auracar_jobs', JSON.stringify(this.jobs));
      localStorage.setItem('auracar_enquiries', JSON.stringify(this.enquiries));
      localStorage.setItem('auracar_societies', JSON.stringify(this.societies));
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

  public resetToCleanSlate() {
    this.societies = [];
    this.towers = [];
    this.slots = [];
    this.vehicles = [];
    this.subscriptions = [];
    this.jobs = [];
    this.payments = [];
    this.complaints = [];
    this.providers = [];
    localStorage.removeItem('auracar_vehicles');
    localStorage.removeItem('auracar_subscriptions');
    localStorage.removeItem('auracar_jobs');
    localStorage.removeItem('auracar_societies');
    localStorage.removeItem('auracar_towers');
    localStorage.removeItem('auracar_slots');
    localStorage.removeItem('auracar_providers');
    this.notify();
  }

  public seedRealisticDemo() {
    this.societies = [...INITIAL_SOCIETIES];
    this.towers = [...INITIAL_TOWERS];
    this.slots = [...INITIAL_SLOTS];
    this.vehicles = [...INITIAL_VEHICLES];
    this.subscriptions = [...INITIAL_SUBSCRIPTIONS];
    this.jobs = [...INITIAL_JOBS];
    this.payments = [...INITIAL_PAYMENTS];
    this.complaints = [...INITIAL_COMPLAINTS];
    this.providers = [...INITIAL_PROVIDERS];
    this.notify();
  }

  // Inbound B2B Society Enquiries
  public getEnquiries(): SocietyEnquiry[] {
    return this.enquiries;
  }

  public addEnquiry(data: Omit<SocietyEnquiry, 'id' | 'createdAt' | 'status'>): SocietyEnquiry {
    const newEnquiry: SocietyEnquiry = {
      ...data,
      id: `enq_${Date.now()}`,
      status: 'NEW',
      createdAt: new Date().toISOString().split('T')[0]
    };
    this.enquiries.unshift(newEnquiry);
    this.notify();
    return newEnquiry;
  }

  public updateEnquiryStatus(id: string, status: SocietyEnquiry['status']) {
    const enq = this.enquiries.find(e => e.id === id);
    if (enq) {
      enq.status = status;
      this.notify();
    }
  }

  // Societies & Slots
  public getSocieties(): Society[] {
    return this.societies;
  }

  public addSociety(data: Omit<Society, 'id' | 'activeCarsCount'>): Society {
    const newSociety: Society = {
      ...data,
      id: `soc_${Date.now()}`,
      activeCarsCount: 0
    };
    this.societies.unshift(newSociety);
    this.notify();
    return newSociety;
  }

  public addProvider(data: Omit<ProviderProfile, 'id'>): ProviderProfile {
    const newProvider: ProviderProfile = {
      ...data,
      id: `prov_${Date.now()}`
    };
    this.providers.push(newProvider);
    this.notify();
    return newProvider;
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

  public triggerDailyDispatch(targetDate: string = '2026-09-03') {
    const activeSubs = this.subscriptions.filter(s => s.status === 'ACTIVE');
    let generatedCount = 0;

    activeSubs.forEach((sub, idx) => {
      const existingJob = this.jobs.find(j => j.subscriptionId === sub.id && j.serviceDate === targetDate);
      if (!existingJob) {
        const vehicle = this.vehicles.find(v => v.id === sub.vehicleId);
        const assignedProvider = this.providers[idx % (this.providers.length || 1)] || { id: 'prov_ramesh_01', fullName: 'Ramesh Kumar' };

        const newJob: ServiceJob = {
          id: `job_${sub.id}_${targetDate.replace(/-/g, '')}`,
          subscriptionId: sub.id,
          vehicleId: sub.vehicleId,
          vehicle: vehicle || {
            id: sub.vehicleId,
            customerId: 'usr_cust_01',
            make: 'Toyota',
            model: 'Fortuner',
            color: 'Pearl White',
            registrationNo: 'KA 03 MX 4492',
            type: 'SUV_LUXURY',
            societyId: 'soc_plh_01',
            societyName: 'Prestige Lakeside Habitat',
            slotId: 'slot_1',
            slotName: 'Slot B2-104',
            isActive: true
          },
          societyId: vehicle?.societyId || 'soc_plh_01',
          societyName: vehicle?.societyName || 'Prestige Lakeside Habitat',
          slotId: vehicle?.slotId || 'slot_1',
          slotDetails: vehicle?.slotName || 'Tower 1 • Basement 2 • Slot B2-104',
          walkingSequence: idx + 1,
          providerId: assignedProvider.id,
          providerName: assignedProvider.fullName,
          serviceDate: targetDate,
          timeWindow: sub.preferredWindow || '06:00 - 08:00 AM',
          status: 'SCHEDULED'
        };

        this.jobs.unshift(newJob);
        generatedCount++;
      }
    });

    this.notify();
    return generatedCount;
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
