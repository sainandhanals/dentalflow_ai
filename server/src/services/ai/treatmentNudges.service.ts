export interface TreatmentNudgeInput {
  patientName: string;
  procedure: string;
  estimatedCost?: number;
  currency?: string;
  objectionCategory?: string;
  daysPending?: number;
  hasConsent?: boolean;
}

export interface NudgeStep {
  stepNumber: number;
  dayOffset: number;
  stage: string;
  channel: 'email' | 'sms';
  subject: string;
  message: string;
  status: 'Draft' | 'Scheduled' | 'Sent';
}

export interface TreatmentNudgeOutput {
  nudgeType: 'empathetic-treatment-nudge-sequence';
  recommendedApproach: string;
  requiresConsentCheck: boolean;
  hasValidConsent: boolean;
  steps: NudgeStep[];
  isDemo: boolean;
  disclaimer: string;
}

export class TreatmentNudgesService {
  public static generateSequence(input: TreatmentNudgeInput): TreatmentNudgeOutput {
    const costStr = input.estimatedCost ? `${input.currency || '$'}${input.estimatedCost.toLocaleString()}` : 'your care plan';
    const objection = (input.objectionCategory || 'Cost concern').toLowerCase();

    let steps: NudgeStep[] = [];
    let approach = 'Balanced informational reassurance';

    if (objection.includes('cost')) {
      approach = 'Highlight zero-stress monthly financing (CareCredit/Sunbit) and long-term tooth preservation';
      steps = [
        {
          stepNumber: 1,
          dayOffset: 1,
          stage: 'Initial Empathetic Check-in',
          channel: 'email',
          subject: `${input.patientName}, reviewing your treatment options at BrightSmile`,
          message: `Hi ${input.patientName}, we know deciding on ${input.procedure} is an important investment. We wanted to share our flexible 0% interest monthly financing options starting at low monthly payments so you can restore your smile comfortably.`,
          status: 'Draft',
        },
        {
          stepNumber: 2,
          dayOffset: 4,
          stage: 'Clinical Value & Prevention',
          channel: 'email',
          subject: `Protecting your teeth and oral health long-term`,
          message: `Our dental team prepared a brief overview illustrating how timely care for ${input.procedure} prevents complications, discomfort, and higher restorative costs down the road.`,
          status: 'Draft',
        },
        {
          stepNumber: 3,
          dayOffset: 10,
          stage: 'Interactive Questions & Consultation',
          channel: 'sms',
          subject: `Quick question about your care plan`,
          message: `Hi ${input.patientName}, our treatment coordinator has a quick 10-minute phone window open this week if you have any questions about insurance coverage or payment terms.`,
          status: 'Draft',
        },
        {
          stepNumber: 4,
          dayOffset: 21,
          stage: 'Gentle Priority Holding Notice',
          channel: 'email',
          subject: `Update on your treatment estimate validity`,
          message: `Hi ${input.patientName}, just a friendly reminder that your customized treatment estimate of ${costStr} remains locked in for the next two weeks. Let us know whenever you are ready!`,
          status: 'Draft',
        },
      ];
    } else if (objection.includes('fear') || objection.includes('anxiety')) {
      approach = 'Gentle reassurance, painless dental technology, comfort amenities, and sedation options';
      steps = [
        {
          stepNumber: 1,
          dayOffset: 2,
          stage: 'Comfort First Assurance',
          channel: 'sms',
          subject: `Your comfort is our top priority`,
          message: `Hi ${input.patientName}, we want you to know that your comfort is our absolute priority. For ${input.procedure}, we offer gentle numbing techniques and calming amenities to make sure your visit is completely stress-free.`,
          status: 'Draft',
        },
        {
          stepNumber: 2,
          dayOffset: 7,
          stage: 'Step-by-step Walkthrough',
          channel: 'email',
          subject: `What to expect during your ${input.procedure}`,
          message: `Hi ${input.patientName}, here is a simple 2-minute overview explaining how our team keeps you relaxed and pain-free every step of the way. You remain in complete control throughout.`,
          status: 'Draft',
        },
        {
          stepNumber: 3,
          dayOffset: 14,
          stage: 'Low-Pressure Phone Chat',
          channel: 'sms',
          subject: `Meet Dr. Wilson before your visit`,
          message: `Hi ${input.patientName}, would you like a brief complimentary 5-minute chat with the doctor just to discuss any concerns before scheduling? No commitment required.`,
          status: 'Draft',
        },
      ];
    } else {
      approach = 'Schedule flexibility and convenient early morning/evening clinic slots';
      steps = [
        {
          stepNumber: 1,
          dayOffset: 2,
          stage: 'Flexible Scheduling Options',
          channel: 'email',
          subject: `Fitting your ${input.procedure} into a busy schedule`,
          message: `Hi ${input.patientName}, we know life gets busy! We offer early morning (8 AM) and Saturday appointments so your care never interferes with work or family commitments.`,
          status: 'Draft',
        },
        {
          stepNumber: 2,
          dayOffset: 9,
          stage: 'Fast-Track Booking Link',
          channel: 'sms',
          subject: `One-click booking for your appointment`,
          message: `Hi ${input.patientName}, click here to view available 45-minute slots for your ${input.procedure} and pick what suits you best.`,
          status: 'Draft',
        },
      ];
    }

    return {
      nudgeType: 'empathetic-treatment-nudge-sequence',
      recommendedApproach: approach,
      requiresConsentCheck: true,
      hasValidConsent: input.hasConsent ?? true,
      steps,
      isDemo: true,
      disclaimer:
        'Administrative notice: Nudge sequences provide empathetic appointment follow-ups and financing explanations. They do not constitute medical diagnosis.',
    };
  }
}
