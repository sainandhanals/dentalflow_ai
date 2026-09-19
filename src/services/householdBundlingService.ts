import { Household, HouseholdMember } from '../types';

export interface BundleSuggestion {
  household: Household;
  recommendedTimeWindow: string;
  totalAppointments: number;
  unscheduledPatients: HouseholdMember[];
  efficiencyGain: string;
  confirmationSummary: string;
}

/**
 * Service to identify family / household appointment bundling opportunities.
 */
export function generateHouseholdBundle(household: Household): BundleSuggestion {
  const unscheduled = household.members.filter((m) => m.status === 'Suggested' || m.status === 'Unscheduled');
  const scheduled = household.members.filter((m) => m.status === 'Scheduled' || m.status === 'Booked');

  const totalAppts = household.members.length;
  const efficiencyGain = `${unscheduled.length} family transit trips eliminated • 1 chair block reserved`;

  const confirmationSummary = `Confirmed family bundle for ${household.householdName} (${totalAppts} appointments on ${household.suggestedDate} from ${household.suggestedTime}). Automated family itinerary prepared.`;

  return {
    household,
    recommendedTimeWindow: `${household.suggestedDate}, ${household.suggestedTime}`,
    totalAppointments: totalAppts,
    unscheduledPatients: unscheduled,
    efficiencyGain,
    confirmationSummary,
  };
}
