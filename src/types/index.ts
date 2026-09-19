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

// ==========================================
// FEATURE 1: NO-SHOW RISK & WAITLIST MODELS
// ==========================================
export type AppointmentRiskLevel = 
  | 'Low Risk' 
  | 'Medium Risk' 
  | 'High Risk' 
  | 'low' 
  | 'medium' 
  | 'high' 
  | 'Low' 
  | 'Medium' 
  | 'High';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone?: string;
  date: string;
  time: string;
  duration?: number;
  operatory?: string;
  procedure: string;
  provider: string;
  dentistName?: string;
  attendanceHistory: string;
  cancellationHistory: string;
  noShowProbability: number;
  noShowRiskScore?: number;
  leadTimeDays?: number;
  confirmationStatus?: 'confirmed' | 'unconfirmed' | 'pending' | string;
  riskLevel: AppointmentRiskLevel;
  riskFactors: string[];
  recommendedActions?: string[];
  status: 'Scheduled' | 'Cancelled' | 'Waitlist Filled' | 'Completed' | 'scheduled' | 'cancelled';
}

export interface WaitlistEntry {
  id: string;
  patientId: string;
  patientName: string;
  phone?: string;
  procedure: string;
  preferredDate: string;
  preferredTime: string;
  acceptanceProbability: number;
  matchScore?: number;
  distanceKm?: number;
  flexibleDays?: string[];
  matchReasons?: string[];
  providerPreference: string;
  availability: string;
  urgency: 'High' | 'Medium' | 'Standard' | 'urgent' | 'soon' | 'standard';
  matchReason: string;
  status: 'Waiting' | 'Offer Sent' | 'Accepted' | 'Declined' | 'scheduled' | 'offer_sent';
  offerSentAt?: string;
}

// ==========================================
// FEATURE 2: HOUSEHOLD BUNDLING MODELS
// ==========================================
export interface HouseholdMember {
  memberId: string;
  id?: string;
  name: string;
  relationship: string;
  age?: number;
  isPrimary?: boolean;
  hasUpcomingAppointment: boolean;
  procedureNeeded?: string;
  suggestedTime?: string;
  suggestedSlot?: string;
  assignedOperatory?: string;
  assignedDentist?: string;
  estimatedDurationMinutes?: number;
  status: 'Scheduled' | 'Suggested' | 'Booked' | 'Unscheduled' | 'ready' | 'confirmed';
}

export interface Household {
  householdId: string;
  id?: string;
  householdName: string;
  familyName?: string;
  primaryContactName?: string;
  primaryContactPhone?: string;
  address?: string;
  members: HouseholdMember[];
  scheduledCount: number;
  totalCount: number;
  suggestedDate: string;
  suggestedTime: string;
  schedulingEfficiency: string;
  bundleStatus?: 'pending_confirmation' | 'confirmed' | 'dismissed';
  status: 'Opportunity Detected' | 'Bundled' | 'Dismissed' | string;
}

// ==========================================
// FEATURE 3: TREATMENT PLAN NUDGE MODELS
// ==========================================
export type TreatmentPlanStatus = 
  | 'Draft' 
  | 'Presented' 
  | 'Awaiting Acceptance' 
  | 'Accepted' 
  | 'Declined' 
  | 'Scheduled'
  | 'pending_decision'
  | 'nudge_active'
  | 'accepted'
  | 'declined';

export type ObjectionCategory = 
  | 'Cost concern' 
  | 'Fear/anxiety' 
  | 'Treatment complexity' 
  | 'Scheduling difficulty' 
  | 'Needs more information' 
  | 'General follow-up'
  | 'cost_concern'
  | 'fear_anxiety'
  | 'time_constraint'
  | 'need_education';

export interface NudgeMessage {
  id?: string;
  stepNumber?: number;
  dayOffset?: number;
  day: number;
  stage: string;
  channel?: 'whatsapp' | 'sms' | 'email' | string;
  subject: string;
  body?: string;
  message: string;
  status: 'Draft' | 'Scheduled' | 'Sent' | 'sent' | 'queued';
}

export interface TreatmentPlan {
  id: string;
  patientId: string;
  patientName: string;
  procedure: string;
  procedureName?: string;
  toothNumber?: string;
  diagnosisDate?: string;
  value: number;
  estimatedCost?: number;
  currency: string;
  createdDate: string;
  daysPending: number;
  status: TreatmentPlanStatus;
  objectionCategory: ObjectionCategory;
  objectionNotes?: string;
  recommendedStrategy?: string;
  recommendedApproach: string;
  nudgeSequence: NudgeMessage[];
  sequenceStatus: 'Not Generated' | 'Draft' | 'Active' | 'Paused' | 'Completed' | string;
}

// ==========================================
// FEATURE 4: AI REVIEW-RESPONSE MODELS
// ==========================================
export type ReviewPlatform = 'Google' | 'Yelp' | 'Healthgrades' | 'google' | 'yelp' | 'practo' | 'facebook';

export type ReviewSentiment = 'Positive' | 'Neutral' | 'Negative' | 'positive' | 'neutral' | 'negative';

export interface PatientVisitContext {
  patientId?: string;
  patientName?: string;
  recentProcedure?: string;
  procedure?: string;
  provider?: string;
  dentist?: string;
  appointmentDate?: string;
  visitDate?: string;
  visitCount?: number;
}

export interface DentalReview {
  id: string;
  platform: ReviewPlatform;
  reviewerName: string;
  authorName?: string;
  rating: number;
  reviewText: string;
  date: string;
  reviewDate?: string;
  sentiment: ReviewSentiment;
  patientId?: string;
  patientVisitContext?: PatientVisitContext;
  matchedVisit?: PatientVisitContext;
  aiDraft?: string;
  aiDraftResponse?: string;
  responseStatus?: 'draft_ready' | 'approved' | string;
  approvalStatus: 'Pending Review' | 'Approved' | 'Published (Simulated)' | 'Edited' | string;
}

export type AIOperationTab = 'no-show' | 'waitlist' | 'households' | 'treatment-plans' | 'reviews';
