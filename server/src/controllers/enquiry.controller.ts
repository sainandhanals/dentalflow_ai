import { Request, Response, NextFunction } from 'express';
import { EnquiryService } from '../services/enquiry.service';

export class EnquiryController {
  public static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, specialty, priority, search } = req.query as {
        status?: string;
        specialty?: string;
        priority?: string;
        search?: string;
      };

      const enquiries = await EnquiryService.getAllEnquiries({
        status,
        specialty,
        priority,
        search,
      });

      res.json({
        success: true,
        data: enquiries,
        total: enquiries.length,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const enquiry = await EnquiryService.getEnquiryById(id);
      res.json({
        success: true,
        data: enquiry,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const enquiry = await EnquiryService.createEnquiry(req.body);
      res.status(201).json({
        success: true,
        data: enquiry,
        message: 'Enquiry received and AI classified successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  public static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const enquiry = await EnquiryService.updateEnquiry(id, req.body);
      res.json({
        success: true,
        data: enquiry,
        message: 'Enquiry updated successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  public static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await EnquiryService.deleteEnquiry(id);
      res.json({
        success: true,
        message: 'Enquiry deleted successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  public static async classify(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const enquiry = await EnquiryService.classifyExistingEnquiry(id);
      res.json({
        success: true,
        data: enquiry,
        message: 'Enquiry re-classified using AI engine',
      });
    } catch (err) {
      next(err);
    }
  }

  public static async addNote(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { author, text } = req.body;
      const note = await EnquiryService.addNote(id, author, text);
      res.status(201).json({
        success: true,
        data: note,
        message: 'Staff note added to enquiry',
      });
    } catch (err) {
      next(err);
    }
  }
}
