import { DentalSpecialty, DetectedProcedureItem, AIClassification } from '../types';
import { SPECIALTY_TAXONOMY, INTENT_CATEGORIES } from '../data/specialtyTaxonomy';

/**
 * Service to analyze incoming patient enquiry text and classify:
 * 1. Requested procedure or concern
 * 2. Relevant dental specialty
 * 3. Inferred patient intent
 * 4. Suggested administrative next action
 * 
 * Note: Administrative classification for front-desk reception routing only.
 * Does not provide clinical diagnosis or medical evaluation.
 */
export function classifyEnquiry(enquiryText: string): AIClassification {
  if (!enquiryText || enquiryText.trim().length === 0) {
    return {
      procedure: 'General dental consultation',
      specialty: 'Needs Staff Review',
      detectedProcedures: [],
      intent: 'General Inquiry',
      confidence: 40,
      confidenceLevel: 'Low',
      suggestedAction: 'Review enquiry manually and contact patient for details.',
      priorityReasoning: 'Empty or unparsed enquiry text.',
      isConfirmedByStaff: false
    };
  }

  const normalized = enquiryText.toLowerCase();

  // 1. Detect Intent
  let detectedIntent = 'Information Request';
  if (
    normalized.includes('how much') || 
    normalized.includes('cost') || 
    normalized.includes('price') || 
    normalized.includes('pricing') || 
    normalized.includes('quote') || 
    normalized.includes('rates') ||
    normalized.includes('financing')
  ) {
    detectedIntent = 'Pricing Enquiry';
  } else if (
    normalized.includes('emergency') || 
    normalized.includes('broken tooth') || 
    normalized.includes('cracked tooth') || 
    normalized.includes('severe pain') || 
    normalized.includes('throbbing') || 
    normalized.includes('urgent')
  ) {
    detectedIntent = 'Urgent Review Request';
  } else if (
    normalized.includes('consultation') || 
    normalized.includes('consult') || 
    normalized.includes('options') || 
    normalized.includes('interested in getting') || 
    normalized.includes('thinking about') ||
    normalized.includes('looking for')
  ) {
    detectedIntent = 'Consultation Request';
  } else if (
    normalized.includes('appointment') || 
    normalized.includes('book') || 
    normalized.includes('schedule') || 
    normalized.includes('opening') || 
    normalized.includes('reserve')
  ) {
    detectedIntent = 'Appointment Request';
  } else if (
    normalized.includes('reschedule') || 
    normalized.includes('postpone') || 
    normalized.includes('shift') ||
    normalized.includes('cancel')
  ) {
    detectedIntent = 'Reschedule Request';
  } else if (
    normalized.includes('confirm') || 
    normalized.includes('confirmed')
  ) {
    detectedIntent = 'Booking Confirmation';
  }

  // 2. Scan all specialty rules for matching procedures
  const matchedProcedures: {
    procedure: string;
    specialty: DentalSpecialty;
    keywordMatchCount: number;
    defaultAction: string;
  }[] = [];

  for (const rule of SPECIALTY_TAXONOMY) {
    for (const proc of rule.procedures) {
      let matchCount = 0;
      for (const kw of proc.keywords) {
        // Regex word boundary or direct inclusion
        const regex = new RegExp(`\\b${kw}`, 'i');
        if (regex.test(normalized)) {
          matchCount++;
        }
      }
      if (matchCount > 0) {
        matchedProcedures.push({
          procedure: proc.name,
          specialty: rule.specialty,
          keywordMatchCount: matchCount,
          defaultAction: proc.defaultAction || rule.defaultSuggestedAction
        });
      }
    }
  }

  // Check for ambiguous / low confidence queries:
  // e.g. "I'm having some problems with my teeth. Can someone help?"
  const isAmbiguousQuery = 
    (matchedProcedures.length === 0) ||
    (matchedProcedures.length === 1 && 
      matchedProcedures[0].procedure === 'General Dental Consultation' && 
      normalized.length < 60 && 
      (normalized.includes('problem') || normalized.includes('help') || normalized.includes('someone')));

  if (isAmbiguousQuery || matchedProcedures.length === 0) {
    return {
      procedure: 'General dental consultation',
      specialty: 'Needs Staff Review',
      detectedProcedures: [
        {
          id: 'proc-fallback',
          procedure: 'General dental consultation',
          specialty: 'Needs Staff Review',
          confidence: 48
        }
      ],
      intent: detectedIntent || 'General Inquiry',
      confidence: 48,
      confidenceLevel: 'Low',
      suggestedAction: 'Review enquiry manually — request clarification from patient regarding symptoms.',
      priorityReasoning: 'Enquiry uses non-specific terminology ("problems with teeth", "need help"). Staff triage required.',
      isConfirmedByStaff: false
    };
  }

  // Sort matched procedures by match strength
  matchedProcedures.sort((a, b) => b.keywordMatchCount - a.keywordMatchCount);

  // De-duplicate procedures
  const uniqueProcedures: typeof matchedProcedures = [];
  const seenProcNames = new Set<string>();

  for (const item of matchedProcedures) {
    if (!seenProcNames.has(item.procedure)) {
      seenProcNames.add(item.procedure);
      uniqueProcedures.push(item);
    }
  }

  const primaryMatch = uniqueProcedures[0];

  // Convert to DetectedProcedureItem list
  const detectedItems: DetectedProcedureItem[] = uniqueProcedures.map((item, idx) => ({
    id: `dp-${idx + 1}`,
    procedure: item.procedure,
    specialty: item.specialty,
    confidence: Math.min(97, 85 + item.keywordMatchCount * 4)
  }));

  const confidenceScore = Math.min(98, 88 + primaryMatch.keywordMatchCount * 3);
  const confidenceLevel: 'High' | 'Medium' | 'Low' = 
    confidenceScore >= 80 ? 'High' : confidenceScore >= 60 ? 'Medium' : 'Low';

  let reasoning = `Detected patient request for "${primaryMatch.procedure}" matching the ${primaryMatch.specialty} clinical scope.`;
  if (detectedItems.length > 1) {
    reasoning += ` Identified ${detectedItems.length} distinct procedures in enquiry text.`;
  }

  return {
    procedure: primaryMatch.procedure,
    specialty: primaryMatch.specialty,
    detectedProcedures: detectedItems,
    intent: detectedIntent,
    serviceCategory: primaryMatch.specialty,
    confidence: confidenceScore,
    confidenceLevel,
    suggestedAction: primaryMatch.defaultAction,
    priorityReasoning: reasoning,
    isConfirmedByStaff: false
  };
}
