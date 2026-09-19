export interface ReviewResponseInput {
  reviewerName: string;
  rating: number;
  reviewText: string;
  tone?: 'professional' | 'warm' | 'concise';
  clinicName?: string;
  dentistName?: string;
}

export interface ReviewResponseOutput {
  response: string;
  tone: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  requiresHumanReview: boolean;
  hipaaSafe: boolean;
  isDemo: boolean;
}

export class ReviewResponseService {
  public static generateResponse(input: ReviewResponseInput): ReviewResponseOutput {
    const clinic = input.clinicName || 'BrightSmile Dental Studio';
    const rating = input.rating;
    const tone = input.tone || 'professional';

    let sentiment: 'Positive' | 'Neutral' | 'Negative' = 'Positive';
    let response = '';

    if (rating >= 4) {
      sentiment = 'Positive';
      if (tone === 'warm') {
        response = `Dear ${input.reviewerName}, thank you so much for your wonderful review! Our entire team at ${clinic} takes great joy in making dental visits gentle, comfortable, and welcoming. We truly appreciate you trusting us with your smile and look forward to seeing you at your next regular visit!`;
      } else if (tone === 'concise') {
        response = `Dear ${input.reviewerName}, thank you for taking the time to share your feedback! We are delighted to hear you had a great experience with our team at ${clinic}. See you next time!`;
      } else {
        response = `Dear ${input.reviewerName}, thank you for taking the time to leave such kind feedback. We are committed to providing top-tier clinical care in a comfortable environment, and hearing that our team met your expectations means the world to us. Thank you for choosing ${clinic}.`;
      }
    } else if (rating === 3) {
      sentiment = 'Neutral';
      response = `Dear ${input.reviewerName}, thank you for sharing your feedback with us. While we are glad you had some positive aspects to your visit, we always strive for excellence in every patient interaction. We take your observations seriously as we continually refine our clinic workflow and scheduling. If you would like to discuss your experience further, please feel free to reach out to our office manager directly at ${clinic}.`;
    } else {
      sentiment = 'Negative';
      // HIPAA-conscious response that does not confirm patient status or clinical details
      response = `Thank you for sharing your perspective. At ${clinic}, patient care and satisfaction are our utmost priorities. Because patient privacy regulations prevent us from discussing specific individuals or treatment details publicly, we invite you to contact our office manager directly so we may listen to your concerns and work toward a resolution.`;
    }

    return {
      response,
      tone,
      sentiment,
      requiresHumanReview: true,
      hipaaSafe: true,
      isDemo: true,
    };
  }
}
