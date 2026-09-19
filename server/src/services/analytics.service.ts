import { prisma } from '../config/prisma';

export class AnalyticsService {
  public static async getOverviewMetrics() {
    const [
      totalPatients,
      totalEnquiries,
      newEnquiries,
      convertedEnquiries,
      appointments,
      followUps,
      waitlistEntries,
      treatmentPlans,
      reviews,
    ] = await Promise.all([
      prisma.patient.count(),
      prisma.enquiry.count(),
      prisma.enquiry.count({ where: { status: 'New' } }),
      prisma.enquiry.count({ where: { status: 'Converted' } }),
      prisma.appointment.findMany(),
      prisma.followUpTask.findMany(),
      prisma.waitlistEntry.count({ where: { status: 'Waiting' } }),
      prisma.treatmentPlan.findMany(),
      prisma.dentalReview.findMany(),
    ]);

    // Appointments breakdown
    const scheduledAppointments = appointments.filter((a) =>
      ['Scheduled', 'scheduled'].includes(a.status)
    ).length;

    const noShowRiskDistribution = {
      low: appointments.filter((a) => a.riskLevel.toLowerCase().includes('low')).length,
      medium: appointments.filter((a) => a.riskLevel.toLowerCase().includes('medium')).length,
      high: appointments.filter((a) => a.riskLevel.toLowerCase().includes('high')).length,
    };

    // Follow-ups breakdown
    const pendingFollowUps = followUps.filter((f) => f.status !== 'completed').length;
    const dueTodayFollowUps = followUps.filter((f) => f.status === 'due_today').length;
    const overdueFollowUps = followUps.filter((f) => f.status === 'overdue').length;

    // Treatment plans value
    const totalPipelineValue = treatmentPlans.reduce((sum, p) => sum + p.value, 0);

    // Review sentiments
    const reviewSentimentDistribution = {
      positive: reviews.filter((r) => r.sentiment.toLowerCase() === 'positive').length,
      neutral: reviews.filter((r) => r.sentiment.toLowerCase() === 'neutral').length,
      negative: reviews.filter((r) => r.sentiment.toLowerCase() === 'negative').length,
    };

    // Specialty Breakdown from enquiries
    const enquiriesList = await prisma.enquiry.findMany();
    const specialtyMap: Record<string, number> = {};
    enquiriesList.forEach((e) => {
      const spec = e.aiSpecialty || e.specialty || e.service || 'General Dentistry';
      specialtyMap[spec] = (specialtyMap[spec] || 0) + 1;
    });

    const specialtyDistribution = Object.entries(specialtyMap).map(([specialty, count]) => ({
      specialty,
      count,
    }));

    return {
      totalPatients,
      totalEnquiries,
      newEnquiries,
      convertedEnquiries,
      conversionRate:
        totalEnquiries > 0 ? Math.round((convertedEnquiries / totalEnquiries) * 100) : 0,
      scheduledAppointments,
      noShowRiskDistribution,
      pendingFollowUps,
      dueTodayFollowUps,
      overdueFollowUps,
      waitlistCount: waitlistEntries,
      totalPipelineValue,
      reviewSentimentDistribution,
      specialtyDistribution,
      generatedAt: new Date().toISOString(),
      isDemo: true,
    };
  }
}
