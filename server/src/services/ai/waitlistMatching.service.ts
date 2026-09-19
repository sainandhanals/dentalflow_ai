import { WaitlistEntry } from '@prisma/client';

export interface SlotDetails {
  date: string;
  time: string;
  duration?: number;
  provider: string;
  procedure?: string;
  operatory?: string;
}

export interface MatchedCandidate {
  candidateId: string;
  patientName: string;
  phone?: string;
  matchScore: number;
  acceptanceProbability: number;
  matchingFactors: string[];
  suggestedSlot: string;
  urgency: string;
  matchExplanation: string;
}

export interface WaitlistMatchResult {
  slot: SlotDetails;
  matchedCount: number;
  topCandidate?: MatchedCandidate;
  rankedCandidates: MatchedCandidate[];
  isDemo: boolean;
}

export class WaitlistMatchingService {
  public static matchSlot(slot: SlotDetails, candidates: WaitlistEntry[]): WaitlistMatchResult {
    const scoredCandidates: MatchedCandidate[] = candidates.map((candidate) => {
      let score = 50;
      const factors: string[] = [];

      // Procedure compatibility
      if (
        slot.procedure &&
        candidate.procedure.toLowerCase().includes(slot.procedure.toLowerCase().split(' ')[0])
      ) {
        score += 25;
        factors.push(`Procedure matches slot requirements (${candidate.procedure})`);
      } else {
        factors.push(`Routine compatible procedure (${candidate.procedure})`);
        score += 10;
      }

      // Provider compatibility
      if (
        candidate.providerPreference === 'Any Available' ||
        candidate.providerPreference.toLowerCase() === slot.provider.toLowerCase()
      ) {
        score += 15;
        factors.push(`Accepts provider ${slot.provider}`);
      }

      // Proximity / Availability
      if (candidate.distanceKm <= 3.0) {
        score += 15;
        factors.push(`Close clinic proximity (${candidate.distanceKm} km away)`);
      }

      // Urgency factor
      if (candidate.urgency.toLowerCase() === 'high' || candidate.urgency.toLowerCase() === 'urgent') {
        score += 15;
        factors.push('Marked as high clinical urgency on waitlist');
      }

      score = Math.min(Math.max(score, 40), 98);
      const acceptanceProbability = Math.round((score / 100) * 100) / 100;

      return {
        candidateId: candidate.id,
        patientName: candidate.patientName,
        phone: candidate.phone || undefined,
        matchScore: score,
        acceptanceProbability,
        matchingFactors: factors,
        suggestedSlot: `${slot.date} at ${slot.time} (${slot.provider})`,
        urgency: candidate.urgency,
        matchExplanation: `High compatibility with ${slot.provider}'s opening. ${factors.join('; ')}.`,
      };
    });

    scoredCandidates.sort((a, b) => b.matchScore - a.matchScore);

    return {
      slot,
      matchedCount: scoredCandidates.length,
      topCandidate: scoredCandidates[0],
      rankedCandidates: scoredCandidates,
      isDemo: true,
    };
  }
}
