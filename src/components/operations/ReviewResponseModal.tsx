import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { DentalReview } from '../../types';
import { useDentalFlow } from '../../context/DentalFlowContext';
import { REVIEW_SAFETY_DISCLAIMER } from '../../services/reviewResponseService';
import { 
  Star, 
  Sparkles, 
  ShieldAlert, 
  RefreshCw, 
  Check, 
  Copy, 
  Send, 
  ExternalLink, 
  MessageSquare,
  Building,
  CheckCircle2
} from 'lucide-react';

interface ReviewResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: DentalReview | null;
}

export const ReviewResponseModal: React.FC<ReviewResponseModalProps> = ({
  isOpen,
  onClose,
  review
}) => {
  const { generateReviewDraftForReview, approveReviewDraft } = useDentalFlow();
  const [editedResponse, setEditedResponse] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  useEffect(() => {
    if (review) {
      setEditedResponse(review.aiDraftResponse || review.aiDraft || '');
    }
  }, [review]);

  if (!review) return null;

  const author = review.authorName || review.reviewerName || 'Patient';
  const reviewDate = review.reviewDate || review.date || 'Recent visit';
  const aiDraft = review.aiDraftResponse || review.aiDraft || '';
  const isApproved = review.approvalStatus === 'Approved' || review.responseStatus === 'approved';
  const visitContext = review.matchedVisit || review.patientVisitContext;

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      generateReviewDraftForReview(review.id);
      setIsGenerating(false);
    }, 450);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editedResponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApprove = () => {
    approveReviewDraft(review.id);
    onClose();
  };

  const getPlatformBadge = (platform?: string) => {
    const p = (platform || 'google').toLowerCase();
    switch (p) {
      case 'google':
        return { name: 'Google Review', bg: 'bg-red-50 text-red-700 border-red-200' };
      case 'practo':
        return { name: 'Practo Feedback', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'yelp':
        return { name: 'Yelp Rating', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
      default:
        return { name: 'Patient Review', bg: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  const platform = getPlatformBadge(review.platform);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Review Response Engine (HIPAA Compliant)"
      subtitle={`Feedback from ${author} on ${platform.name}`}
      maxWidth="2xl"
    >
      <div className="space-y-5">
        {/* Patient Review Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4.5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-sm">
                {author.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{author}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  {/* Star Rating */}
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-500">• {reviewDate}</span>
                </div>
              </div>
            </div>

            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border self-start sm:self-auto ${platform.bg}`}>
              {platform.name}
            </span>
          </div>

          {/* Review Text */}
          <div className="bg-white p-3.5 rounded-lg border border-slate-200 text-slate-800 text-xs leading-relaxed italic">
            "{review.reviewText}"
          </div>

          {/* Matched Internal Visit Context */}
          {visitContext && (
            <div className="bg-slate-100/70 rounded-lg p-2.5 text-xs text-slate-600 flex flex-wrap items-center gap-3">
              <span className="font-bold text-slate-700 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-teal-600" />
                Internal Practice Record:
              </span>
              <span>Procedure: <strong>{visitContext.procedure || visitContext.recentProcedure || 'Care Visit'}</strong></span>
              <span>•</span>
              <span>Clinician: <strong>{visitContext.dentist || visitContext.provider || 'Staff Clinician'}</strong></span>
              <span>•</span>
              <span>Visited: <strong>{visitContext.visitDate || visitContext.appointmentDate || 'Recent'}</strong></span>
            </div>
          )}
        </div>

        {/* HIPAA Safety Guard Banner */}
        <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-3 text-xs text-blue-900 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold block">HIPAA & Healthcare Privacy Guard Active</span>
            <p className="text-[11px] text-blue-800 leading-normal">{REVIEW_SAFETY_DISCLAIMER}</p>
          </div>
        </div>

        {/* AI Response Draft Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                AI-Suggested Public Response Draft
              </h5>
              <span className="text-[10px] bg-teal-50 text-teal-700 font-semibold px-2 py-0.5 rounded border border-teal-200">
                {review.sentiment === 'negative' ? 'Empathetic De-escalation' : 'Appreciative & Professional'}
              </span>
            </div>

            <button
              type="button"
              onClick={handleRegenerate}
              disabled={isGenerating}
              className="text-xs text-teal-700 hover:text-teal-900 flex items-center gap-1 font-medium transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
              Regenerate Draft
            </button>
          </div>

          <div className="relative">
            <textarea
              rows={5}
              value={editedResponse}
              onChange={(e) => setEditedResponse(e.target.value)}
              className="w-full text-xs text-slate-800 p-3.5 bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 leading-relaxed font-sans shadow-sm"
              placeholder="AI generating response draft..."
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCopy}
              className="w-full sm:w-auto px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy Draft'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>

          <button
            type="button"
            onClick={handleApprove}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Approve & Publish Response
          </button>
        </div>
      </div>
    </Modal>
  );
};
