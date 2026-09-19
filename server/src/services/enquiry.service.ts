import { prisma } from '../config/prisma';
import { AppError } from '../middleware/error.middleware';
import { LeadClassificationService } from './ai/leadClassification.service';

export class EnquiryService {
  private static formatEnquiry(enquiry: any) {
    let detectedProcedures = [];
    try {
      if (enquiry.aiDetectedProcedures) {
        detectedProcedures = JSON.parse(enquiry.aiDetectedProcedures);
      }
    } catch {
      detectedProcedures = [];
    }

    return {
      ...enquiry,
      aiClassification: {
        procedure: enquiry.aiProcedure || enquiry.procedure || 'Routine Preventive Cleaning & Exam',
        specialty: enquiry.aiSpecialty || enquiry.specialty || enquiry.service || 'General Dentistry',
        intent: enquiry.aiIntent || 'Consultation Request',
        confidence: enquiry.aiConfidence || 90,
        confidenceLevel: enquiry.aiConfidenceLevel || 'High',
        suggestedAction: enquiry.aiSuggestedAction || 'Contact the lead promptly.',
        priorityReasoning: enquiry.aiPriorityReasoning || 'Routine enquiry ingested.',
        detectedProcedures,
        isConfirmedByStaff: enquiry.aiConfirmedByStaff ?? false,
      },
    };
  }

  public static async getAllEnquiries(filters?: {
    status?: string;
    specialty?: string;
    priority?: string;
    search?: string;
  }) {
    const where: any = {};

    if (filters?.search) {
      where.OR = [
        { patientName: { contains: filters.search } },
        { patientEmail: { contains: filters.search } },
        { enquirySummary: { contains: filters.search } },
        { fullMessage: { contains: filters.search } },
      ];
    }

    if (filters?.status && filters.status !== 'All') {
      where.status = filters.status;
    }

    if (filters?.specialty && filters.specialty !== 'All') {
      where.OR = [
        { service: filters.specialty },
        { specialty: filters.specialty },
        { aiSpecialty: filters.specialty },
      ];
    }

    if (filters?.priority && filters.priority !== 'All') {
      where.priority = filters.priority;
    }

    const enquiries = await prisma.enquiry.findMany({
      where,
      include: {
        notes: { orderBy: { createdAt: 'desc' } },
        followUps: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return enquiries.map(this.formatEnquiry);
  }

  public static async getEnquiryById(id: string) {
    const enquiry = await prisma.enquiry.findUnique({
      where: { id },
      include: {
        notes: { orderBy: { createdAt: 'desc' } },
        followUps: true,
      },
    });

    if (!enquiry) {
      throw new AppError('Enquiry not found', 404, 'ENQUIRY_NOT_FOUND');
    }

    return this.formatEnquiry(enquiry);
  }

  public static async createEnquiry(data: any) {
    // Run AI classification automatically
    const classification = await LeadClassificationService.classifyLead({
      patientName: data.patientName,
      patientEmail: data.patientEmail,
      patientPhone: data.patientPhone,
      message: data.fullMessage || data.enquirySummary || '',
      source: data.source,
      service: data.service,
    });

    const created = await prisma.enquiry.create({
      data: {
        patientName: data.patientName,
        patientEmail: data.patientEmail || 'prospect@demo.example',
        patientPhone: data.patientPhone || '+1 (555) 000-0000',
        enquirySummary: data.enquirySummary || 'Treatment Consultation Enquiry',
        fullMessage: data.fullMessage || data.enquirySummary || '',
        service: classification.specialty,
        procedure: classification.procedure,
        specialty: classification.specialty,
        source: data.source || 'Website',
        priority: data.priority || classification.priority,
        status: data.status || 'New',
        receivedAt: 'Just now',
        timestamp: new Date().toISOString(),
        assignedStaff: data.assignedStaff || 'Olivia Reed',
        isReviewed: false,
        aiProcedure: classification.procedure,
        aiSpecialty: classification.specialty,
        aiIntent: classification.intent,
        aiConfidence: classification.confidence,
        aiConfidenceLevel: classification.confidenceLevel,
        aiSuggestedAction: classification.suggestedAction,
        aiPriorityReasoning: classification.priorityReasoning,
        aiDetectedProcedures: JSON.stringify(classification.detectedProcedures),
        aiConfirmedByStaff: false,
        notes: {
          create: [
            {
              author: 'AI System',
              text: `Auto-classified as ${classification.specialty} (${classification.confidence}% confidence). Suggested action: ${classification.suggestedAction}`,
              createdAt: 'Just now',
            },
          ],
        },
      },
      include: {
        notes: true,
      },
    });

    return this.formatEnquiry(created);
  }

  public static async updateEnquiry(id: string, data: any) {
    await this.getEnquiryById(id);

    const updatePayload: any = {};
    if (data.status !== undefined) updatePayload.status = data.status;
    if (data.priority !== undefined) updatePayload.priority = data.priority;
    if (data.assignedStaff !== undefined) updatePayload.assignedStaff = data.assignedStaff;
    if (data.lastDraft !== undefined) updatePayload.lastDraft = data.lastDraft;
    if (data.isReviewed !== undefined) updatePayload.isReviewed = data.isReviewed;
    if (data.service !== undefined) updatePayload.service = data.service;
    if (data.procedure !== undefined) updatePayload.procedure = data.procedure;
    if (data.specialty !== undefined) updatePayload.specialty = data.specialty;

    if (data.aiClassification) {
      updatePayload.aiProcedure = data.aiClassification.procedure;
      updatePayload.aiSpecialty = data.aiClassification.specialty;
      updatePayload.aiIntent = data.aiClassification.intent;
      updatePayload.aiConfirmedByStaff = data.aiClassification.isConfirmedByStaff ?? true;
    }

    const updated = await prisma.enquiry.update({
      where: { id },
      data: updatePayload,
      include: {
        notes: true,
        followUps: true,
      },
    });

    return this.formatEnquiry(updated);
  }

  public static async deleteEnquiry(id: string) {
    await this.getEnquiryById(id);
    return await prisma.enquiry.delete({ where: { id } });
  }

  public static async addNote(enquiryId: string, author: string, text: string) {
    await this.getEnquiryById(enquiryId);

    return await prisma.enquiryNote.create({
      data: {
        enquiryId,
        author: author || 'Staff Member',
        text,
        createdAt: 'Just now',
      },
    });
  }

  public static async classifyExistingEnquiry(id: string) {
    const enquiry = await this.getEnquiryById(id);

    const classification = await LeadClassificationService.classifyLead({
      patientName: enquiry.patientName,
      patientEmail: enquiry.patientEmail,
      patientPhone: enquiry.patientPhone,
      message: enquiry.fullMessage || enquiry.enquirySummary,
      source: enquiry.source,
      service: enquiry.service,
    });

    const updated = await prisma.enquiry.update({
      where: { id },
      data: {
        service: classification.specialty,
        procedure: classification.procedure,
        specialty: classification.specialty,
        aiProcedure: classification.procedure,
        aiSpecialty: classification.specialty,
        aiIntent: classification.intent,
        aiConfidence: classification.confidence,
        aiConfidenceLevel: classification.confidenceLevel,
        aiSuggestedAction: classification.suggestedAction,
        aiPriorityReasoning: classification.priorityReasoning,
        aiDetectedProcedures: JSON.stringify(classification.detectedProcedures),
      },
      include: {
        notes: true,
      },
    });

    return this.formatEnquiry(updated);
  }
}
