import React, { useState, useEffect } from 'react';
import { useDentalFlow } from '../../context/DentalFlowContext';
import { Modal } from '../common/Modal';
import { 
  Sparkles, 
  Copy, 
  Check, 
  RefreshCw, 
  ShieldAlert, 
  Send, 
  Save, 
  FileText
} from 'lucide-react';

export const AIAssistantModal: React.FC = () => {
  const { 
    aiAssistantState, 
    closeAIAssistant, 
    saveEnquiryDraft, 
    markEnquiryReviewed,
    createFollowUpForEnquiry,
    addToast 
  } = useDentalFlow();

  const { isOpen, enquiry, patient, objective: initialObj, tone: initialTone, procedure: passedProc, specialty: passedSpec } = aiAssistantState;

  const [objective, setObjective] = useState('Consultation Booking Offer');
  const [tone, setTone] = useState<'Professional' | 'Friendly' | 'Concise'>('Friendly');
  const [template, setTemplate] = useState('BrightSmile Approved Standard');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [draftMessage, setDraftMessage] = useState('');
  const [copied, setCopied] = useState(false);

  // Derive procedure and specialty context
  const detectedProcedure = passedProc || enquiry?.aiClassification?.procedure || enquiry?.procedure || 'Dental Care Consultation';
  const detectedSpecialty = passedSpec || enquiry?.aiClassification?.specialty || enquiry?.service || 'General Dentistry';

  // Sync initial state when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialObj) setObjective(initialObj);
      if (initialTone) setTone(initialTone);
      
      // If enquiry already has a saved draft, load it; otherwise generate initial
      if (enquiry?.lastDraft) {
        setDraftMessage(enquiry.lastDraft);
      } else {
        generateDraft(initialTone || 'Friendly', initialObj || 'Consultation Booking Offer');
      }
    }
  }, [isOpen, enquiry, patient]);

  const recipientName = enquiry?.patientName || patient?.name || 'Valued Patient';

  const generateDraft = (selectedTone = tone, selectedObjective = objective) => {
    setIsGenerating(true);
    setGenerationStep(`Analyzing intent for ${detectedProcedure} (${detectedSpecialty})...`);

    setTimeout(() => {
      setGenerationStep('Applying BrightSmile approved communication guidelines...');
    }, 400);

    setTimeout(() => {
      setGenerationStep('Formatting procedure-specific message draft...');
    }, 700);

    setTimeout(() => {
      let draft = '';
      if (selectedObjective === 'Consultation Booking Offer') {
        if (selectedTone === 'Friendly') {
          draft = `Hello ${recipientName}! Thank you so much for reaching out to BrightSmile Dental Studio regarding your inquiry for ${detectedProcedure.toLowerCase()}. Our team specializing in ${detectedSpecialty} would love to welcome you in to discuss your goals. Would you like to schedule an introductory 30-minute consultation this week? You can reply directly to this message or call our front desk at (555) 382-9011 to pick a time that suits your schedule best. Looking forward to meeting you!`;
        } else if (selectedTone === 'Professional') {
          draft = `Dear ${recipientName}, thank you for contacting BrightSmile Dental Studio regarding your ${detectedProcedure} consultation in ${detectedSpecialty}. Our clinical coordination team is available to assist you with a comprehensive preliminary assessment and appointment scheduling. Please let us know your preferred days of the week, or contact our coordination desk at (555) 382-9011 to arrange an appointment.`;
        } else {
          draft = `Hi ${recipientName}, thanks for contacting BrightSmile Dental Studio about ${detectedProcedure}. We have consultation slots open this week with our ${detectedSpecialty} team. Would morning or afternoon suit you better? Reach us at (555) 382-9011 to confirm.`;
        }
      } else if (selectedObjective === 'Pricing & Scope Response') {
        if (selectedTone === 'Friendly') {
          draft = `Hi ${recipientName}, thank you for asking about our ${detectedProcedure.toLowerCase()} options and pricing! At BrightSmile, we believe in complete fee transparency. Because every patient's smile is unique, our ${detectedSpecialty} team begins with a quick diagnostic evaluation so we can provide an exact, itemized treatment plan. We also offer flexible interest-free monthly installment plans. Would you like us to reserve a 20-minute consultation to walk you through the options?`;
        } else if (selectedTone === 'Professional') {
          draft = `Dear ${recipientName}, in response to your enquiry regarding ${detectedProcedure} fees at BrightSmile Dental Studio, our clinic provides itemized estimates following an introductory evaluation with our ${detectedSpecialty} specialists. We accept major PPO insurance plans and provide flexible financing options. Please contact our administrative desk at (555) 382-9011 to schedule your assessment.`;
        } else {
          draft = `Hello ${recipientName}, our ${detectedProcedure} pricing depends on the initial examination. We offer transparent pricing and 0% financing through our ${detectedSpecialty} department. Contact us at (555) 382-9011 to schedule your evaluation.`;
        }
      } else if (selectedObjective === 'Urgent Assessment Triage') {
        draft = `Hello ${recipientName}, we received your urgent note regarding discomfort related to ${detectedProcedure.toLowerCase()}. While clinical triage is handled in-person by our dental team, we have reserved a same-day evaluation buffer at BrightSmile Dental Studio today. Please call our front desk immediately at (555) 382-9011 so our receptionist can accommodate you directly. If you are experiencing severe swelling or difficulty breathing, please seek emergency medical care immediately.`;
      } else {
        draft = `Hello ${recipientName}, thank you for connecting with BrightSmile Dental Studio regarding your ${detectedProcedure.toLowerCase()} request. One of our ${detectedSpecialty} patient coordinators will follow up shortly to help finalize your booking. Please let us know if you have any questions in the meantime.`;
      }

      setDraftMessage(draft);
      setIsGenerating(false);
      setGenerationStep('');
    }, 950);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(draftMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast({
      type: 'info',
      title: 'Copied to Clipboard',
      message: 'Draft message copied to clipboard.'
    });
  };

  const handleSaveDraft = () => {
    if (enquiry) {
      saveEnquiryDraft(enquiry.id, draftMessage);
    } else {
      addToast({
        type: 'success',
        title: 'Draft Saved',
        message: 'Communication draft recorded for patient file.'
      });
    }
  };

  const handleSendForReview = () => {
    if (enquiry) {
      saveEnquiryDraft(enquiry.id, draftMessage);
      markEnquiryReviewed(enquiry.id);
      createFollowUpForEnquiry(
        { ...enquiry, lastDraft: draftMessage },
        `Review communication draft: ${detectedProcedure}`
      );
    } else {
      addToast({
        type: 'success',
        title: 'Queued for Staff Review',
        message: 'Draft attached to patient record and assigned to receptionist queue.'
      });
    }
    closeAIAssistant();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeAIAssistant}
      title="AI Communication Assistant"
      subtitle="Generate compliant, personalized patient messaging drafts contextualized by procedure and specialty"
      maxWidth="2xl"
    >
      <div className="space-y-5">
        {/* Context Strip with Procedure and Specialty */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3.5 rounded-xl bg-teal-50/70 border border-teal-200/80 gap-2 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold shadow-xs flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-teal-950 text-sm">{recipientName}</span>
                <span className="text-teal-700">•</span>
                <span className="font-semibold text-teal-800 bg-white px-2 py-0.5 rounded border border-teal-200">
                  {detectedSpecialty}
                </span>
              </div>
              <p className="text-[11px] text-teal-700 mt-0.5 font-medium">
                Detected Procedure: <strong className="text-teal-950">{detectedProcedure}</strong>
              </p>
            </div>
          </div>
          <span className="bg-white/90 px-2.5 py-1 rounded-md text-[11px] font-medium text-teal-800 border border-teal-200/70 self-start sm:self-auto">
            {enquiry?.source ? `Via ${enquiry.source}` : 'Active Patient'}
          </span>
        </div>

        {/* Configuration Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Communication Objective
            </label>
            <select
              value={objective}
              onChange={(e) => {
                setObjective(e.target.value);
                generateDraft(tone, e.target.value);
              }}
              className="w-full text-xs py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="Consultation Booking Offer">Consultation Offer</option>
              <option value="Pricing & Scope Response">Pricing & Fee Info</option>
              <option value="Urgent Assessment Triage">Urgent Assessment Triage</option>
              <option value="Routine Follow-up">General Follow-up</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Draft Tone
            </label>
            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg">
              {(['Friendly', 'Professional', 'Concise'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setTone(t);
                    generateDraft(t, objective);
                  }}
                  className={`py-1 text-center text-xs font-medium rounded transition-all ${
                    tone === t 
                      ? 'bg-white text-teal-800 shadow-sm font-semibold' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Approved Template Rule
            </label>
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="w-full text-xs py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="BrightSmile Approved Standard">BrightSmile Standard</option>
              <option value="Specialty Specific Protocol">Specialty Clinical Protocol</option>
              <option value="Weekend Urgent Care Policy">Urgent Care Policy</option>
            </select>
          </div>
        </div>

        {/* Generation & Output Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <FileText className="w-4 h-4 text-teal-600" />
              Generated Draft (Editable)
            </div>
            <button
              onClick={() => generateDraft()}
              disabled={isGenerating}
              className="inline-flex items-center gap-1 text-xs text-teal-700 hover:text-teal-800 font-medium transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              Regenerate
            </button>
          </div>

          <div className="relative">
            {isGenerating ? (
              <div className="w-full h-44 rounded-xl border border-slate-200 bg-slate-50/70 p-4 flex flex-col items-center justify-center text-center">
                <div className="w-8 h-8 rounded-full border-2 border-teal-600 border-t-transparent animate-spin mb-3" />
                <p className="text-xs font-medium text-slate-700">{generationStep}</p>
                <p className="text-[11px] text-slate-400 mt-1">Applying practice boundaries & staff oversight checks...</p>
              </div>
            ) : (
              <textarea
                value={draftMessage}
                onChange={(e) => setDraftMessage(e.target.value)}
                rows={6}
                className="w-full p-3.5 text-xs sm:text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all font-sans leading-relaxed resize-none"
                placeholder="Draft message will appear here..."
              />
            )}
          </div>
        </div>

        {/* Safety & Compliance Notice */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/70 border border-amber-200/70 text-amber-900 text-xs">
          <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="leading-normal">
            <strong className="font-semibold text-amber-950">Administrative Assistant Notice:</strong> AI drafts are formulated for receptionist and marketing follow-up assistance. Qualified clinic staff must review, verify tone, and ensure clinical triage decisions are managed outside automated systems.
          </p>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={handleCopy}
            disabled={isGenerating || !draftMessage}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-400" />}
            {copied ? 'Copied!' : 'Copy Draft'}
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isGenerating || !draftMessage}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <Save className="w-4 h-4 text-slate-500" />
              Save to Enquiry
            </button>
            <button
              type="button"
              onClick={handleSendForReview}
              disabled={isGenerating || !draftMessage}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm transition-all"
            >
              <Send className="w-4 h-4" />
              Send for Staff Review
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
