import { ServicePlan, Subscription, Vehicle } from '../types';

export interface UpcomingServiceDate {
  dateString: string; // YYYY-MM-DD
  dayName: string; // "Mon", "Tue", "Wed", etc.
  dayNumber: number; // 1-31
  isScheduled: boolean;
  isPaused: boolean;
}

export class SubscriptionEngine {
  /**
   * Generates a 30-day forward calendar matrix based on plan frequency and pause ranges
   */
  public static generate30DaySchedule(
    subscription: Subscription,
    pausedRanges: { startDate: string; endDate: string }[] = []
  ): UpcomingServiceDate[] {
    const dates: UpcomingServiceDate[] = [];
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const current = new Date(today.getTime() + i * 86400000);
      const dateString = current.toISOString().split('T')[0];
      const dayOfWeek = current.getDay(); // 0 = Sun, 1 = Mon, ... 6 = Sat
      const dayName = current.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNumber = current.getDate();

      // Check if paused
      const isPaused = pausedRanges.some(
        range => dateString >= range.startDate && dateString <= range.endDate
      );

      // Determine schedule based on frequency
      let isScheduled = false;
      if (!isPaused && subscription.status === 'ACTIVE') {
        switch (subscription.plan.frequency) {
          case 'DAILY':
            // Mon to Sat (Sunday off for cleaner rest)
            isScheduled = dayOfWeek !== 0;
            break;
          case 'ALTERNATE_DAYS':
          case 'THREE_WEEKLY':
            // Mon, Wed, Fri (1, 3, 5)
            isScheduled = dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5;
            break;
          case 'WEEKLY':
            // Every Saturday (6)
            isScheduled = dayOfWeek === 6;
            break;
        }
      }

      dates.push({
        dateString,
        dayName,
        dayNumber,
        isScheduled,
        isPaused
      });
    }

    return dates;
  }

  /**
   * Calculates pro-rated billing adjustment when a user pauses their subscription
   */
  public static calculatePauseExtension(
    currentNextBillingDate: string,
    pauseDaysCount: number
  ): string {
    const currentBilling = new Date(currentNextBillingDate);
    const newBilling = new Date(currentBilling.getTime() + pauseDaysCount * 86400000);
    return newBilling.toISOString().split('T')[0];
  }

  /**
   * Calculates multi-vehicle bundle discount (10% off second vehicle in same society)
   */
  public static calculateMultiCarPricing(
    vehicles: Vehicle[],
    plans: ServicePlan[]
  ): {
    totalOriginal: number;
    totalDiscounted: number;
    discountSavings: number;
  } {
    let totalOriginal = 0;

    vehicles.forEach(veh => {
      const plan = plans[0]; // Default or selected
      const price = plan.pricing[veh.type] || plan.pricing.SEDAN;
      totalOriginal += price;
    });

    // 10% discount on total if 2 or more cars
    const discountFactor = vehicles.length >= 2 ? 0.10 : 0;
    const discountSavings = Math.round(totalOriginal * discountFactor);
    const totalDiscounted = totalOriginal - discountSavings;

    return {
      totalOriginal,
      totalDiscounted,
      discountSavings
    };
  }
}
