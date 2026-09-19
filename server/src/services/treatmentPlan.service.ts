import { prisma } from '../config/prisma';
import { AppError } from '../middleware/error.middleware';
import { TreatmentNudgesService } from './ai/treatmentNudges.service';

export class TreatmentPlanService {
  public static async getAllPlans(status?: string) {
    const where: any = {};
    if (status && status !== 'All') where.status = status;

    return await prisma.treatmentPlan.findMany({
      where,
      include: {
        nudgeSequence: { orderBy: { stepNumber: 'asc' } },
      },
      orderBy: { daysPending: 'desc' },
    });
  }

  public static async getPlanById(id: string) {
    const plan = await prisma.treatmentPlan.findUnique({
      where: { id },
      include: {
        nudgeSequence: { orderBy: { stepNumber: 'asc' } },
      },
    });

    if (!plan) throw new AppError('Treatment plan not found', 404, 'TREATMENT_PLAN_NOT_FOUND');
    return plan;
  }

  public static async generateNudgesForPlan(id: string, customObjection?: string) {
    const plan = await this.getPlanById(id);

    const objectionToUse = customObjection || plan.objectionCategory;
    const generated = TreatmentNudgesService.generateSequence({
      patientName: plan.patientName,
      procedure: plan.procedure,
      estimatedCost: plan.value || plan.estimatedCost || 1200,
      currency: plan.currency || '$',
      objectionCategory: objectionToUse,
      daysPending: plan.daysPending,
      hasConsent: true,
    });

    // Replace existing nudge sequence with newly generated steps
    await prisma.nudgeMessage.deleteMany({ where: { treatmentPlanId: id } });

    await prisma.nudgeMessage.createMany({
      data: generated.steps.map((s) => ({
        treatmentPlanId: id,
        stepNumber: s.stepNumber,
        day: s.dayOffset,
        dayOffset: s.dayOffset,
        stage: s.stage,
        channel: s.channel,
        subject: s.subject,
        message: s.message,
        status: s.status,
      })),
    });

    return await prisma.treatmentPlan.update({
      where: { id },
      data: {
        objectionCategory: objectionToUse,
        recommendedApproach: generated.recommendedApproach,
        sequenceStatus: 'Active',
      },
      include: {
        nudgeSequence: { orderBy: { stepNumber: 'asc' } },
      },
    });
  }

  public static async updateSequenceStatus(id: string, status: string) {
    await this.getPlanById(id);

    return await prisma.treatmentPlan.update({
      where: { id },
      data: { sequenceStatus: status },
      include: { nudgeSequence: true },
    });
  }
}
