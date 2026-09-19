import { Request, Response, NextFunction } from 'express';
import { LeadClassificationService } from '../services/ai/leadClassification.service';
import { NoShowPredictionService } from '../services/ai/noShowPrediction.service';
import { WaitlistMatchingService } from '../services/ai/waitlistMatching.service';
import { HouseholdBundlingService } from '../services/ai/householdBundling.service';
import { TreatmentNudgesService } from '../services/ai/treatmentNudges.service';
import { ReviewResponseService } from '../services/ai/reviewResponse.service';
import { WaitlistService } from '../services/waitlist.service';
import { HouseholdService } from '../services/household.service';
import { TreatmentPlanService } from '../services/treatmentPlan.service';
import { ReviewService } from '../services/review.service';

export class AIController {
  // 7.1 Lead Classification
  public static async classifyLead(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await LeadClassificationService.classifyLead(req.body);
      res.json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  // 7.2 No-Show Risk Prediction
  public static async predictNoShow(req: Request, res: Response, next: NextFunction) {
    try {
      const result = NoShowPredictionService.calculateRisk(req.body);
      res.json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  // 7.3 Waitlist Matching
  public static async matchWaitlist(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await WaitlistService.matchAppointmentSlot(req.body);
      res.json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  // Waitlist Entry Management
  public static async getWaitlist(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.query as { status?: string };
      const entries = await WaitlistService.getAllWaitlistEntries(status);
      res.json({ success: true, data: entries });
    } catch (err) {
      next(err);
    }
  }

  public static async createWaitlistEntry(req: Request, res: Response, next: NextFunction) {
    try {
      const entry = await WaitlistService.createEntry(req.body);
      res.status(201).json({ success: true, data: entry });
    } catch (err) {
      next(err);
    }
  }

  public static async updateWaitlistEntry(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const entry = await WaitlistService.updateEntry(id, req.body);
      res.json({ success: true, data: entry });
    } catch (err) {
      next(err);
    }
  }

  // 7.4 Household Appointment Bundling
  public static async bundleHousehold(req: Request, res: Response, next: NextFunction) {
    try {
      let input = req.body || {};
      if (input.householdId && (!input.members || input.members.length === 0)) {
        try {
          const hh = await HouseholdService.getHouseholdById(input.householdId);
          input = {
            householdId: hh.householdId,
            familyName: hh.familyName || hh.householdName,
            primaryContactName: hh.primaryContactName || 'Family Contact',
            primaryContactPhone: hh.primaryContactPhone || undefined,
            members: hh.members.map((m) => ({
              memberId: m.memberId,
              name: m.name,
              relationship: m.relationship,
              procedureNeeded: m.procedureNeeded || 'Routine Hygiene Exam',
              hasUpcomingAppointment: m.hasUpcomingAppointment,
              age: m.age || 30,
            })),
            preferredDay: input.preferredDay,
          };
        } catch {
          // If household not found by ID, proceed with provided input
        }
      }
      const result = HouseholdBundlingService.analyzeBundle(input);
      res.json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getHouseholds(req: Request, res: Response, next: NextFunction) {
    try {
      const households = await HouseholdService.getAllHouseholds();
      res.json({ success: true, data: households });
    } catch (err) {
      next(err);
    }
  }

  public static async confirmHousehold(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { members } = req.body;
      const household = await HouseholdService.confirmBundle(id, members);
      res.json({ success: true, data: household, message: 'Household bundle confirmed' });
    } catch (err) {
      next(err);
    }
  }

  // 7.5 Treatment Nudges
  public static async generateTreatmentNudges(req: Request, res: Response, next: NextFunction) {
    try {
      const result = TreatmentNudgesService.generateSequence(req.body);
      res.json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getTreatmentPlans(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.query as { status?: string };
      const plans = await TreatmentPlanService.getAllPlans(status);
      res.json({ success: true, data: plans });
    } catch (err) {
      next(err);
    }
  }

  public static async generateNudgesForPlan(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { objectionCategory } = req.body;
      const plan = await TreatmentPlanService.generateNudgesForPlan(id, objectionCategory);
      res.json({ success: true, data: plan });
    } catch (err) {
      next(err);
    }
  }

  public static async updatePlanSequenceStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { status } = req.body;
      const plan = await TreatmentPlanService.updateSequenceStatus(id, status);
      res.json({ success: true, data: plan });
    } catch (err) {
      next(err);
    }
  }

  // 7.6 Review Response Generation
  public static async generateReviewResponse(req: Request, res: Response, next: NextFunction) {
    try {
      const result = ReviewResponseService.generateResponse(req.body);
      res.json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const { sentiment, approvalStatus } = req.query as { sentiment?: string; approvalStatus?: string };
      const reviews = await ReviewService.getAllReviews({ sentiment, approvalStatus });
      res.json({ success: true, data: reviews });
    } catch (err) {
      next(err);
    }
  }

  public static async generateReviewDraft(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { tone } = req.body;
      const review = await ReviewService.generateDraftForReview(id, tone);
      res.json({ success: true, data: review });
    } catch (err) {
      next(err);
    }
  }

  public static async updateReviewDraft(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { text } = req.body;
      const review = await ReviewService.updateDraftText(id, text);
      res.json({ success: true, data: review });
    } catch (err) {
      next(err);
    }
  }

  public static async approveReview(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { editedText } = req.body;
      const review = await ReviewService.approveReviewResponse(id, editedText);
      res.json({ success: true, data: review, message: 'Review draft approved and published (simulated)' });
    } catch (err) {
      next(err);
    }
  }
}
