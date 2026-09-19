import { prisma } from '../config/prisma';
import { AppError } from '../middleware/error.middleware';
import { WaitlistMatchingService } from './ai/waitlistMatching.service';

export class WaitlistService {
  private static formatEntry(entry: any) {
    let flexibleDays: string[] = [];
    let matchReasons: string[] = [];

    try {
      if (entry.flexibleDays) flexibleDays = JSON.parse(entry.flexibleDays);
    } catch {
      flexibleDays = [];
    }

    try {
      if (entry.matchReasons) matchReasons = JSON.parse(entry.matchReasons);
    } catch {
      matchReasons = [];
    }

    return {
      ...entry,
      flexibleDays,
      matchReasons,
    };
  }

  public static async getAllWaitlistEntries(status?: string) {
    const where: any = {};
    if (status && status !== 'All') where.status = status;

    const entries = await prisma.waitlistEntry.findMany({
      where,
      orderBy: { matchScore: 'desc' },
    });

    return entries.map(this.formatEntry);
  }

  public static async getEntryById(id: string) {
    const entry = await prisma.waitlistEntry.findUnique({ where: { id } });
    if (!entry) throw new AppError('Waitlist entry not found', 404, 'WAITLIST_NOT_FOUND');
    return this.formatEntry(entry);
  }

  public static async createEntry(data: any) {
    const created = await prisma.waitlistEntry.create({
      data: {
        patientId: data.patientId || null,
        patientName: data.patientName,
        phone: data.phone || null,
        procedure: data.procedure,
        preferredDate: data.preferredDate || new Date().toISOString().split('T')[0],
        preferredTime: data.preferredTime || 'Morning',
        acceptanceProbability: data.acceptanceProbability ?? 0.8,
        matchScore: data.matchScore ?? 85,
        distanceKm: data.distanceKm ?? 3.5,
        flexibleDays: JSON.stringify(data.flexibleDays || ['Monday', 'Wednesday', 'Friday']),
        matchReasons: JSON.stringify(data.matchReasons || ['Matches standard clinic operatory buffer']),
        providerPreference: data.providerPreference || 'Any Available',
        availability: data.availability || 'Flexible',
        urgency: data.urgency || 'Medium',
        matchReason: data.matchReason || 'Routine match',
        status: data.status || 'Waiting',
      },
    });

    return this.formatEntry(created);
  }

  public static async updateEntry(id: string, data: any) {
    await this.getEntryById(id);

    const updatePayload: any = {};
    if (data.status) updatePayload.status = data.status;
    if (data.offerSentAt) updatePayload.offerSentAt = data.offerSentAt;

    const updated = await prisma.waitlistEntry.update({
      where: { id },
      data: updatePayload,
    });

    return this.formatEntry(updated);
  }

  public static async matchAppointmentSlot(slot: any) {
    const candidates = await prisma.waitlistEntry.findMany({
      where: { status: 'Waiting' },
    });

    return WaitlistMatchingService.matchSlot(slot, candidates);
  }
}
