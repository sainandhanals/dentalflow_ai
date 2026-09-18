import { Enquiry, Patient, FollowUpTask, AutomationWorkflow, ClinicSettings } from '../types';

export const INITIAL_SETTINGS: ClinicSettings = {
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
};

export const INITIAL_ENQUIRIES: Enquiry[] = [
  {
    id: 'ENQ-2024-001',
    patientName: 'Sarah Thomas',
    patientEmail: 'sarah.t***@demo.example',
    patientPhone: '+1 (555) 234-****',
    enquirySummary: 'Interested in Invisalign consultation & treatment timeline',
    fullMessage: "Hi there, I've been considering Invisalign for a few months now to correct some crowding in my lower teeth. Could someone please explain the consultation process, expected timelines, and help me book an introductory appointment?",
    service: 'Orthodontics',
    source: 'Website',
    aiClassification: {
      intent: 'Consultation Request',
      serviceCategory: 'Orthodontics / Clear Aligners',
      suggestedAction: 'Offer an approved orthodontic consultation slot and send the clear aligner guide.',
      confidence: 96,
      priorityReasoning: 'High conversion probability; prospect specifically requested booking assistance for a premier treatment tier.',
    },
    priority: 'High',
    status: 'New',
    receivedAt: '12 min ago',
    timestamp: '2026-09-18T03:37:00Z',
    assignedStaff: 'Olivia Reed',
    isReviewed: false,
    notes: [
      {
        id: 'n1',
        author: 'System',
        text: 'Enquiry ingested via brightsmiledental.com webform. Auto-classified with 96% confidence.',
        createdAt: '12 min ago'
      }
    ],
  },
  {
    id: 'ENQ-2024-002',
    patientName: 'Daniel Mathew',
    patientEmail: 'daniel.m***@demo.example',
    patientPhone: '+1 (555) 876-****',
    enquirySummary: 'Need an urgent appointment for a broken molar tooth',
    fullMessage: "Hello, my upper right molar cracked while eating dinner last night. It feels sharp against my tongue and is uncomfortable. Do you have any emergency or same-day openings today or tomorrow morning?",
    service: 'General Dentistry',
    source: 'Email',
    aiClassification: {
      intent: 'Appointment Request (Urgent Operational Review)',
      serviceCategory: 'General Restorative Dentistry',
      suggestedAction: 'Prioritize phone triage by receptionist to assess discomfort and allocate same-day buffer chair.',
      confidence: 94,
      priorityReasoning: 'Operational notice: Acute discomfort reported. Staff review required for immediate schedule accommodation.',
    },
    priority: 'Urgent Review',
    status: 'Pending Review',
    receivedAt: '28 min ago',
    timestamp: '2026-09-18T03:21:00Z',
    assignedStaff: 'Alex Morgan',
    isReviewed: false,
    notes: [
      {
        id: 'n2',
        author: 'Alex Morgan',
        text: 'Checking chair 3 morning emergency buffer between 11:30 and 12:00 PM.',
        createdAt: '15 min ago'
      }
    ],
  },
  {
    id: 'ENQ-2024-003',
    patientName: 'Emily Joseph',
    patientEmail: 'emily.j***@demo.example',
    patientPhone: '+1 (555) 456-****',
    enquirySummary: 'Asked about in-office teeth whitening packages & pricing',
    fullMessage: "Good morning! I have an upcoming wedding in four weeks and wanted to know about your in-office laser whitening options, pricing tiers, and whether any preparatory exam is required.",
    service: 'Cosmetic Dentistry',
    source: 'Website',
    aiClassification: {
      intent: 'Pricing & Treatment Scope Enquiry',
      serviceCategory: 'Cosmetic Whitening',
      suggestedAction: 'Send approved cosmetic whitening overview flyer and invite to quick shade assessment.',
      confidence: 92,
      priorityReasoning: 'Time-sensitive event deadline (4 weeks). Follow-up prompt recommended to capture interest.',
    },
    priority: 'Medium',
    status: 'Follow-up Required',
    receivedAt: '1 hour ago',
    timestamp: '2026-09-18T02:45:00Z',
    assignedStaff: 'James Wilson',
    isReviewed: true,
    notes: [
      {
        id: 'n3',
        author: 'James Wilson',
        text: 'Sent pricing information brochure via email. Scheduled follow-up call if not booked within 48 hours.',
        createdAt: '45 min ago'
      }
    ],
  },
  {
    id: 'ENQ-2024-004',
    patientName: 'Arjun Nair',
    patientEmail: 'arjun.n***@demo.example',
    patientPhone: '+1 (555) 901-****',
    enquirySummary: 'Routine dental hygiene check and cleaning information',
    fullMessage: "Hi, I recently moved into the neighborhood and am looking for a new family dentist. Just wanted to verify if you accept Delta Dental PPO for routine cleanings and checkups.",
    service: 'Preventive Dentistry',
    source: 'Website',
    aiClassification: {
      intent: 'Information & Insurance Request',
      serviceCategory: 'Preventive Hygiene & Exam',
      suggestedAction: 'Confirm Delta Dental in-network status and offer online new-patient registration link.',
      confidence: 95,
      priorityReasoning: 'Standard insurance verification inquiry. Low complexity, high booking readiness.',
    },
    priority: 'Low',
    status: 'Responded',
    receivedAt: '2 hours ago',
    timestamp: '2026-09-18T01:45:00Z',
    assignedStaff: 'Olivia Reed',
    isReviewed: true,
    notes: [
      {
        id: 'n4',
        author: 'Olivia Reed',
        text: 'Confirmed in-network status. Sent online scheduling link.',
        createdAt: '1 hour ago'
      }
    ],
  },
  {
    id: 'ENQ-2024-005',
    patientName: 'Mia Thomas',
    patientEmail: 'mia.t***@demo.example',
    patientPhone: '+1 (555) 672-****',
    enquirySummary: 'First dental checkup for 5-year-old child',
    fullMessage: "Hello, looking to bring my 5-year-old daughter for her first thorough checkup. Do your dentists specialize in pediatric gentle care? She is quite nervous about the dentist.",
    service: 'Pediatric Dentistry',
    source: 'Phone',
    aiClassification: {
      intent: 'Pediatric First Visit Consultation',
      serviceCategory: 'Pediatric Dentistry',
      suggestedAction: 'Reassure parent regarding Dr. Lee’s gentle pediatric protocol and book a relaxed introductory appointment.',
      confidence: 93,
      priorityReasoning: 'Parent seeking reassurance. Warm, empathetic tone draft recommended.',
    },
    priority: 'High',
    status: 'New',
    receivedAt: '3 hours ago',
    timestamp: '2026-09-18T00:30:00Z',
    assignedStaff: 'Olivia Reed',
    isReviewed: false,
    notes: [],
  },
  {
    id: 'ENQ-2024-006',
    patientName: 'Noah Williams',
    patientEmail: 'noah.w***@demo.example',
    patientPhone: '+1 (555) 789-****',
    enquirySummary: 'Clear aligners financing options and consult confirmation',
    fullMessage: "Thank you for the quick quote yesterday! I would like to move forward with booking the 3D digital scan consult this Thursday at 4 PM.",
    service: 'Orthodontics',
    source: 'Website',
    aiClassification: {
      intent: 'Booking Confirmation',
      serviceCategory: 'Orthodontics',
      suggestedAction: 'Confirm Thursday 4 PM scan in practice management system and send pre-visit checklist.',
      confidence: 98,
      priorityReasoning: 'Converted lead. Direct confirmation of consult appointment.',
    },
    priority: 'High',
    status: 'Converted',
    receivedAt: 'Yesterday',
    timestamp: '2026-09-17T15:20:00Z',
    assignedStaff: 'Alex Morgan',
    isReviewed: true,
    notes: [
      {
        id: 'n5',
        author: 'Alex Morgan',
        text: 'Deposit collected. Digital scan scheduled with Dr. Davis for Thursday 4:00 PM.',
        createdAt: 'Yesterday'
      }
    ],
  },
  {
    id: 'ENQ-2024-007',
    patientName: 'Clara Bennett',
    patientEmail: 'clara.b***@demo.example',
    patientPhone: '+1 (555) 345-****',
    enquirySummary: 'Rescheduling routine cleaning due to travel',
    fullMessage: "Hi, I have a cleaning appointment scheduled next Tuesday, but I will be traveling for work. Can we shift this to the following week?",
    service: 'Preventive Dentistry',
    source: 'Email',
    aiClassification: {
      intent: 'Reschedule Request',
      serviceCategory: 'Preventive Care',
      suggestedAction: 'Provide two available morning slots for the following week.',
      confidence: 91,
      priorityReasoning: 'Existing patient retention. Prompt reschedule prevents appointment lapse.',
    },
    priority: 'Medium',
    status: 'Follow-up Required',
    receivedAt: 'Yesterday',
    timestamp: '2026-09-17T11:00:00Z',
    assignedStaff: 'James Wilson',
    isReviewed: true,
    notes: [],
  },
  {
    id: 'ENQ-2024-008',
    patientName: 'David Chen',
    patientEmail: 'david.c***@demo.example',
    patientPhone: '+1 (555) 555-****',
    enquirySummary: 'Dental crown replacement quote and longevity question',
    fullMessage: "I had a porcelain crown placed 12 years ago that is beginning to feel loose. What is the typical procedure and cost to replace it with a modern ceramic crown?",
    service: 'General Dentistry',
    source: 'Website',
    aiClassification: {
      intent: 'Restorative Care Consultation',
      serviceCategory: 'Crown & Bridge Restorations',
      suggestedAction: 'Invite for an examination and digital X-ray evaluation of margin integrity.',
      confidence: 95,
      priorityReasoning: 'High-value restorative service. Loose crown needs timely physical exam.',
    },
    priority: 'High',
    status: 'Pending Review',
    receivedAt: '2 days ago',
    timestamp: '2026-09-16T14:15:00Z',
    assignedStaff: 'Alex Morgan',
    isReviewed: false,
    notes: [],
  }
];

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'PAT-101',
    name: 'Sarah Thomas',
    email: 'sarah.t***@demo.example',
    phone: '+1 (555) 234-5678',
    lastAppointment: 'None (Prospective Lead)',
    nextAppointment: 'Pending Consultation Booking',
    engagementScore: 82,
    engagementLevel: 'Active',
    preferredChannel: 'Email',
    lastInteraction: '12 min ago (Website Enquiry)',
    assignedStaff: 'Olivia Reed',
    interactions: [
      {
        id: 'i1',
        date: '2026-09-18 03:37',
        type: 'Online Enquiry',
        title: 'Submitted Invisalign consultation enquiry',
        note: 'Customer expressed high interest in lower teeth alignment.',
        staff: 'System'
      },
      {
        id: 'i2',
        date: '2026-09-18 03:38',
        type: 'Email',
        title: 'Automated receipt acknowledgement sent',
        note: 'Standard clinic notification delivered with office hours.',
        staff: 'System'
      }
    ],
    notes: [
      {
        id: 'pn1',
        author: 'Olivia Reed',
        text: 'Prefers email communication over phone calls during working hours.',
        createdAt: '10 min ago'
      }
    ]
  },
  {
    id: 'PAT-102',
    name: 'Daniel Mathew',
    email: 'daniel.m***@demo.example',
    phone: '+1 (555) 876-5432',
    lastAppointment: '2026-03-12 (Routine Exam & Scaling)',
    nextAppointment: 'Pending Emergency Review',
    engagementScore: 64,
    engagementLevel: 'Moderate',
    preferredChannel: 'Phone',
    lastInteraction: '28 min ago (Email Enquiry)',
    assignedStaff: 'Alex Morgan',
    interactions: [
      {
        id: 'i3',
        date: '2026-09-18 03:21',
        type: 'Online Enquiry',
        title: 'Reported broken molar',
        note: 'Requested urgent appointment slot.',
        staff: 'System'
      },
      {
        id: 'i4',
        date: '2026-03-12 10:00',
        type: 'In-Clinic',
        title: 'Routine 6-month cleaning & exam',
        note: 'Completed successfully with Dr. Davis. No issues noted at the time.',
        staff: 'Dr. Davis'
      }
    ],
    notes: [
      {
        id: 'pn2',
        author: 'Alex Morgan',
        text: 'Patient was regular for exams until 6 months ago. Priority review initiated.',
        createdAt: '20 min ago'
      }
    ]
  },
  {
    id: 'PAT-103',
    name: 'Emily Joseph',
    email: 'emily.j***@demo.example',
    phone: '+1 (555) 456-7890',
    lastAppointment: '2025-11-20 (Consultation)',
    nextAppointment: 'None scheduled',
    engagementScore: 78,
    engagementLevel: 'Active',
    preferredChannel: 'SMS',
    lastInteraction: '1 hour ago (Pricing Inquiry)',
    assignedStaff: 'James Wilson',
    interactions: [
      {
        id: 'i5',
        date: '2026-09-18 02:45',
        type: 'Online Enquiry',
        title: 'Inquired about in-office whitening',
        note: 'Mentioned 4-week wedding timeline.',
        staff: 'System'
      },
      {
        id: 'i6',
        date: '2026-09-18 03:00',
        type: 'Email',
        title: 'Sent Cosmetic Whitening Brochure',
        note: 'Included current seasonal package options.',
        staff: 'James Wilson'
      }
    ],
    notes: []
  },
  {
    id: 'PAT-104',
    name: 'Arjun Nair',
    email: 'arjun.n***@demo.example',
    phone: '+1 (555) 901-2345',
    lastAppointment: 'None (New Resident)',
    nextAppointment: '2026-09-24 09:30 AM (Hygiene Check)',
    engagementScore: 91,
    engagementLevel: 'Active',
    preferredChannel: 'Email',
    lastInteraction: '2 hours ago (Booked via portal)',
    assignedStaff: 'Olivia Reed',
    interactions: [
      {
        id: 'i7',
        date: '2026-09-18 01:45',
        type: 'Online Enquiry',
        title: 'Insurance verification inquiry',
        note: 'Delta Dental PPO confirmed.',
        staff: 'Olivia Reed'
      },
      {
        id: 'i8',
        date: '2026-09-18 02:15',
        type: 'SMS',
        title: 'Booking confirmation SMS sent',
        note: 'Calendar invite delivered for Sept 24.',
        staff: 'System'
      }
    ],
    notes: []
  },
  {
    id: 'PAT-105',
    name: 'Noah Williams',
    email: 'noah.w***@demo.example',
    phone: '+1 (555) 789-0123',
    lastAppointment: 'None (New Patient)',
    nextAppointment: '2026-09-20 04:00 PM (3D Ortho Scan)',
    engagementScore: 88,
    engagementLevel: 'Active',
    preferredChannel: 'SMS',
    lastInteraction: 'Yesterday (Deposit Confirmed)',
    assignedStaff: 'Alex Morgan',
    interactions: [
      {
        id: 'i9',
        date: '2026-09-17 15:20',
        type: 'Call',
        title: 'Consultation confirmation call',
        note: 'Patient confirmed Thursday slot. Sent pre-visit forms.',
        staff: 'Alex Morgan'
      }
    ],
    notes: []
  },
  {
    id: 'PAT-106',
    name: 'Clara Bennett',
    email: 'clara.b***@demo.example',
    phone: '+1 (555) 345-6789',
    lastAppointment: '2026-01-14 (Filling)',
    nextAppointment: 'Overdue for 6-month checkup',
    engagementScore: 32,
    engagementLevel: 'At Risk',
    preferredChannel: 'Email',
    lastInteraction: 'Yesterday (Reschedule requested)',
    assignedStaff: 'James Wilson',
    interactions: [
      {
        id: 'i10',
        date: '2026-09-17 11:00',
        type: 'Email',
        title: 'Requested to reschedule hygiene appointment',
        note: 'Traveling for business.',
        staff: 'James Wilson'
      }
    ],
    notes: [
      {
        id: 'pn3',
        author: 'James Wilson',
        text: 'Patient frequently reschedules due to travel. Offer Saturday morning slot if available.',
        createdAt: 'Yesterday'
      }
    ]
  },
  {
    id: 'PAT-107',
    name: 'David Chen',
    email: 'david.c***@demo.example',
    phone: '+1 (555) 555-6789',
    lastAppointment: '2025-08-10 (Crown placement)',
    nextAppointment: 'None scheduled (Loose crown reported)',
    engagementScore: 41,
    engagementLevel: 'At Risk',
    preferredChannel: 'Phone',
    lastInteraction: '2 days ago (Website Enquiry)',
    assignedStaff: 'Alex Morgan',
    interactions: [
      {
        id: 'i11',
        date: '2026-09-16 14:15',
        type: 'Online Enquiry',
        title: 'Inquired regarding loose crown',
        note: 'Needs clinical exam before recementing or replacing.',
        staff: 'System'
      }
    ],
    notes: []
  }
];

export const INITIAL_FOLLOW_UPS: FollowUpTask[] = [
  {
    id: 'TSK-001',
    title: 'Follow up with unbooked orthodontic lead (Sarah Thomas)',
    patientName: 'Sarah Thomas',
    patientId: 'PAT-101',
    enquiryId: 'ENQ-2024-001',
    taskType: 'Unbooked lead follow-up',
    dueDate: 'Today, 2:00 PM',
    priority: 'High',
    assignedStaff: 'Olivia Reed',
    status: 'due_today',
    notes: 'Send personalized clear aligner treatment guide and consultation link.'
  },
  {
    id: 'TSK-002',
    title: 'Review and confirm same-day slot for broken molar (Daniel Mathew)',
    patientName: 'Daniel Mathew',
    patientId: 'PAT-102',
    enquiryId: 'ENQ-2024-002',
    taskType: 'Pending enquiry response',
    dueDate: 'Today, 11:00 AM',
    priority: 'Urgent Review',
    assignedStaff: 'Alex Morgan',
    status: 'due_today',
    notes: 'Check Chair 3 opening and call patient directly.'
  },
  {
    id: 'TSK-003',
    title: 'Review post-appointment feedback request for hygiene visits',
    patientName: 'Arjun Nair',
    patientId: 'PAT-104',
    taskType: 'Post-appointment feedback request',
    dueDate: 'Today, 4:30 PM',
    priority: 'Low',
    assignedStaff: 'James Wilson',
    status: 'due_today',
    notes: 'Verify feedback survey draft meets tone standards before batch dispatch.'
  },
  {
    id: 'TSK-004',
    title: 'Follow up on whitening inquiry quote (Emily Joseph)',
    patientName: 'Emily Joseph',
    patientId: 'PAT-103',
    enquiryId: 'ENQ-2024-003',
    taskType: 'Unbooked lead follow-up',
    dueDate: 'Yesterday (Overdue)',
    priority: 'High',
    assignedStaff: 'James Wilson',
    status: 'overdue',
    notes: 'Brochure delivered yesterday; check if shade consultation desired.'
  },
  {
    id: 'TSK-005',
    title: 'Contact patient regarding overdue 6-month hygiene recall',
    patientName: 'Clara Bennett',
    patientId: 'PAT-106',
    taskType: 'Appointment reminder review',
    dueDate: '2 days ago (Overdue)',
    priority: 'Medium',
    assignedStaff: 'Olivia Reed',
    status: 'overdue',
    notes: 'Patient was traveling; offer next week Thursday or Saturday opening.'
  },
  {
    id: 'TSK-006',
    title: 'Review AI-generated consultation confirmation draft for Noah Williams',
    patientName: 'Noah Williams',
    patientId: 'PAT-105',
    taskType: 'Review communication draft',
    dueDate: 'Tomorrow, 10:00 AM',
    priority: 'Medium',
    assignedStaff: 'Alex Morgan',
    status: 'scheduled',
    notes: 'Ensure pre-visit medical history link is included.'
  },
  {
    id: 'TSK-007',
    title: 'Outreach to David Chen regarding loose crown examination',
    patientName: 'David Chen',
    patientId: 'PAT-107',
    taskType: 'Pending enquiry response',
    dueDate: 'Friday, 11:30 AM',
    priority: 'High',
    assignedStaff: 'Alex Morgan',
    status: 'scheduled',
    notes: 'Explain evaluation process and schedule diagnostic appointment.'
  },
  {
    id: 'TSK-008',
    title: 'Completed: Send appointment reminder SMS batch',
    patientName: 'Multiple Patients (18)',
    taskType: 'Appointment reminder review',
    dueDate: 'Completed Today',
    priority: 'Low',
    assignedStaff: 'Olivia Reed',
    status: 'completed',
    notes: '18 reminders dispatched successfully for tomorrow’s schedule.'
  }
];

export const INITIAL_WORKFLOWS: AutomationWorkflow[] = [
  {
    id: 'WF-01',
    name: 'New Enquiry Follow-up & AI Draft',
    description: 'Instantly categorizes incoming web & email enquiries, assigns staff, and prepares an approved personalized message draft.',
    trigger: 'New Enquiry Received (Web, Email)',
    condition: 'Enquiry unreviewed after 15 minutes',
    action: 'Create high-priority staff task & generate approved AI draft',
    status: 'active',
    staffApprovalRequired: true,
    messageTemplate: 'Approved Warm Receptionist Template (Orthodontic & General)',
    delayHours: 0.25,
    executionsCount: 142
  },
  {
    id: 'WF-02',
    name: 'Unbooked Lead Reminder Sequence',
    description: 'Detects enquiries with expressed treatment intent where no clinic appointment was booked within 48 hours.',
    trigger: 'Enquiry Marked Interested / Consultation Request',
    condition: 'No booking recorded within 48 hours',
    action: 'Queue personalized follow-up message draft for receptionist review',
    status: 'active',
    staffApprovalRequired: true,
    messageTemplate: 'Friendly Follow-up & Schedule Availability Check',
    delayHours: 48,
    executionsCount: 89
  },
  {
    id: 'WF-03',
    name: 'Post-Appointment Engagement & Feedback',
    description: 'Follows up with patients 24 hours after completed treatments to check in on their comfort and invite private feedback.',
    trigger: 'Appointment Status Marked Completed',
    condition: 'Patient eligible for follow-up (no active clinical complications)',
    action: 'Send polite thank-you message and post-visit satisfaction survey link',
    status: 'active',
    staffApprovalRequired: true,
    messageTemplate: 'Post-Visit Care Check & Google Review Invitation',
    delayHours: 24,
    executionsCount: 264
  },
  {
    id: 'WF-04',
    name: 'Pending Appointment Hygiene Recall',
    description: 'Identifies active patients approaching 6 months since their last dental cleaning who have no future appointments scheduled.',
    trigger: 'Elapsed Time Since Last Hygiene Exam >= 170 Days',
    condition: 'No forward appointment on clinic calendar',
    action: 'Queue gentle preventive checkup reminder task for patient coordinator',
    status: 'paused',
    staffApprovalRequired: true,
    messageTemplate: '6-Month Routine Hygiene Checkup Reminder',
    delayHours: 4080, // ~170 days
    executionsCount: 57
  }
];
