import React, { useState } from 'react';
import { useDentalFlow } from '../context/DentalFlowContext';
import { AIOperationTab, Appointment, Household, TreatmentPlan, DentalReview } from '../types';
import { AppointmentDetailModal } from '../components/operations/AppointmentDetailModal';
import { WaitlistOfferModal } from '../components/operations/WaitlistOfferModal';
import { HouseholdBundleModal } from '../components/operations/HouseholdBundleModal';
import { TreatmentPlanModal } from '../components/operations/TreatmentPlanModal';
import { ReviewResponseModal } from '../components/operations/ReviewResponseModal';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  Users, 
  FileText, 
  Star, 
  AlertTriangle, 
  CheckCircle, 
  Zap, 
  Send, 
  ShieldCheck, 
  Stethoscope, 
  ChevronRight, 
  Phone, 
  Building, 
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const AIOperationsPage: React.FC = () => {
  const {
    activeAIOperationTab,
    setActiveAIOperationTab,
    appointments,
    waitlist,
    households,
    treatmentPlans,
    reviews,
    simulateAppointmentCancellation,
    confirmHouseholdBundle,
    approveNudgeSequence,
    approveReviewDraft
  } = useDentalFlow();

  // Selected Modal States
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState<boolean>(false);

  const [waitlistTargetAppointment, setWaitlistTargetAppointment] = useState<Appointment | null>(null);
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState<boolean>(false);

  const [selectedHousehold, setSelectedHousehold] = useState<Household | null>(null);
  const [isHouseholdModalOpen, setIsHouseholdModalOpen] = useState<boolean>(false);

  const [selectedPlan, setSelectedPlan] = useState<TreatmentPlan | null>(null);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState<boolean>(false);

  const [selectedReview, setSelectedReview] = useState<DentalReview | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);

  // Filters
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [reviewFilter, setReviewFilter] = useState<'all' | 'pending' | 'approved'>('all');

  // Stats for badge counters
  const highRiskCount = appointments.filter(a => {
    const isHigh = (a.riskLevel || '').toLowerCase().includes('high');
    const isSched = (a.status || '').toLowerCase().includes('sched');
    return isHigh && isSched;
  }).length;
  const openSlotsCount = appointments.filter(a => (a.status || '').toLowerCase().includes('cancel')).length;
  const pendingBundlesCount = households.filter(h => h.status !== 'Bundled' && h.bundleStatus !== 'confirmed').length;
  const pendingPlansCount = treatmentPlans.filter(p => (p.status || '').toLowerCase().includes('await') || (p.status || '').toLowerCase().includes('pending') || p.sequenceStatus !== 'Active').length;
  const pendingReviewsCount = reviews.filter(r => r.approvalStatus !== 'Approved' && r.responseStatus !== 'approved').length;

  const filteredAppointments = appointments.filter(a => {
    if (riskFilter === 'all') return true;
    return (a.riskLevel || '').toLowerCase().includes(riskFilter);
  });

  const filteredReviews = reviews.filter(r => {
    const isApproved = r.approvalStatus === 'Approved' || r.responseStatus === 'approved';
    if (reviewFilter === 'all') return true;
    return reviewFilter === 'approved' ? isApproved : !isApproved;
  });

  // Handle opening Waitlist Modal for an appointment
  const handleOpenWaitlist = (apt: Appointment) => {
    setWaitlistTargetAppointment(apt);
    setIsWaitlistModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              AI Operations Engine
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-teal-500 to-indigo-600 text-white flex items-center gap-1 shadow-xs">
              <Sparkles className="w-3 h-3 text-amber-300" /> Live AI Copilot
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Predictive chair defense, multi-member family scheduling, empathetic nudges & HIPAA-safe patient responses.
          </p>
        </div>

        {/* Global Action Shortcut */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 hidden sm:inline">Human Practice Manager Oversight:</span>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 border border-teal-200 text-teal-800 rounded-xl text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>100% Guarded</span>
          </div>
        </div>
      </div>

      {/* Modern Navigation Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveAIOperationTab('no-show')}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all shrink-0 ${
            activeAIOperationTab === 'no-show'
              ? 'border-teal-600 text-teal-700 bg-teal-50/50 rounded-t-xl'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>No-Show Risk Engine</span>
          {highRiskCount > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-100 text-rose-700">
              {highRiskCount} High Risk
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveAIOperationTab('waitlist')}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all shrink-0 ${
            activeAIOperationTab === 'waitlist'
              ? 'border-teal-600 text-teal-700 bg-teal-50/50 rounded-t-xl'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <Zap className="w-4 h-4 text-teal-600" />
          <span>Auto-Waitlist Fast-Fill</span>
          {openSlotsCount > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-800 animate-pulse">
              {openSlotsCount} Slot Open
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveAIOperationTab('households')}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all shrink-0 ${
            activeAIOperationTab === 'households'
              ? 'border-teal-600 text-teal-700 bg-teal-50/50 rounded-t-xl'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <Users className="w-4 h-4 text-indigo-600" />
          <span>Household Bundling</span>
          {pendingBundlesCount > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-indigo-100 text-indigo-700">
              {pendingBundlesCount} Bundles
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveAIOperationTab('treatment-plans')}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all shrink-0 ${
            activeAIOperationTab === 'treatment-plans'
              ? 'border-teal-600 text-teal-700 bg-teal-50/50 rounded-t-xl'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <FileText className="w-4 h-4 text-purple-600" />
          <span>Empathetic Nudges</span>
          {pendingPlansCount > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-purple-100 text-purple-700">
              {pendingPlansCount} Pending
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveAIOperationTab('reviews')}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all shrink-0 ${
            activeAIOperationTab === 'reviews'
              ? 'border-teal-600 text-teal-700 bg-teal-50/50 rounded-t-xl'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <Star className="w-4 h-4 text-amber-500" />
          <span>AI Review Responses</span>
          {pendingReviewsCount > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-800">
              {pendingReviewsCount} Drafts
            </span>
          )}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: NO-SHOW RISK ENGINE */}
      {/* ========================================================================= */}
      {activeAIOperationTab === 'no-show' && (
        <div className="space-y-5 animate-fade-in">
          {/* Top Alert Spotlight */}
          <div className="bg-gradient-to-r from-rose-900 via-rose-950 to-slate-950 text-white rounded-2xl p-5 shadow-sm border border-rose-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-400/30 uppercase tracking-wide">
                  High Risk Priority Flag
                </span>
                <span className="text-xs text-rose-200">Operatory 2 • Dr. Sarah Wilson</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                Sarah Thomas — 78% Predicted No-Show Risk (02:00 PM Today)
              </h3>
              <p className="text-xs text-rose-100/80 max-w-2xl">
                Root canal procedure booked 18 days prior with unconfirmed SMS and historical cancellations. Recommend immediate front-desk confirmation call or standby waitlist activation.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  const target = appointments.find(a => a.patientName === 'Sarah Thomas') || appointments[0];
                  setSelectedAppointment(target);
                  setIsAppointmentModalOpen(true);
                }}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-rose-950 font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                View Risk Diagnostics
              </button>
            </div>
          </div>

          {/* Table Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-subtle text-xs">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="font-semibold text-slate-700">Filter by AI Risk:</span>
              <div className="flex items-center gap-1">
                {(['all', 'high', 'medium', 'low'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setRiskFilter(lvl)}
                    className={`px-3 py-1 rounded-lg font-medium capitalize transition-colors ${
                      riskFilter === lvl
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <span className="text-slate-500">
              Showing {filteredAppointments.length} scheduled slots today
            </span>
          </div>

          {/* Appointments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAppointments.map((apt) => {
              const isHigh = (apt.riskLevel || '').toLowerCase().includes('high');
              const isMed = (apt.riskLevel || '').toLowerCase().includes('med');
              const prob = apt.noShowRiskScore ?? apt.noShowProbability ?? 0;
              const duration = apt.duration || 45;
              const operatory = apt.operatory || 'Operatory 2';
              const doctor = apt.dentistName || apt.provider;
              const isCancelled = (apt.status || '').toLowerCase().includes('cancel');

              return (
                <div
                  key={apt.id}
                  className={`bg-white rounded-2xl border transition-all p-4.5 shadow-subtle flex flex-col justify-between ${
                    isHigh
                      ? 'border-rose-200 hover:border-rose-300'
                      : isMed
                        ? 'border-amber-200 hover:border-amber-300'
                        : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{apt.patientName}</h4>
                        <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Stethoscope className="w-3 h-3 text-teal-600" />
                          {apt.procedure}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className={`text-xs font-black px-2 py-0.5 rounded-full border ${
                          isHigh
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : isMed
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {prob}% Risk
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5 capitalize">
                          {apt.riskLevel}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mb-3">
                      <div
                        className={`h-full rounded-full ${
                          isHigh ? 'bg-rose-500' : isMed ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${prob}%` }}
                      />
                    </div>

                    {/* Meta info */}
                    <div className="bg-slate-50 rounded-xl p-2.5 text-xs text-slate-600 space-y-1 mb-3">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-slate-500">
                          <Clock className="w-3 h-3 text-slate-400" /> Time
                        </span>
                        <span className="font-semibold text-slate-800">{apt.time} ({duration}m)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Operatory</span>
                        <span className="font-medium text-slate-700">{operatory}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Clinician</span>
                        <span className="font-medium text-slate-700">{doctor}</span>
                      </div>
                    </div>

                    {/* Risk Factor Chips */}
                    {apt.riskFactors && apt.riskFactors.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {apt.riskFactors.slice(0, 2).map((factor, fIdx) => (
                          <span
                            key={fIdx}
                            className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium truncate max-w-full"
                          >
                            ⚠️ {factor}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setSelectedAppointment(apt);
                        setIsAppointmentModalOpen(true);
                      }}
                      className="text-xs font-semibold text-teal-700 hover:text-teal-900 transition-colors"
                    >
                      AI Diagnostics →
                    </button>

                    {!isCancelled ? (
                      <button
                        onClick={() => {
                          simulateAppointmentCancellation(apt.id);
                          handleOpenWaitlist(apt);
                        }}
                        className="text-[11px] font-medium text-rose-600 hover:bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 transition-colors"
                      >
                        Simulate Cancel
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenWaitlist(apt)}
                        className="text-[11px] font-semibold text-white bg-teal-600 hover:bg-teal-700 px-2.5 py-1 rounded-lg shadow-xs transition-colors flex items-center gap-1"
                      >
                        <Zap className="w-3 h-3 text-amber-300" /> Fast-Fill
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: AUTO-WAITLIST FAST-FILL */}
      {/* ========================================================================= */}
      {activeAIOperationTab === 'waitlist' && (
        <div className="space-y-5 animate-fade-in">
          {/* Quick Dispatch Banner */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30">
                  AI Rapid Dispatch Engine
                </span>
                <span className="text-xs text-slate-400">Multi-parameter Patient Matching</span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                Zero-Downtime Operatory Filling
              </h3>
              <p className="text-xs text-slate-300 max-w-2xl">
                When cancellations occur, DentalFlow AI ranks waiting patients by procedure match, proximity radius, schedule flexibility, and clinical urgency to reclaim chair revenue in under 3 minutes.
              </p>
            </div>

            <button
              onClick={() => {
                const targetApt = appointments.find(a => (a.status || '').toLowerCase().includes('cancel')) || appointments[0];
                handleOpenWaitlist(targetApt);
              }}
              className="px-4 py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              Launch Match Wizard
            </button>
          </div>

          {/* Waitlist Candidate Roster */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Active Waitlist Patients ({waitlist.length})</h4>
                <p className="text-xs text-slate-500">Live priority queue ready for instant automated dispatch</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="py-3 px-3">Patient Name</th>
                    <th className="py-3 px-3">Needed Care</th>
                    <th className="py-3 px-3">Urgency</th>
                    <th className="py-3 px-3">Commute Radius</th>
                    <th className="py-3 px-3">Availability</th>
                    <th className="py-3 px-3">Match Score</th>
                    <th className="py-3 px-3 text-right">Quick Dispatch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {waitlist.map((candidate) => {
                    const phone = candidate.phone || '98765 43210';
                    const urgencyStr = (candidate.urgency || 'Standard').toString().toUpperCase();
                    const isUrgent = urgencyStr.includes('URGENT') || urgencyStr.includes('HIGH');
                    const distance = candidate.distanceKm || 2.4;
                    const flexDays = candidate.flexibleDays || ['Weekdays', 'Saturday'];
                    const score = candidate.matchScore ?? candidate.acceptanceProbability ?? 88;
                    const isBooked = candidate.status === 'Accepted' || candidate.status === 'scheduled';
                    const hasOffer = candidate.status === 'Offer Sent' || candidate.status === 'offer_sent';

                    return (
                      <tr key={candidate.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-3 font-semibold text-slate-900">
                          {candidate.patientName}
                          <div className="text-[11px] text-slate-400 font-normal">{phone}</div>
                        </td>

                        <td className="py-3.5 px-3">
                          <span className="font-medium text-slate-800">{candidate.procedure}</span>
                        </td>

                        <td className="py-3.5 px-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isUrgent
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {urgencyStr}
                          </span>
                        </td>

                        <td className="py-3.5 px-3 text-slate-600">
                          {distance} km away
                        </td>

                        <td className="py-3.5 px-3 text-slate-600">
                          <div className="flex flex-wrap gap-1">
                            {flexDays.slice(0, 2).map((d: string, i: number) => (
                              <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                                {d}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-teal-700">{score}%</span>
                            <div className="w-12 bg-slate-100 rounded-full h-1.5">
                              <div
                                className="bg-teal-600 h-full rounded-full"
                                style={{ width: `${score}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-3 text-right">
                          {isBooked ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded">
                              <CheckCircle className="w-3.5 h-3.5" /> Booked
                            </span>
                          ) : hasOffer ? (
                            <span className="text-amber-700 font-medium bg-amber-50 px-2 py-1 rounded border border-amber-200">
                              Offer Pending
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                const targetApt = appointments.find(a => (a.status || '').toLowerCase().includes('cancel')) || appointments[0];
                                handleOpenWaitlist(targetApt);
                              }}
                              className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition-colors shadow-xs"
                            >
                              Dispatch Offer
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: HOUSEHOLD BUNDLING */}
      {/* ========================================================================= */}
      {activeAIOperationTab === 'households' && (
        <div className="space-y-5 animate-fade-in">
          {/* Household AI Header */}
          <div className="p-4 bg-gradient-to-r from-sky-50 via-teal-50 to-indigo-50 border border-teal-200 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-700" />
                <h3 className="font-bold text-slate-900 text-sm">Family Multi-Chair Scheduling Optimization</h3>
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl">
                DentalFlow AI detects patients belonging to the same household who have pending cleanings, checkups, or treatments, and synthesizes consolidated weekend itineraries.
              </p>
            </div>

            <div className="text-xs bg-white/90 border border-teal-200 px-3.5 py-2 rounded-xl text-teal-900 font-semibold shadow-xs shrink-0">
              ✨ 2 Household Clusters Detected
            </div>
          </div>

          {/* Households Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {households.map((household, hIdx) => {
              const isConfirmed = household.status === 'Bundled' || household.bundleStatus === 'confirmed';
              const hId = household.householdId || household.id || `h-${hIdx}`;
              const fName = household.householdName || household.familyName || 'Family Bundle';
              const contactName = household.primaryContactName || household.members[0]?.name || 'Primary Contact';
              const contactPhone = household.primaryContactPhone || '98765 43210';

              return (
                <div
                  key={hId}
                  className={`bg-white rounded-2xl border transition-all p-5 shadow-subtle flex flex-col justify-between ${
                    isConfirmed
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : 'border-slate-200 hover:border-teal-300'
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-base">{fName}</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            isConfirmed
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : 'bg-amber-100 text-amber-800 border-amber-300'
                          }`}>
                            {isConfirmed ? '✓ Confirmed Bundle' : 'Opportunity Ready'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Primary: {contactName} ({contactPhone})
                        </p>
                      </div>

                      <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-black">
                        {household.members.length}
                      </div>
                    </div>

                    {/* Member Breakdown Preview */}
                    <div className="space-y-2 mb-4">
                      <span className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider block">
                        Family Care Roster:
                      </span>
                      <div className="grid grid-cols-1 gap-1.5">
                        {household.members.map((m, mIdx) => (
                          <div
                            key={m.memberId || m.id || `m-${mIdx}`}
                            className="bg-slate-50 border border-slate-100 rounded-lg p-2 text-xs flex items-center justify-between"
                          >
                            <div>
                              <span className="font-semibold text-slate-800">{m.name}</span>{' '}
                              <span className="text-slate-500 capitalize">({m.relationship}, {m.age ?? 32}y)</span>
                            </div>
                            <span className="text-teal-700 font-medium text-[11px] bg-teal-50 px-2 py-0.5 rounded">
                              {m.procedureNeeded || 'Dental Visit'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Savings Tag */}
                    <div className="bg-teal-50/60 border border-teal-200/60 rounded-xl p-2.5 text-xs text-teal-900 flex items-center gap-2 mb-4">
                      <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>Saves family 3 separate clinic trips • 100% weekend operatory fill</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <button
                      onClick={() => {
                        setSelectedHousehold(household);
                        setIsHouseholdModalOpen(true);
                      }}
                      className="text-xs font-semibold text-teal-700 hover:text-teal-900 transition-colors"
                    >
                      View Full Schedule Matrix →
                    </button>

                    <button
                      onClick={() => confirmHouseholdBundle(hId)}
                      disabled={isConfirmed}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isConfirmed
                          ? 'bg-emerald-600 text-white cursor-default'
                          : 'bg-teal-600 hover:bg-teal-700 text-white shadow-xs'
                      }`}
                    >
                      {isConfirmed ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                          Bundle Booked
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5 text-amber-300" />
                          Confirm Bundle
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: TREATMENT PLANS & EMPATHETIC NUDGES */}
      {/* ========================================================================= */}
      {activeAIOperationTab === 'treatment-plans' && (
        <div className="space-y-5 animate-fade-in">
          {/* Spotlight Header */}
          <div className="bg-gradient-to-r from-purple-900 via-slate-900 to-navy-950 text-white p-5 rounded-2xl border border-purple-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-400/30">
                  Empathetic Conversion Engine
                </span>
                <span className="text-xs text-purple-200">Rahul Menon • ₹28,000 Root Canal Plan</span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                Overcoming Patient Hesitation Without High-Pressure Sales
              </h3>
              <p className="text-xs text-slate-300 max-w-2xl">
                AI analyzes patient objection notes (cost, dental anxiety, or scheduling) and generates tailored 4-step communication sequences (Day 1, 3, 7, 14) offering 0% EMI and gentle doctor follow-ups.
              </p>
            </div>

            <button
              onClick={() => {
                const plan = treatmentPlans.find(p => p.patientName === 'Rahul Menon') || treatmentPlans[0];
                setSelectedPlan(plan);
                setIsPlanModalOpen(true);
              }}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              Open Rahul Menon's Plan
            </button>
          </div>

          {/* Treatment Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {treatmentPlans.map((plan) => {
              const isActive = plan.status === 'nudge_active' || plan.sequenceStatus === 'Active';
              const isAccepted = plan.status === 'accepted' || plan.status === 'Accepted';
              const procName = plan.procedure || plan.procedureName || 'Dental Procedure';
              const planCost = plan.value ?? plan.estimatedCost ?? 28000;
              const objectionText = plan.objectionNotes || plan.recommendedApproach || 'Clarifying treatment benefits and financing.';

              return (
                <div
                  key={plan.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-5 flex flex-col justify-between hover:border-purple-300 transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">{plan.patientName}</h4>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Care: <strong className="text-slate-800">{procName}</strong>
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-black text-slate-900">
                          ₹{planCost.toLocaleString('en-IN')}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full block mt-0.5 ${
                          isActive
                            ? 'bg-purple-100 text-purple-800'
                            : isAccepted
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                        }`}>
                          {isActive ? 'Nudge Active' : isAccepted ? 'Accepted' : 'Pending Decision'}
                        </span>
                      </div>
                    </div>

                    {/* Objection Insight Banner */}
                    <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-900 mb-3">
                      <span className="font-bold block">Identified Barrier:</span>
                      <p className="text-[11px] text-amber-800 mt-0.5">{objectionText}</p>
                    </div>

                    {/* 4-Step Pills */}
                    <div className="space-y-1 mb-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        4-Step Sequence:
                      </span>
                      <div className="grid grid-cols-4 gap-1.5 text-center text-[10px]">
                        {plan.nudgeSequence?.map((step, sIdx) => {
                          const isSent = (step.status || 'Draft').toLowerCase().includes('sent');
                          const dayNum = step.dayOffset ?? step.day ?? (sIdx * 3 + 1);
                          return (
                            <div
                              key={step.id || `s-${sIdx}`}
                              className={`p-1.5 rounded-lg border font-medium ${
                                isSent
                                  ? 'bg-purple-50 text-purple-700 border-purple-200 font-bold'
                                  : 'bg-slate-50 text-slate-600 border-slate-200'
                              }`}
                            >
                              Day {dayNum}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <button
                      onClick={() => {
                        setSelectedPlan(plan);
                        setIsPlanModalOpen(true);
                      }}
                      className="text-xs font-semibold text-purple-700 hover:text-purple-900 transition-colors"
                    >
                      View Nudge Copies →
                    </button>

                    <button
                      onClick={() => approveNudgeSequence(plan.id)}
                      disabled={isActive}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-purple-700 text-white cursor-default'
                          : 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs'
                      }`}
                    >
                      {isActive ? 'Sequence Running' : 'Activate Sequence'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: AI REVIEW RESPONSES (HIPAA SAFE) */}
      {/* ========================================================================= */}
      {activeAIOperationTab === 'reviews' && (
        <div className="space-y-5 animate-fade-in">
          {/* Safeguard Alert */}
          <div className="bg-slate-900 text-white p-4.5 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <h3 className="font-bold text-white text-sm">HIPAA & Medical Privacy Response Protocol</h3>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                DentalFlow AI drafts professional, empathetic responses to Google and Practo reviews. It references visit sentiment while strictly omitting clinical diagnosis codes, medical charts, or dispute details.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setReviewFilter('pending')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  reviewFilter === 'pending'
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Needs Review ({pendingReviewsCount})
              </button>
              <button
                onClick={() => setReviewFilter('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  reviewFilter === 'all'
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                All
              </button>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {filteredReviews.map((review) => {
              const isApproved = review.approvalStatus === 'Approved' || review.responseStatus === 'approved';
              const author = review.authorName || review.reviewerName || 'Patient';
              const reviewDate = review.reviewDate || review.date || 'Recent';
              const draft = review.aiDraftResponse || review.aiDraft;

              return (
                <div
                  key={review.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-5 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 font-bold text-slate-700 flex items-center justify-center text-xs">
                        {author.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{author}</h4>
                          <span className="text-xs text-slate-500">• {reviewDate}</span>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold capitalize">
                            {review.platform}
                          </span>
                        </div>

                        {/* Stars */}
                        <div className="flex items-center text-amber-400 mt-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3 h-3 ${s <= review.rating ? 'fill-amber-400' : 'text-slate-200'}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border self-start sm:self-auto ${
                      isApproved
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {isApproved ? '✓ Published to Google' : 'AI Draft Ready For Review'}
                    </span>
                  </div>

                  {/* Review Text */}
                  <p className="text-xs text-slate-700 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                    "{review.reviewText}"
                  </p>

                  {/* AI Draft Preview */}
                  {draft && (
                    <div className="bg-teal-50/40 border border-teal-100 rounded-xl p-3.5 space-y-1 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-teal-900 text-[11px]">
                        <Sparkles className="w-3 h-3 text-teal-600" />
                        AI Draft Response (Staff-Approved):
                      </div>
                      <p className="text-slate-700 leading-relaxed text-xs">
                        {draft}
                      </p>
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                    <button
                      onClick={() => {
                        setSelectedReview(review);
                        setIsReviewModalOpen(true);
                      }}
                      className="text-xs font-semibold text-teal-700 hover:text-teal-900 transition-colors"
                    >
                      Open in Draft Editor →
                    </button>

                    {!isApproved && (
                      <button
                        onClick={() => approveReviewDraft(review.id, draft)}
                        className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                      >
                        Approve & Publish
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modals */}
      <AppointmentDetailModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        appointment={selectedAppointment}
        onOpenWaitlistOffer={handleOpenWaitlist}
      />

      <WaitlistOfferModal
        isOpen={isWaitlistModalOpen}
        onClose={() => setIsWaitlistModalOpen(false)}
        appointment={waitlistTargetAppointment}
      />

      <HouseholdBundleModal
        isOpen={isHouseholdModalOpen}
        onClose={() => setIsHouseholdModalOpen(false)}
        household={selectedHousehold}
      />

      <TreatmentPlanModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        plan={selectedPlan}
      />

      <ReviewResponseModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        review={selectedReview}
      />
    </div>
  );
};
