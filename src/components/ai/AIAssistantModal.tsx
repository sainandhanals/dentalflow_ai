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
  FileText,
  UserRound
} from 'lucide-react';

export const AIAssistantModal: React.FC = () => {
  const { 
    aiAssistantState, 
    closeAIAssistant, 
    saveEnquiryDraft, 
    markEnquiryReviewed,
    addToast 
  } = useDentalFlow();

  const { isOpen, enquiry, patient, objective: initialObj, tone: initialTone } = aiAssistantState;

  const [objective, setObjective] = useState('Consultation Booking Offer');
  const [tone, setTone] = useState<'Professional' | 'Friendly' | 'Concise'>('Friendly');
  const [template, setTemplate] = useState('BrightSmile Approved Standard');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [draftMessage, setDraftMessage] = useState('');
  const [copied, setCopied] = useState(false);

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
  const serviceContext = enquiry?.service || 'Dental Care';

  const generateDraft = (selectedTone = tone, selectedObjective = objective) => {
    setIsGenerating(true);
    setGenerationStep('Analyzing enquiry intent and clinic context...');

    setTimeout(() => {
      setGenerationStep('Applying BrightSmile communication guidelines...');
    }, 400);

    setTimeout(() => {
      setGenerationStep('Formatting personalized message draft...');
    }, 700);

    setTimeout(() => {
      let draft = '';
      if (selectedObjective === 'Consultation Booking Offer') {
        if (selectedTone === 'Friendly') {
          draft = `Hello ${recipientName}! Thank you so much for reaching out to BrightSmile Dental Studio about ${serviceContext}. We would love to welcome you in and help you explore your options. Would you like to come in for a relaxed 30-minute consultation this week? You can reply directly to this message or call our front desk at (555) 382-9011 to pick a time that suits your schedule best. Looking forward to meeting you!`;
        } else if (selectedTone === 'Professional') {
          draft = `Dear ${recipientName}, thank you for contacting BrightSmile Dental Studio regarding your ${serviceContext} enquiry. Our team is available to assist you with comprehensive treatment overview and preliminary scheduling. Please let us know your preferred days of the week, or contact our coordination team at (555) 382-9011 to arrange an initial consultation appointment.`;
        } else {
          draft = `Hi ${recipientName}, thanks for contacting BrightSmile Dental Studio about ${serviceContext}. We have consultation slots open this week. Would morning or afternoon suit you better? Reach us at (555) 382-9011 to confirm.`;
        }
      } else if (selectedObjective === 'Pricing & Scope Response') {
        if (selectedTone === 'Friendly') {
          draft = `Hi ${recipientName}, thank you for asking about our ${serviceContext} pricing! At BrightSmile, we believe in complete transparency. Our packages start with an initial diagnostic assessment so our clinical team can tailor the exact treatment plan to your smile. We also offer flexible interest-free monthly installment plans. Would you like us to reserve a quick 20-minute consultation so we can give you an exact quote?`;
        } else if (selectedTone === 'Professional') {
          draft = `Dear ${recipientName}, in response to your enquiry regarding ${serviceContext} fees at BrightSmile Dental Studio, our clinic provides itemized treatment estimates following an introductory clinical evaluation. We accept major PPO insurance plans and provide flexible financing options. Please contact our administrative desk to schedule your assessment.`;
        } else {
          draft = `Hello ${recipientName}, our ${serviceContext} treatment pricing depends on the clinical assessment. We offer transparent pricing and 0% financing. Contact us at (555) 382-9011 to schedule your evaluation.`;
        }
      } else if (selectedObjective === 'Urgent Assessment Triage') {
        draft = `Hello ${recipientName}, we received your urgent note regarding discomfort. While clinical triage is handled in-person by our dental team, we have reserved a same-day evaluation buffer at BrightSmile Dental Studio today. Please call our front desk immediately at (555) 382-9011 so our receptionist can accommodate you directly. If you are experiencing severe swelling or difficulty breathing, please seek emergency medical care immediately.`;
      } else {
        draft = `Hello ${recipientName}, thank you for connecting with BrightSmile Dental Studio. We are checking our availability regarding your ${serviceContext} request. One of our patient care coordinators will follow up shortly to help finalize your booking. Please let us know if you have any questions in the meantime.`;
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
    }
    addToast({
      type: 'success',
      title: 'Queued for Staff Review',
      message: 'Draft attached to enquiry and assigned to receptionist queue.'
    });
    closeAIAssistant();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeAIAssistant}
      title="AI Communication Assistant"
      subtitle="Generate and review compliant, personalized patient messaging drafts"
      maxWidth="2xl"
    >
      <div className="space-y-5">
        {/* Context Strip */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-teal-50/60 border border-teal-100 text-xs text-teal-900">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-teal-950">{recipientName}</span>
              <span className="text-teal-700 ml-1.5">• {serviceContext}</span>
            </div>
          </div>
          <span className="bg-white/80 px-2.5 py-1 rounded-md text-[11px] font-medium text-teal-800 border border-teal-200/60">
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
              <option value="Orthodontic Specialization Protocol">Ortho Protocol</option>
              <option value="Weekend Urgent Triage Template">Urgent Care Policy</option>
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
