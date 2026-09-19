export interface LeadClassificationInput {
  patientName?: string;
  patientEmail?: string;
  patientPhone?: string;
  message: string;
  source?: string;
  service?: string;
}

export interface DetectedProcedure {
  id: string;
  procedure: string;
  specialty: string;
  confidence: number;
}

export interface LeadClassificationOutput {
  classification: string;
  priority: 'Urgent Review' | 'High' | 'Medium' | 'Low';
  intent: string;
  procedure: string;
  specialty: string;
  confidence: number;
  confidenceLevel: 'High' | 'Medium' | 'Low';
  suggestedAction: string;
  priorityReasoning: string;
  detectedProcedures: DetectedProcedure[];
  isDemo: boolean;
}

const SPECIALTY_KEYWORDS: { [key: string]: { specialty: string; procedure: string; weight: number }[] } = {
  invisalign: [{ specialty: 'Orthodontics', procedure: 'Clear Aligners / Invisalign', weight: 95 }],
  braces: [{ specialty: 'Orthodontics', procedure: 'Traditional Metal & Ceramic Braces', weight: 92 }],
  crowding: [{ specialty: 'Orthodontics', procedure: 'Clear Aligners / Invisalign', weight: 88 }],
  straighten: [{ specialty: 'Orthodontics', procedure: 'Clear Aligners / Invisalign', weight: 85 }],
  implant: [{ specialty: 'Implant Dentistry', procedure: 'Dental Implant Placement & Crown', weight: 95 }],
  "missing tooth": [{ specialty: 'Implant Dentistry', procedure: 'Dental Implant Placement & Crown', weight: 90 }],
  whiten: [{ specialty: 'Cosmetic Dentistry', procedure: 'Professional In-Office Teeth Whitening', weight: 94 }],
  veneer: [{ specialty: 'Cosmetic Dentistry', procedure: 'Porcelain Veneers & Smile Makeover', weight: 92 }],
  broken: [{ specialty: 'General Dentistry', procedure: 'Composite Dental Fillings & Restoration', weight: 90 }],
  chipped: [{ specialty: 'General Dentistry', procedure: 'Composite Dental Fillings & Restoration', weight: 88 }],
  cavity: [{ specialty: 'General Dentistry', procedure: 'Composite Dental Fillings & Restoration', weight: 86 }],
  cleaning: [{ specialty: 'General Dentistry', procedure: 'Routine Preventive Cleaning & Exam', weight: 85 }],
  checkup: [{ specialty: 'General Dentistry', procedure: 'Routine Preventive Cleaning & Exam', weight: 85 }],
  pain: [{ specialty: 'Endodontics', procedure: 'Root Canal Therapy & Pulp Treatment', weight: 92 }],
  throbbing: [{ specialty: 'Endodontics', procedure: 'Root Canal Therapy & Pulp Treatment', weight: 93 }],
  abscess: [{ specialty: 'Endodontics', procedure: 'Emergency Endodontic Treatment', weight: 96 }],
  wisdom: [{ specialty: 'Oral & Maxillofacial Surgery', procedure: 'Surgical Wisdom Teeth Extraction', weight: 95 }],
  extraction: [{ specialty: 'Oral & Maxillofacial Surgery', procedure: 'Tooth Extraction & Bone Grafting', weight: 90 }],
  gum: [{ specialty: 'Periodontics', procedure: 'Deep Scaling & Periodontal Maintenance', weight: 88 }],
  bleeding: [{ specialty: 'Periodontics', procedure: 'Deep Scaling & Periodontal Maintenance', weight: 85 }],
  child: [{ specialty: 'Pediatric Dentistry', procedure: 'Pediatric Dental Exam & Sealants', weight: 92 }],
  kid: [{ specialty: 'Pediatric Dentistry', procedure: 'Pediatric Dental Exam & Sealants', weight: 90 }],
  denture: [{ specialty: 'Prosthodontics', procedure: 'Full or Partial Denture Prosthetics', weight: 92 }],
  crown: [{ specialty: 'Prosthodontics', procedure: 'Custom Porcelain Crown', weight: 88 }],
};

export class LeadClassificationService {
  public static async classifyLead(input: LeadClassificationInput): Promise<LeadClassificationOutput> {
    const text = `${input.service || ''} ${input.message}`.toLowerCase();

    // Check for urgent symptoms
    const isUrgent =
      text.includes('broken') ||
      text.includes('throbbing') ||
      text.includes('emergency') ||
      text.includes('severe pain') ||
      text.includes('cracked') ||
      text.includes('swollen');

    let matchedSpecialty = 'General Dentistry';
    let matchedProcedure = 'Routine Preventive Cleaning & Exam';
    let highestWeight = 75;
    const detectedProcedures: DetectedProcedure[] = [];

    let count = 1;
    for (const [kw, matches] of Object.entries(SPECIALTY_KEYWORDS)) {
      if (text.includes(kw)) {
        for (const m of matches) {
          if (m.weight > highestWeight) {
            highestWeight = m.weight;
            matchedSpecialty = m.specialty;
            matchedProcedure = m.procedure;
          }
          if (!detectedProcedures.some((d) => d.procedure === m.procedure)) {
            detectedProcedures.push({
              id: `dp-${count++}`,
              procedure: m.procedure,
              specialty: m.specialty,
              confidence: m.weight,
            });
          }
        }
      }
    }

    if (detectedProcedures.length === 0) {
      detectedProcedures.push({
        id: 'dp-default',
        procedure: matchedProcedure,
        specialty: matchedSpecialty,
        confidence: 80,
      });
    }

    let priority: 'Urgent Review' | 'High' | 'Medium' | 'Low' = 'Medium';
    let classification = 'medium-intent';
    let intent = 'Consultation Request';
    let suggestedAction = 'Follow up within 24 hours to schedule consultation.';
    let priorityReasoning = 'Standard treatment enquiry requiring routine staff review.';

    if (isUrgent) {
      priority = 'Urgent Review';
      classification = 'emergency-related';
      intent = 'Urgent Review Request';
      suggestedAction = 'Direct phone triage by receptionist to assess acute discomfort and assign emergency buffer.';
      priorityReasoning = 'Urgent clinical symptoms reported. Immediate reception follow-up required.';
    } else if (highestWeight >= 90) {
      priority = 'High';
      classification = 'high-intent';
      intent = 'High-Value Booking Request';
      suggestedAction = `Reserve consultation slot for ${matchedProcedure} and send digital pre-consultation guide.`;
      priorityReasoning = `Strong purchase intent for elective/specialized procedure (${matchedSpecialty}). High conversion expected.`;
    } else if (text.includes('price') || text.includes('cost') || text.includes('quote')) {
      priority = 'Medium';
      classification = 'medium-intent';
      intent = 'Pricing & Insurance Enquiry';
      suggestedAction = 'Send transparent fee guide and in-network insurance breakdown.';
      priorityReasoning = 'Prospective patient is evaluating financing and fee structures.';
    }

    const confidence = highestWeight;
    const confidenceLevel: 'High' | 'Medium' | 'Low' = confidence >= 85 ? 'High' : confidence >= 70 ? 'Medium' : 'Low';

    return {
      classification,
      priority,
      intent,
      procedure: matchedProcedure,
      specialty: matchedSpecialty,
      confidence,
      confidenceLevel,
      suggestedAction,
      priorityReasoning,
      detectedProcedures,
      isDemo: true,
    };
  }
}
