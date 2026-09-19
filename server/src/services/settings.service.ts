import { prisma } from '../config/prisma';

export class SettingsService {
  public static async getSettings() {
    let settings = await prisma.clinicSettings.findFirst();
    if (!settings) {
      settings = await prisma.clinicSettings.create({
        data: {
          id: 'default-settings',
          clinicName: 'BrightSmile Dental Studio',
          phone: '+1 (555) 382-9011',
          email: 'care@brightsmiledental.demo',
          operatingHours: 'Mon - Fri: 8:00 AM - 6:00 PM | Sat: 9:00 AM - 2:00 PM',
          requireStaffReview: true,
          aiAssistanceEnabled: true,
          inactivityThresholdDays: 180,
          scoringWeightVisits: 60,
          scoringWeightCommunication: 40,
          demoMode: true,
        },
      });
    }
    return settings;
  }

  public static async updateSettings(data: any) {
    const existing = await this.getSettings();
    return await prisma.clinicSettings.update({
      where: { id: existing.id },
      data,
    });
  }

  public static async getAllWorkflows() {
    return await prisma.automationWorkflow.findMany({
      orderBy: { createdAt: 'asc' },
    });
  }

  public static async toggleWorkflow(id: string) {
    const wf = await prisma.automationWorkflow.findUnique({ where: { id } });
    if (!wf) throw new Error('Workflow not found');

    const nextStatus = wf.status === 'active' ? 'paused' : 'active';
    return await prisma.automationWorkflow.update({
      where: { id },
      data: { status: nextStatus },
    });
  }

  public static async createWorkflow(data: any) {
    return await prisma.automationWorkflow.create({
      data: {
        name: data.name,
        description: data.description || '',
        trigger: data.trigger,
        condition: data.condition,
        action: data.action,
        status: data.status || 'active',
        staffApprovalRequired: data.staffApprovalRequired ?? true,
        messageTemplate: data.messageTemplate || '',
        delayHours: data.delayHours ?? 1,
        executionsCount: 0,
      },
    });
  }
}
