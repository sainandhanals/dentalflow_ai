import { 
  Enquiry, 
  Patient, 
  FollowUpTask, 
  AutomationWorkflow, 
  ClinicSettings,
  Appointment,
  WaitlistEntry,
  Household,
  TreatmentPlan,
  DentalReview
} from '../types';

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
    procedure: 'Clear Aligners / Invisalign',
    specialty: 'Orthodontics',
    source: 'Website',
    aiClassification: {
      procedure: 'Clear Aligners / Invisalign',
      specialty: 'Orthodontics',
      detectedProcedures: [
        {
          id: 'dp-1',
          procedure: 'Clear Aligners / Invisalign',
          specialty: 'Orthodontics',
          confidence: 96
        }
      ],
      intent: 'Consultation Request',
      confidence: 96,
      confidenceLevel: 'High',
      suggestedAction: 'Offer an approved orthodontic consultation slot and send the clear aligner guide.',
      priorityReasoning: 'High conversion probability; prospect specifically requested booking assistance for clear aligners.',
      isConfirmedByStaff: false,
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
    procedure: 'Composite Dental Fillings & Restoration',
    specialty: 'General Dentistry',
    source: 'Email',
    aiClassification: {
      procedure: 'Composite Dental Fillings & Restoration',
      specialty: 'General Dentistry',
      detectedProcedures: [
        {
          id: 'dp-2',
          procedure: 'Composite Dental Fillings & Restoration',
          specialty: 'General Dentistry',
          confidence: 94
        }
      ],
      intent: 'Urgent Review Request',
      confidence: 94,
      confidenceLevel: 'High',
      suggestedAction: 'Prioritize phone triage by receptionist to assess discomfort and allocate same-day buffer chair.',
      priorityReasoning: 'Operational notice: Acute discomfort reported. Staff review required for immediate schedule accommodation.',
      isConfirmedByStaff: false,
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
    procedure: 'Teeth Whitening (In-Office / Take-Home)',
    specialty: 'Cosmetic Dentistry',
    source: 'Website',
    aiClassification: {
      procedure: 'Teeth Whitening (In-Office / Take-Home)',
      specialty: 'Cosmetic Dentistry',
      detectedProcedures: [
        {
          id: 'dp-3',
          procedure: 'Teeth Whitening (In-Office / Take-Home)',
          specialty: 'Cosmetic Dentistry',
          confidence: 92
        }
      ],
      intent: 'Pricing Enquiry',
      confidence: 92,
      confidenceLevel: 'High',
      suggestedAction: 'Send approved cosmetic whitening overview flyer and invite to quick shade assessment.',
      priorityReasoning: 'Time-sensitive event deadline (4 weeks). Follow-up prompt recommended to capture interest.',
      isConfirmedByStaff: true,
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
    patientName: 'Marcus Vance',
    patientEmail: 'marcus.v***@demo.example',
    patientPhone: '+1 (555) 321-****',
    enquirySummary: 'Bleeding gums and periodontal deep cleaning evaluation',
    fullMessage: "My gums bleed whenever I brush and look swollen around the lower front teeth. My coworker mentioned deep cleaning might help. Can I come in for an evaluation?",
    service: 'Periodontics',
    procedure: 'Gum Health Evaluation & Treatment',
    specialty: 'Periodontics',
    source: 'Website',
    aiClassification: {
      procedure: 'Gum Health Evaluation & Treatment',
      specialty: 'Periodontics',
      detectedProcedures: [
        {
          id: 'dp-4',
          procedure: 'Gum Health Evaluation & Treatment',
          specialty: 'Periodontics',
          confidence: 95
        },
        {
          id: 'dp-4b',
          procedure: 'Deep Cleaning (Scaling & Root Planing)',
          specialty: 'Periodontics',
          confidence: 88
        }
      ],
      intent: 'Consultation Request',
      confidence: 95,
      confidenceLevel: 'High',
      suggestedAction: 'Schedule clinical gum evaluation and hygiene assessment with periodontics team.',
      priorityReasoning: 'Patient reported bleeding and swollen gums with interest in deep cleaning.',
      isConfirmedByStaff: false,
    },
    priority: 'High',
    status: 'New',
    receivedAt: '1.5 hours ago',
    timestamp: '2026-09-18T02:00:00Z',
    assignedStaff: 'Olivia Reed',
    isReviewed: false,
    notes: [],
  },
  {
    id: 'ENQ-2024-005',
    patientName: 'Elena Rostova',
    patientEmail: 'elena.r***@demo.example',
    patientPhone: '+1 (555) 765-****',
    enquirySummary: 'Severe throbbing pain in lower molar - root canal consultation',
    fullMessage: "I have a severe throbbing toothache in my bottom back molar that keeps me awake at night. Hot and cold drinks make it sharply painful. Do you do root canals or endodontic treatments?",
    service: 'Endodontics',
    procedure: 'Root Canal Treatment & Evaluation',
    specialty: 'Endodontics',
    source: 'Email',
    aiClassification: {
      procedure: 'Root Canal Treatment & Evaluation',
      specialty: 'Endodontics',
      detectedProcedures: [
        {
          id: 'dp-5',
          procedure: 'Root Canal Treatment & Evaluation',
          specialty: 'Endodontics',
          confidence: 97
        }
      ],
      intent: 'Consultation Request',
      confidence: 97,
      confidenceLevel: 'High',
      suggestedAction: 'Prioritize prompt diagnostic exam and periapical X-ray evaluation.',
      priorityReasoning: 'Acute pulp sensitivity symptoms reported. Prompt endodontic evaluation recommended.',
      isConfirmedByStaff: false,
    },
    priority: 'Urgent Review',
    status: 'Pending Review',
    receivedAt: '2 hours ago',
    timestamp: '2026-09-18T01:30:00Z',
    assignedStaff: 'Alex Morgan',
    isReviewed: false,
    notes: [],
  },
  {
    id: 'ENQ-2024-006',
    patientName: 'Liam Walker',
    patientEmail: 'liam.w***@demo.example',
    patientPhone: '+1 (555) 654-****',
    enquirySummary: 'Impacted wisdom tooth removal consultation & surgery availability',
    fullMessage: "Hello, my college dentist informed me that my bottom two wisdom teeth are impacted and need to be removed. Can someone explain the surgical consultation and recovery timeline?",
    service: 'Oral & Maxillofacial Surgery',
    procedure: 'Wisdom Tooth Removal & Extraction',
    specialty: 'Oral & Maxillofacial Surgery',
    source: 'Website',
    aiClassification: {
      procedure: 'Wisdom Tooth Removal & Extraction',
      specialty: 'Oral & Maxillofacial Surgery',
      detectedProcedures: [
        {
          id: 'dp-6',
          procedure: 'Wisdom Tooth Removal & Extraction',
          specialty: 'Oral & Maxillofacial Surgery',
          confidence: 96
        }
      ],
      intent: 'Consultation Request',
      confidence: 96,
      confidenceLevel: 'High',
      suggestedAction: 'Schedule surgical evaluation and request panoramic X-ray (OPG).',
      priorityReasoning: 'Impacted third molar removal request. Oral surgery coordinator referral.',
      isConfirmedByStaff: false,
    },
    priority: 'Medium',
    status: 'New',
    receivedAt: '3 hours ago',
    timestamp: '2026-09-18T00:45:00Z',
    assignedStaff: 'James Wilson',
    isReviewed: false,
    notes: [],
  },
  {
    id: 'ENQ-2024-007',
    patientName: 'Patricia Davis',
    patientEmail: 'patricia.d***@demo.example',
    patientPhone: '+1 (555) 890-****',
    enquirySummary: 'Lost upper molar - dental implant quote and candidacy check',
    fullMessage: "I've lost a tooth in the upper left side about six months ago and I want a dental implant. Can someone explain the pricing, how long the bone healing takes, and help me book a scan?",
    service: 'Implant Dentistry',
    procedure: 'Dental Implant Placement & Consult',
    specialty: 'Implant Dentistry',
    source: 'Website',
    aiClassification: {
      procedure: 'Dental Implant Placement & Consult',
      specialty: 'Implant Dentistry',
      detectedProcedures: [
        {
          id: 'dp-7',
          procedure: 'Dental Implant Placement & Consult',
          specialty: 'Implant Dentistry',
          confidence: 94
        }
      ],
      intent: 'Pricing Enquiry',
      confidence: 94,
      confidenceLevel: 'High',
      suggestedAction: 'Offer comprehensive implant consultation including 3D CBCT bone scan evaluation.',
      priorityReasoning: 'High-value missing tooth replacement inquiry. Patient requested pricing and 3D scan.',
      isConfirmedByStaff: false,
    },
    priority: 'High',
    status: 'New',
    receivedAt: '4 hours ago',
    timestamp: '2026-09-17T23:45:00Z',
    assignedStaff: 'Alex Morgan',
    isReviewed: false,
    notes: [],
  },
  {
    id: 'ENQ-2024-008',
    patientName: 'Chloe Bennett',
    patientEmail: 'chloe.b***@demo.example',
    patientPhone: '+1 (555) 432-****',
    enquirySummary: 'Combination enquiry: Teeth whitening and Invisalign consultation',
    fullMessage: "Hi, I want to whiten my teeth and I'm also considering Invisalign before my sister's wedding in December. Can we do both together and what would the package cost be?",
    service: 'Cosmetic Dentistry',
    procedure: 'Teeth Whitening (In-Office / Take-Home)',
    specialty: 'Cosmetic Dentistry',
    source: 'Website',
    aiClassification: {
      procedure: 'Teeth Whitening (In-Office / Take-Home)',
      specialty: 'Cosmetic Dentistry',
      detectedProcedures: [
        {
          id: 'dp-8a',
          procedure: 'Teeth Whitening (In-Office / Take-Home)',
          specialty: 'Cosmetic Dentistry',
          confidence: 95
        },
        {
          id: 'dp-8b',
          procedure: 'Clear Aligners / Invisalign',
          specialty: 'Orthodontics',
          confidence: 93
        }
      ],
      intent: 'Pricing Enquiry',
      confidence: 94,
      confidenceLevel: 'High',
      suggestedAction: 'Invite for cosmetic & clear aligner combo consultation; explain sequence of alignment prior to final whitening.',
      priorityReasoning: 'Multiple procedures detected: Cosmetic Dentistry (Whitening) and Orthodontics (Invisalign).',
      isConfirmedByStaff: false,
    },
    priority: 'High',
    status: 'New',
    receivedAt: '5 hours ago',
    timestamp: '2026-09-17T22:30:00Z',
    assignedStaff: 'Alex Morgan',
    isReviewed: false,
    notes: [],
  },
  {
    id: 'ENQ-2024-009',
    patientName: 'David Chen',
    patientEmail: 'david.c***@demo.example',
    patientPhone: '+1 (555) 555-****',
    enquirySummary: 'Dental crown replacement quote and longevity question',
    fullMessage: "I had a porcelain crown placed 12 years ago that is beginning to feel loose. What is the typical procedure and cost to replace it with a modern ceramic crown?",
    service: 'Prosthodontics',
    procedure: 'Dental Crowns & Caps',
    specialty: 'Prosthodontics',
    source: 'Website',
    aiClassification: {
      procedure: 'Dental Crowns & Caps',
      specialty: 'Prosthodontics',
      detectedProcedures: [
        {
          id: 'dp-9',
          procedure: 'Dental Crowns & Caps',
          specialty: 'Prosthodontics',
          confidence: 95
        }
      ],
      intent: 'Pricing Enquiry',
      confidence: 95,
      confidenceLevel: 'High',
      suggestedAction: 'Schedule examination and margin integrity evaluation for crown restoration.',
      priorityReasoning: 'High-value restorative service. Loose crown needs timely physical exam.',
      isConfirmedByStaff: true,
    },
    priority: 'High',
    status: 'Pending Review',
    receivedAt: 'Yesterday',
    timestamp: '2026-09-17T14:15:00Z',
    assignedStaff: 'Alex Morgan',
    isReviewed: true,
    notes: [],
  },
  {
    id: 'ENQ-2024-010',
    patientName: 'Mia Thomas',
    patientEmail: 'mia.t***@demo.example',
    patientPhone: '+1 (555) 672-****',
    enquirySummary: 'First dental checkup for 5-year-old child',
    fullMessage: "Hello, looking to bring my 5-year-old daughter for her first thorough checkup. Do your dentists specialize in pediatric gentle care? She is quite nervous about the dentist.",
    service: 'Pediatric Dentistry',
    procedure: 'Children’s Dental Check-up & Gentle Care',
    specialty: 'Pediatric Dentistry',
    source: 'Phone',
    aiClassification: {
      procedure: 'Children’s Dental Check-up & Gentle Care',
      specialty: 'Pediatric Dentistry',
      detectedProcedures: [
        {
          id: 'dp-10',
          procedure: 'Children’s Dental Check-up & Gentle Care',
          specialty: 'Pediatric Dentistry',
          confidence: 93
        }
      ],
      intent: 'Consultation Request',
      confidence: 93,
      confidenceLevel: 'High',
      suggestedAction: 'Reassure parent regarding Dr. Lee’s gentle pediatric protocol and book a relaxed introductory appointment.',
      priorityReasoning: 'Parent seeking reassurance. Warm, empathetic tone draft recommended.',
      isConfirmedByStaff: false,
    },
    priority: 'High',
    status: 'New',
    receivedAt: 'Yesterday',
    timestamp: '2026-09-17T11:30:00Z',
    assignedStaff: 'Olivia Reed',
    isReviewed: false,
    notes: [],
  },
  {
    id: 'ENQ-2024-011',
    patientName: 'Arthur Pendelton',
    patientEmail: 'arthur.p***@demo.example',
    patientPhone: '+1 (555) 112-****',
    enquirySummary: 'Ambiguous inquiry regarding general teeth issues',
    fullMessage: "I'm having some problems with my teeth. Can someone help me out?",
    service: 'Needs Staff Review',
    procedure: 'General dental consultation',
    specialty: 'Needs Staff Review',
    source: 'Website',
    aiClassification: {
      procedure: 'General dental consultation',
      specialty: 'Needs Staff Review',
      detectedProcedures: [
        {
          id: 'dp-11',
          procedure: 'General dental consultation',
          specialty: 'Needs Staff Review',
          confidence: 48
        }
      ],
      intent: 'Information Request',
      confidence: 48,
      confidenceLevel: 'Low',
      suggestedAction: 'Review enquiry manually — request clarification from patient regarding symptoms.',
      priorityReasoning: 'Ambiguous query lacking specific procedure terminology. Manual front-desk review recommended.',
      isConfirmedByStaff: false,
    },
    priority: 'Medium',
    status: 'Pending Review',
    receivedAt: 'Yesterday',
    timestamp: '2026-09-17T09:15:00Z',
    assignedStaff: 'Alex Morgan',
    isReviewed: false,
    notes: [],
  },
  {
    id: 'ENQ-2024-012',
    patientName: 'Arjun Nair',
    patientEmail: 'arjun.n***@demo.example',
    patientPhone: '+1 (555) 901-****',
    enquirySummary: 'Routine dental hygiene check and cleaning information',
    fullMessage: "Hi, I recently moved into the neighborhood and am looking for a new family dentist. Just wanted to verify if you accept Delta Dental PPO for routine cleanings and checkups.",
    service: 'General Dentistry',
    procedure: 'Routine Check-up & Professional Cleaning',
    specialty: 'General Dentistry',
    source: 'Website',
    aiClassification: {
      procedure: 'Routine Check-up & Professional Cleaning',
      specialty: 'General Dentistry',
      detectedProcedures: [
        {
          id: 'dp-12',
          procedure: 'Routine Check-up & Professional Cleaning',
          specialty: 'General Dentistry',
          confidence: 95
        }
      ],
      intent: 'Information Request',
      confidence: 95,
      confidenceLevel: 'High',
      suggestedAction: 'Confirm Delta Dental in-network status and offer online new-patient registration link.',
      priorityReasoning: 'Standard insurance verification inquiry. Low complexity, high booking readiness.',
      isConfirmedByStaff: true,
    },
    priority: 'Low',
    status: 'Responded',
    receivedAt: '2 days ago',
    timestamp: '2026-09-16T14:45:00Z',
    assignedStaff: 'Olivia Reed',
    isReviewed: true,
    notes: [
      {
        id: 'n4',
        author: 'Olivia Reed',
        text: 'Confirmed in-network status. Sent online scheduling link.',
        createdAt: '2 days ago'
      }
    ],
  },
  {
    id: 'ENQ-2024-013',
    patientName: 'Noah Williams',
    patientEmail: 'noah.w***@demo.example',
    patientPhone: '+1 (555) 789-****',
    enquirySummary: 'Clear aligners financing options and consult confirmation',
    fullMessage: "Thank you for the quick quote yesterday! I would like to move forward with booking the 3D digital scan consult this Thursday at 4 PM.",
    service: 'Orthodontics',
    procedure: 'Clear Aligners / Invisalign',
    specialty: 'Orthodontics',
    source: 'Website',
    aiClassification: {
      procedure: 'Clear Aligners / Invisalign',
      specialty: 'Orthodontics',
      detectedProcedures: [
        {
          id: 'dp-13',
          procedure: 'Clear Aligners / Invisalign',
          specialty: 'Orthodontics',
          confidence: 98
        }
      ],
      intent: 'Booking Confirmation',
      confidence: 98,
      confidenceLevel: 'High',
      suggestedAction: 'Confirm Thursday 4 PM scan in practice management system and send pre-visit checklist.',
      priorityReasoning: 'Converted lead. Direct confirmation of consult appointment.',
      isConfirmedByStaff: true,
    },
    priority: 'High',
    status: 'Converted',
    receivedAt: '3 days ago',
    timestamp: '2026-09-15T15:20:00Z',
    assignedStaff: 'Alex Morgan',
    isReviewed: true,
    notes: [
      {
        id: 'n5',
        author: 'Alex Morgan',
        text: 'Deposit collected. Digital scan scheduled with Dr. Davis for Thursday 4:00 PM.',
        createdAt: '3 days ago'
      }
    ],
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
    title: 'Follow up on periodontal deep cleaning enquiry (Marcus Vance)',
    patientName: 'Marcus Vance',
    enquiryId: 'ENQ-2024-004',
    taskType: 'Unbooked lead follow-up',
    dueDate: 'Today, 3:30 PM',
    priority: 'High',
    assignedStaff: 'Olivia Reed',
    status: 'due_today',
    notes: 'Explain quadrant scaling procedure and check hygiene openings.'
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
    title: 'Urgent: Contact Elena Rostova regarding endodontic evaluation',
    patientName: 'Elena Rostova',
    enquiryId: 'ENQ-2024-005',
    taskType: 'Pending enquiry response',
    dueDate: 'Today, 1:00 PM',
    priority: 'Urgent Review',
    assignedStaff: 'Alex Morgan',
    status: 'due_today',
    notes: 'Patient reported throbbing pain; reserve buffer slot for evaluation.'
  }
];

export const INITIAL_WORKFLOWS: AutomationWorkflow[] = [
  {
    id: 'WF-01',
    name: 'New Enquiry Procedure Classification & Draft',
    description: 'Instantly classifies requested dental procedure and specialty, assigns staff, and prepares an approved personalized message draft.',
    trigger: 'New Enquiry Received (Web, Email)',
    condition: 'Enquiry unreviewed after 15 minutes',
    action: 'Classify procedure, create high-priority staff task & generate approved AI draft',
    status: 'active',
    staffApprovalRequired: true,
    messageTemplate: 'Approved Procedure-Specific Template (Orthodontic, Restorative & Cosmetic)',
    delayHours: 0.25,
    executionsCount: 142
  },
  {
    id: 'WF-02',
    name: 'Unbooked Specialty Lead Reminder Sequence',
    description: 'Detects enquiries with expressed treatment intent (e.g. Ortho, Implants, Cosmetic) where no clinic appointment was booked within 48 hours.',
    trigger: 'Enquiry Marked Interested / Consultation Request',
    condition: 'No booking recorded within 48 hours',
    action: 'Queue personalized specialty follow-up message draft for receptionist review',
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
    delayHours: 4080,
    executionsCount: 57
  }
];

// ==========================================
// INITIAL APPOINTMENTS (FEATURE 1: NO-SHOW)
// ==========================================
export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'APT-001',
    patientId: 'PAT-101',
    patientName: 'Sarah Thomas',
    date: 'Tomorrow',
    time: '10:30 AM',
    procedure: 'Root Canal Treatment (Tooth #19)',
    provider: 'Dr. Maya Lin',
    attendanceHistory: 'Sporadic past attendance (1 completed exam in 18 months)',
    cancellationHistory: '2 previous no-shows, 1 late cancellation (< 24h notice)',
    noShowProbability: 78,
    riskLevel: 'High Risk',
    riskFactors: [
      '2 previous unexcused no-shows in past 6 months',
      '1 previous late cancellation (< 24h notice)',
      'Invasive dental procedure (higher patient hesitation/anxiety)',
      'Mid-morning slot booked > 2 weeks in advance'
    ],
    status: 'Scheduled'
  },
  {
    id: 'APT-002',
    patientId: 'PAT-108',
    patientName: 'Marcus Vance',
    date: 'Tomorrow',
    time: '02:00 PM',
    procedure: 'Composite Filling Restoration',
    provider: 'Dr. Alex Morgan',
    attendanceHistory: 'Moderate consistency (2 visits in 12 months)',
    cancellationHistory: '1 previous late reschedule',
    noShowProbability: 54,
    riskLevel: 'Medium Risk',
    riskFactors: [
      '1 previous late reschedule (< 48h notice)',
      'Afternoon slot with moderate historical dropout'
    ],
    status: 'Scheduled'
  },
  {
    id: 'APT-003',
    patientId: 'PAT-110',
    patientName: 'Priya Kumar',
    date: 'Saturday',
    time: '10:30 AM',
    procedure: 'Routine Dental Cleaning & Exam',
    provider: 'Dr. Maya Lin',
    attendanceHistory: 'Excellent consistency (4 consecutive check-ups attended)',
    cancellationHistory: '0 previous cancellations or no-shows',
    noShowProbability: 12,
    riskLevel: 'Low Risk',
    riskFactors: [
      'Consistent past appointment attendance',
      'Confirmed attendance via SMS'
    ],
    status: 'Scheduled'
  },
  {
    id: 'APT-004',
    patientId: 'PAT-107',
    patientName: 'Rahul Menon',
    date: 'Friday',
    time: '03:00 PM',
    procedure: 'Crown Margin Evaluation',
    provider: 'Dr. Maya Lin',
    attendanceHistory: 'Lapsed patient returning for acute concern',
    cancellationHistory: '1 previous no-show 8 months ago',
    noShowProbability: 62,
    riskLevel: 'Medium Risk',
    riskFactors: [
      '1 previous missed appointment',
      'Long commute distance noted in intake file'
    ],
    status: 'Scheduled'
  },
  {
    id: 'APT-005',
    patientId: 'PAT-102',
    patientName: 'Daniel Mathew',
    date: 'Thursday',
    time: '11:00 AM',
    procedure: 'Implant Placement Consultation',
    provider: 'Dr. Alex Morgan',
    attendanceHistory: 'Irregular visits; postponed restorative stages twice',
    cancellationHistory: '2 previous late cancellations',
    noShowProbability: 72,
    riskLevel: 'High Risk',
    riskFactors: [
      '2 previous cancellations for surgical consultations',
      'High-complexity restorative procedure with noted dental anxiety'
    ],
    status: 'Scheduled'
  },
  {
    id: 'APT-006',
    patientId: 'PAT-103',
    patientName: 'Emily Joseph',
    date: 'Wednesday',
    time: '04:30 PM',
    procedure: 'Teeth Whitening In-Office Session',
    provider: 'Dr. Maya Lin',
    attendanceHistory: 'Active patient (wedding date deadline noted)',
    cancellationHistory: '0 cancellations; high motivation',
    noShowProbability: 15,
    riskLevel: 'Low Risk',
    riskFactors: [
      'Pre-paid cosmetic deposit recorded',
      'Confirmed via portal'
    ],
    status: 'Scheduled'
  }
];

// ==========================================
// INITIAL WAITLIST (FEATURE 1: AUTO-WAITLIST)
// ==========================================
export const INITIAL_WAITLIST: WaitlistEntry[] = [
  {
    id: 'WTL-001',
    patientId: 'PAT-120',
    patientName: 'Emily Johnson',
    procedure: 'Dental Cleaning & Hygiene',
    preferredDate: 'Today / Tomorrow',
    preferredTime: 'After 2:00 PM',
    acceptanceProbability: 94,
    providerPreference: 'Dr. Maya Lin',
    availability: 'Today after 2 PM',
    urgency: 'High',
    matchReason: 'Available today after 2 PM • Requested cleaning appointment • Same provider preference (Dr. Maya Lin)',
    status: 'Waiting'
  },
  {
    id: 'WTL-002',
    patientId: 'PAT-107',
    patientName: 'Rahul Menon',
    procedure: 'Root Canal Assessment',
    preferredDate: 'Tomorrow',
    preferredTime: 'Flexible',
    acceptanceProbability: 87,
    providerPreference: 'Dr. Maya Lin',
    availability: 'Flexible daytime',
    urgency: 'High',
    matchReason: 'Acute sensitivity reported • Requested same-week buffer • High proximity (5 mins from clinic)',
    status: 'Waiting'
  },
  {
    id: 'WTL-003',
    patientId: 'PAT-121',
    patientName: 'Ananya Thomas',
    procedure: 'Orthodontic Consultation',
    preferredDate: 'Tomorrow / Saturday',
    preferredTime: 'Morning (10 AM - 12 PM)',
    acceptanceProbability: 73,
    providerPreference: 'Any Provider',
    availability: 'Mornings before 12 PM',
    urgency: 'Medium',
    matchReason: 'Requested introductory aligner scan • Available during morning cancellations',
    status: 'Waiting'
  },
  {
    id: 'WTL-004',
    patientId: 'PAT-104',
    patientName: 'Arjun Nair',
    procedure: 'Preventive Hygiene Check',
    preferredDate: 'This Week',
    preferredTime: 'Late Afternoon',
    acceptanceProbability: 68,
    providerPreference: 'Dr. Alex Morgan',
    availability: 'Afternoons 3:00 - 5:00 PM',
    urgency: 'Standard',
    matchReason: 'Flexible routine cleaning standby list',
    status: 'Waiting'
  }
];

// ==========================================
// INITIAL HOUSEHOLDS (FEATURE 2: BUNDLING)
// ==========================================
export const INITIAL_HOUSEHOLDS: Household[] = [
  {
    householdId: 'HSH-001',
    householdName: 'Kumar Family',
    scheduledCount: 1,
    totalCount: 4,
    suggestedDate: 'Saturday, Sep 26',
    suggestedTime: '10:00 AM – 12:00 PM',
    schedulingEfficiency: '3 additional family appointments grouped • 1 shared commute',
    status: 'Opportunity Detected',
    members: [
      {
        memberId: 'PAT-109',
        name: 'Arun Kumar',
        relationship: 'Father',
        hasUpcomingAppointment: true,
        procedureNeeded: 'Dental Cleaning',
        suggestedTime: '10:00 AM',
        status: 'Scheduled'
      },
      {
        memberId: 'PAT-110',
        name: 'Priya Kumar',
        relationship: 'Mother',
        hasUpcomingAppointment: false,
        procedureNeeded: 'Dental Cleaning & Exam',
        suggestedTime: '10:30 AM',
        status: 'Suggested'
      },
      {
        memberId: 'PAT-111',
        name: 'Ayaan Kumar',
        relationship: 'Son (Age 9)',
        hasUpcomingAppointment: false,
        procedureNeeded: 'Pediatric Checkup',
        suggestedTime: '11:00 AM',
        status: 'Suggested'
      },
      {
        memberId: 'PAT-112',
        name: 'Diya Kumar',
        relationship: 'Daughter (Age 6)',
        hasUpcomingAppointment: false,
        procedureNeeded: 'Fluoride Treatment & Clean',
        suggestedTime: '11:30 AM',
        status: 'Suggested'
      }
    ]
  },
  {
    householdId: 'HSH-002',
    householdName: 'Patel Family',
    scheduledCount: 1,
    totalCount: 2,
    suggestedDate: 'Tuesday, Sep 22',
    suggestedTime: '02:00 PM – 03:15 PM',
    schedulingEfficiency: '1 additional appointment grouped • Consecutive chair booking',
    status: 'Opportunity Detected',
    members: [
      {
        memberId: 'PAT-115',
        name: 'Rajesh Patel',
        relationship: 'Husband',
        hasUpcomingAppointment: true,
        procedureNeeded: 'Crown Fitting Evaluation',
        suggestedTime: '02:00 PM',
        status: 'Scheduled'
      },
      {
        memberId: 'PAT-116',
        name: 'Sunita Patel',
        relationship: 'Wife',
        hasUpcomingAppointment: false,
        procedureNeeded: 'Periodontal Screening & Clean',
        suggestedTime: '02:45 PM',
        status: 'Suggested'
      }
    ]
  }
];

// ==========================================
// INITIAL TREATMENT PLANS (FEATURE 3: NUDGES)
// ==========================================
export const INITIAL_TREATMENT_PLANS: TreatmentPlan[] = [
  {
    id: 'TRP-001',
    patientId: 'PAT-107',
    patientName: 'Rahul Menon',
    procedure: 'Root Canal + Crown',
    value: 28000,
    currency: '₹',
    createdDate: '2026-09-13',
    daysPending: 6,
    status: 'Awaiting Acceptance',
    objectionCategory: 'Cost concern',
    recommendedApproach: 'Explain clinical value of preserving natural tooth and offer 0% interest installment plan.',
    sequenceStatus: 'Not Generated',
    nudgeSequence: []
  },
  {
    id: 'TRP-002',
    patientId: 'PAT-102',
    patientName: 'Daniel Mathew',
    procedure: 'Titanium Dental Implant',
    value: 45000,
    currency: '₹',
    createdDate: '2026-09-10',
    daysPending: 9,
    status: 'Awaiting Acceptance',
    objectionCategory: 'Fear/anxiety',
    recommendedApproach: 'Reassure patient on gentle anesthesia, minimal invasiveness, and comfortable procedure pacing.',
    sequenceStatus: 'Draft',
    nudgeSequence: []
  },
  {
    id: 'TRP-003',
    patientId: 'PAT-103',
    patientName: 'Emily Joseph',
    procedure: 'Porcelain Veneers (4 Units)',
    value: 36000,
    currency: '₹',
    createdDate: '2026-09-15',
    daysPending: 4,
    status: 'Awaiting Acceptance',
    objectionCategory: 'Needs more information',
    recommendedApproach: 'Provide diagnostic smile mock-up photos and ceramic shade warranty details.',
    sequenceStatus: 'Not Generated',
    nudgeSequence: []
  },
  {
    id: 'TRP-004',
    patientId: 'PAT-101',
    patientName: 'Sarah Thomas',
    procedure: 'Clear Aligners / Invisalign',
    value: 65000,
    currency: '₹',
    createdDate: '2026-09-08',
    daysPending: 11,
    status: 'Awaiting Acceptance',
    objectionCategory: 'Scheduling difficulty',
    recommendedApproach: 'Emphasize flexible remote aligner check-ins with fewer required in-clinic appointments.',
    sequenceStatus: 'Active',
    nudgeSequence: []
  }
];

// ==========================================
// INITIAL REVIEWS (FEATURE 4: REVIEW INBOX)
// ==========================================
export const INITIAL_REVIEWS: DentalReview[] = [
  {
    id: 'REV-001',
    platform: 'Google',
    reviewerName: 'Priya K.',
    rating: 5,
    date: 'Yesterday',
    sentiment: 'Positive',
    reviewText: 'The staff were very friendly and Dr. Maya explained everything clearly.',
    patientId: 'PAT-110',
    patientVisitContext: {
      patientName: 'Priya Kumar',
      recentProcedure: 'Dental Examination & Cleaning',
      provider: 'Dr. Maya Lin',
      appointmentDate: '2 days ago',
      visitCount: 4
    },
    approvalStatus: 'Pending Review'
  },
  {
    id: 'REV-002',
    platform: 'Google',
    reviewerName: 'Marcus Vance',
    rating: 2,
    date: '3 days ago',
    sentiment: 'Negative',
    reviewText: 'Waited 35 minutes past my appointment time without an update. Dental work itself was fine though.',
    patientId: 'PAT-108',
    patientVisitContext: {
      patientName: 'Marcus Vance',
      recentProcedure: 'Composite Filling',
      provider: 'Dr. Alex Morgan',
      appointmentDate: '3 days ago',
      visitCount: 2
    },
    approvalStatus: 'Pending Review'
  },
  {
    id: 'REV-003',
    platform: 'Yelp',
    reviewerName: 'Ananya T.',
    rating: 5,
    date: '5 days ago',
    sentiment: 'Positive',
    reviewText: 'Gentle cleaning and great team. Highly recommend Dr. Maya!',
    patientId: 'PAT-121',
    patientVisitContext: {
      patientName: 'Ananya Thomas',
      recentProcedure: 'Routine Cleaning',
      provider: 'Dr. Maya Lin',
      appointmentDate: '5 days ago',
      visitCount: 3
    },
    aiDraft: "Thank you so much, Ananya! We are thrilled to hear that your visit with Dr. Maya Lin was a positive and comfortable experience. Our entire team at BrightSmile Dental Studio appreciates your kind words and look forward to seeing you at your next routine check-up!",
    approvalStatus: 'Approved'
  },
  {
    id: 'REV-004',
    platform: 'Google',
    reviewerName: 'David Kim',
    rating: 4,
    date: '1 week ago',
    sentiment: 'Positive',
    reviewText: 'Good root canal care and clear explanations, but parking was tricky.',
    patientVisitContext: {
      provider: 'Dr. Maya Lin',
      recentProcedure: 'Endodontic Care'
    },
    approvalStatus: 'Pending Review'
  },
  {
    id: 'REV-005',
    platform: 'Yelp',
    reviewerName: 'Sophie L.',
    rating: 5,
    date: '2 weeks ago',
    sentiment: 'Positive',
    reviewText: 'My daughter loved her first pediatric visit! The team was so gentle and patient.',
    patientVisitContext: {
      provider: 'Dr. Alex Morgan',
      recentProcedure: 'Pediatric First Visit'
    },
    approvalStatus: 'Approved'
  }
];
