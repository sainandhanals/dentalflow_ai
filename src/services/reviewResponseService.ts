import { DentalReview, ReviewSentiment } from '../types';

/**
 * Service to draft personalized, privacy-safe public responses to Google/Yelp reviews.
 * 
 * Strict Privacy Safeguards:
 * - NEVER discloses specific clinical diagnoses, medical history, or payment disputes.
 * - Warmly acknowledges positive visits with general provider/clinic hospitality.
 * - For negative feedback: acknowledges experience, avoids argument, offers private offline resolution.
 */
export function generateReviewResponseDraft(review: DentalReview, variation: number = 1): string {
  const reviewer = review.reviewerName.split(' ')[0];
  const provider = review.patientVisitContext?.provider || 'Dr. Maya and our dental team';

  if (review.sentiment === 'Positive' || review.rating >= 4) {
    if (variation === 1) {
      return `Thank you so much, ${reviewer}! We are thrilled to hear that your visit with ${provider} was a positive and comfortable experience. Our entire team at BrightSmile Dental Studio appreciates your kind words and look forward to seeing you at your next routine check-up!`;
    }
    return `Hi ${reviewer}, thank you for taking the time to leave such a thoughtful review! Ensuring our patients feel relaxed and informed throughout their care is our top priority. We're grateful for your trust in ${provider} and the BrightSmile family.`;
  }

  if (review.sentiment === 'Neutral' || review.rating === 3) {
    return `Hello ${reviewer}, thank you for sharing your feedback with us. At BrightSmile Dental Studio, we continuously strive to deliver seamless, comfortable care. If there is anything we can do to make your future visits even better, please feel free to reach out to our practice manager directly at (555) 382-9011.`;
  }

  // Negative Sentiment (1-2 Stars)
  if (variation === 1) {
    return `Hello ${reviewer}, thank you for sharing your feedback. We sincerely apologize that your experience did not reflect the high standard of timeliness and care we strive for. Because we take patient satisfaction seriously and respect your privacy, our practice manager would welcome the opportunity to discuss your experience directly. Please contact us at your convenience at (555) 382-9011 so we can assist you.`;
  }

  return `Dear ${reviewer}, we appreciate you bringing this matter to our attention and apologize for the frustration caused during your recent visit. Patient comfort and prompt attention are essential to our clinic philosophy. Please reach out to our office manager directly at (555) 382-9011 so we may address your concerns in detail.`;
}

export const REVIEW_SAFETY_DISCLAIMER =
  'AI-drafted response compliant with healthcare privacy guidelines. Human practice manager approval is required before publishing.';
