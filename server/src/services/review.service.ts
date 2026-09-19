import { prisma } from '../config/prisma';
import { AppError } from '../middleware/error.middleware';
import { ReviewResponseService } from './ai/reviewResponse.service';

export class ReviewService {
  public static async getAllReviews(filters?: { sentiment?: string; approvalStatus?: string }) {
    const where: any = {};
    if (filters?.sentiment && filters.sentiment !== 'All') where.sentiment = filters.sentiment;
    if (filters?.approvalStatus && filters.approvalStatus !== 'All') {
      where.approvalStatus = filters.approvalStatus;
    }

    return await prisma.dentalReview.findMany({
      where,
      orderBy: { date: 'desc' },
    });
  }

  public static async getReviewById(id: string) {
    const review = await prisma.dentalReview.findUnique({ where: { id } });
    if (!review) throw new AppError('Review not found', 404, 'REVIEW_NOT_FOUND');
    return review;
  }

  public static async generateDraftForReview(id: string, tone?: 'professional' | 'warm' | 'concise') {
    const review = await this.getReviewById(id);

    const generated = ReviewResponseService.generateResponse({
      reviewerName: review.reviewerName,
      rating: review.rating,
      reviewText: review.reviewText,
      tone: tone || 'professional',
    });

    return await prisma.dentalReview.update({
      where: { id },
      data: {
        aiDraft: generated.response,
        aiDraftResponse: generated.response,
        responseStatus: 'draft_ready',
      },
    });
  }

  public static async updateDraftText(id: string, text: string) {
    await this.getReviewById(id);

    return await prisma.dentalReview.update({
      where: { id },
      data: {
        aiDraft: text,
        aiDraftResponse: text,
        approvalStatus: 'Edited',
      },
    });
  }

  public static async approveReviewResponse(id: string, editedText?: string) {
    const review = await this.getReviewById(id);

    return await prisma.dentalReview.update({
      where: { id },
      data: {
        aiDraft: editedText || review.aiDraft,
        aiDraftResponse: editedText || review.aiDraftResponse,
        approvalStatus: 'Approved',
        responseStatus: 'approved',
      },
    });
  }
}
