import React, { useState, useEffect } from 'react';
import { useDentalFlow } from '../../context/DentalFlowContext';
import { Badge } from '../common/Badge';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  Mail, 
  Phone, 
  MessageSquare, 
  ShieldAlert, 
  Trophy, 
  FileText,
  UserCheck,
  Edit3,
  Check,
  Layers,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { EnquiryStatus, DentalSpecialty } from '../../types';
import { SPECIALTY_TAXONOMY, INTENT_CATEGORIES } from '../../data/specialtyTaxonomy';

export const EnquiryDetailDrawer: React.FC = () => {
  const { 
    selectedEnquiry, 
    setSelectedEnquiry, 
    updateEnquiryStatus, 
    assignEnquiryStaff, 
    addEnquiryNote, 
    markEnquiryReviewed,
    markEnquiryConverted,
    confirmEnquiryClassification,
    updateEnquiryClassification,
    openAIAssistant 
  } = useDentalFlow();

  const [newNoteText, setNewNoteText] = useState('');
  const [isEditingClassification, setIsEditingClassification] = useState(false);
  
  // Classification edit states
  const [editProcedure, setEditProcedure] = useState('');
  const [editSpecialty, setEditSpecialty] = useState<DentalSpecialty>('General Dentistry');
  const [editIntent, setEditIntent] = useState('Consultation Request');

  useEffect(() => {
    if (selectedEnquiry) {
      setEditProcedure(selectedEnquiry.aiClassification.procedure || selectedEnquiry.procedure || 'General dental consultation');
      setEditSpecialty((selectedEnquiry.aiClassification.specialty || selectedEnquiry.specialty || 'General Dentistry') as DentalSpecialty);
      setEditIntent(selectedEnquiry.aiClassification.intent || 'Consultation Request');
      setIsEditingClassification(false);
    }
  }, [selectedEnquiry]);

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
      procedure: selectedEnquiry.aiClassification.procedure || selectedEnquiry.procedure,
      specialty: selectedEnquiry.aiClassification.specialty || selectedEnquiry.specialty,
      objective: selectedEnquiry.priority === 'Urgent Review' 
        ? 'Urgent Assessment Triage' 
        : selectedEnquiry.aiClassification.intent.includes('Pricing')
          ? 'Pricing & Scope Response'
          : 'Consultation Booking Offer',
      tone: 'Friendly'
    });
  };

  const handleSaveClassificationEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProcedure.trim()) return;
    updateEnquiryClassification(selectedEnquiry.id, {
      procedure: editProcedure,
      specialty: editSpecialty,
      intent: editIntent,
    });
    setIsEditingClassification(false);
  };

  const aiClass = selectedEnquiry.aiClassification;
  const isMultiProcedure = aiClass.detectedProcedures && aiClass.detectedProcedures.length > 1;
  const isLowConfidence = aiClass.confidence < 60 || aiClass.confidenceLevel === 'Low';

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
                Original Patient Enquiry
              </h4>
              <Badge variant="source">{selectedEnquiry.source}</Badge>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed font-sans shadow-subtle">
              <p className="font-semibold text-slate-900 mb-1">{selectedEnquiry.enquirySummary}</p>
              <p className="text-slate-600 italic">"{selectedEnquiry.fullMessage}"</p>
            </div>
          </div>

          {/* FEATURE: AI Procedure & Specialty Classification */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-50/90 via-sky-50/40 to-slate-50 border border-teal-200 shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-teal-950">AI Procedure Classification</h4>
                  <p className="text-[11px] text-teal-700">Administrative categorization for front-desk triage</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {aiClass.isConfirmedByStaff ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                    <CheckCircle2 className="w-3 h-3" /> Confirmed
                  </span>
                ) : isLowConfidence ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                    <AlertCircle className="w-3 h-3" /> {aiClass.confidence}% Low Confidence
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-teal-800 bg-white/90 px-2.5 py-0.5 rounded-full border border-teal-200 shadow-xs">
                    {aiClass.confidence}% — Demo AI
                  </span>
                )}
              </div>
            </div>

            {/* In-place Edit Form or Display Mode */}
            {isEditingClassification ? (
              <form onSubmit={handleSaveClassificationEdit} className="space-y-3 p-3.5 bg-white rounded-xl border border-teal-200">
                <span className="text-xs font-bold text-slate-800 block">Edit Classification</span>
                
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Detected Procedure / Concern
                  </label>
                  <input
                    type="text"
                    required
                    value={editProcedure}
                    onChange={(e) => setEditProcedure(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Dental Specialty
                    </label>
                    <select
                      value={editSpecialty}
                      onChange={(e) => setEditSpecialty(e.target.value as DentalSpecialty)}
                      className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                    >
                      {SPECIALTY_TAXONOMY.map((r) => (
                        <option key={r.specialty} value={r.specialty}>
                          {r.specialty}
                        </option>
                      ))}
                      <option value="Needs Staff Review">Needs Staff Review</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Inferred Intent
                    </label>
                    <select
                      value={editIntent}
                      onChange={(e) => setEditIntent(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                    >
                      {INTENT_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEditingClassification(false)}
                    className="px-3 py-1 text-xs text-slate-600 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                  >
                    Save & Confirm
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                {/* Standard Display Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="bg-white/90 p-3 rounded-xl border border-teal-100/90 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Detected Procedure
                    </span>
                    <span className="font-bold text-slate-900 text-sm">
                      {aiClass.procedure || selectedEnquiry.procedure || 'General dental consultation'}
                    </span>
                  </div>

                  <div className="bg-white/90 p-3 rounded-xl border border-teal-100/90 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Dental Specialty
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-teal-800 text-sm">
                        {aiClass.specialty || selectedEnquiry.specialty || 'General Dentistry'}
                      </span>
                      {aiClass.specialty === 'Needs Staff Review' && (
                        <Badge variant="priority" size="sm">Staff Review</Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Intent & Confidence row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="bg-white/90 p-2.5 rounded-xl border border-teal-100/90 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                      Patient Intent
                    </span>
                    <span className="font-semibold text-slate-800">
                      {aiClass.intent}
                    </span>
                  </div>

                  <div className="bg-white/90 p-2.5 rounded-xl border border-teal-100/90 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                      Classification Confidence
                    </span>
                    <span className={`font-semibold ${isLowConfidence ? 'text-amber-700' : 'text-slate-800'}`}>
                      {aiClass.confidence}% ({aiClass.confidenceLevel} Confidence)
                    </span>
                  </div>
                </div>

                {/* Multiple Procedures Breakdown if applicable */}
                {isMultiProcedure && (
                  <div className="p-3 bg-white/90 rounded-xl border border-teal-100 text-xs space-y-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-teal-900 uppercase tracking-wider">
                      <Layers className="w-3.5 h-3.5 text-teal-600" />
                      Multiple Procedures Detected ({aiClass.detectedProcedures?.length})
                    </div>
                    <div className="space-y-1.5">
                      {aiClass.detectedProcedures?.map((proc, idx) => (
                        <div key={proc.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/70">
                          <div>
                            <span className="font-bold text-slate-900 text-xs">{idx + 1}. {proc.procedure}</span>
                            <span className="text-slate-500 text-[11px] block">Specialty: <strong className="text-teal-700">{proc.specialty}</strong></span>
                          </div>
                          <span className="text-[10px] font-semibold text-slate-400">{proc.confidence}% match</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Administrative Action */}
                <div className="bg-white/90 p-3 rounded-xl border border-teal-100 text-xs shadow-xs space-y-1">
                  <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block">
                    Suggested Administrative Action
                  </span>
                  <p className="text-slate-800 font-medium leading-relaxed">
                    {aiClass.suggestedAction}
                  </p>
                  <p className="text-[11px] text-slate-500 italic mt-0.5">
                    Reasoning: {aiClass.priorityReasoning}
                  </p>
                </div>

                {/* Confirm & Edit Buttons */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    {!aiClass.isConfirmedByStaff ? (
                      <button
                        onClick={() => confirmEnquiryClassification(selectedEnquiry.id)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-all hover:scale-[1.02]"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Confirm Classification
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-emerald-700 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Classification Confirmed by Staff
                      </span>
                    )}

                    <button
                      onClick={() => setIsEditingClassification(true)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                      Edit Classification
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Operational vs Clinical Boundary Alert */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
            <ShieldAlert className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-slate-800">Administrative Boundary:</strong> AI classification is for administrative routing only. Clinical concerns must be reviewed by qualified dental professionals.
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
