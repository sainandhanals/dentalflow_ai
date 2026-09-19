import { Request, Response, NextFunction } from 'express';
import { PatientService } from '../services/patient.service';

export class PatientController {
  public static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const search = req.query.search as string | undefined;
      const engagementLevel = req.query.engagementLevel as string | undefined;
      const patients = await PatientService.getAllPatients(search, engagementLevel);

      res.json({
        success: true,
        data: patients,
        total: patients.length,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const patient = await PatientService.getPatientById(id);
      res.json({
        success: true,
        data: patient,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const patient = await PatientService.createPatient(req.body);
      res.status(201).json({
        success: true,
        data: patient,
        message: 'Patient profile created successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  public static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const patient = await PatientService.updatePatient(id, req.body);
      res.json({
        success: true,
        data: patient,
        message: 'Patient profile updated successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  public static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await PatientService.deletePatient(id);
      res.json({
        success: true,
        message: 'Patient profile deleted successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  public static async addNote(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { author, text } = req.body;
      const note = await PatientService.addNote(id, author, text);
      res.status(201).json({
        success: true,
        data: note,
        message: 'Clinical / administrative note added',
      });
    } catch (err) {
      next(err);
    }
  }

  public static async addInteraction(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const interaction = await PatientService.addInteraction(id, req.body);
      res.status(201).json({
        success: true,
        data: interaction,
        message: 'Interaction recorded',
      });
    } catch (err) {
      next(err);
    }
  }
}
