import { prisma } from '../config/prisma';
import { AppError } from '../middleware/error.middleware';

export class PatientService {
  public static async getAllPatients(search?: string, engagementLevel?: string) {
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    if (engagementLevel && engagementLevel !== 'All') {
      where.engagementLevel = engagementLevel;
    }

    return await prisma.patient.findMany({
      where,
      include: {
        interactions: { orderBy: { createdAt: 'desc' } },
        notes: { orderBy: { createdAt: 'desc' } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  public static async getPatientById(id: string) {
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        interactions: { orderBy: { createdAt: 'desc' } },
        notes: { orderBy: { createdAt: 'desc' } },
        appointments: true,
        treatmentPlans: true,
        followUps: true,
      },
    });

    if (!patient) {
      throw new AppError('Patient not found', 404, 'PATIENT_NOT_FOUND');
    }

    return patient;
  }

  public static async createPatient(data: any) {
    return await prisma.patient.create({
      data: {
        name: data.name,
        email: data.email || 'patient@demo.example',
        phone: data.phone || '+1 (555) 000-0000',
        lastAppointment: data.lastAppointment || new Date().toISOString().split('T')[0],
        nextAppointment: data.nextAppointment || 'None scheduled',
        engagementScore: data.engagementScore ?? 80,
        engagementLevel: data.engagementLevel || 'Active',
        preferredChannel: data.preferredChannel || 'Email',
        lastInteraction: data.lastInteraction || new Date().toISOString().split('T')[0],
        assignedStaff: data.assignedStaff || 'Dr. Sarah Wilson',
        consentStatus: data.consentStatus ?? true,
      },
      include: {
        interactions: true,
        notes: true,
      },
    });
  }

  public static async updatePatient(id: string, data: any) {
    await this.getPatientById(id);

    return await prisma.patient.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        lastAppointment: data.lastAppointment,
        nextAppointment: data.nextAppointment,
        engagementScore: data.engagementScore,
        engagementLevel: data.engagementLevel,
        preferredChannel: data.preferredChannel,
        lastInteraction: data.lastInteraction,
        assignedStaff: data.assignedStaff,
        consentStatus: data.consentStatus,
      },
      include: {
        interactions: true,
        notes: true,
      },
    });
  }

  public static async deletePatient(id: string) {
    await this.getPatientById(id);
    return await prisma.patient.delete({ where: { id } });
  }

  public static async addNote(patientId: string, author: string, text: string) {
    await this.getPatientById(patientId);

    return await prisma.patientNote.create({
      data: {
        patientId,
        author: author || 'Staff Member',
        text,
        createdAt: new Date().toISOString(),
      },
    });
  }

  public static async addInteraction(patientId: string, interaction: any) {
    await this.getPatientById(patientId);

    return await prisma.patientInteraction.create({
      data: {
        patientId,
        date: interaction.date || new Date().toISOString().split('T')[0],
        type: interaction.type || 'In-Clinic',
        title: interaction.title,
        note: interaction.note,
        staff: interaction.staff || 'Staff Member',
      },
    });
  }
}
