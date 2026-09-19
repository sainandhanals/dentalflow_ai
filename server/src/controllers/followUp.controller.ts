import { Request, Response, NextFunction } from 'express';
import { FollowUpService } from '../services/followUp.service';

export class FollowUpController {
  public static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, staff } = req.query as { status?: string; staff?: string };
      const tasks = await FollowUpService.getAllFollowUps({ status, staff });
      res.json({
        success: true,
        data: tasks,
        total: tasks.length,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const task = await FollowUpService.getFollowUpById(id);
      res.json({
        success: true,
        data: task,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await FollowUpService.createFollowUp(req.body);
      res.status(201).json({
        success: true,
        data: task,
        message: 'Follow-up task created',
      });
    } catch (err) {
      next(err);
    }
  }

  public static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const task = await FollowUpService.updateFollowUp(id, req.body);
      res.json({
        success: true,
        data: task,
        message: 'Follow-up task updated',
      });
    } catch (err) {
      next(err);
    }
  }

  public static async complete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const task = await FollowUpService.completeFollowUp(id);
      res.json({
        success: true,
        data: task,
        message: 'Follow-up task marked completed',
      });
    } catch (err) {
      next(err);
    }
  }

  public static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await FollowUpService.deleteFollowUp(id);
      res.json({
        success: true,
        message: 'Follow-up task deleted',
      });
    } catch (err) {
      next(err);
    }
  }
}
