import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';

const router = Router();

router.get('/overview', AnalyticsController.getOverview);

export default router;
