import { ApiClient } from './client';
import {
  Patient,
  Enquiry,
  Appointment,
  FollowUpTask,
  WaitlistEntry,
  Household,
  TreatmentPlan,
  DentalReview,
  AutomationWorkflow,
  ClinicSettings,
} from '../../types';

export const dentalApi = {
  // Health
  checkHealth: async () => {
    return await ApiClient.get<{ success: boolean; message: string; database: string }>('/health', 2500);
  },

  // Patients
  getPatients: async (search?: string, engagementLevel?: string) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (engagementLevel) params.append('engagementLevel', engagementLevel);
    const query = params.toString() ? `?${params.toString()}` : '';
    return await ApiClient.get<Patient[]>(`/patients${query}`);
  },
  getPatientById: async (id: string) => {
    return await ApiClient.get<Patient>(`/patients/${id}`);
  },
  createPatient: async (data: Partial<Patient>) => {
    return await ApiClient.post<Patient>('/patients', data);
  },
  updatePatient: async (id: string, data: Partial<Patient>) => {
    return await ApiClient.patch<Patient>(`/patients/${id}`, data);
  },
  addPatientNote: async (patientId: string, author: string, text: string) => {
    return await ApiClient.post(`/patients/${patientId}/notes`, { author, text });
  },

  // Enquiries
  getEnquiries: async (filters?: { status?: string; specialty?: string; priority?: string; search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.specialty) params.append('specialty', filters.specialty);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.search) params.append('search', filters.search);
    const query = params.toString() ? `?${params.toString()}` : '';
    return await ApiClient.get<Enquiry[]>(`/enquiries${query}`);
  },
  createEnquiry: async (data: Partial<Enquiry>) => {
    return await ApiClient.post<Enquiry>('/enquiries', data);
  },
  updateEnquiry: async (id: string, data: Partial<Enquiry>) => {
    return await ApiClient.patch<Enquiry>(`/enquiries/${id}`, data);
  },
  classifyEnquiry: async (id: string) => {
    return await ApiClient.post<Enquiry>(`/enquiries/${id}/classify`);
  },
  addEnquiryNote: async (id: string, author: string, text: string) => {
    return await ApiClient.post(`/enquiries/${id}/notes`, { author, text });
  },

  // Appointments
  getAppointments: async (date?: string, status?: string) => {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    if (status) params.append('status', status);
    const query = params.toString() ? `?${params.toString()}` : '';
    return await ApiClient.get<Appointment[]>(`/appointments${query}`);
  },
  createAppointment: async (data: Partial<Appointment>) => {
    return await ApiClient.post<Appointment>('/appointments', data);
  },
  updateAppointment: async (id: string, data: Partial<Appointment>) => {
    return await ApiClient.patch<Appointment>(`/appointments/${id}`, data);
  },
  simulateCancelAppointment: async (id: string) => {
    return await ApiClient.post<Appointment>(`/appointments/${id}/simulate-cancel`);
  },

  // Follow-ups
  getFollowUps: async (status?: string, staff?: string) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (staff) params.append('staff', staff);
    const query = params.toString() ? `?${params.toString()}` : '';
    return await ApiClient.get<FollowUpTask[]>(`/follow-ups${query}`);
  },
  createFollowUp: async (data: Partial<FollowUpTask>) => {
    return await ApiClient.post<FollowUpTask>('/follow-ups', data);
  },
  updateFollowUp: async (id: string, data: Partial<FollowUpTask>) => {
    return await ApiClient.patch<FollowUpTask>(`/follow-ups/${id}`, data);
  },
  completeFollowUp: async (id: string) => {
    return await ApiClient.post<FollowUpTask>(`/follow-ups/${id}/complete`);
  },

  // AI Operations
  classifyLeadAi: async (data: { message: string; service?: string; source?: string }) => {
    return await ApiClient.post('/ai/lead-classification', data);
  },
  predictNoShowAi: async (appointmentData: any) => {
    return await ApiClient.post('/ai/no-show-prediction', appointmentData);
  },
  matchWaitlistSlotAi: async (slotData: any) => {
    return await ApiClient.post('/ai/waitlist-match', slotData);
  },
  bundleHouseholdAi: async (householdData: any) => {
    return await ApiClient.post('/ai/household-bundling', householdData);
  },
  generateTreatmentNudgesAi: async (planData: any) => {
    return await ApiClient.post('/ai/treatment-nudges', planData);
  },
  generateReviewResponseAi: async (reviewData: any) => {
    return await ApiClient.post('/ai/review-response', reviewData);
  },

  // Operations Data
  getWaitlist: async (status?: string) => {
    const query = status ? `?status=${status}` : '';
    return await ApiClient.get<WaitlistEntry[]>(`/waitlist${query}`);
  },
  updateWaitlistEntry: async (id: string, data: Partial<WaitlistEntry>) => {
    return await ApiClient.patch<WaitlistEntry>(`/waitlist/${id}`, data);
  },
  getHouseholds: async () => {
    return await ApiClient.get<Household[]>('/households');
  },
  confirmHouseholdBundle: async (id: string, members?: any[]) => {
    return await ApiClient.post<Household>(`/households/${id}/confirm`, { members });
  },
  getTreatmentPlans: async () => {
    return await ApiClient.get<TreatmentPlan[]>('/treatment-plans');
  },
  generatePlanNudges: async (id: string, objectionCategory?: string) => {
    return await ApiClient.post<TreatmentPlan>(`/treatment-plans/${id}/generate`, { objectionCategory });
  },
  updatePlanStatus: async (id: string, status: string) => {
    return await ApiClient.patch<TreatmentPlan>(`/treatment-plans/${id}`, { status });
  },
  getReviews: async () => {
    return await ApiClient.get<DentalReview[]>('/reviews');
  },
  generateReviewDraft: async (id: string, tone?: string) => {
    return await ApiClient.post<DentalReview>(`/reviews/${id}/generate`, { tone });
  },
  updateReviewDraft: async (id: string, text: string) => {
    return await ApiClient.patch<DentalReview>(`/reviews/${id}/draft`, { text });
  },
  approveReview: async (id: string, editedText?: string) => {
    return await ApiClient.post<DentalReview>(`/reviews/${id}/approve`, { editedText });
  },

  // Analytics
  getAnalyticsOverview: async () => {
    return await ApiClient.get('/analytics/overview');
  },

  // Settings & Workflows
  getSettings: async () => {
    return await ApiClient.get<ClinicSettings>('/settings');
  },
  updateSettings: async (settings: Partial<ClinicSettings>) => {
    return await ApiClient.patch<ClinicSettings>('/settings', settings);
  },
  getWorkflows: async () => {
    return await ApiClient.get<AutomationWorkflow[]>('/workflows');
  },
  toggleWorkflow: async (id: string) => {
    return await ApiClient.patch<AutomationWorkflow>(`/workflows/${id}/toggle`);
  },
};
