import { Appointment, WaitlistEntry } from '../types';

export interface WaitlistMatchResult {
  candidate: WaitlistEntry;
  acceptanceScore: number;
  matchReason: string;
  smsPreview: string;
}

/**
 * Service to rank waitlist candidates to fill cancelled dental chair openings.
 */
export function rankWaitlistCandidates(
  cancelledAppointment: Appointment,
  waitlist: WaitlistEntry[]
): WaitlistMatchResult[] {
  const openTime = cancelledAppointment.time;
  const openProvider = cancelledAppointment.provider;
  const openProc = cancelledAppointment.procedure;

  const results: WaitlistMatchResult[] = waitlist
    .filter((w) => w.status === 'Waiting' || w.status === 'Offer Sent')
    .map((candidate) => {
      let score = candidate.acceptanceProbability;

      // Provider match bonus
      if (candidate.providerPreference.toLowerCase().includes(openProvider.toLowerCase()) || candidate.providerPreference === 'Any Provider') {
        score = Math.min(99, score + 4);
      }

      // Procedure compatibility check
      const procMatch =
        candidate.procedure.toLowerCase() === openProc.toLowerCase() ||
        (candidate.procedure.includes('Cleaning') && openProc.includes('Check-up')) ||
        (candidate.procedure.includes('Consultation') && openProc.includes('Consultation'));

      let reason = candidate.matchReason;
      if (procMatch) {
        reason = `Requested ${candidate.procedure} • Matches ${openProvider} schedule • Available ${candidate.availability}`;
      }

      const smsPreview = `Hi ${candidate.patientName.split(' ')[0]}, an opening has become available today at ${openTime} with ${openProvider} at BrightSmile Dental Studio for your ${candidate.procedure}. Reply YES within 15 min to reserve this slot or NO to pass.`;

      return {
        candidate,
        acceptanceScore: score,
        matchReason: reason,
        smsPreview,
      };
    });

  // Sort descending by acceptance likelihood
  return results.sort((a, b) => b.acceptanceScore - a.acceptanceScore);
}
