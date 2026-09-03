import { prisma } from '../config/prisma';

export interface DispatchRunResult {
  serviceDate: string;
  totalSocietiesEvaluated: number;
  totalJobsCreated: number;
  cleanersDeployed: number;
  timestamp: string;
}

export class MidnightJobDispatcher {
  /**
   * Idempotent batch worker that generates morning work orders for all active societies.
   * Can be triggered via cron at 12:00 AM daily or called programmatically by Society Admins.
   */
  public static async runDailyDispatch(targetDate?: Date): Promise<DispatchRunResult> {
    const today = targetDate || new Date();
    today.setHours(0, 0, 0, 0);
    const dayOfWeek = today.getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat
    const dateString = today.toISOString().split('T')[0];

    // Fetch all active societies with their active subscriptions and available providers
    const societies = await prisma.society.findMany({
      where: { tenantStatus: 'ACTIVE', isActive: true },
      include: {
        providers: {
          where: { isVerified: true },
          orderBy: { ratingAverage: 'desc' }
        }
      }
    });

    let totalJobsCreated = 0;
    let cleanersDeployed = 0;

    for (const society of societies) {
      // Fetch active subscriptions for this society
      const activeSubscriptions = await prisma.subscription.findMany({
        where: {
          status: 'ACTIVE',
          vehicle: {
            parkingSlot: {
              tower: { societyId: society.id }
            }
          }
        },
        include: {
          plan: true,
          vehicle: {
            include: {
              parkingSlot: true
            }
          }
        }
      });

      // Filter by plan frequency and vacation pause
      const eligibleSubs = activeSubscriptions.filter(sub => {
        // Check vacation pause: suppress jobs during pause
        if (sub.pausedUntil && new Date(sub.pausedUntil) > today) {
          return false;
        }

        // Check plan frequency
        switch (sub.plan.frequency) {
          case 'DAILY':
            return dayOfWeek !== 0; // Mon - Sat (Sunday off)
          case 'ALTERNATE_DAYS':
          case 'THREE_WEEKLY':
            return dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5; // Mon, Wed, Fri
          case 'WEEKLY':
            return dayOfWeek === 6; // Saturday only
          default:
            return true;
        }
      });

      if (eligibleSubs.length === 0) continue;

      const activeProviders = society.providers;
      if (activeProviders.length > 0) {
        cleanersDeployed += activeProviders.length;
      }

      // Sort vehicles by basement walking sequence (1 -> 2 -> 3)
      eligibleSubs.sort((a, b) => 
        (a.vehicle.parkingSlot.walkingSequence || 0) - (b.vehicle.parkingSlot.walkingSequence || 0)
      );

      const maxCapacityPerCleaner = 28;

      for (let i = 0; i < eligibleSubs.length; i++) {
        const sub = eligibleSubs[i];
        const providerIndex = Math.floor(i / maxCapacityPerCleaner);
        const assignedProvider = activeProviders[providerIndex] || activeProviders[0];

        // Idempotent upsert: ensure exactly one job exists per vehicle per date
        try {
          await prisma.serviceJob.upsert({
            where: {
              vehicleId_serviceDate: {
                vehicleId: sub.vehicleId,
                serviceDate: today
              }
            },
            update: {
              providerId: assignedProvider?.id || null,
              timeWindow: sub.preferredWindow || '06:00-08:00'
            },
            create: {
              subscriptionId: sub.id,
              vehicleId: sub.vehicleId,
              societyId: society.id,
              slotId: sub.vehicle.slotId,
              providerId: assignedProvider?.id || null,
              serviceDate: today,
              timeWindow: sub.preferredWindow || '06:00-08:00',
              status: 'SCHEDULED'
            }
          });
          totalJobsCreated++;
        } catch {
          // Idempotent catch
        }
      }
    }

    return {
      serviceDate: dateString,
      totalSocietiesEvaluated: societies.length,
      totalJobsCreated,
      cleanersDeployed,
      timestamp: new Date().toISOString()
    };
  }
}
