import React, { useState } from 'react';
import { useDentalFlow } from '../../context/DentalFlowContext';
import { Badge } from '../common/Badge';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  MessageSquare, 
  ShieldAlert, 
  Send, 
  Trophy, 
  FileText,
  UserCheck,
  Calendar
} from 'lucide-react';
import { EnquiryStatus, PriorityLevel } from '../../types';

export const EnquiryDetailDrawer: React.FC = () => {
  const { 
    selectedEnquiry, 
    setSelectedEnquiry, 
    updateEnquiryStatus, 
    assignEnquiryStaff, 
    addEnquiryNote, 
    markEnquiryReviewed,
    markEnquiryConverted,
    openAIAssistant 
  } = useDentalFlow();

  const [newNoteText, setNewNoteText] = useState('');

  if (!selectedEnquiry) return null;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    addEnquiryNote(selectedEnquiry.id, newNoteText);
    setNewNoteText('');
  };

  const handleOpenAI = () => {
    openAIAssistant({
      enquiry: selectedEnquiry,
      objective: selectedEnquiry.priority === 'Urgent Review' 
        ? 'Urgent Assessment Triage' 
        : selectedEnquiry.aiClassification.intent.includes('Pricing')
          ? 'Pricing & Scope Response'
          : 'Consultation Booking Offer',
      tone: 'Friendly'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-navy-950/40 backdrop-blur-sm transition-opacity"
        onClick={() => setSelectedEnquiry(null)}
      />

      {/* Drawer */}
      <div 
        className="relative w-full max-w-xl bg-white shadow-modal h-full flex flex-col z-10 animate-slide-in-right overflow-hidden border-l border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600/10 text-teal-700 flex items-center justify-center font-bold text-sm">
              {selectedEnquiry.patientName.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  {selectedEnquiry.patientName}
                </h3>
                <Badge variant="status">{selectedEnquiry.status}</Badge>
                <Badge variant="priority">{selectedEnquiry.priority}</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                <span>{selectedEnquiry.id}</span>
                <span>•</span>
                <span>Via {selectedEnquiry.source}</span>
                <span>•</span>
                <span>{selectedEnquiry.receivedAt}</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedEnquiry(null)}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2 p-2 bg-slate-100/60 rounded-xl border border-slate-200/60">
            <button
              onClick={handleOpenAI}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Generate AI Draft
            </button>

            {!selectedEnquiry.isReviewed && (
              <button
                onClick={() => markEnquiryReviewed(selectedEnquiry.id)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                Mark Reviewed
              </button>
            )}

            {selectedEnquiry.status !== 'Converted' ? (
              <button
                onClick={() => markEnquiryConverted(selectedEnquiry.id)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
              >
                <Trophy className="w-3.5 h-3.5" />
                Mark as Converted
              </button>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-800 bg-emerald-100">
                <CheckCircle2 className="w-3.5 h-3.5" /> Converted Lead
              </span>
            )}
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <Mail className="w-4 h-4 text-slate-400" />
              <span className="font-mono text-[11px]">{selectedEnquiry.patientEmail}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Phone className="w-4 h-4 text-slate-400" />
              <span>{selectedEnquiry.patientPhone}</span>
            </div>
          </div>

          {/* Original Enquiry Message */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                Original Enquiry Message
              </h4>
              <Badge variant="service">{selectedEnquiry.service}</Badge>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed font-sans shadow-subtle">
              <p className="font-medium text-slate-900 mb-1">{selectedEnquiry.enquirySummary}</p>
              <p className="text-slate-600 italic">"{selectedEnquiry.fullMessage}"</p>
            </div>
          </div>

          {/* AI Administrative Classification & Suggested Next Action */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-50/80 to-sky-50/50 border border-teal-200/80 shadow-subtle space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-bold text-teal-950">AI Administrative Classification</h4>
              </div>
              <span className="text-[11px] font-semibold text-teal-700 bg-white/80 px-2 py-0.5 rounded-full border border-teal-200">
                {selectedEnquiry.aiClassification.confidence}% Confidence (Demo)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="bg-white/80 p-2.5 rounded-xl border border-teal-100">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Detected Intent
                </span>
                <span className="font-semibold text-slate-900">
                  {selectedEnquiry.aiClassification.intent}
                </span>
              </div>
              <div className="bg-white/80 p-2.5 rounded-xl border border-teal-100">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Service Category
                </span>
                <span className="font-semibold text-slate-900">
                  {selectedEnquiry.aiClassification.serviceCategory}
                </span>
              </div>
            </div>

            <div className="bg-white/90 p-3 rounded-xl border border-teal-100 text-xs">
              <span className="text-[10px] font-semibold text-teal-800 uppercase tracking-wider block mb-1">
                Suggested Next Action
              </span>
              <p className="text-slate-700 font-medium">
                {selectedEnquiry.aiClassification.suggestedAction}
              </p>
              <p className="text-[11px] text-slate-500 mt-1 italic">
                Reasoning: {selectedEnquiry.aiClassification.priorityReasoning}
              </p>
            </div>
          </div>

          {/* Operational vs Clinical Boundary Alert */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
            <ShieldAlert className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-slate-700">Administrative Boundary:</strong> AI classification assists staff triage and workflow dispatching. Clinical diagnosis and treatment recommendations remain solely with licensed dental professionals.
            </p>
          </div>

          {/* Status & Assignment Selectors */}
          <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50/70 rounded-xl border border-slate-200">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Update Status
              </label>
              <select
                value={selectedEnquiry.status}
                onChange={(e) => updateEnquiryStatus(selectedEnquiry.id, e.target.value as EnquiryStatus)}
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="New">New</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Follow-up Required">Follow-up Required</option>
                <option value="Responded">Responded</option>
                <option value="Converted">Converted</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Assign Staff
              </label>
              <select
                value={selectedEnquiry.assignedStaff}
                onChange={(e) => assignEnquiryStaff(selectedEnquiry.id, e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="Alex Morgan">Alex Morgan (Practice Manager)</option>
                <option value="Olivia Reed">Olivia Reed (Receptionist)</option>
                <option value="James Wilson">James Wilson (Coordinator)</option>
              </select>
            </div>
          </div>

          {/* Saved AI Draft Preview if any */}
          {selectedEnquiry.lastDraft && (
            <div className="p-3.5 rounded-xl bg-teal-50/50 border border-teal-200/70 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-teal-900 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-teal-600" />
                  Saved Draft (Awaiting Dispatch)
                </span>
                <button
                  onClick={handleOpenAI}
                  className="text-teal-700 hover:text-teal-900 text-[11px] font-semibold underline"
                >
                  Edit in Assistant
                </button>
              </div>
              <p className="text-slate-700 bg-white p-2.5 rounded-lg border border-teal-100 italic leading-relaxed">
                "{selectedEnquiry.lastDraft}"
              </p>
            </div>
          )}

          {/* Staff Notes Log */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Staff Notes & Activity ({selectedEnquiry.notes.length})
            </h4>

            <form onSubmit={handleAddNote} className="space-y-2">
              <textarea
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Add front-desk coordination note..."
                rows={2}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newNoteText.trim()}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  Add Staff Note
                </button>
              </div>
            </form>

            <div className="space-y-2">
              {selectedEnquiry.notes.map((n) => (
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
        </div>
      </div>
    </div>
  );
};
