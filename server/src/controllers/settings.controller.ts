import { Request, Response, NextFunction } from 'express';
import { SettingsService } from '../services/settings.service';

export class SettingsController {
  public static async getSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await SettingsService.getSettings();
      res.json({ success: true, data: settings });
    } catch (err) {
      next(err);
    }
  }

  public static async updateSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await SettingsService.updateSettings(req.body);
      res.json({ success: true, data: settings, message: 'Settings saved' });
    } catch (err) {
      next(err);
    }
  }

  public static async getWorkflows(req: Request, res: Response, next: NextFunction) {
    try {
      const workflows = await SettingsService.getAllWorkflows();
      res.json({ success: true, data: workflows });
    } catch (err) {
      next(err);
    }
  }

  public static async toggleWorkflow(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const workflow = await SettingsService.toggleWorkflow(id);
      res.json({ success: true, data: workflow });
    } catch (err) {
      next(err);
    }
  }

  public static async createWorkflow(req: Request, res: Response, next: NextFunction) {
    try {
      const workflow = await SettingsService.createWorkflow(req.body);
      res.status(201).json({ success: true, data: workflow });
    } catch (err) {
      next(err);
    }
  }
}
