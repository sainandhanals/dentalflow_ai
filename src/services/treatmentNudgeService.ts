import { TreatmentPlan, ObjectionCategory, NudgeMessage } from '../types';

/**
 * Service to generate personalized, empathetic treatment plan follow-up sequences.
 */
export function generateTreatmentNudgeSequence(
  plan: TreatmentPlan,
  customObjection?: ObjectionCategory
): { objection: ObjectionCategory; recommendedApproach: string; sequence: NudgeMessage[] } {
  const objection = customObjection || plan.objectionCategory;
  const firstName = plan.patientName.split(' ')[0];
  const proc = plan.procedure;

  let approach = 'Explain treatment clinical value and present flexible payment options.';
  let day3Message = `If budget or treatment cost is on your mind, our front desk offers interest-free monthly installment plans and insurance pre-authorizations to make ${proc} completely stress-free.`;

  if (objection === 'Cost concern') {
    approach = 'Present transparent pricing breakdown, itemized value, and 0% financing solutions.';
    day3Message = `Hi ${firstName}, we want to make sure financial questions never get in the way of your oral health. At BrightSmile, we offer flexible 0% interest monthly payment options and will submit directly to your dental benefits on your behalf.`;
  } else if (objection === 'Fear/anxiety') {
    approach = 'Reassure patient on gentle anesthesia, comfort amenities, and modern pain-free techniques.';
    day3Message = `Hi ${firstName}, we understand that dental procedures like ${proc} can feel intimidating. Dr. Maya and our team prioritize gentle care, local numbing techniques, and relaxed pacing so you are completely comfortable every step of the way.`;
  } else if (objection === 'Treatment complexity') {
    approach = 'Break procedure down into simple, manageable phases with clear timeline.';
    day3Message = `Hi ${firstName}, ${proc} is a straightforward 2-step process designed to permanently restore your tooth function. Would you like a brief 10-minute phone call with our treatment coordinator to review the exact step-by-step plan?`;
  } else if (objection === 'Scheduling difficulty') {
    approach = 'Highlight early morning, late afternoon, and Saturday appointment accommodations.';
    day3Message = `Hi ${firstName}, we know how busy your schedule can get. We have early morning (8:00 AM) and weekend appointment buffers specifically reserved for treatment procedures like ${proc}.`;
  } else {
    approach = 'Offer open Q&A with treatment coordinator and review diagnostic imaging.';
    day3Message = `Hi ${firstName}, Dr. Maya noted that you might have additional questions before deciding on ${proc}. We are here to help whenever you're ready—just reply to this message anytime.`;
  }

  const sequence: NudgeMessage[] = [
    {
      day: 1,
      stage: 'Educational Message',
      subject: `Understanding your recommended ${proc}`,
      message: `Hi ${firstName}, thank you for visiting BrightSmile Dental Studio. Dr. Maya recommended ${proc} to preserve your natural tooth structure and prevent further discomfort. We have attached a brief overview of how this restorative treatment protects your smile.`,
      status: 'Draft',
    },
    {
      day: 3,
      stage: 'Objection & Hesitation Handling',
      subject: `Options for your upcoming ${proc}`,
      message: day3Message,
      status: 'Draft',
    },
    {
      day: 7,
      stage: 'Friendly Reminder',
      subject: `Checking in regarding your ${proc}`,
      message: `Hi ${firstName}, just checking in to see if you have any questions regarding your ${proc} treatment plan. Our coordination desk is happy to check insurance coverage or reserve a time slot that suits you best.`,
      status: 'Draft',
    },
    {
      day: 14,
      stage: 'Final Non-Pushy Check-in',
      subject: `Your dental care at BrightSmile`,
      message: `Hello ${firstName}, we want to make sure your tooth remains healthy and comfortable. Whenever you are ready to proceed with your ${proc}, feel free to reach out to us at (555) 382-9011. Have a wonderful week!`,
      status: 'Draft',
    },
  ];

  return {
    objection,
    recommendedApproach: approach,
    sequence,
  };
}
