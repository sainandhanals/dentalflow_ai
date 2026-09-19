import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { TreatmentPlan } from '../../types';
import { useDentalFlow } from '../../context/DentalFlowContext';
import { 
  FileText, 
  Sparkles, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw, 
  Send, 
  Clock, 
  MessageSquare, 
  Mail, 
  Smartphone, 
  CreditCard, 
  ShieldCheck,
  Calendar,
  IndianRupee,
  Check
} from 'lucide-react';

interface TreatmentPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: TreatmentPlan | null;
}

export const TreatmentPlanModal: React.FC<TreatmentPlanModalProps> = ({
  isOpen,
  onClose,
  plan
}) => {
  const { generateNudgeSequenceForPlan, approveNudgeSequence } = useDentalFlow();
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  if (!plan) return null;

  const procName = plan.procedure || plan.procedureName || 'Dental Care';
  const planCost = plan.value ?? plan.estimatedCost ?? 28000;
  const isActive = plan.status === 'nudge_active' || plan.sequenceStatus === 'Active';
  const isAccepted = plan.status === 'accepted' || plan.status === 'Accepted';
  const objectionText = plan.objectionNotes || plan.recommendedApproach || 'Addressing financial and clinical concerns.';

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      generateNudgeSequenceForPlan(plan.id);
      setIsGenerating(false);
    }, 500);
  };

  const handleApprove = () => {
    approveNudgeSequence(plan.id);
  };

  const getChannelIcon = (channel?: string) => {
    switch (channel?.toLowerCase()) {
      case 'whatsapp':
        return <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />;
      case 'email':
        return <Mail className="w-3.5 h-3.5 text-sky-500" />;
      case 'sms':
      default:
        return <Smartphone className="w-3.5 h-3.5 text-purple-500" />;
    }
  };

  const getObjectionLabel = (category?: string) => {
    const c = (category || 'cost').toLowerCase();
    if (c.includes('cost')) {
      return { label: 'Cost / Out-of-Pocket Concern', icon: CreditCard, color: 'bg-amber-100 text-amber-800 border-amber-300' };
    }
    if (c.includes('fear') || c.includes('anxiety')) {
      return { label: 'Dental Anxiety / Pain Apprehension', icon: AlertCircle, color: 'bg-rose-100 text-rose-800 border-rose-300' };
    }
    if (c.includes('time') || c.includes('schedul')) {
      return { label: 'Scheduling & Time Limitations', icon: Clock, color: 'bg-blue-100 text-blue-800 border-blue-300' };
    }
    return { label: 'Need Education / Second Opinion', icon: FileText, color: 'bg-slate-100 text-slate-800 border-slate-300' };
  };

  const objection = getObjectionLabel(plan.objectionCategory);
  const ObjectionIcon = objection.icon;

  const activeMessage = plan.nudgeSequence && plan.nudgeSequence[activeStepIndex];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Empathetic Treatment Nudge Engine"
      subtitle={`Plan #${plan.id.toUpperCase()} • ${plan.patientName} (${procName})`}
      maxWidth="2xl"
    >
      <div className="space-y-5">
        {/* Header Summary Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-slate-900 text-base">{plan.patientName}</h4>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                isActive 
                  ? 'bg-purple-100 text-purple-800 border-purple-300' 
                  : isAccepted 
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border-amber-300'
              }`}>
                {isActive ? '● Nudge Sequence Active' : isAccepted ? '✓ Plan Accepted' : 'Pending Patient Decision'}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Recommended: <strong className="text-slate-800">{procName}</strong>
            </p>
            {plan.toothNumber && (
              <p className="text-[11px] text-slate-500 mt-0.5">
                Target Site: Tooth #{plan.toothNumber} • Diagnosed {plan.diagnosisDate || 'Recent'}
              </p>
            )}
          </div>

          <div className="text-right bg-white p-3 rounded-xl border border-slate-200">
            <div className="text-xs text-slate-500">Estimated Investment</div>
            <div className="text-xl font-black text-slate-900 flex items-center justify-end">
              <span>₹{planCost.toLocaleString('en-IN')}</span>
            </div>
            <div className="text-[10px] text-emerald-600 font-medium">Eligible for 0% EMI</div>
          </div>
        </div>

        {/* Identified Barrier / Objection Banner */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
              <ObjectionIcon className="w-4 h-4" />
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-900">Detected Hesitation Barrier:</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${objection.color}`}>
                  {objection.label}
                </span>
              </div>
              <p className="text-amber-800 text-xs">{objectionText}</p>
              <div className="text-[11px] text-amber-900/80 font-medium pt-1">
                💡 AI Recommended Strategy: {plan.recommendedStrategy || plan.recommendedApproach || 'Address payment flexibility without sounding transactional; highlight long-term tooth preservation.'}
              </div>
            </div>
          </div>
        </div>

        {/* 4-Step Sequence Timeline Tabs */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              Tailored 4-Step Patient Nudge Journey
            </h5>
            <button
              type="button"
              onClick={handleRegenerate}
              disabled={isGenerating}
              className="text-xs text-purple-700 hover:text-purple-900 flex items-center gap-1 font-medium transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
              Regenerate AI Copy
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {plan.nudgeSequence?.map((step, idx) => {
              const isSelected = activeStepIndex === idx;
              const stepDay = step.dayOffset ?? step.day ?? (idx * 3 + 1);
              const stepNum = step.stepNumber ?? (idx + 1);
              const stepChannel = step.channel || 'sms';
              const isSent = (step.status || 'Draft').toLowerCase().includes('sent');

              return (
                <button
                  key={step.id || `step-${idx}`}
                  type="button"
                  onClick={() => setActiveStepIndex(idx)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-purple-50/80 border-purple-300 ring-2 ring-purple-400/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold text-slate-800">Day {stepDay}</span>
                    {getChannelIcon(stepChannel)}
                  </div>
                  <div className="text-[11px] font-medium text-slate-600 truncate">
                    Step {stepNum}: {stepChannel.toUpperCase()}
                  </div>
                  <div className="text-[9px] text-slate-400 capitalize mt-0.5">
                    {isSent ? '✓ Sent' : 'Queued'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Nudge Message Preview */}
        {activeMessage && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800">
                  Step {activeMessage.stepNumber ?? (activeStepIndex + 1)} (Dispatched at Day {activeMessage.dayOffset ?? activeMessage.day ?? 1})
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-white border border-slate-200 font-semibold text-slate-700 capitalize">
                  {getChannelIcon(activeMessage.channel)}
                  {activeMessage.channel || 'sms'}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 italic">
                Focus: Empathy & Education
              </span>
            </div>

            {activeMessage.subject && (
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Subject</span>
                <span className="font-semibold text-slate-800">{activeMessage.subject}</span>
              </div>
            )}

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-1">Message Content</span>
              <div className="bg-white border border-slate-200 rounded-lg p-3 text-slate-800 text-xs leading-relaxed font-sans shadow-inner whitespace-pre-line">
                {activeMessage.body || activeMessage.message}
              </div>
            </div>
          </div>
        )}

        {/* Compliance Footer & Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
            <span>Patients can opt-out at any time via STOP. Compliant with HIPAA & healthcare outreach guidelines.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Close
            </button>

            <button
              type="button"
              onClick={handleApprove}
              disabled={isActive}
              className={`w-full sm:w-auto px-4 py-2 text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 ${
                isActive
                  ? 'bg-purple-700 text-white cursor-default'
                  : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/20'
              }`}
            >
              {isActive ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  Sequence Activated & Running
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  Approve & Launch 4-Step Sequence
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
