import React, { useState } from 'react';
import { useDentalFlow } from '../../context/DentalFlowContext';
import { Badge } from '../common/Badge';
import { 
  X, 
  Activity, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  Plus, 
  FileText, 
  Info, 
  CheckCircle2, 
  ShieldAlert,
  MessageCircle,
  Sparkles
} from 'lucide-react';

export const PatientDetailDrawer: React.FC = () => {
  const { 
    selectedPatient, 
    setSelectedPatient, 
    addPatientNote, 
    followUps,
    setIsNewFollowUpModalOpen,
    openAIAssistant 
  } = useDentalFlow();

  const [activeTab, setActiveTab] = useState<'overview' | 'interactions' | 'followups' | 'notes'>('overview');
  const [noteText, setNoteText] = useState('');

  if (!selectedPatient) return null;

  const patientFollowUps = followUps.filter(
    (t) => t.patientId === selectedPatient.id || t.patientName === selectedPatient.name
  );

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    addPatientNote(selectedPatient.id, noteText);
    setNoteText('');
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 50) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
      <div 
        className="fixed inset-0 bg-navy-950/40 backdrop-blur-sm transition-opacity"
        onClick={() => setSelectedPatient(null)}
      />

      <div 
        className="relative w-full max-w-xl bg-white shadow-modal h-full flex flex-col z-10 animate-slide-in-right overflow-hidden border-l border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-sm">
              {selectedPatient.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{selectedPatient.name}</h3>
                <Badge variant="engagement">{selectedPatient.engagementLevel}</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedPatient.id} • Assigned to {selectedPatient.assignedStaff}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedPatient(null)}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close profile"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-slate-200 px-6 bg-white text-xs font-semibold">
          {(['overview', 'interactions', 'followups', 'notes'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-3 capitalize border-b-2 transition-all ${
                activeTab === tab 
                  ? 'border-teal-600 text-teal-700 font-bold' 
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab === 'followups' ? `Follow-ups (${patientFollowUps.length})` : tab}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Engagement Score Card */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-subtle space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-teal-600" />
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Patient Engagement Index
                    </h4>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getScoreColor(selectedPatient.engagementScore)}`}>
                    Score: {selectedPatient.engagementScore} / 100 ({selectedPatient.engagementLevel})
                  </span>
                </div>

                {/* Score bar */}
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-teal-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${selectedPatient.engagementScore}%` }}
                  />
                </div>

                {/* Operational Disclaimer Notice */}
                <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                  <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    Engagement score is a configurable operational indicator based on interaction and communication frequency. It is not a measure of patient health, treatment need, or clinical risk.
                  </p>
                </div>
              </div>

              {/* Patient Key Metrics */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Last Completed Visit
                  </span>
                  <p className="font-semibold text-slate-900">{selectedPatient.lastAppointment}</p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Next Scheduled Visit
                  </span>
                  <p className="font-semibold text-slate-900">{selectedPatient.nextAppointment}</p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Preferred Channel
                  </span>
                  <p className="font-semibold text-slate-900">{selectedPatient.preferredChannel}</p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Last Interaction
                  </span>
                  <p className="font-semibold text-slate-900">{selectedPatient.lastInteraction}</p>
                </div>
              </div>

              {/* Quick Assistant Trigger */}
              <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200/80 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-teal-950">Engage {selectedPatient.name}</h5>
                  <p className="text-[11px] text-teal-700 mt-0.5">Prepare an approved follow-up or reminder draft</p>
                </div>
                <button
                  onClick={() => openAIAssistant({ patient: selectedPatient, objective: 'Routine Follow-up' })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Draft
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Interactions Timeline */}
          {activeTab === 'interactions' && (
            <div className="space-y-4">
              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {selectedPatient.interactions.map((int) => (
                  <div key={int.id} className="relative group">
                    <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-teal-600" />
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{int.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{int.date}</span>
                      </div>
                      <p className="text-slate-600">{int.note}</p>
                      <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
                        <Badge variant="neutral" size="sm">{int.type}</Badge>
                        <span>Staff: {int.staff}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Follow-ups */}
          {activeTab === 'followups' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Active Tasks for {selectedPatient.name}</span>
                <button
                  onClick={() => setIsNewFollowUpModalOpen(true)}
                  className="inline-flex items-center gap-1 text-xs text-teal-600 font-bold hover:text-teal-700"
                >
                  <Plus className="w-3.5 h-3.5" />
                  New Task
                </button>
              </div>

              {patientFollowUps.length > 0 ? (
                <div className="space-y-2">
                  {patientFollowUps.map((t) => (
                    <div key={t.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{t.title}</span>
                        <Badge variant="priority">{t.priority}</Badge>
                      </div>
                      <p className="text-slate-500 text-[11px]">Due: {t.dueDate} • Assigned: {t.assignedStaff}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic py-6 text-center">No pending follow-ups for this patient.</p>
              )}
            </div>
          )}

          {/* Tab 4: Staff Notes */}
          {activeTab === 'notes' && (
            <div className="space-y-3">
              <form onSubmit={handleAddNote} className="space-y-2">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Add communication preference or administrative note..."
                  rows={2}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!noteText.trim()}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg text-xs font-medium transition-colors"
                  >
                    Save Note
                  </button>
                </div>
              </form>

              <div className="space-y-2">
                {selectedPatient.notes.map((n) => (
                  <div key={n.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                    <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1">
                      <span className="font-semibold text-slate-700">{n.author}</span>
                      <span>{n.createdAt}</span>
                    </div>
                    <p className="text-slate-700">{n.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
