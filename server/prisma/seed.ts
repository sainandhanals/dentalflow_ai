import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting DentalFlow AI Database Seeding...');

  // Clear existing data to ensure clean idempotency
  await prisma.nudgeMessage.deleteMany();
  await prisma.treatmentPlan.deleteMany();
  await prisma.householdMember.deleteMany();
  await prisma.household.deleteMany();
  await prisma.waitlistEntry.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.followUpTask.deleteMany();
  await prisma.enquiryNote.deleteMany();
  await prisma.enquiry.deleteMany();
  await prisma.patientNote.deleteMany();
  await prisma.patientInteraction.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.dentalReview.deleteMany();
  await prisma.automationWorkflow.deleteMany();
  await prisma.clinicSettings.deleteMany();

  // 1. Clinic Settings
  await prisma.clinicSettings.create({
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

  // 2. Patients
  const patientSarah = await prisma.patient.create({
    data: {
      id: 'PAT-001',
      name: 'Sarah Thomas',
      email: 'sarah.t***@demo.example',
      phone: '+1 (555) 234-5678',
      lastAppointment: '2026-06-12',
      nextAppointment: '2026-09-24',
      engagementScore: 92,
      engagementLevel: 'Active',
      preferredChannel: 'SMS',
      lastInteraction: '2026-09-18',
      assignedStaff: 'Dr. Sarah Wilson',
      consentStatus: true,
      interactions: {
        create: [
          {
            date: '2026-09-18',
            type: 'Online Enquiry',
            title: 'Invisalign Enquiry Received',
            note: 'Enquired about Invisalign consultation timeline via website form.',
            staff: 'AI Receptionist',
          },
          {
            date: '2026-06-12',
            type: 'In-Clinic',
            title: 'Routine Cleaning & Exam',
            note: 'Routine prophylaxis completed. Mild lower crowding noted.',
            staff: 'Dr. Sarah Wilson',
          },
        ],
      },
      notes: {
        create: [
          {
            author: 'Dr. Sarah Wilson',
            text: 'Patient expressed interest in clear aligners for aesthetic improvement.',
            createdAt: '2026-06-12',
          },
        ],
      },
    },
  });

  const patientDaniel = await prisma.patient.create({
    data: {
      id: 'PAT-002',
      name: 'Daniel Mathew',
      email: 'daniel.m***@demo.example',
      phone: '+1 (555) 876-5432',
      lastAppointment: '2025-11-20',
      nextAppointment: '2026-09-20',
      engagementScore: 78,
      engagementLevel: 'Moderate',
      preferredChannel: 'Phone',
      lastInteraction: '2026-09-18',
      assignedStaff: 'Dr. James Chen',
      consentStatus: true,
      interactions: {
        create: [
          {
            date: '2026-09-18',
            type: 'Email',
            title: 'Broken Molar Urgent Enquiry',
            note: 'Reports broken upper right molar while chewing dinner. Requested emergency triage.',
            staff: 'Olivia Reed',
          },
        ],
      },
      notes: {
        create: [
          {
            author: 'Olivia Reed',
            text: 'Allocated emergency buffer slot for tomorrow morning.',
            createdAt: '2026-09-18',
          },
        ],
      },
    },
  });

  const patientElena = await prisma.patient.create({
    data: {
      id: 'PAT-003',
      name: 'Elena Rostova',
      email: 'elena.r***@demo.example',
      phone: '+1 (555) 432-1098',
      lastAppointment: '2026-08-10',
      nextAppointment: 'None scheduled',
      engagementScore: 64,
      engagementLevel: 'Moderate',
      preferredChannel: 'Email',
      lastInteraction: '2026-09-10',
      assignedStaff: 'Dr. James Chen',
      consentStatus: true,
      interactions: {
        create: [
          {
            date: '2026-08-10',
            type: 'In-Clinic',
            title: 'Implant Consultation & CBCT',
            note: 'Comprehensive 3D scan and implant presentation for #19 and #30.',
            staff: 'Dr. James Chen',
          },
        ],
      },
      notes: {
        create: [
          {
            author: 'Dr. James Chen',
            text: 'Patient concerned about out-of-pocket implant cost and financing plans.',
            createdAt: '2026-08-10',
          },
        ],
      },
    },
  });

  const patientMarcus = await prisma.patient.create({
    data: {
      id: 'PAT-004',
      name: 'Marcus Vance',
      email: 'marcus.v***@demo.example',
      phone: '+1 (555) 765-4321',
      lastAppointment: '2026-07-28',
      nextAppointment: 'None scheduled',
      engagementScore: 48,
      engagementLevel: 'At Risk',
      preferredChannel: 'SMS',
      lastInteraction: '2026-08-15',
      assignedStaff: 'Dr. Sarah Wilson',
      consentStatus: true,
      interactions: {
        create: [
          {
            date: '2026-07-28',
            type: 'In-Clinic',
            title: 'Crown Replacement Diagnosis',
            note: 'Fractured porcelain on lower molar crown #18 noted.',
            staff: 'Dr. Sarah Wilson',
          },
        ],
      },
      notes: {
        create: [
          {
            author: 'Dr. Sarah Wilson',
            text: 'Severe dental anxiety during previous anesthetic injections.',
            createdAt: '2026-07-28',
          },
        ],
      },
    },
  });

  // 3. Enquiries with AI Classification
  await prisma.enquiry.create({
    data: {
      id: 'ENQ-2024-001',
      patientName: 'Sarah Thomas',
      patientEmail: 'sarah.t***@demo.example',
      patientPhone: '+1 (555) 234-****',
      enquirySummary: 'Interested in Invisalign consultation & treatment timeline',
      fullMessage:
        "Hi there, I've been considering Invisalign for a few months now to correct some crowding in my lower teeth. Could someone please explain the consultation process, expected timelines, and help me book an introductory appointment?",
      service: 'Orthodontics',
      procedure: 'Clear Aligners / Invisalign',
      specialty: 'Orthodontics',
      source: 'Website',
      priority: 'High',
      status: 'New',
      receivedAt: '12 min ago',
      timestamp: '2026-09-18T03:37:00Z',
      assignedStaff: 'Olivia Reed',
      isReviewed: false,
      aiProcedure: 'Clear Aligners / Invisalign',
      aiSpecialty: 'Orthodontics',
      aiIntent: 'Consultation Request',
      aiConfidence: 96,
      aiConfidenceLevel: 'High',
      aiSuggestedAction:
        'Offer an approved orthodontic consultation slot and send the clear aligner guide.',
      aiPriorityReasoning:
        'High conversion probability; prospect specifically requested booking assistance for clear aligners.',
      aiDetectedProcedures: JSON.stringify([
        {
          id: 'dp-1',
          procedure: 'Clear Aligners / Invisalign',
          specialty: 'Orthodontics',
          confidence: 96,
        },
      ]),
      aiConfirmedByStaff: false,
      notes: {
        create: [
          {
            author: 'System',
            text: 'Enquiry ingested via brightsmiledental.com webform. Auto-classified with 96% confidence.',
            createdAt: '12 min ago',
          },
        ],
      },
    },
  });

  await prisma.enquiry.create({
    data: {
      id: 'ENQ-2024-002',
      patientName: 'Daniel Mathew',
      patientEmail: 'daniel.m***@demo.example',
      patientPhone: '+1 (555) 876-****',
      enquirySummary: 'Need an urgent appointment for a broken molar tooth',
      fullMessage:
        'Hello, my upper right molar cracked while eating dinner last night. It feels sharp against my tongue and is uncomfortable. Do you have any emergency or same-day openings today or tomorrow morning?',
      service: 'General Dentistry',
      procedure: 'Composite Dental Fillings & Restoration',
      specialty: 'General Dentistry',
      source: 'Email',
      priority: 'Urgent Review',
      status: 'Pending Review',
      receivedAt: '35 min ago',
      timestamp: '2026-09-18T03:14:00Z',
      assignedStaff: 'Dr. James Chen',
      isReviewed: false,
      aiProcedure: 'Composite Dental Fillings & Restoration',
      aiSpecialty: 'General Dentistry',
      aiIntent: 'Urgent Review Request',
      aiConfidence: 94,
      aiConfidenceLevel: 'High',
      aiSuggestedAction:
        'Prioritize phone triage by receptionist to assess discomfort and allocate same-day buffer chair.',
      aiPriorityReasoning:
        'Operational notice: Acute discomfort reported. Staff review required for immediate schedule accommodation.',
      aiDetectedProcedures: JSON.stringify([
        {
          id: 'dp-2',
          procedure: 'Composite Dental Fillings & Restoration',
          specialty: 'General Dentistry',
          confidence: 94,
        },
      ]),
      aiConfirmedByStaff: false,
      notes: {
        create: [
          {
            author: 'Triage System',
            text: 'Flagged for urgent administrative triage due to acute molar pain.',
            createdAt: '30 min ago',
          },
        ],
      },
    },
  });

  await prisma.enquiry.create({
    data: {
      id: 'ENQ-2024-003',
      patientName: 'Chloe Bennett',
      patientEmail: 'chloe.b***@demo.example',
      patientPhone: '+1 (555) 345-****',
      enquirySummary: 'Questions about professional teeth whitening packages',
      fullMessage:
        "Hi! My wedding is coming up in 6 weeks and I'd like to get my teeth professionally whitened. Do you offer in-office zoom whitening or take-home custom trays? What are the package pricing options?",
      service: 'Cosmetic Dentistry',
      procedure: 'Professional In-Office Teeth Whitening',
      specialty: 'Cosmetic Dentistry',
      source: 'Website',
      priority: 'Medium',
      status: 'Responded',
      receivedAt: '2 hours ago',
      timestamp: '2026-09-18T01:45:00Z',
      assignedStaff: 'Olivia Reed',
      lastDraft:
        'Hi Chloe! Congratulations on your upcoming wedding. We offer both Philips Zoom In-Office Whitening and custom take-home trays...',
      isReviewed: true,
      aiProcedure: 'Professional In-Office Teeth Whitening',
      aiSpecialty: 'Cosmetic Dentistry',
      aiIntent: 'Service Information',
      aiConfidence: 98,
      aiConfidenceLevel: 'High',
      aiSuggestedAction:
        'Send bridal cosmetic smile brochure with bundled in-office Zoom and touch-up pen packages.',
      aiPriorityReasoning:
        'Time-sensitive event-driven enquiry (wedding in 6 weeks) with strong purchase intent.',
      aiDetectedProcedures: JSON.stringify([
        {
          id: 'dp-3',
          procedure: 'Professional In-Office Teeth Whitening',
          specialty: 'Cosmetic Dentistry',
          confidence: 98,
        },
      ]),
      aiConfirmedByStaff: true,
    },
  });

  // 4. Appointments & No-Show Estimations
  await prisma.appointment.create({
    data: {
      id: 'APT-101',
      patientId: patientSarah.id,
      patientName: 'Sarah Thomas',
      patientPhone: '+1 (555) 234-5678',
      date: '2026-09-24',
      time: '10:00 AM',
      duration: 60,
      operatory: 'Operatory 1',
      procedure: 'Invisalign ClinCheck Scan',
      provider: 'Dr. Sarah Wilson',
      dentistName: 'Dr. Sarah Wilson',
      attendanceHistory: '4 attended, 0 missed',
      cancellationHistory: '0 late cancels',
      noShowProbability: 0.12,
      noShowRiskScore: 12,
      leadTimeDays: 6,
      confirmationStatus: 'confirmed',
      riskLevel: 'Low',
      riskFactors: JSON.stringify([
        'Confirmed via two-way SMS',
        'Strong historical attendance record (100%)',
        'High financial investment in clear aligner package',
      ]),
      recommendedActions: JSON.stringify([
        'Standard 24-hour reminder SMS',
        'Ensure 3D scanner is calibrated',
      ]),
      status: 'Scheduled',
    },
  });

  await prisma.appointment.create({
    data: {
      id: 'APT-102',
      patientId: patientDaniel.id,
      patientName: 'Daniel Mathew',
      patientPhone: '+1 (555) 876-5432',
      date: '2026-09-20',
      time: '02:30 PM',
      duration: 45,
      operatory: 'Operatory 2',
      procedure: 'Emergency Composite Restoration',
      provider: 'Dr. James Chen',
      dentistName: 'Dr. James Chen',
      attendanceHistory: '1 attended, 2 missed',
      cancellationHistory: '1 late cancellation',
      noShowProbability: 0.68,
      noShowRiskScore: 68,
      leadTimeDays: 2,
      confirmationStatus: 'unconfirmed',
      riskLevel: 'High',
      riskFactors: JSON.stringify([
        'Multiple historical late cancellations',
        'Unconfirmed booking 48 hours out',
        'Afternoon Friday slot historically has elevated cancellation rates',
      ]),
      recommendedActions: JSON.stringify([
        'Phone confirmation call from reception',
        'Prepare standby patient from waitlist if unconfirmed by 5 PM',
      ]),
      status: 'Scheduled',
    },
  });

  await prisma.appointment.create({
    data: {
      id: 'APT-103',
      patientId: patientMarcus.id,
      patientName: 'Marcus Vance',
      patientPhone: '+1 (555) 765-4321',
      date: '2026-09-22',
      time: '11:15 AM',
      duration: 45,
      operatory: 'Operatory 3',
      procedure: 'Deep Scaling & Root Planing',
      provider: 'Dr. Sarah Wilson',
      dentistName: 'Dr. Sarah Wilson',
      attendanceHistory: '2 attended, 1 missed',
      cancellationHistory: '0 late cancels',
      noShowProbability: 0.44,
      noShowRiskScore: 44,
      leadTimeDays: 4,
      confirmationStatus: 'pending',
      riskLevel: 'Medium',
      riskFactors: JSON.stringify([
        'Documented dental procedure anxiety',
        'Prior missed appointment 6 months ago',
      ]),
      recommendedActions: JSON.stringify([
        'Send gentle reassuring pre-visit communication regarding topical numbing',
        'Direct phone call confirmation',
      ]),
      status: 'Scheduled',
    },
  });

  // 5. Follow-Up Tasks
  await prisma.followUpTask.create({
    data: {
      id: 'FLW-001',
      title: 'Emergency triage callback for broken molar',
      patientName: 'Daniel Mathew',
      patientId: patientDaniel.id,
      taskType: 'Pending enquiry response',
      dueDate: '2026-09-18',
      priority: 'Urgent Review',
      assignedStaff: 'Olivia Reed',
      status: 'due_today',
      notes: 'Confirm arrival time and pre-medication instructions if needed.',
    },
  });

  await prisma.followUpTask.create({
    data: {
      id: 'FLW-002',
      title: 'Send Orthodontic ClinCheck consultation confirmation',
      patientName: 'Sarah Thomas',
      patientId: patientSarah.id,
      taskType: 'Unbooked lead follow-up',
      dueDate: '2026-09-19',
      priority: 'High',
      assignedStaff: 'Olivia Reed',
      status: 'scheduled',
      notes: 'Provide clinic parking details and digital intake form link.',
    },
  });

  await prisma.followUpTask.create({
    data: {
      id: 'FLW-003',
      title: 'Follow up on Full Arch Implant financing consultation',
      patientName: 'Elena Rostova',
      patientId: patientElena.id,
      taskType: 'Review communication draft',
      dueDate: '2026-09-17',
      priority: 'Medium',
      assignedStaff: 'Dr. James Chen',
      status: 'overdue',
      notes: 'Discuss Sunbit 0% interest financing options.',
    },
  });

  // 6. Waitlist Entries
  await prisma.waitlistEntry.create({
    data: {
      id: 'WL-001',
      patientId: patientSarah.id,
      patientName: 'Amara Patel',
      phone: '+1 (555) 345-9876',
      procedure: 'Preventive Cleaning & Checkup',
      preferredDate: '2026-09-20',
      preferredTime: 'Afternoon (2:00 PM - 5:00 PM)',
      acceptanceProbability: 0.92,
      matchScore: 94,
      distanceKm: 2.1,
      flexibleDays: JSON.stringify(['Monday', 'Friday', 'Saturday']),
      matchReasons: JSON.stringify([
        'Immediate availability within 30 min notice',
        'Located 2.1 km from clinic',
        'Matches Dr. James Chen operatory buffer',
      ]),
      providerPreference: 'Dr. James Chen',
      availability: 'Immediate (1hr notice)',
      urgency: 'High',
      matchReason: 'Perfect replacement match for Friday afternoon cancellation buffer.',
      status: 'Waiting',
    },
  });

  await prisma.waitlistEntry.create({
    data: {
      id: 'WL-002',
      patientId: patientDaniel.id,
      patientName: 'Carlos Gomez',
      phone: '+1 (555) 789-0123',
      procedure: 'Composite Filling Replacement',
      preferredDate: '2026-09-21',
      preferredTime: 'Morning (9:00 AM - 12:00 PM)',
      acceptanceProbability: 0.85,
      matchScore: 88,
      distanceKm: 4.5,
      flexibleDays: JSON.stringify(['Tuesday', 'Thursday']),
      matchReasons: JSON.stringify([
        'Flexible work-from-home schedule',
        'Routine procedure matches standard 45-min opening',
      ]),
      providerPreference: 'Any Available',
      availability: 'Same day with morning notice',
      urgency: 'Medium',
      matchReason: 'Ideal candidate for morning slot backfills.',
      status: 'Waiting',
    },
  });

  // 7. Household Bundling Opportunities
  await prisma.household.create({
    data: {
      id: 'HH-001',
      householdId: 'HH-KUMAR-01',
      householdName: 'Kumar Family',
      familyName: 'Kumar',
      primaryContactName: 'Anita Kumar',
      primaryContactPhone: '+1 (555) 678-1234',
      address: '742 Evergreen Terrace, Springfield',
      scheduledCount: 1,
      totalCount: 3,
      suggestedDate: '2026-09-26 (Saturday)',
      suggestedTime: '10:00 AM - 12:00 PM (Concurrent Operatories)',
      schedulingEfficiency: 'Saves 2 separate round-trip family clinic visits',
      bundleStatus: 'pending_confirmation',
      status: 'Opportunity Detected',
      members: {
        create: [
          {
            memberId: 'MEM-01',
            name: 'Anita Kumar (Mother)',
            relationship: 'Primary Contact / Mother',
            age: 42,
            isPrimary: true,
            hasUpcomingAppointment: true,
            procedureNeeded: 'Routine Hygiene & Exam',
            suggestedTime: '10:00 AM',
            suggestedSlot: 'Operatory 1',
            assignedOperatory: 'Operatory 1',
            assignedDentist: 'Dr. Sarah Wilson',
            estimatedDurationMinutes: 45,
            status: 'Scheduled',
          },
          {
            memberId: 'MEM-02',
            name: 'Rohan Kumar (Son)',
            relationship: 'Dependent Son',
            age: 12,
            isPrimary: false,
            hasUpcomingAppointment: false,
            procedureNeeded: 'Pediatric Dental Checkup & Fluoride',
            suggestedTime: '10:45 AM',
            suggestedSlot: 'Operatory 1',
            assignedOperatory: 'Operatory 1',
            assignedDentist: 'Dr. Sarah Wilson',
            estimatedDurationMinutes: 30,
            status: 'Suggested',
          },
          {
            memberId: 'MEM-03',
            name: 'Rajesh Kumar (Father)',
            relationship: 'Spouse',
            age: 44,
            isPrimary: false,
            hasUpcomingAppointment: false,
            procedureNeeded: 'Overdue 6-Month Recare Exam',
            suggestedTime: '10:00 AM',
            suggestedSlot: 'Operatory 2 (Concurrent)',
            assignedOperatory: 'Operatory 2',
            assignedDentist: 'Dr. James Chen',
            estimatedDurationMinutes: 45,
            status: 'Suggested',
          },
        ],
      },
    },
  });

  // 8. Treatment Plans & Empathetic Nudges
  await prisma.treatmentPlan.create({
    data: {
      id: 'TP-2024-001',
      patientId: patientElena.id,
      patientName: 'Elena Rostova',
      procedure: 'Full Arch Dental Implant & Zirconia Bridge',
      procedureName: 'Full Arch Dental Implant & Zirconia Bridge',
      toothNumber: '#19, #30',
      diagnosisDate: '2026-08-10',
      value: 4850.0,
      estimatedCost: 4850.0,
      currency: '$',
      createdDate: '2026-08-10',
      daysPending: 38,
      status: 'Awaiting Acceptance',
      objectionCategory: 'Cost concern',
      objectionNotes:
        'Patient expressed interest in treatment but stated that the one-time out-of-pocket payment felt overwhelming without structured payment plans.',
      recommendedStrategy:
        'Lead with flexible monthly payment plans (Sunbit/CareCredit) and highlight the long-term bone preservation benefits.',
      recommendedApproach:
        'Lead with flexible monthly payment plans and highlight bone preservation benefits.',
      sequenceStatus: 'Active',
      nudgeSequence: {
        create: [
          {
            stepNumber: 1,
            day: 1,
            dayOffset: 1,
            stage: 'Initial Empathetic Check-in',
            channel: 'email',
            subject: 'Elena, reviewing your treatment options at BrightSmile Dental',
            message:
              'Hi Elena, we know deciding on dental implants is a significant step. We wanted to share our flexible 0% interest monthly financing options starting at $189/month so you can restore your smile comfortably.',
            status: 'Sent',
          },
          {
            stepNumber: 2,
            day: 4,
            dayOffset: 4,
            stage: 'Clinical Value & Prevention',
            channel: 'email',
            subject: 'Protecting your adjacent teeth and jawbone health',
            message:
              'Dr. Chen prepared a brief visual guide illustrating how timely implant placement prevents adjacent teeth from shifting and halts bone loss over time.',
            status: 'Draft',
          },
          {
            stepNumber: 3,
            day: 10,
            dayOffset: 10,
            stage: 'Interactive Questions & Consultation',
            channel: 'sms',
            subject: 'Quick question about your implant plan',
            message:
              'Hi Elena, Dr. Chen has a 15-minute phone slot open this Thursday at 4 PM if you have any questions about the timeline or financing.',
            status: 'Draft',
          },
          {
            stepNumber: 4,
            day: 21,
            dayOffset: 21,
            stage: 'Gentle Priority Holding Notice',
            channel: 'email',
            subject: 'Update on your treatment estimate validity',
            message:
              'Hi Elena, just a friendly reminder that your customized lab fee estimate remains locked in for another two weeks. Let us know whenever you are ready to proceed.',
            status: 'Draft',
          },
        ],
      },
    },
  });

  await prisma.treatmentPlan.create({
    data: {
      id: 'TP-2024-002',
      patientId: patientMarcus.id,
      patientName: 'Marcus Vance',
      procedure: 'Deep Scaling & Periodontal Therapy',
      procedureName: 'Deep Scaling & Periodontal Therapy',
      toothNumber: 'Full Mouth',
      diagnosisDate: '2026-07-28',
      value: 1200.0,
      estimatedCost: 1200.0,
      currency: '$',
      createdDate: '2026-07-28',
      daysPending: 52,
      status: 'Awaiting Acceptance',
      objectionCategory: 'Fear/anxiety',
      objectionNotes:
        'Patient postponed scheduling due to past uncomfortable deep cleaning experience at another dental practice.',
      recommendedStrategy:
        'Emphasize pain-free ultrasonic technology, computer-controlled local anesthesia, and optional mild oral sedation.',
      recommendedApproach:
        'Emphasize pain-free ultrasonic technology and gentle care protocols.',
      sequenceStatus: 'Draft',
      nudgeSequence: {
        create: [
          {
            stepNumber: 1,
            day: 2,
            dayOffset: 2,
            stage: 'Comfort First Assurance',
            channel: 'sms',
            subject: 'Your comfort is our top priority at BrightSmile',
            message:
              'Hi Marcus, we want you to know that our periodontal therapy utilizes ultra-gentle warm water ultrasonic scaling and topical numbing gel for a comfortable, stress-free visit.',
            status: 'Draft',
          },
        ],
      },
    },
  });

  // 9. Dental Reviews
  await prisma.dentalReview.create({
    data: {
      id: 'REV-001',
      platform: 'Google',
      reviewerName: 'Rebecca Miller',
      authorName: 'Rebecca Miller',
      rating: 5,
      reviewText:
        'Dr. Sarah Wilson and her team are absolutely phenomenal! I have always had massive dental anxiety, but they took the time to explain every single step of my filling and made sure I felt zero pain. The clinic is pristine and modern.',
      date: '2026-09-16',
      reviewDate: '2026-09-16',
      sentiment: 'Positive',
      patientId: 'PAT-001',
      recentProcedure: 'Composite Dental Restoration',
      dentist: 'Dr. Sarah Wilson',
      visitDate: '2026-09-15',
      aiDraft:
        'Dear Rebecca, thank you so much for taking the time to share your kind words! We understand how intimidating dental visits can feel, and our team is thrilled to hear you felt calm, comfortable, and well-cared for. We look forward to seeing you at your next visit!',
      aiDraftResponse:
        'Dear Rebecca, thank you so much for taking the time to share your kind words! We understand how intimidating dental visits can feel, and our team is thrilled to hear you felt calm, comfortable, and well-cared for. We look forward to seeing you at your next visit!',
      responseStatus: 'draft_ready',
      approvalStatus: 'Pending Review',
    },
  });

  await prisma.dentalReview.create({
    data: {
      id: 'REV-002',
      platform: 'Google',
      reviewerName: 'Jason K.',
      authorName: 'Jason K.',
      rating: 3,
      reviewText:
        'The dentistry work was great, but I had to wait 25 minutes past my scheduled appointment time before being called back into the operatory. Front desk was busy on the phone.',
      date: '2026-09-14',
      reviewDate: '2026-09-14',
      sentiment: 'Neutral',
      dentist: 'Dr. James Chen',
      visitDate: '2026-09-14',
      aiDraft:
        'Dear Jason, thank you for your candid feedback and for complimenting our clinical care. We sincerely apologize for the delay in seating you for your appointment. We value your time immensely and are actively refining our scheduling buffers to ensure on-time seating. We hope to welcome you back for a smoother visit.',
      aiDraftResponse:
        'Dear Jason, thank you for your candid feedback and for complimenting our clinical care. We sincerely apologize for the delay in seating you for your appointment. We value your time immensely and are actively refining our scheduling buffers to ensure on-time seating. We hope to welcome you back for a smoother visit.',
      responseStatus: 'draft_ready',
      approvalStatus: 'Pending Review',
    },
  });

  // 10. Automation Workflows
  await prisma.automationWorkflow.create({
    data: {
      id: 'WF-001',
      name: 'High-Intent Clear Aligner Lead Follow-up',
      description:
        'Automatically creates high-priority follow-up task and generates personalized orthodontic consultation draft when an Invisalign lead is ingested.',
      trigger: 'Enquiry Received with AI Specialty = Orthodontics & Confidence > 90%',
      condition: 'Lead Status is New and Intent matches Consultation Request',
      action: 'Create Staff Triage Task & Draft WhatsApp/Email Welcome Kit',
      status: 'active',
      staffApprovalRequired: true,
      messageTemplate:
        'Hi {{patientName}}, thank you for reaching out to BrightSmile! We have reserved priority consultation times for clear aligners this week...',
      delayHours: 1,
      executionsCount: 28,
    },
  });

  await prisma.automationWorkflow.create({
    data: {
      id: 'WF-002',
      name: 'High-Risk No-Show Proactive Confirmation',
      description:
        'Triggers reception verification reminder 48 hours prior for any appointment with estimated no-show risk score above 60.',
      trigger: 'Appointment Risk Score >= 60',
      condition: 'Confirmation Status is Unconfirmed 48h prior',
      action: 'Flag for Reception Call & Prepare Waitlist Standby Match',
      status: 'active',
      staffApprovalRequired: true,
      messageTemplate:
        'Friendly check-in from BrightSmile regarding your appointment on {{appointmentDate}} at {{appointmentTime}}...',
      delayHours: 0,
      executionsCount: 42,
    },
  });

  console.log('✅ Database seeded successfully with realistic dental practice data.');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
