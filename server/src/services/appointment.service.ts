import { prisma } from '../config/prisma';
import { AppError } from '../middleware/error.middleware';
import { NoShowPredictionService } from './ai/noShowPrediction.service';

export class AppointmentService {
  private static formatAppointment(apt: any) {
    let riskFactors: string[] = [];
    let recommendedActions: string[] = [];

    try {
      if (apt.riskFactors) riskFactors = JSON.parse(apt.riskFactors);
    } catch {
      riskFactors = [];
    }

    try {
      if (apt.recommendedActions) recommendedActions = JSON.parse(apt.recommendedActions);
    } catch {
      recommendedActions = [];
    }

    return {
      ...apt,
      riskFactors,
      recommendedActions,
    };
  }

  public static async getAllAppointments(filters?: { date?: string; status?: string }) {
    const where: any = {};
    if (filters?.date) where.date = filters.date;
    if (filters?.status && filters.status !== 'All') where.status = filters.status;

    const appointments = await prisma.appointment.findMany({
      where,
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
    });

    return appointments.map(this.formatAppointment);
  }

  public static async getAppointmentById(id: string) {
    const apt = await prisma.appointment.findUnique({ where: { id } });
    if (!apt) throw new AppError('Appointment not found', 404, 'APPOINTMENT_NOT_FOUND');
    return this.formatAppointment(apt);
  }

  public static async createAppointment(data: any) {
    // Calculate initial no-show risk prediction
    const prediction = NoShowPredictionService.calculateRisk({
      patientName: data.patientName,
      leadTimeDays: data.leadTimeDays ?? 3,
      confirmationStatus: data.confirmationStatus || 'unconfirmed',
      attendanceHistory: data.attendanceHistory,
      cancellationHistory: data.cancellationHistory,
      procedure: data.procedure,
      time: data.time,
    });

    const created = await prisma.appointment.create({
      data: {
        patientId: data.patientId || null,
        patientName: data.patientName,
        patientPhone: data.patientPhone,
        date: data.date,
        time: data.time,
        duration: data.duration ?? 45,
        operatory: data.operatory || 'Operatory 1',
        procedure: data.procedure,
        provider: data.provider || 'Dr. Sarah Wilson',
        dentistName: data.dentistName || data.provider || 'Dr. Sarah Wilson',
        attendanceHistory: data.attendanceHistory || '3 attended, 0 missed',
        cancellationHistory: data.cancellationHistory || '0 late cancels',
        noShowProbability: prediction.noShowProbability,
        noShowRiskScore: prediction.riskScore,
        leadTimeDays: data.leadTimeDays ?? 3,
        confirmationStatus: data.confirmationStatus || 'unconfirmed',
        riskLevel: prediction.riskLevel,
        riskFactors: JSON.stringify(prediction.factors),
        recommendedActions: JSON.stringify(prediction.recommendedActions),
        status: data.status || 'Scheduled',
      },
    });

    return this.formatAppointment(created);
  }

  public static async updateAppointment(id: string, data: any) {
    await this.getAppointmentById(id);

    const updatePayload: any = {};
    const fields = [
      'date',
      'time',
      'duration',
      'operatory',
      'procedure',
      'provider',
      'dentistName',
      'confirmationStatus',
      'status',
      'attendanceHistory',
      'cancellationHistory',
      'noShowRiskScore',
      'riskLevel',
    ];

    for (const f of fields) {
      if (data[f] !== undefined) updatePayload[f] = data[f];
    }

    if (data.riskFactors) updatePayload.riskFactors = JSON.stringify(data.riskFactors);
    if (data.recommendedActions) updatePayload.recommendedActions = JSON.stringify(data.recommendedActions);

    const updated = await prisma.appointment.update({
      where: { id },
      data: updatePayload,
    });

    return this.formatAppointment(updated);
  }

  public static async simulateCancellation(id: string) {
    await this.getAppointmentById(id);

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        status: 'Cancelled',
      },
    });

    return this.formatAppointment(updated);
  }

  public static async deleteAppointment(id: string) {
    await this.getAppointmentById(id);
    return await prisma.appointment.delete({ where: { id } });
  }
}
