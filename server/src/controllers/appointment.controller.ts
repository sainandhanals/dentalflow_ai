import { Request, Response, NextFunction } from 'express';
import { AppointmentService } from '../services/appointment.service';

export class AppointmentController {
  public static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { date, status } = req.query as { date?: string; status?: string };
      const appointments = await AppointmentService.getAllAppointments({ date, status });
      res.json({
        success: true,
        data: appointments,
        total: appointments.length,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const appointment = await AppointmentService.getAppointmentById(id);
      res.json({
        success: true,
        data: appointment,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const appointment = await AppointmentService.createAppointment(req.body);
      res.status(201).json({
        success: true,
        data: appointment,
        message: 'Appointment booked and no-show risk estimated',
      });
    } catch (err) {
      next(err);
    }
  }

  public static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const appointment = await AppointmentService.updateAppointment(id, req.body);
      res.json({
        success: true,
        data: appointment,
        message: 'Appointment updated successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  public static async simulateCancel(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const appointment = await AppointmentService.simulateCancellation(id);
      res.json({
        success: true,
        data: appointment,
        message: 'Appointment cancelled; slot freed for waitlist matching',
      });
    } catch (err) {
      next(err);
    }
  }

  public static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await AppointmentService.deleteAppointment(id);
      res.json({
        success: true,
        message: 'Appointment deleted successfully',
      });
    } catch (err) {
      next(err);
    }
  }
}
