export type UserRole = 'CUSTOMER' | 'PROVIDER' | 'ADMIN' | 'SOCIETY_MANAGER';

export type VehicleType = 'HATCHBACK' | 'SEDAN' | 'COMPACT_SUV' | 'SUV_LUXURY';

export type PlanFrequency = 'DAILY' | 'ALTERNATE_DAYS' | 'THREE_WEEKLY' | 'WEEKLY';

export type SubscriptionStatus = 'DRAFT' | 'PENDING_PAYMENT' | 'ACTIVE' | 'PAUSED' | 'CANCELLED' | 'EXPIRED';

export type JobStatus = 
  | 'SCHEDULED' 
  | 'ASSIGNED' 
  | 'IN_PROGRESS' 
  | 'COMPLETED' 
  | 'MISSED' 
  | 'UNABLE_TO_SERVICE' 
  | 'CANCELLED';

export interface User {
  id: string;
  phoneNumber: string;
  fullName: string;
  email?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface Society {
  id: string;
  name: string;
  code: string;
  addressLine: string;
  locality: string;
  city: string;
  pincode: string;
  waterPolicy: 'WATERLESS_ONLY' | 'LOW_WATER' | 'BUCKET_PERMITTED';
  totalApartments: number;
  activeCarsCount: number;
}

export interface BuildingTower {
  id: string;
  societyId: string;
  name: string;
  totalFloors: number;
}

export interface ParkingSlot {
  id: string;
  towerId: string;
  towerName?: string;
  level: string; // "Basement 1", "Basement 2", "Podium"
  slotNumber: string; // "B2-104"
  walkingSequence: number;
}

export interface Vehicle {
  id: string;
  customerId: string;
  make: string; // "Toyota"
  model: string; // "Fortuner"
  color: string; // "Pearl White"
  registrationNo: string; // "MH12AB1234"
  type: VehicleType;
  societyId: string;
  societyName: string;
  slotId: string;
  slotName: string;
  notes?: string;
  isActive: boolean;
}

export interface ServicePlan {
  id: string;
  name: string;
  code: string;
  frequency: PlanFrequency;
  frequencyLabel: string;
  description: string;
  pricing: {
    HATCHBACK: number; // in INR
    SEDAN: number;
    COMPACT_SUV: number;
    SUV_LUXURY: number;
  };
  inclusions: string[];
  recommended?: boolean;
}

export interface Subscription {
  id: string;
  customerId: string;
  vehicleId: string;
  vehicle: Vehicle;
  servicePlanId: string;
  plan: ServicePlan;
  status: SubscriptionStatus;
  monthlyAmount: number; // in INR
  startDate: string;
  endDate?: string;
  nextBillingDate: string;
  preferredWindow: string; // "06:00 - 08:00 AM"
  assignedProviderId?: string;
  assignedProviderName?: string;
  pausedUntil?: string;
}

export interface ServiceProof {
  id: string;
  jobId: string;
  beforePhotoUrl: string;
  afterPhotoUrl: string;
  beforeTakenAt: string;
  afterTakenAt: string;
  syncTimestamp: string;
  durationMinutes: number;
  watermarkHash: string;
}

export interface ServiceJob {
  id: string;
  subscriptionId: string;
  vehicleId: string;
  vehicle: Vehicle;
  societyId: string;
  societyName: string;
  slotId: string;
  slotDetails: string; // "Tower B • Basement 2 • Slot #B2-104"
  walkingSequence: number;
  providerId?: string;
  providerName?: string;
  serviceDate: string; // YYYY-MM-DD
  timeWindow: string; // "06:00 - 08:00 AM"
  status: JobStatus;
  startedAt?: string;
  completedAt?: string;
  exceptionReason?: string;
  proof?: ServiceProof;
  ratingScore?: number;
  ratingFeedback?: string;
}

export interface ProviderProfile {
  id: string;
  userId: string;
  fullName: string;
  phoneNumber: string;
  badgeNumber: string;
  assignedSocietyId: string;
  assignedSocietyName: string;
  ratingAverage: number;
  totalJobsDone: number;
  isOnline: boolean;
  checkInTime?: string;
}

export interface PaymentTransaction {
  id: string;
  subscriptionId: string;
  customerId: string;
  amount: number; // in INR
  currency: string;
  status: 'CAPTURED' | 'PENDING' | 'FAILED' | 'REFUNDED';
  razorpayPaymentId: string;
  razorpayOrderId: string;
  invoiceNumber: string;
  paymentMethod: 'UPI_AUTOPAY' | 'CREDIT_CARD' | 'NET_BANKING';
  createdAt: string;
  invoicePdfUrl?: string;
}

export interface ComplaintTicket {
  id: string;
  jobId: string;
  jobSlot: string;
  vehicleName: string;
  vehiclePlate: string;
  customerId: string;
  customerName: string;
  category: 'MISSED_SPOTS' | 'SCRATCH_CLAIM' | 'LATE_SERVICE' | 'CLEANER_UNAVAILABLE';
  description: string;
  status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'REFUNDED' | 'REJECTED';
  resolutionNote?: string;
  resolvedAt?: string;
  createdAt: string;
  proof?: ServiceProof;
}

export interface SocietyEnquiry {
  id: string;
  societyName: string;
  contactPerson: string;
  email: string;
  phoneNumber: string;
  city: string;
  estimatedUnits: number;
  status: 'NEW' | 'CONTACTED' | 'DEMO_SCHEDULED' | 'PROPOSAL_SENT' | 'CONVERTED' | 'CLOSED';
  createdAt: string;
}

export interface DashboardMetricSummary {
  totalActiveSubscriptions: number;
  todayScheduledJobs: number;
  todayCompletedJobs: number;
  todayInProgressJobs: number;
  todayMissedOrDelayed: number;
  completionRate: number;
  activeProvidersOnDuty: number;
  totalMonthlyRevenue: number;
  openComplaintsCount: number;
  totalRefundsIssued: number;
}
