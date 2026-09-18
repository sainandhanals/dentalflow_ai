export type DentalSpecialty = 
  | 'General Dentistry'
  | 'Orthodontics'
  | 'Periodontics'
  | 'Endodontics'
  | 'Prosthodontics'
  | 'Oral & Maxillofacial Surgery'
  | 'Pediatric Dentistry'
  | 'Cosmetic Dentistry'
  | 'Implant Dentistry'
  | 'Needs Staff Review';

// Backward-compatible alias for existing references
export type ServiceType = DentalSpecialty;

export type EnquirySource = 'Website' | 'Email' | 'Phone' | 'Referral';

export type PriorityLevel = 'Urgent Review' | 'High' | 'Medium' | 'Low';

export type EnquiryStatus = 
  | 'New' 
  | 'Pending Review' 
  | 'Follow-up Required' 
  | 'Responded' 
  | 'Converted' 
  | 'Closed';

export interface Note {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface DetectedProcedureItem {
  id: string;
  procedure: string;
  specialty: DentalSpecialty;
  confidence: number;
}

export interface AIClassification {
  procedure: string; // Primary detected procedure
  specialty: DentalSpecialty; // Primary dental specialty
  detectedProcedures?: DetectedProcedureItem[]; // Multi-procedure breakdown
  intent: string;
  serviceCategory?: string;
  confidence: number;
  confidenceLevel: 'High' | 'Medium' | 'Low';
  suggestedAction: string;
  priorityReasoning: string;
  isConfirmedByStaff?: boolean;
}

export interface Enquiry {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  enquirySummary: string;
  fullMessage: string;
  service: DentalSpecialty;
  procedure?: string;
  specialty?: DentalSpecialty;
  source: EnquirySource;
  aiClassification: AIClassification;
  priority: PriorityLevel;
  status: EnquiryStatus;
  receivedAt: string;
  timestamp: string;
  assignedStaff: string;
  notes: Note[];
  lastDraft?: string;
  isReviewed?: boolean;
}

export type EngagementLevel = 'Active' | 'Moderate' | 'At Risk';

export interface Interaction {
  id: string;
  date: string;
  type: 'Email' | 'SMS' | 'Call' | 'In-Clinic' | 'Online Enquiry';
  title: string;
  note: string;
  staff: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastAppointment: string;
  nextAppointment: string;
  engagementScore: number;
  engagementLevel: EngagementLevel;
  preferredChannel: 'Email' | 'SMS' | 'Phone';
  lastInteraction: string;
  assignedStaff: string;
  interactions: Interaction[];
  notes: Note[];
}

export type FollowUpTaskType = 
  | 'Unbooked lead follow-up' 
  | 'Appointment reminder review' 
  | 'Post-appointment feedback request' 
  | 'Review communication draft' 
  | 'Pending enquiry response';

export type FollowUpStatus = 'due_today' | 'overdue' | 'scheduled' | 'completed';

export interface FollowUpTask {
  id: string;
  title: string;
  patientName: string;
  patientId?: string;
  enquiryId?: string;
  taskType: FollowUpTaskType;
  dueDate: string;
  priority: PriorityLevel;
  assignedStaff: string;
  status: FollowUpStatus;
  notes?: string;
}

export interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  trigger: string;
  condition: string;
  action: string;
  status: 'active' | 'paused';
  staffApprovalRequired: boolean;
  messageTemplate: string;
  delayHours: number;
  executionsCount: number;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

export interface ClinicSettings {
  clinicName: string;
  phone: string;
  email: string;
  operatingHours: string;
  requireStaffReview: boolean;
  aiAssistanceEnabled: boolean;
  inactivityThresholdDays: number;
  scoringWeightVisits: number;
  scoringWeightCommunication: number;
  demoMode: boolean;
}
