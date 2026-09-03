import { ServiceJob, Subscription, ProviderProfile, ParkingSlot } from '../types';

export interface DispatchSummary {
  societyId: string;
  serviceDate: string;
  totalGenerated: number;
  assignedCount: number;
  unassignedCount: number;
  cleanersDeployed: number;
  averageCarsPerCleaner: number;
}

export class JobDispatchEngine {
  /**
   * Generates the morning manifest for a society based on active subscriptions,
   * plan frequency rules, vacation pauses, and basement walking sequence.
   */
  public static generateDailyManifest(
    societyId: string,
    serviceDate: string,
    subscriptions: Subscription[],
    providers: ProviderProfile[],
    slots: ParkingSlot[]
  ): { jobs: ServiceJob[]; summary: DispatchSummary } {
    const dayOfWeek = new Date(serviceDate).getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat
    const activeSubsInSociety = subscriptions.filter(
      s => s.status === 'ACTIVE' && s.vehicle.societyId === societyId
    );

    const eligibleSubs = activeSubsInSociety.filter(sub => {
      // Check frequency rules
      switch (sub.plan.frequency) {
        case 'DAILY':
          return dayOfWeek !== 0; // Mon-Sat
        case 'ALTERNATE_DAYS':
        case 'THREE_WEEKLY':
          return dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5; // Mon, Wed, Fri
        case 'WEEKLY':
          return dayOfWeek === 6; // Saturday
        default:
          return true;
      }
    });

    const activeProvidersInSociety = providers.filter(
      p => p.assignedSocietyId === societyId && p.isOnline
    );

    const generatedJobs: ServiceJob[] = [];
    const maxCapacityPerCleaner = 28; // 25-28 cars for a 2.5 hr morning shift

    eligibleSubs.forEach((sub, idx) => {
      const slot = slots.find(s => s.id === sub.vehicle.slotId);
      const walkingSeq = slot?.walkingSequence || idx + 1;

      // Deterministic cleaner allocation by capacity
      const providerIndex = Math.floor(idx / maxCapacityPerCleaner);
      const assignedProvider = activeProvidersInSociety[providerIndex] || activeProvidersInSociety[0];

      const job: ServiceJob = {
        id: `job_${sub.id}_${serviceDate.replace(/-/g, '')}`,
        subscriptionId: sub.id,
        vehicleId: sub.vehicleId,
        vehicle: sub.vehicle,
        societyId: societyId,
        societyName: sub.vehicle.societyName,
        slotId: sub.vehicle.slotId,
        slotDetails: sub.vehicle.slotName,
        walkingSequence: walkingSeq,
        providerId: assignedProvider?.id,
        providerName: assignedProvider?.fullName,
        serviceDate: serviceDate,
        timeWindow: sub.preferredWindow || '06:00 - 08:00 AM',
        status: assignedProvider ? 'SCHEDULED' : 'SCHEDULED'
      };

      generatedJobs.push(job);
    });

    // Sort strictly by physical walking sequence in the basement
    generatedJobs.sort((a, b) => a.walkingSequence - b.walkingSequence);

    const summary: DispatchSummary = {
      societyId,
      serviceDate,
      totalGenerated: generatedJobs.length,
      assignedCount: generatedJobs.filter(j => j.providerId).length,
      unassignedCount: generatedJobs.filter(j => !j.providerId).length,
      cleanersDeployed: activeProvidersInSociety.length,
      averageCarsPerCleaner: activeProvidersInSociety.length > 0 
        ? Math.round(generatedJobs.length / activeProvidersInSociety.length)
        : 0
    };

    return { jobs: generatedJobs, summary };
  }

  /**
   * Emergency re-assignment when a cleaner is delayed or absent
   */
  public static reassignManifest(
    jobs: ServiceJob[],
    fromProviderId: string,
    toProvider: ProviderProfile
  ): ServiceJob[] {
    return jobs.map(job => {
      if (job.providerId === fromProviderId && (job.status === 'SCHEDULED' || job.status === 'ASSIGNED')) {
        return {
          ...job,
          providerId: toProvider.id,
          providerName: toProvider.fullName
        };
      }
      return job;
    });
  }
}
