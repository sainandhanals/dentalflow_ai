import { Router } from 'express';
import { AIController } from '../controllers/ai.controller';

const router = Router();

// 7.1 Lead Classification
router.post('/ai/lead-classification', AIController.classifyLead);

// 7.2 No-Show Risk Prediction
router.post('/ai/no-show-prediction', AIController.predictNoShow);

// 7.3 Waitlist Matching & Operations
router.post('/ai/waitlist-match', AIController.matchWaitlist);
router.get('/waitlist', AIController.getWaitlist);
router.post('/waitlist', AIController.createWaitlistEntry);
router.patch('/waitlist/:id', AIController.updateWaitlistEntry);

// 7.4 Household Bundling & Operations
router.post('/ai/household-bundling', AIController.bundleHousehold);
router.get('/households', AIController.getHouseholds);
router.post('/households/:id/confirm', AIController.confirmHousehold);

// 7.5 Treatment Nudges & Plans
router.post('/ai/treatment-nudges', AIController.generateTreatmentNudges);
router.get('/treatment-nudges', AIController.getTreatmentPlans);
router.get('/treatment-plans', AIController.getTreatmentPlans);
router.post('/treatment-plans/:id/generate', AIController.generateNudgesForPlan);
router.patch('/treatment-plans/:id', AIController.updatePlanSequenceStatus);
router.patch('/treatment-nudges/:id', AIController.updatePlanSequenceStatus);

// 7.6 Review Response Generation & Moderation
router.post('/ai/review-response', AIController.generateReviewResponse);
router.get('/review-responses', AIController.getReviews);
router.get('/reviews', AIController.getReviews);
router.post('/reviews/:id/generate', AIController.generateReviewDraft);
router.patch('/reviews/:id/draft', AIController.updateReviewDraft);
router.post('/reviews/:id/approve', AIController.approveReview);
router.patch('/review-responses/:id', AIController.approveReview);

export default router;
