import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Appointment, WaitlistEntry } from '../../types';
import { useDentalFlow } from '../../context/DentalFlowContext';
import { rankWaitlistCandidates, WaitlistMatchResult } from '../../services/waitlistMatchingService';
import { 
  Sparkles, 
  Send, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Zap, 
  Calendar, 
  ShieldCheck, 
  Phone,
  UserCheck
} from 'lucide-react';

interface WaitlistOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
}

export const WaitlistOfferModal: React.FC<WaitlistOfferModalProps> = ({
  isOpen,
  onClose,
  appointment
}) => {
  const { waitlist, sendWaitlistOffer, autoFillWaitlist } = useDentalFlow();
  const [sendingId, setSendingId] = useState<string | null>(null);

  if (!appointment) return null;

  const rankedResults = rankWaitlistCandidates(appointment, waitlist);
  const topResult = rankedResults[0];

  const handleSendOffer = (candidate: WaitlistEntry) => {
    setSendingId(candidate.id);
    setTimeout(() => {
      sendWaitlistOffer(candidate, appointment);
      setSendingId(null);
    }, 400);
  };

  const handleAutoFill = () => {
    autoFillWaitlist(appointment);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const doctor = appointment.dentistName || appointment.provider;
  const duration = appointment.duration || 45;
  const operatory = appointment.operatory || 'Operatory 2';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Waitlist Fast-Fill Dispatch"
      subtitle={`Fill Open Chair • ${appointment.time} on ${appointment.date} (${operatory})`}
      maxWidth="2xl"
    >
      <div className="space-y-5">
        {/* Open Chair Alert Banner */}
        <div className="bg-gradient-to-r from-teal-900 via-navy-900 to-slate-900 text-white p-4 rounded-xl shadow-sm border border-teal-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30 uppercase tracking-wide">
                Slot Available
              </span>
              <span className="text-xs text-slate-300">
                {appointment.date} • {appointment.time} ({duration} min)
              </span>
            </div>
            <h4 className="text-base font-bold text-white mt-1">
              {operatory} • {doctor}
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Target Procedure Specialty: <strong className="text-white">{appointment.procedure}</strong>
            </p>
          </div>

          {topResult && (
            <button
              type="button"
              onClick={handleAutoFill}
              className="px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-semibold text-xs rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 shrink-0 animate-pulse"
            >
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
              1-Click Smart Auto-Fill
            </button>
          )}
        </div>

        {/* AI Ranking Intro */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Top AI-Ranked Waitlist Candidates ({rankedResults.length})
            </h4>
          </div>
          <span className="text-[11px] text-slate-500">
            Ranked by Procedure Match, Commute Radius & Urgency
          </span>
        </div>

        {/* Candidate List */}
        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
          {rankedResults.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <p className="text-xs text-slate-500">No matching waitlist candidates found for this slot.</p>
            </div>
          ) : (
            rankedResults.map((result: WaitlistMatchResult, idx: number) => {
              const { candidate, acceptanceScore, matchReason } = result;
              const isTop = idx === 0;
              const hasOffer = candidate.status === 'Offer Sent' || candidate.status === 'offer_sent';
              const isScheduled = candidate.status === 'Accepted' || candidate.status === 'scheduled';
              const phone = candidate.phone || '98765 43210';
              const distance = candidate.distanceKm || (idx === 0 ? 1.8 : 3.5);
              const reasons = candidate.matchReasons && candidate.matchReasons.length > 0 
                ? candidate.matchReasons 
                : [matchReason];

              const urgencyStr = (candidate.urgency || 'Standard').toString().toUpperCase();
              const isUrgent = urgencyStr.includes('URGENT') || urgencyStr.includes('HIGH');

              return (
                <div 
                  key={candidate.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isTop 
                      ? 'bg-teal-50/40 border-teal-200 shadow-sm' 
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                        isTop ? 'bg-teal-600 text-white shadow' : 'bg-slate-100 text-slate-700'
                      }`}>
                        #{idx + 1}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h5 className="font-bold text-slate-900 text-sm">{candidate.patientName}</h5>
                          {isTop && (
                            <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded border border-teal-200 flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" /> Best Match
                            </span>
                          )}
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            isUrgent 
                              ? 'bg-rose-100 text-rose-700' 
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {urgencyStr}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-2">
                          <span className="font-medium text-slate-800">{candidate.procedure}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-slate-500">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {phone}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-slate-500">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {distance} km away
                          </span>
                        </p>

                        {/* Match Reasons Tags */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                          {reasons.map((reason: string, rIdx: number) => (
                            <span 
                              key={rIdx}
                              className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-600 font-medium"
                            >
                              ✓ {reason}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Action Column */}
                    <div className="flex flex-col sm:items-end justify-between gap-2 shrink-0">
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <span className="text-base font-black text-teal-700">{acceptanceScore}%</span>
                          <span className="text-[10px] text-slate-400 block -mt-1">Match Score</span>
                        </div>
                        <div className="w-12 bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-teal-600 h-full rounded-full" 
                            style={{ width: `${acceptanceScore}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        {isScheduled ? (
                          <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                            <CheckCircle className="w-3.5 h-3.5" /> Booked
                          </span>
                        ) : hasOffer ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                              Offer Dispatched
                            </span>
                            <button
                              type="button"
                              onClick={handleAutoFill}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow transition-colors flex items-center gap-1"
                            >
                              <UserCheck className="w-3.5 h-3.5" /> Confirm Slot
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleSendOffer(candidate)}
                              disabled={sendingId === candidate.id}
                              className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors flex items-center gap-1"
                            >
                              <Send className="w-3 h-3 text-teal-600" />
                              {sendingId === candidate.id ? 'Sending...' : 'Send SMS Offer'}
                            </button>
                            <button
                              type="button"
                              onClick={handleAutoFill}
                              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow transition-colors flex items-center gap-1"
                            >
                              <Zap className="w-3 h-3 text-amber-300" /> Auto-Fill
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
            <span>Automated waitlist notifications expire after 30 minutes if patient does not respond.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
