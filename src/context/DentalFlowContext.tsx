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
  FollowUpStatus
} from '../types';
import { 
  INITIAL_ENQUIRIES, 
  INITIAL_PATIENTS, 
  INITIAL_FOLLOW_UPS, 
  INITIAL_WORKFLOWS, 
  INITIAL_SETTINGS 
} from '../data/mockData';

export type PageId = 
  | 'dashboard' 
  | 'enquiries' 
  | 'patients' 
  | 'followups' 
  | 'workflows' 
  | 'analytics' 
  | 'settings';

interface AIAssistantState {
  isOpen: boolean;
  enquiry?: Enquiry;
  patient?: Patient;
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
  addEnquiry: (enquiry: Partial<Enquiry>) => void;
  updateEnquiryStatus: (id: string, status: EnquiryStatus) => void;
  assignEnquiryStaff: (id: string, staff: string) => void;
  addEnquiryNote: (id: string, text: string) => void;
  markEnquiryReviewed: (id: string) => void;
  markEnquiryConverted: (id: string) => void;
  saveEnquiryDraft: (id: string, draft: string) => void;

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

  // Utilities
  resetDemoData: () => void;
}

const DentalFlowContext = createContext<DentalFlowContextType | undefined>(undefined);

export const DentalFlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<PageId>('dashboard');
  const [dateRange, setDateRange] = useState<'today' | '7days' | '30days'>('7days');

  // Load or fallback to mock data
  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => {
    const saved = localStorage.getItem('dentalflow_enquiries');
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

  // Modals state
  const [isNewEnquiryModalOpen, setIsNewEnquiryModalOpen] = useState(false);
  const [isNewFollowUpModalOpen, setIsNewFollowUpModalOpen] = useState(false);
  const [isNewWorkflowModalOpen, setIsNewWorkflowModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // AI Assistant state
  const [aiAssistantState, setAiAssistantState] = useState<AIAssistantState>({ isOpen: false });

  // Toasts
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('dentalflow_enquiries', JSON.stringify(enquiries));
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
  const addEnquiry = (enquiryData: Partial<Enquiry>) => {
    const newId = `ENQ-2024-${String(enquiries.length + 1).padStart(3, '0')}`;
    const newEnquiry: Enquiry = {
      id: newId,
      patientName: enquiryData.patientName || 'New Enquirer',
      patientEmail: enquiryData.patientEmail || 'patient@demo.example',
      patientPhone: enquiryData.patientPhone || '+1 (555) 000-0000',
      enquirySummary: enquiryData.enquirySummary || 'General consultation request',
      fullMessage: enquiryData.fullMessage || 'I would like more information on booking an appointment.',
      service: enquiryData.service || 'General Dentistry',
      source: enquiryData.source || 'Website',
      aiClassification: enquiryData.aiClassification || {
        intent: 'General Consultation Request',
        serviceCategory: enquiryData.service || 'General Dentistry',
        suggestedAction: 'Offer standard initial examination consultation and booking calendar.',
        confidence: 93,
        priorityReasoning: 'Newly created enquiry queued for front-desk triage.',
      },
      priority: enquiryData.priority || 'Medium',
      status: 'New',
      receivedAt: 'Just now',
      timestamp: new Date().toISOString(),
      assignedStaff: enquiryData.assignedStaff || 'Alex Morgan',
      isReviewed: false,
      notes: [
        {
          id: `note-${Date.now()}`,
          author: 'System',
          text: 'Enquiry manually added by clinic staff. AI pre-classification generated.',
          createdAt: 'Just now'
        }
      ]
    };

    setEnquiries((prev) => [newEnquiry, ...prev]);
    addToast({
      type: 'success',
      title: 'Enquiry Added',
      message: `Enquiry for ${newEnquiry.patientName} created successfully.`
    });
  };

  const updateEnquiryStatus = (id: string, status: EnquiryStatus) => {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status, isReviewed: true } : e))
    );
    if (selectedEnquiry && selectedEnquiry.id === id) {
      setSelectedEnquiry((prev) => (prev ? { ...prev, status, isReviewed: true } : null));
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

  const markEnquiryConverted = (id: string) => {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'Converted', isReviewed: true } : e))
    );
    if (selectedEnquiry && selectedEnquiry.id === id) {
      setSelectedEnquiry((prev) =>
        prev ? { ...prev, status: 'Converted', isReviewed: true } : null
      );
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
      message: 'Enquiry has been marked as a successfully booked patient.'
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

  // Patients operations
  const addPatient = (patientData: Partial<Patient>) => {
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
    addToast({
      type: 'success',
      title: 'Note Added',
      message: 'Patient profile note saved.'
    });
  };

  // Follow-ups operations
  const addFollowUp = (taskData: Omit<FollowUpTask, 'id'>) => {
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

  // Reset demo
  const resetDemoData = () => {
    setEnquiries(INITIAL_ENQUIRIES);
    setPatients(INITIAL_PATIENTS);
    setFollowUps(INITIAL_FOLLOW_UPS);
    setWorkflows(INITIAL_WORKFLOWS);
    setSettings(INITIAL_SETTINGS);
    setSelectedEnquiry(null);
    setSelectedPatient(null);
    localStorage.clear();
    addToast({
      type: 'info',
      title: 'Demo Data Reset',
      message: 'All enquiries, patients, and tasks restored to default demonstration state.'
    });
  };

  return (
    <DentalFlowContext.Provider
      value={{
        activePage,
        setActivePage,
        dateRange,
        setDateRange,
        enquiries,
        selectedEnquiry,
        setSelectedEnquiry,
        addEnquiry,
        updateEnquiryStatus,
        assignEnquiryStaff,
        addEnquiryNote,
        markEnquiryReviewed,
        markEnquiryConverted,
        saveEnquiryDraft,
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
        toasts,
        addToast,
        removeToast,
        resetDemoData,
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
