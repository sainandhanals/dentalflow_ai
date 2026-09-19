import { prisma } from '../config/prisma';
import { AppError } from '../middleware/error.middleware';
import { HouseholdBundlingService } from './ai/householdBundling.service';

export class HouseholdService {
  public static async getAllHouseholds() {
    return await prisma.household.findMany({
      include: {
        members: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  public static async getHouseholdById(id: string) {
    const hh = await prisma.household.findFirst({
      where: { OR: [{ id }, { householdId: id }] },
      include: { members: true },
    });

    if (!hh) throw new AppError('Household not found', 404, 'HOUSEHOLD_NOT_FOUND');
    return hh;
  }

  public static async confirmBundle(id: string, updatedMembers?: any[]) {
    const hh = await this.getHouseholdById(id);

    if (updatedMembers && updatedMembers.length > 0) {
      for (const m of updatedMembers) {
        await prisma.householdMember.updateMany({
          where: { householdId: hh.householdId, memberId: m.memberId },
          data: {
            status: m.status || 'Booked',
            hasUpcomingAppointment: true,
            suggestedTime: m.suggestedTime,
            assignedOperatory: m.assignedOperatory,
            assignedDentist: m.assignedDentist,
          },
        });
      }
    } else {
      await prisma.householdMember.updateMany({
        where: { householdId: hh.householdId },
        data: { status: 'Booked', hasUpcomingAppointment: true },
      });
    }

    return await prisma.household.update({
      where: { id: hh.id },
      data: {
        status: 'Bundled',
        bundleStatus: 'confirmed',
        scheduledCount: hh.totalCount,
      },
      include: { members: true },
    });
  }

  public static async analyzeBundling(input: any) {
    return HouseholdBundlingService.analyzeBundle(input);
  }
}
