import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Enquiry, 
  Patient, 
  FollowUpTask, 
  AutomationWorkflow, 
  ClinicSettings, 
  ToastNotification,
  EnquiryStatus,
  FollowUpStatus,
  DentalSpecialty,
  Appointment,
  WaitlistEntry,
  Household,
  HouseholdMember,
  TreatmentPlan,
  ObjectionCategory,
  DentalReview
} from '../types';
import { 
  INITIAL_ENQUIRIES, 
  INITIAL_PATIENTS, 
  INITIAL_FOLLOW_UPS, 
  INITIAL_WORKFLOWS, 
  INITIAL_SETTINGS,
  INITIAL_APPOINTMENTS,
  INITIAL_WAITLIST,
  INITIAL_HOUSEHOLDS,
  INITIAL_TREATMENT_PLANS,
  INITIAL_REVIEWS
} from '../data/mockData';
import { classifyEnquiry } from '../services/classificationService';
import { calculateNoShowRisk } from '../services/noShowPredictionService';
import { rankWaitlistCandidates } from '../services/waitlistMatchingService';
import { generateTreatmentNudgeSequence } from '../services/treatmentNudgeService';
import { generateReviewResponseDraft } from '../services/reviewResponseService';
import { dentalApi } from '../services/api/dentalApi';

export type PageId = 
  | 'dashboard' 
  | 'enquiries' 
  | 'patients' 
  | 'followups' 
  | 'workflows' 
  | 'analytics' 
  | 'settings'
  | 'ai-operations';

export type AIOperationTab = 'no-show' | 'waitlist' | 'households' | 'treatment-plans' | 'reviews';

interface AIAssistantState {
  isOpen: boolean;
  enquiry?: Enquiry;
  patient?: Patient;
  procedure?: string;
  specialty?: string;
  objective?: string;
  tone?: 'Professional' | 'Friendly' | 'Concise';
}

interface DentalFlowContextType {
  activePage: PageId;
  setActivePage: (page: PageId) => void;
  dateRange: 'today' | '7days' | '30days';
  setDateRange: (range: 'today' | '7days' | '30days') => void;

  // Enquiries
  enquiries: Enquiry[];
  selectedEnquiry: Enquiry | null;
  setSelectedEnquiry: (enquiry: Enquiry | null) => void;
  selectedSpecialtyFilter: string;
  setSelectedSpecialtyFilter: (specialty: string) => void;
  navigateToEnquiriesWithSpecialty: (specialty: string) => void;
  createFollowUpForEnquiry: (enquiry: Enquiry, customTitle?: string) => void;
  addEnquiry: (enquiry: Partial<Enquiry>) => void;
  updateEnquiryStatus: (id: string, status: EnquiryStatus) => void;
  assignEnquiryStaff: (id: string, staff: string) => void;
  addEnquiryNote: (id: string, text: string) => void;
  markEnquiryReviewed: (id: string) => void;
  markEnquiryConverted: (id: string) => void;
  saveEnquiryDraft: (id: string, draft: string) => void;
  confirmEnquiryClassification: (id: string) => void;
  updateEnquiryClassification: (id: string, updated: { procedure: string; specialty: DentalSpecialty; intent?: string }) => void;

  // Patients
  patients: Patient[];
  selectedPatient: Patient | null;
  setSelectedPatient: (patient: Patient | null) => void;
  addPatient: (patient: Partial<Patient>) => void;
  addPatientNote: (id: string, text: string) => void;

  // Follow-ups
  followUps: FollowUpTask[];
  addFollowUp: (task: Omit<FollowUpTask, 'id'>) => void;
  updateFollowUpStatus: (id: string, status: FollowUpStatus) => void;
  snoozeFollowUp: (id: string, days: number) => void;
  reassignFollowUp: (id: string, staff: string) => void;

  // Workflows
  workflows: AutomationWorkflow[];
  toggleWorkflow: (id: string) => void;
  addWorkflow: (wf: Omit<AutomationWorkflow, 'id' | 'executionsCount'>) => void;

  // Settings
  settings: ClinicSettings;
  updateSettings: (newSettings: Partial<ClinicSettings>) => void;

  // AI Operations Page & Navigation
  activeOperationTab: AIOperationTab;
  setActiveOperationTab: (tab: AIOperationTab) => void;
  activeAIOperationTab: AIOperationTab;
  setActiveAIOperationTab: (tab: AIOperationTab) => void;
  navigateToAIOperation: (tab: AIOperationTab) => void;

  // Feature 1: Appointments & No-Show
  appointments: Appointment[];
  selectedAppointment: Appointment | null;
  setSelectedAppointment: (apt: Appointment | null) => void;
  simulateAppointmentCancellation: (appointmentId: string) => void;
  isAppointmentDetailModalOpen: boolean;
  setIsAppointmentDetailModalOpen: (open: boolean) => void;

  // Feature 1: Waitlist
  waitlist: WaitlistEntry[];
  selectedWaitlistEntry: WaitlistEntry | null;
  setSelectedWaitlistEntry: (w: WaitlistEntry | null) => void;
  sendWaitlistOffer: (entryOrId: WaitlistEntry | string, appointment?: Appointment) => void;
  autoFillWaitlist: (appointmentOrId?: Appointment | string, candidateId?: string) => void;
  isWaitlistOfferModalOpen: boolean;
  setIsWaitlistOfferModalOpen: (open: boolean) => void;

  // Feature 2: Household Bundling
  households: Household[];
  selectedHousehold: Household | null;
  setSelectedHousehold: (h: Household | null) => void;
  confirmHouseholdBundle: (householdId: string, updatedMembers?: HouseholdMember[]) => void;
  isHouseholdBundleModalOpen: boolean;
  setIsHouseholdBundleModalOpen: (open: boolean) => void;

  // Feature 3: Treatment Plan Nudges
  treatmentPlans: TreatmentPlan[];
  selectedTreatmentPlan: TreatmentPlan | null;
  setSelectedTreatmentPlan: (tp: TreatmentPlan | null) => void;
  generateNudgeSequenceForPlan: (planId: string, customObjection?: ObjectionCategory) => void;
  approveNudgeSequence: (planId: string) => void;
  pauseNudgeSequence: (planId: string) => void;
  isTreatmentPlanModalOpen: boolean;
  setIsTreatmentPlanModalOpen: (open: boolean) => void;

  // Feature 4: Review Inbox
  reviews: DentalReview[];
  selectedReview: DentalReview | null;
  setSelectedReview: (r: DentalReview | null) => void;
  generateReviewDraftForReview: (reviewId: string, variation?: number) => void;
  approveReviewDraft: (reviewId: string, editedText?: string) => void;
  updateReviewDraftText: (reviewId: string, text: string) => void;
  isReviewResponseModalOpen: boolean;
  setIsReviewResponseModalOpen: (open: boolean) => void;

  // Modals
  isNewEnquiryModalOpen: boolean;
  setIsNewEnquiryModalOpen: (open: boolean) => void;
  isNewFollowUpModalOpen: boolean;
  setIsNewFollowUpModalOpen: (open: boolean) => void;
  isNewWorkflowModalOpen: boolean;
  setIsNewWorkflowModalOpen: (open: boolean) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  
  // AI Assistant Modal
  aiAssistantState: AIAssistantState;
  openAIAssistant: (params: Omit<AIAssistantState, 'isOpen'>) => void;
  closeAIAssistant: () => void;

  // Toasts
  toasts: ToastNotification[];
  addToast: (toast: Omit<ToastNotification, 'id'>) => void;
  removeToast: (id: string) => void;

  // Backend Live Status
  isBackendLive: boolean;
  isSyncing: boolean;
  checkBackendConnection: () => Promise<void>;

  // Analytics Overview Data
  overviewMetrics: any | null;
  refreshAnalytics: () => Promise<void>;

  // Utilities
  resetDemoData: () => void;
}

const DentalFlowContext = createContext<DentalFlowContextType | undefined>(undefined);

export const DentalFlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<PageId>('dashboard');
  const [dateRange, setDateRange] = useState<'today' | '7days' | '30days'>('7days');

  // Load or fallback to mock data
  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => {
    const saved = localStorage.getItem('dentalflow_enquiries_v2');
    return saved ? JSON.parse(saved) : INITIAL_ENQUIRIES;
  });

  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('dentalflow_patients');
    return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
  });

  const [followUps, setFollowUps] = useState<FollowUpTask[]>(() => {
    const saved = localStorage.getItem('dentalflow_followups');
    return saved ? JSON.parse(saved) : INITIAL_FOLLOW_UPS;
  });

  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>(() => {
    const saved = localStorage.getItem('dentalflow_workflows');
    return saved ? JSON.parse(saved) : INITIAL_WORKFLOWS;
  });

  const [settings, setSettings] = useState<ClinicSettings>(() => {
    const saved = localStorage.getItem('dentalflow_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedSpecialtyFilter, setSelectedSpecialtyFilter] = useState<string>('All');

  // AI Operations Tab State
  const [activeOperationTab, setActiveOperationTab] = useState<AIOperationTab>('no-show');

  // Operations Data States
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('dentalflow_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>(() => {
    const saved = localStorage.getItem('dentalflow_waitlist');
    return saved ? JSON.parse(saved) : INITIAL_WAITLIST;
  });

  const [households, setHouseholds] = useState<Household[]>(() => {
    const saved = localStorage.getItem('dentalflow_households');
    return saved ? JSON.parse(saved) : INITIAL_HOUSEHOLDS;
  });

  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlan[]>(() => {
    const saved = localStorage.getItem('dentalflow_treatment_plans');
    return saved ? JSON.parse(saved) : INITIAL_TREATMENT_PLANS;
  });

  const [reviews, setReviews] = useState<DentalReview[]>(() => {
    const saved = localStorage.getItem('dentalflow_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  // Selected Entities
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedWaitlistEntry, setSelectedWaitlistEntry] = useState<WaitlistEntry | null>(null);
  const [selectedHousehold, setSelectedHousehold] = useState<Household | null>(null);
  const [selectedTreatmentPlan, setSelectedTreatmentPlan] = useState<TreatmentPlan | null>(null);
  const [selectedReview, setSelectedReview] = useState<DentalReview | null>(null);

  // Operations Modals
  const [isAppointmentDetailModalOpen, setIsAppointmentDetailModalOpen] = useState(false);
  const [isWaitlistOfferModalOpen, setIsWaitlistOfferModalOpen] = useState(false);
  const [isHouseholdBundleModalOpen, setIsHouseholdBundleModalOpen] = useState(false);
  const [isTreatmentPlanModalOpen, setIsTreatmentPlanModalOpen] = useState(false);
  const [isReviewResponseModalOpen, setIsReviewResponseModalOpen] = useState(false);

  // Modals state
  const [isNewEnquiryModalOpen, setIsNewEnquiryModalOpen] = useState(false);
  const [isNewFollowUpModalOpen, setIsNewFollowUpModalOpen] = useState(false);
  const [isNewWorkflowModalOpen, setIsNewWorkflowModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // AI Assistant state
  const [aiAssistantState, setAiAssistantState] = useState<AIAssistantState>({ isOpen: false });

  // Toasts
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Backend connection & sync status
  const [isBackendLive, setIsBackendLive] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [overviewMetrics, setOverviewMetrics] = useState<any | null>(null);

  const refreshAnalytics = async () => {
    try {
      const res = await dentalApi.getAnalyticsOverview();
      if (res.success && res.data) {
        setOverviewMetrics(res.data);
      }
    } catch (err) {
      console.warn('Analytics refresh warning:', err);
    }
  };

  const checkBackendConnection = async () => {
    setIsSyncing(true);
    try {
      const health = await dentalApi.checkHealth();
      if (health.success) {
        setIsBackendLive(true);
        const [
          enquiriesRes,
          patientsRes,
          appointmentsRes,
          followUpsRes,
          waitlistRes,
          householdsRes,
          treatmentPlansRes,
          reviewsRes,
          workflowsRes,
          settingsRes,
          analyticsRes,
        ] = await Promise.all([
          dentalApi.getEnquiries(),
          dentalApi.getPatients(),
          dentalApi.getAppointments(),
          dentalApi.getFollowUps(),
          dentalApi.getWaitlist(),
          dentalApi.getHouseholds(),
          dentalApi.getTreatmentPlans(),
          dentalApi.getReviews(),
          dentalApi.getWorkflows(),
          dentalApi.getSettings(),
          dentalApi.getAnalyticsOverview(),
        ]);

        if (enquiriesRes.success && enquiriesRes.data) setEnquiries(enquiriesRes.data);
        if (patientsRes.success && patientsRes.data) setPatients(patientsRes.data);
        if (appointmentsRes.success && appointmentsRes.data) setAppointments(appointmentsRes.data);
        if (followUpsRes.success && followUpsRes.data) setFollowUps(followUpsRes.data);
        if (waitlistRes.success && waitlistRes.data) setWaitlist(waitlistRes.data);
        if (householdsRes.success && householdsRes.data) setHouseholds(householdsRes.data);
        if (treatmentPlansRes.success && treatmentPlansRes.data) setTreatmentPlans(treatmentPlansRes.data);
        if (reviewsRes.success && reviewsRes.data) setReviews(reviewsRes.data);
        if (workflowsRes.success && workflowsRes.data) setWorkflows(workflowsRes.data);
        if (settingsRes.success && settingsRes.data) setSettings(settingsRes.data);
        if (analyticsRes.success && analyticsRes.data) setOverviewMetrics(analyticsRes.data);

        addToast({
          type: 'success',
          title: 'Connected to Live Server',
          message: 'Synchronized live records from Express & SQLite database.',
        });
      } else {
        setIsBackendLive(false);
      }
    } catch {
      setIsBackendLive(false);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    checkBackendConnection();
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('dentalflow_enquiries_v2', JSON.stringify(enquiries));
  }, [enquiries]);

  useEffect(() => {
    localStorage.setItem('dentalflow_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('dentalflow_followups', JSON.stringify(followUps));
  }, [followUps]);

  useEffect(() => {
    localStorage.setItem('dentalflow_workflows', JSON.stringify(workflows));
  }, [workflows]);

  useEffect(() => {
    localStorage.setItem('dentalflow_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('dentalflow_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('dentalflow_waitlist', JSON.stringify(waitlist));
  }, [waitlist]);

  useEffect(() => {
    localStorage.setItem('dentalflow_households', JSON.stringify(households));
  }, [households]);

  useEffect(() => {
    localStorage.setItem('dentalflow_treatment_plans', JSON.stringify(treatmentPlans));
  }, [treatmentPlans]);

  useEffect(() => {
    localStorage.setItem('dentalflow_reviews', JSON.stringify(reviews));
  }, [reviews]);

  const addToast = (toast: Omit<ToastNotification, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Enquiries operations
  const addEnquiry = async (enquiryData: Partial<Enquiry>) => {
    if (isBackendLive) {
      try {
        const res = await dentalApi.createEnquiry(enquiryData);
        if (res.success && res.data) {
          setEnquiries((prev) => [res.data!, ...prev]);
          refreshAnalytics();
          addToast({
            type: 'success',
            title: 'Enquiry Added & Classified (Backend Live)',
            message: `Detected: ${res.data.aiClassification?.procedure} (${res.data.aiClassification?.specialty}). Saved to SQLite database.`,
          });
          return;
        }
      } catch (err) {
        console.warn('Backend enquiry creation failed, using local fallback:', err);
      }
    }

    const newId = `ENQ-2024-${String(enquiries.length + 1).padStart(3, '0')}`;
    
    // Run automated classification service if not explicitly supplied
    const autoClass = enquiryData.aiClassification || classifyEnquiry(enquiryData.fullMessage || enquiryData.enquirySummary || '');
    const determinedProcedure = enquiryData.procedure || autoClass.procedure;
    const determinedSpecialty = (enquiryData.specialty || autoClass.specialty || 'General Dentistry') as DentalSpecialty;

    const newEnquiry: Enquiry = {
      id: newId,
      patientName: enquiryData.patientName || 'New Enquirer',
      patientEmail: enquiryData.patientEmail || 'patient@demo.example',
      patientPhone: enquiryData.patientPhone || '+1 (555) 000-0000',
      enquirySummary: enquiryData.enquirySummary || `Consultation request for ${determinedProcedure}`,
      fullMessage: enquiryData.fullMessage || `Patient contacted clinic inquiring about ${determinedProcedure} services and scheduling.`,
      service: determinedSpecialty,
      procedure: determinedProcedure,
      specialty: determinedSpecialty,
      source: enquiryData.source || 'Website',
      aiClassification: {
        ...autoClass,
        procedure: determinedProcedure,
        specialty: determinedSpecialty,
      },
      priority: enquiryData.priority || (autoClass.intent.includes('Urgent') ? 'Urgent Review' : 'High'),
      status: 'New',
      receivedAt: 'Just now',
      timestamp: new Date().toISOString(),
      assignedStaff: enquiryData.assignedStaff || 'Alex Morgan',
      isReviewed: false,
      notes: [
        {
          id: `note-${Date.now()}`,
          author: 'System',
          text: `Enquiry ingested. Auto-detected procedure: "${determinedProcedure}" under ${determinedSpecialty} (${autoClass.confidence}% confidence).`,
          createdAt: 'Just now'
        }
      ]
    };

    setEnquiries((prev) => [newEnquiry, ...prev]);
    addToast({
      type: 'success',
      title: 'Enquiry Added & Classified',
      message: `Detected: ${determinedProcedure} (${determinedSpecialty}).`
    });
  };

  const updateEnquiryStatus = (id: string, status: EnquiryStatus) => {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status, isReviewed: true } : e))
    );
    if (selectedEnquiry && selectedEnquiry.id === id) {
      setSelectedEnquiry((prev) => (prev ? { ...prev, status, isReviewed: true } : null));
    }
    if (isBackendLive) {
      dentalApi.updateEnquiry(id, { status, isReviewed: true }).catch((err) => console.warn('API sync warning:', err));
    }
    addToast({
      type: 'info',
      title: 'Status Updated',
      message: `Enquiry status changed to "${status}".`
    });
  };

  const assignEnquiryStaff = (id: string, staff: string) => {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, assignedStaff: staff } : e))
    );
    if (selectedEnquiry && selectedEnquiry.id === id) {
      setSelectedEnquiry((prev) => (prev ? { ...prev, assignedStaff: staff } : null));
    }
    if (isBackendLive) {
      dentalApi.updateEnquiry(id, { assignedStaff: staff }).catch((err) => console.warn('API sync warning:', err));
    }
    addToast({
      type: 'info',
      title: 'Staff Assigned',
      message: `Assigned to ${staff}.`
    });
  };

  const addEnquiryNote = (id: string, text: string) => {
    const newNote = {
      id: `n-${Date.now()}`,
      author: 'Alex Morgan',
      text,
      createdAt: 'Just now'
    };
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, notes: [newNote, ...e.notes] } : e))
    );
    if (selectedEnquiry && selectedEnquiry.id === id) {
      setSelectedEnquiry((prev) =>
        prev ? { ...prev, notes: [newNote, ...prev.notes] } : null
      );
    }
    if (isBackendLive) {
      dentalApi.addEnquiryNote(id, 'Alex Morgan', text).catch((err) => console.warn('API sync warning:', err));
    }
    addToast({
      type: 'success',
      title: 'Note Added',
      message: 'Staff note saved successfully.'
    });
  };

  const markEnquiryReviewed = (id: string) => {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isReviewed: true, status: e.status === 'New' ? 'Pending Review' : e.status } : e))
    );
    if (selectedEnquiry && selectedEnquiry.id === id) {
      setSelectedEnquiry((prev) =>
        prev ? { ...prev, isReviewed: true, status: prev.status === 'New' ? 'Pending Review' : prev.status } : null
      );
    }
    addToast({
      type: 'success',
      title: 'Marked as Reviewed',
      message: 'Staff review acknowledged.'
    });
  };

  const navigateToEnquiriesWithSpecialty = (specialty: string) => {
    setSelectedSpecialtyFilter(specialty);
    setActivePage('enquiries');
  };

  const createFollowUpForEnquiry = (enquiry: Enquiry, customTitle?: string) => {
    const procedure = enquiry.aiClassification?.procedure || enquiry.procedure || 'Consultation';
    const specialty = enquiry.aiClassification?.specialty || enquiry.specialty || 'General Dentistry';
    const title = customTitle || `Follow-up: ${procedure} (${specialty})`;
    const newId = `TSK-${String(followUps.length + 1).padStart(3, '0')}`;
    const newTask: FollowUpTask = {
      id: newId,
      title,
      patientName: enquiry.patientName,
      enquiryId: enquiry.id,
      taskType: enquiry.priority === 'Urgent Review' ? 'Pending enquiry response' : 'Unbooked lead follow-up',
      dueDate: enquiry.priority === 'Urgent Review' ? 'Today (2h emergency buffer)' : 'Tomorrow by 10:00 AM',
      priority: enquiry.priority,
      assignedStaff: enquiry.assignedStaff,
      status: 'due_today',
      notes: `Generated from enquiry ${enquiry.id}. Target service: "${procedure}" under ${specialty}. ${enquiry.lastDraft ? 'AI communication draft attached.' : ''}`,
    };
    setFollowUps((prev) => [newTask, ...prev]);
    if (enquiry.status === 'New') {
      updateEnquiryStatus(enquiry.id, 'Pending Review');
    }
    addToast({
      type: 'success',
      title: 'Follow-up Task Scheduled',
      message: `Task queued for ${enquiry.assignedStaff} regarding ${procedure}.`
    });
  };

  const markEnquiryConverted = (id: string) => {
    const targetEnquiry = enquiries.find(e => e.id === id) || (selectedEnquiry?.id === id ? selectedEnquiry : null);

    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'Converted', isReviewed: true } : e))
    );
    if (selectedEnquiry && selectedEnquiry.id === id) {
      setSelectedEnquiry((prev) =>
        prev ? { ...prev, status: 'Converted', isReviewed: true } : null
      );
    }

    if (targetEnquiry) {
      const existingPatient = patients.find(
        p => p.name.toLowerCase() === targetEnquiry.patientName.toLowerCase() || 
             p.email.toLowerCase() === targetEnquiry.patientEmail.toLowerCase()
      );
      if (!existingPatient) {
        const newPatientId = `PAT-${100 + patients.length + 1}`;
        const newPatient: Patient = {
          id: newPatientId,
          name: targetEnquiry.patientName,
          email: targetEnquiry.patientEmail,
          phone: targetEnquiry.patientPhone,
          lastAppointment: 'Introductory Consultation (Booked)',
          nextAppointment: 'Upcoming in 3 days',
          engagementScore: 92,
          engagementLevel: 'Active',
          preferredChannel: targetEnquiry.source === 'Phone' ? 'Phone' : 'Email',
          lastInteraction: 'Just now (Converted from Enquiry)',
          assignedStaff: targetEnquiry.assignedStaff,
          interactions: [
            {
              id: `int-${Date.now()}`,
              date: new Date().toISOString().replace('T', ' ').substring(0, 16),
              type: targetEnquiry.source === 'Website' ? 'Online Enquiry' : (targetEnquiry.source as any),
              title: `Converted lead for ${targetEnquiry.aiClassification?.procedure || targetEnquiry.procedure || 'Consultation'}`,
              note: `Patient converted from enquiry ${targetEnquiry.id} (${targetEnquiry.aiClassification?.specialty || targetEnquiry.specialty}). Introductory appointment booked.`,
              staff: targetEnquiry.assignedStaff
            }
          ],
          notes: [
            {
              id: `pn-${Date.now()}`,
              author: 'System',
              text: `Converted from enquiry ${targetEnquiry.id}. Target procedure: ${targetEnquiry.aiClassification?.procedure || targetEnquiry.procedure}.`,
              createdAt: 'Just now'
            }
          ]
        };
        setPatients(prev => [newPatient, ...prev]);
      }
    }

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }

    addToast({
      type: 'success',
      title: 'Lead Converted! 🎉',
      message: 'Enquiry converted & patient profile linked in practice directory.'
    });
  };

  const saveEnquiryDraft = (id: string, draft: string) => {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, lastDraft: draft } : e))
    );
    if (selectedEnquiry && selectedEnquiry.id === id) {
      setSelectedEnquiry((prev) => (prev ? { ...prev, lastDraft: draft } : null));
    }
    addToast({
      type: 'success',
      title: 'Draft Saved',
      message: 'AI communication draft saved and logged for staff review.'
    });
  };

  // Confirm administrative classification
  const confirmEnquiryClassification = (id: string) => {
    setEnquiries((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          const updatedAi = { ...e.aiClassification, isConfirmedByStaff: true };
          return { ...e, aiClassification: updatedAi, isReviewed: true };
        }
        return e;
      })
    );
    if (selectedEnquiry && selectedEnquiry.id === id) {
      setSelectedEnquiry((prev) =>
        prev
          ? {
              ...prev,
              aiClassification: { ...prev.aiClassification, isConfirmedByStaff: true },
              isReviewed: true,
            }
          : null
      );
    }
    addToast({
      type: 'success',
      title: 'Classification Confirmed',
      message: 'Staff confirmed procedure and specialty categorization.',
    });
  };

  // Manually edit procedure and specialty
  const updateEnquiryClassification = (
    id: string,
    updated: { procedure: string; specialty: DentalSpecialty; intent?: string }
  ) => {
    setEnquiries((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          const updatedAi = {
            ...e.aiClassification,
            procedure: updated.procedure,
            specialty: updated.specialty,
            serviceCategory: updated.specialty,
            intent: updated.intent || e.aiClassification.intent,
            isConfirmedByStaff: true,
          };
          return {
            ...e,
            procedure: updated.procedure,
            specialty: updated.specialty,
            service: updated.specialty,
            aiClassification: updatedAi,
            isReviewed: true,
          };
        }
        return e;
      })
    );
    if (selectedEnquiry && selectedEnquiry.id === id) {
      setSelectedEnquiry((prev) =>
        prev
          ? {
              ...prev,
              procedure: updated.procedure,
              specialty: updated.specialty,
              service: updated.specialty,
              aiClassification: {
                ...prev.aiClassification,
                procedure: updated.procedure,
                specialty: updated.specialty,
                serviceCategory: updated.specialty,
                intent: updated.intent || prev.aiClassification.intent,
                isConfirmedByStaff: true,
              },
              isReviewed: true,
            }
          : null
      );
    }
    addToast({
      type: 'success',
      title: 'Classification Updated',
      message: `Categorized as ${updated.specialty} (${updated.procedure}).`,
    });
  };

  // Patients operations
  const addPatient = async (patientData: Partial<Patient>) => {
    if (isBackendLive) {
      try {
        const res = await dentalApi.createPatient(patientData);
        if (res.success && res.data) {
          setPatients((prev) => [res.data!, ...prev]);
          refreshAnalytics();
          addToast({
            type: 'success',
            title: 'Patient Profile Created (Backend Live)',
            message: `Profile for ${res.data.name} saved to SQLite database.`,
          });
          return;
        }
      } catch (err) {
        console.warn('Backend patient creation failed, using local fallback:', err);
      }
    }

    const newId = `PAT-${100 + patients.length + 1}`;
    const newPatient: Patient = {
      id: newId,
      name: patientData.name || 'New Patient',
      email: patientData.email || 'patient@demo.example',
      phone: patientData.phone || '+1 (555) 000-0000',
      lastAppointment: 'None (Prospective Lead)',
      nextAppointment: 'None scheduled',
      engagementScore: 75,
      engagementLevel: 'Active',
      preferredChannel: patientData.preferredChannel || 'Email',
      lastInteraction: 'Just now (Added by staff)',
      assignedStaff: patientData.assignedStaff || 'Alex Morgan',
      interactions: [
        {
          id: `int-${Date.now()}`,
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          type: 'Online Enquiry',
          title: 'Patient profile registered in DentalFlow AI',
          note: 'Initial engagement tracking activated.',
          staff: 'Alex Morgan'
        }
      ],
      notes: []
    };
    setPatients((prev) => [newPatient, ...prev]);
    addToast({
      type: 'success',
      title: 'Patient Added',
      message: `Profile for ${newPatient.name} created.`
    });
  };

  const addPatientNote = (id: string, text: string) => {
    const newNote = {
      id: `pn-${Date.now()}`,
      author: 'Alex Morgan',
      text,
      createdAt: 'Just now'
    };
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, notes: [newNote, ...p.notes] } : p))
    );
    if (selectedPatient && selectedPatient.id === id) {
      setSelectedPatient((prev) =>
        prev ? { ...prev, notes: [newNote, ...prev.notes] } : null
      );
    }
    if (isBackendLive) {
      dentalApi.addPatientNote(id, 'Alex Morgan', text).catch((err) => console.warn('API sync warning:', err));
    }
    addToast({
      type: 'success',
      title: 'Note Added',
      message: 'Patient profile note saved.'
    });
  };

  // Follow-ups operations
  const addFollowUp = async (taskData: Omit<FollowUpTask, 'id'>) => {
    if (isBackendLive) {
      try {
        const res = await dentalApi.createFollowUp(taskData);
        if (res.success && res.data) {
          setFollowUps((prev) => [res.data!, ...prev]);
          refreshAnalytics();
          addToast({
            type: 'success',
            title: 'Follow-up Task Created (Backend Live)',
            message: `Task assigned to ${res.data.assignedStaff}. Saved to SQLite database.`,
          });
          return;
        }
      } catch (err) {
        console.warn('Backend follow-up creation failed, using local fallback:', err);
      }
    }

    const newId = `TSK-${String(followUps.length + 1).padStart(3, '0')}`;
    const newTask: FollowUpTask = {
      ...taskData,
      id: newId,
    };
    setFollowUps((prev) => [newTask, ...prev]);
    addToast({
      type: 'success',
      title: 'Follow-up Task Created',
      message: `Task assigned to ${newTask.assignedStaff}.`
    });
  };

  const updateFollowUpStatus = (id: string, status: FollowUpStatus) => {
    setFollowUps((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
    if (isBackendLive) {
      if (status === 'completed') {
        dentalApi.completeFollowUp(id).catch((err) => console.warn('API sync warning:', err));
      } else {
        dentalApi.updateFollowUp(id, { status }).catch((err) => console.warn('API sync warning:', err));
      }
    }
    addToast({
      type: 'info',
      title: status === 'completed' ? 'Task Completed ✅' : 'Task Updated',
      message: status === 'completed' ? 'Follow-up task marked as complete.' : `Status updated to ${status}.`
    });
  };

  const snoozeFollowUp = (id: string, days: number) => {
    setFollowUps((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'scheduled', dueDate: `In ${days} days` } : t))
    );
    if (isBackendLive) {
      dentalApi.updateFollowUp(id, { status: 'scheduled', dueDate: `In ${days} days` }).catch((err) => console.warn('API sync warning:', err));
    }
    addToast({
      type: 'info',
      title: 'Task Snoozed',
      message: `Follow-up postponed by ${days} day(s).`
    });
  };

  const reassignFollowUp = (id: string, staff: string) => {
    setFollowUps((prev) =>
      prev.map((t) => (t.id === id ? { ...t, assignedStaff: staff } : t))
    );
    if (isBackendLive) {
      dentalApi.updateFollowUp(id, { assignedStaff: staff }).catch((err) => console.warn('API sync warning:', err));
    }
    addToast({
      type: 'info',
      title: 'Task Reassigned',
      message: `Reassigned to ${staff}.`
    });
  };

  // Workflows operations
  const toggleWorkflow = (id: string) => {
    setWorkflows((prev) =>
      prev.map((wf) => {
        if (wf.id === id) {
          const newStatus = wf.status === 'active' ? 'paused' : 'active';
          addToast({
            type: newStatus === 'active' ? 'success' : 'warning',
            title: `Workflow ${newStatus === 'active' ? 'Activated' : 'Paused'}`,
            message: `"${wf.name}" is now ${newStatus}.`
          });
          return { ...wf, status: newStatus };
        }
        return wf;
      })
    );
    if (isBackendLive) {
      dentalApi.toggleWorkflow(id).catch((err) => console.warn('API sync warning:', err));
    }
  };

  const addWorkflow = (wfData: Omit<AutomationWorkflow, 'id' | 'executionsCount'>) => {
    const newId = `WF-0${workflows.length + 1}`;
    const newWf: AutomationWorkflow = {
      ...wfData,
      id: newId,
      executionsCount: 0,
    };
    setWorkflows((prev) => [...prev, newWf]);
    addToast({
      type: 'success',
      title: 'Workflow Created',
      message: `Automation "${newWf.name}" configured and active.`
    });
  };

  // Settings operations
  const updateSettings = (newSettings: Partial<ClinicSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    if (isBackendLive) {
      dentalApi.updateSettings(newSettings).catch((err) => console.warn('API sync warning:', err));
    }
    addToast({
      type: 'success',
      title: 'Settings Saved',
      message: 'Clinic preferences and engagement rules updated.'
    });
  };

  // AI Assistant helpers
  const openAIAssistant = (params: Omit<AIAssistantState, 'isOpen'>) => {
    setAiAssistantState({
      isOpen: true,
      ...params
    });
  };

  const closeAIAssistant = () => {
    setAiAssistantState({ isOpen: false });
  };

  // AI Operations Navigation Helper
  const navigateToAIOperation = (tab: AIOperationTab) => {
    setActiveOperationTab(tab);
    setActivePage('ai-operations');
  };

  const simulateAppointmentCancellation = (appointmentId: string) => {
    const apt = appointments.find((a) => a.id === appointmentId);
    if (!apt) return;

    setAppointments((prev) =>
      prev.map((a) => (a.id === appointmentId ? { ...a, status: 'Cancelled' } : a))
    );
    setSelectedAppointment({ ...apt, status: 'Cancelled' });

    if (isBackendLive) {
      dentalApi.simulateCancelAppointment(appointmentId).catch((err) => console.warn('API sync warning:', err));
    }

    addToast({
      type: 'warning',
      title: 'Cancellation Detected',
      message: `${apt.provider}'s ${apt.time} ${apt.procedure} was cancelled. AI Auto-Waitlist triggered.`,
    });

    setIsAppointmentDetailModalOpen(false);
    setIsWaitlistOfferModalOpen(true);
  };

  const sendWaitlistOffer = (entryOrId: WaitlistEntry | string, appointment?: Appointment) => {
    const entry = typeof entryOrId === 'string' ? waitlist.find((w) => w.id === entryOrId) : entryOrId;
    if (!entry) return;

    setWaitlist((prev) =>
      prev.map((w) =>
        w.id === entry.id ? { ...w, status: 'Offer Sent', offerSentAt: 'Just now' } : w
      )
    );

    if (isBackendLive) {
      dentalApi.updateWaitlistEntry(entry.id, { status: 'Offer Sent', offerSentAt: 'Just now' }).catch((err) => console.warn('API sync warning:', err));
    }

    addToast({
      type: 'success',
      title: 'AI Waitlist Offer Sent',
      message: `Simulated SMS offer delivered to ${entry.patientName} (${entry.acceptanceProbability || 85}% acceptance likelihood).`,
    });

    // Add task for coordination
    addFollowUp({
      title: `Confirm waitlist acceptance: ${entry.patientName}`,
      patientName: entry.patientName,
      taskType: 'Pending enquiry response',
      dueDate: 'In 15 minutes',
      priority: 'Urgent Review',
      assignedStaff: 'Olivia Reed',
      status: 'due_today',
      notes: `Waitlist slot offer dispatched for ${entry.procedure}. Awaiting patient SMS reply.`,
    });
  };

  const autoFillWaitlist = async (appointmentOrId?: Appointment | string, candidateId?: string) => {
    const targetApt = typeof appointmentOrId === 'string'
      ? appointments.find((a) => a.id === appointmentOrId) || appointments[0]
      : appointmentOrId || appointments.find((a) => a.status === 'Cancelled' || a.status === 'cancelled') || appointments[0];

    if (!targetApt) return;

    if (isBackendLive) {
      try {
        const matchRes = await dentalApi.matchWaitlistSlotAi({
          date: targetApt.date,
          time: targetApt.time,
          provider: targetApt.dentistName || targetApt.provider,
          procedure: targetApt.procedure,
          operatory: targetApt.operatory,
        });

        if (matchRes.success && matchRes.data && matchRes.data.rankedCandidates?.length > 0) {
          const selectedCandidate = candidateId 
            ? matchRes.data.rankedCandidates.find((c: any) => c.candidateId === candidateId) || matchRes.data.rankedCandidates[0]
            : matchRes.data.rankedCandidates[0];

          await dentalApi.updateWaitlistEntry(selectedCandidate.candidateId, { status: 'Accepted' });
          await dentalApi.updateAppointment(targetApt.id, {
            status: 'Waitlist Filled',
            patientName: `${selectedCandidate.patientName} (Waitlist Filled)`,
          });

          // Refresh waitlist & appointments from backend
          const [updatedApts, updatedWl] = await Promise.all([
            dentalApi.getAppointments(),
            dentalApi.getWaitlist(),
          ]);
          if (updatedApts.data) setAppointments(updatedApts.data);
          if (updatedWl.data) setWaitlist(updatedWl.data);
          refreshAnalytics();

          try {
            confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
          } catch {}

          addToast({
            type: 'success',
            title: 'Chair Auto-Filled! 🎉',
            message: `Slot auto-allocated to ${selectedCandidate.patientName} (${selectedCandidate.matchScore}% match). Saved to database!`,
          });
          setIsWaitlistOfferModalOpen(false);
          return;
        }
      } catch (err) {
        console.warn('Backend waitlist matching failed, using fallback:', err);
      }
    }

    const ranked = rankWaitlistCandidates(targetApt, waitlist);
    if (ranked.length === 0) {
      addToast({
        type: 'warning',
        title: 'Waitlist Empty',
        message: 'No available waitlisted candidates matched this opening.',
      });
      return;
    }

    const candidateMatch = candidateId 
      ? ranked.find((r) => r.candidate.id === candidateId) || ranked[0]
      : ranked[0];

    const best = candidateMatch.candidate;
    setWaitlist((prev) =>
      prev.map((w) =>
        w.id === best.id ? { ...w, status: 'Accepted', offerSentAt: 'Just now' } : w
      )
    );

    setAppointments((prev) =>
      prev.map((a) =>
        a.id === targetApt.id
          ? {
              ...a,
              status: 'Waitlist Filled',
              patientName: `${best.patientName} (Waitlist Filled)`,
            }
          : a
      )
    );

    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // safe fallback
    }

    addToast({
      type: 'success',
      title: 'Chair Auto-Filled! 🎉',
      message: `Slot auto-allocated to ${best.patientName} (${candidateMatch.acceptanceScore}% match). Chair utilization preserved!`,
    });

    setIsWaitlistOfferModalOpen(false);
  };

  // FEATURE 2: Household Bundling Handlers
  const confirmHouseholdBundle = async (householdId: string, updatedMembers?: HouseholdMember[]) => {
    if (isBackendLive) {
      try {
        const res = await dentalApi.confirmHouseholdBundle(householdId, updatedMembers);
        if (res.success && res.data) {
          setHouseholds((prev) =>
            prev.map((h) => (h.householdId === householdId || h.id === householdId ? res.data! : h))
          );
          try {
            confetti({ particleCount: 85, spread: 70, origin: { y: 0.55 } });
          } catch {}
          addToast({
            type: 'success',
            title: 'Family Bundle Confirmed! 👨‍👩‍👧‍👦',
            message: 'Family appointments grouped into single visit window. Saved to database.',
          });
          setIsHouseholdBundleModalOpen(false);
          return;
        }
      } catch (err) {
        console.warn('Backend household confirmation failed, using fallback:', err);
      }
    }

    setHouseholds((prev) =>
      prev.map((h) => {
        if (h.householdId === householdId) {
          const members = updatedMembers || h.members.map((m) => ({ ...m, status: 'Booked' as const }));
          return {
            ...h,
            status: 'Bundled',
            members,
            scheduledCount: members.length,
          };
        }
        return h;
      })
    );

    try {
      confetti({
        particleCount: 85,
        spread: 70,
        origin: { y: 0.55 },
      });
    } catch {
      // safe fallback
    }

    addToast({
      type: 'success',
      title: 'Family Bundle Confirmed! 👨‍👩‍👧‍👦',
      message: 'Family appointments grouped into single visit window. Shared calendar invites dispatched.',
    });

    setIsHouseholdBundleModalOpen(false);
  };

  // FEATURE 3: Treatment Plan Nudge Handlers
  const generateNudgeSequenceForPlan = async (planId: string, customObjection?: ObjectionCategory) => {
    const plan = treatmentPlans.find((tp) => tp.id === planId);
    if (!plan) return;

    if (isBackendLive) {
      try {
        const res = await dentalApi.generatePlanNudges(planId, customObjection);
        if (res.success && res.data) {
          setTreatmentPlans((prev) =>
            prev.map((tp) => (tp.id === planId ? res.data! : tp))
          );
          setSelectedTreatmentPlan(res.data);
          addToast({
            type: 'success',
            title: 'AI Nudge Sequence Generated (Backend Live)',
            message: `Personalized sequence received from server targeting "${res.data.objectionCategory}".`,
          });
          return;
        }
      } catch (err) {
        console.warn('Backend nudge generation failed, using local fallback:', err);
      }
    }

    const result = generateTreatmentNudgeSequence(plan, customObjection);
    const updatedPlan: TreatmentPlan = {
      ...plan,
      objectionCategory: result.objection,
      recommendedApproach: result.recommendedApproach,
      nudgeSequence: result.sequence,
      sequenceStatus: 'Draft',
    };

    setTreatmentPlans((prev) =>
      prev.map((tp) => (tp.id === planId ? updatedPlan : tp))
    );
    setSelectedTreatmentPlan(updatedPlan);

    addToast({
      type: 'success',
      title: 'AI Nudge Sequence Drafted',
      message: `Personalized 4-step sequence prepared targeting "${result.objection}".`,
    });
  };

  const approveNudgeSequence = (planId: string) => {
    setTreatmentPlans((prev) =>
      prev.map((tp) => {
        if (tp.id === planId) {
          return {
            ...tp,
            sequenceStatus: 'Active',
            nudgeSequence: tp.nudgeSequence.map((m, idx) => ({
              ...m,
              status: idx === 0 ? 'Sent' : 'Scheduled',
            })),
          };
        }
        return tp;
      })
    );

    if (selectedTreatmentPlan && selectedTreatmentPlan.id === planId) {
      setSelectedTreatmentPlan((prev) =>
        prev
          ? {
              ...prev,
              sequenceStatus: 'Active',
              nudgeSequence: prev.nudgeSequence.map((m, idx) => ({
                ...m,
                status: idx === 0 ? 'Sent' : 'Scheduled',
              })),
            }
          : null
      );
    }

    if (isBackendLive) {
      dentalApi.updatePlanStatus(planId, 'Active').catch((err) => console.warn('API sync warning:', err));
    }

    addToast({
      type: 'success',
      title: 'Nudge Sequence Activated',
      message: 'Treatment plan sequence active. Day 1 educational guidance dispatched.',
    });
  };

  const pauseNudgeSequence = (planId: string) => {
    setTreatmentPlans((prev) =>
      prev.map((tp) => (tp.id === planId ? { ...tp, sequenceStatus: 'Paused' } : tp))
    );
    if (selectedTreatmentPlan && selectedTreatmentPlan.id === planId) {
      setSelectedTreatmentPlan((prev) => (prev ? { ...prev, sequenceStatus: 'Paused' } : null));
    }

    if (isBackendLive) {
      dentalApi.updatePlanStatus(planId, 'Paused').catch((err) => console.warn('API sync warning:', err));
    }

    addToast({
      type: 'info',
      title: 'Sequence Paused',
      message: 'Automated follow-up paused by staff.',
    });
  };

  // FEATURE 4: Review Response Handlers
  const generateReviewDraftForReview = async (reviewId: string, variation: number = 1) => {
    const rev = reviews.find((r) => r.id === reviewId);
    if (!rev) return;

    if (isBackendLive) {
      try {
        const res = await dentalApi.generateReviewDraft(reviewId);
        if (res.success && res.data) {
          setReviews((prev) => prev.map((r) => (r.id === reviewId ? res.data! : r)));
          setSelectedReview(res.data);
          addToast({
            type: 'success',
            title: 'AI Response Generated (Backend Live)',
            message: 'Personalized, HIPAA-compliant response received from backend AI engine.',
          });
          return;
        }
      } catch (err) {
        console.warn('Backend review draft generation failed, using local fallback:', err);
      }
    }

    const draft = generateReviewResponseDraft(rev, variation);
    const updatedReview: DentalReview = {
      ...rev,
      aiDraft: draft,
    };

    setReviews((prev) => prev.map((r) => (r.id === reviewId ? updatedReview : r)));
    setSelectedReview(updatedReview);

    addToast({
      type: 'success',
      title: 'AI Response Drafted',
      message: 'Personalized, HIPAA-compliant response generated for review.',
    });
  };

  const approveReviewDraft = (reviewId: string, editedText?: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              approvalStatus: 'Approved',
              responseStatus: 'approved',
              aiDraft: editedText || r.aiDraft,
              aiDraftResponse: editedText || r.aiDraftResponse || r.aiDraft,
            }
          : r
      )
    );
    if (selectedReview && selectedReview.id === reviewId) {
      setSelectedReview((prev) =>
        prev
          ? {
              ...prev,
              approvalStatus: 'Approved',
              responseStatus: 'approved',
              aiDraft: editedText || prev.aiDraft,
              aiDraftResponse: editedText || prev.aiDraftResponse || prev.aiDraft,
            }
          : null
      );
    }

    if (isBackendLive) {
      dentalApi.approveReview(reviewId, editedText).catch((err) => console.warn('API sync warning:', err));
    }

    addToast({
      type: 'success',
      title: 'Review Response Approved ✅',
      message: 'Public reply approved by practice manager and ready to publish.',
    });
    setIsReviewResponseModalOpen(false);
  };

  const updateReviewDraftText = (reviewId: string, text: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, aiDraft: text, approvalStatus: 'Edited' } : r))
    );
    if (selectedReview && selectedReview.id === reviewId) {
      setSelectedReview((prev) => (prev ? { ...prev, aiDraft: text, approvalStatus: 'Edited' } : null));
    }

    if (isBackendLive) {
      dentalApi.updateReviewDraft(reviewId, text).catch((err) => console.warn('API sync warning:', err));
    }
  };

  // Reset demo
  const resetDemoData = () => {
    setEnquiries(INITIAL_ENQUIRIES);
    setPatients(INITIAL_PATIENTS);
    setFollowUps(INITIAL_FOLLOW_UPS);
    setWorkflows(INITIAL_WORKFLOWS);
    setSettings(INITIAL_SETTINGS);
    setAppointments(INITIAL_APPOINTMENTS);
    setWaitlist(INITIAL_WAITLIST);
    setHouseholds(INITIAL_HOUSEHOLDS);
    setTreatmentPlans(INITIAL_TREATMENT_PLANS);
    setReviews(INITIAL_REVIEWS);
    setSelectedEnquiry(null);
    setSelectedPatient(null);
    setSelectedAppointment(null);
    setSelectedWaitlistEntry(null);
    setSelectedHousehold(null);
    setSelectedTreatmentPlan(null);
    setSelectedReview(null);
    localStorage.removeItem('dentalflow_enquiries_v2');
    localStorage.removeItem('dentalflow_appointments');
    localStorage.removeItem('dentalflow_waitlist');
    localStorage.removeItem('dentalflow_households');
    localStorage.removeItem('dentalflow_treatment_plans');
    localStorage.removeItem('dentalflow_reviews');
    addToast({
      type: 'info',
      title: 'Demo Data Reset',
      message: 'All enquiries, patients, appointments, and AI operations restored to default state.'
    });
  };

  return (
    <DentalFlowContext.Provider
      value={{
        activePage,
        setActivePage,
        dateRange,
        setDateRange,
        activeOperationTab,
        setActiveOperationTab,
        navigateToAIOperation,
        enquiries,
        selectedEnquiry,
        setSelectedEnquiry,
        selectedSpecialtyFilter,
        setSelectedSpecialtyFilter,
        navigateToEnquiriesWithSpecialty,
        createFollowUpForEnquiry,
        addEnquiry,
        updateEnquiryStatus,
        assignEnquiryStaff,
        addEnquiryNote,
        markEnquiryReviewed,
        markEnquiryConverted,
        saveEnquiryDraft,
        confirmEnquiryClassification,
        updateEnquiryClassification,
        patients,
        selectedPatient,
        setSelectedPatient,
        addPatient,
        addPatientNote,
        followUps,
        addFollowUp,
        updateFollowUpStatus,
        snoozeFollowUp,
        reassignFollowUp,
        workflows,
        toggleWorkflow,
        addWorkflow,
        settings,
        updateSettings,
        appointments,
        selectedAppointment,
        setSelectedAppointment,
        simulateAppointmentCancellation,
        isAppointmentDetailModalOpen,
        setIsAppointmentDetailModalOpen,
        waitlist,
        selectedWaitlistEntry,
        setSelectedWaitlistEntry,
        sendWaitlistOffer,
        autoFillWaitlist,
        isWaitlistOfferModalOpen,
        setIsWaitlistOfferModalOpen,
        households,
        selectedHousehold,
        setSelectedHousehold,
        confirmHouseholdBundle,
        isHouseholdBundleModalOpen,
        setIsHouseholdBundleModalOpen,
        treatmentPlans,
        selectedTreatmentPlan,
        setSelectedTreatmentPlan,
        generateNudgeSequenceForPlan,
        approveNudgeSequence,
        pauseNudgeSequence,
        isTreatmentPlanModalOpen,
        setIsTreatmentPlanModalOpen,
        reviews,
        selectedReview,
        setSelectedReview,
        generateReviewDraftForReview,
        approveReviewDraft,
        updateReviewDraftText,
        isReviewResponseModalOpen,
        setIsReviewResponseModalOpen,
        isNewEnquiryModalOpen,
        setIsNewEnquiryModalOpen,
        isNewFollowUpModalOpen,
        setIsNewFollowUpModalOpen,
        isNewWorkflowModalOpen,
        setIsNewWorkflowModalOpen,
        isSearchModalOpen,
        setIsSearchModalOpen,
        aiAssistantState,
        openAIAssistant,
        closeAIAssistant,
        activeAIOperationTab: activeOperationTab,
        setActiveAIOperationTab: setActiveOperationTab,
        toasts,
        addToast,
        removeToast,
        resetDemoData,
        isBackendLive,
        isSyncing,
        checkBackendConnection,
        overviewMetrics,
        refreshAnalytics,
      }}
    >
      {children}
    </DentalFlowContext.Provider>
  );
};

export const useDentalFlow = () => {
  const context = useContext(DentalFlowContext);
  if (!context) {
    throw new Error('useDentalFlow must be used within a DentalFlowProvider');
  }
  return context;
};
