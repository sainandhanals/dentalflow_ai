import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analytics.service';

export class AnalyticsController {
  public static async getOverview(req: Request, res: Response, next: NextFunction) {
    try {
      const metrics = await AnalyticsService.getOverviewMetrics();
      res.json({
        success: true,
        data: metrics,
      });
    } catch (err) {
      next(err);
    }
  }
}
