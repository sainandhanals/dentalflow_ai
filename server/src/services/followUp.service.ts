import { prisma } from '../config/prisma';
import { AppError } from '../middleware/error.middleware';

export class FollowUpService {
  public static async getAllFollowUps(filters?: { status?: string; staff?: string }) {
    const where: any = {};
    if (filters?.status && filters.status !== 'All') where.status = filters.status;
    if (filters?.staff && filters.staff !== 'All') where.assignedStaff = filters.staff;

    return await prisma.followUpTask.findMany({
      where,
      orderBy: { dueDate: 'asc' },
    });
  }

  public static async getFollowUpById(id: string) {
    const task = await prisma.followUpTask.findUnique({ where: { id } });
    if (!task) throw new AppError('Follow-up task not found', 404, 'FOLLOWUP_NOT_FOUND');
    return task;
  }

  public static async createFollowUp(data: any) {
    return await prisma.followUpTask.create({
      data: {
        title: data.title,
        patientName: data.patientName,
        patientId: data.patientId || null,
        enquiryId: data.enquiryId || null,
        taskType: data.taskType || 'Pending enquiry response',
        dueDate: data.dueDate || new Date().toISOString().split('T')[0],
        priority: data.priority || 'Medium',
        assignedStaff: data.assignedStaff || 'Olivia Reed',
        status: data.status || 'scheduled',
        notes: data.notes || null,
      },
    });
  }

  public static async updateFollowUp(id: string, data: any) {
    await this.getFollowUpById(id);

    return await prisma.followUpTask.update({
      where: { id },
      data: {
        title: data.title,
        patientName: data.patientName,
        taskType: data.taskType,
        dueDate: data.dueDate,
        priority: data.priority,
        assignedStaff: data.assignedStaff,
        status: data.status,
        notes: data.notes,
      },
    });
  }

  public static async completeFollowUp(id: string) {
    await this.getFollowUpById(id);

    return await prisma.followUpTask.update({
      where: { id },
      data: { status: 'completed' },
    });
  }

  public static async deleteFollowUp(id: string) {
    await this.getFollowUpById(id);
    return await prisma.followUpTask.delete({ where: { id } });
  }
}
