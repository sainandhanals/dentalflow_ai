export interface HouseholdMemberInput {
  memberId: string;
  name: string;
  relationship: string;
  procedureNeeded?: string;
  hasUpcomingAppointment: boolean;
  age?: number;
}

export interface HouseholdBundlingInput {
  householdId: string;
  familyName: string;
  primaryContactName: string;
  primaryContactPhone?: string;
  members: HouseholdMemberInput[];
  preferredDay?: string;
}

export interface BundledSlotSuggestion {
  memberId: string;
  memberName: string;
  procedure: string;
  suggestedTime: string;
  operatory: string;
  provider: string;
  estimatedDurationMinutes: number;
}

export interface HouseholdBundlingOutput {
  householdId: string;
  familyName: string;
  efficiencyGain: string;
  suggestedDate: string;
  recommendedTimeWindow: string;
  bundledSlots: BundledSlotSuggestion[];
  requiresConfirmation: boolean;
  explanation: string;
  isDemo: boolean;
}

export class HouseholdBundlingService {
  public static analyzeBundle(input: HouseholdBundlingInput): HouseholdBundlingOutput {
    const members = input?.members || [];
    const unscheduledMembers = members.filter((m) => !m.hasUpcomingAppointment);
    const scheduledMember = members.find((m) => m.hasUpcomingAppointment);

    const baseTime = scheduledMember ? '10:00 AM' : '09:30 AM';
    const suggestedDate = input?.preferredDay || 'Upcoming Saturday';

    const bundledSlots: BundledSlotSuggestion[] = members.map((m, idx) => {
      const isConcurrent = idx > 0 && idx % 2 === 0;
      const operatory = isConcurrent ? 'Operatory 2' : 'Operatory 1';
      const provider = isConcurrent ? 'Dr. James Chen' : 'Dr. Sarah Wilson';
      const duration = (m.age && m.age < 14) ? 30 : 45;
      
      const timeOffsetMinutes = idx * 45;
      const hours = 10 + Math.floor(timeOffsetMinutes / 60);
      const minutes = (timeOffsetMinutes % 60).toString().padStart(2, '0');
      const timeStr = `${hours}:${minutes} AM`;

      return {
        memberId: m.memberId,
        memberName: m.name,
        procedure: m.procedureNeeded || 'Routine Hygiene & Recare Exam',
        suggestedTime: isConcurrent ? baseTime : timeStr,
        operatory,
        provider,
        estimatedDurationMinutes: duration,
      };
    });

    const tripsSaved = Math.max(1, unscheduledMembers.length);

    return {
      householdId: input?.householdId || 'HH-UNKNOWN',
      familyName: input?.familyName || 'Family',
      efficiencyGain: `Saves ${tripsSaved} separate family round trips by coordinating appointments into a single clinic visit window.`,
      suggestedDate,
      recommendedTimeWindow: '10:00 AM - 12:00 PM (Concurrent & Back-to-Back Operatories)',
      bundledSlots,
      requiresConfirmation: true,
      explanation: `Bundling identified for ${input.members.length} household members. Preserves individual privacy while maximizing family convenience.`,
      isDemo: true,
    };
  }
}
