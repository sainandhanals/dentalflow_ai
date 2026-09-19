import React from 'react';
import { Modal } from '../common/Modal';
import { Appointment } from '../../types';
import { useDentalFlow } from '../../context/DentalFlowContext';
import { NO_SHOW_DISCLAIMER } from '../../services/noShowPredictionService';
import { 
  AlertTriangle, 
  Calendar, 
  Clock, 
  User, 
  UserCheck, 
  Phone, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  Stethoscope
} from 'lucide-react';

interface AppointmentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onOpenWaitlistOffer?: (appointment: Appointment) => void;
}

export const AppointmentDetailModal: React.FC<AppointmentDetailModalProps> = ({
  isOpen,
  onClose,
  appointment,
  onOpenWaitlistOffer
}) => {
  const { simulateAppointmentCancellation } = useDentalFlow();

  if (!appointment) return null;

  const getRiskColor = (level?: Appointment['riskLevel']) => {
    const l = (level || 'low').toLowerCase();
    if (l.includes('high')) {
      return {
        bg: 'bg-rose-50 border-rose-200 text-rose-700',
        bar: 'bg-rose-500',
        badge: 'bg-rose-100 text-rose-800 border-rose-300',
        label: 'High No-Show Risk'
      };
    }
    if (l.includes('med')) {
      return {
        bg: 'bg-amber-50 border-amber-200 text-amber-700',
        bar: 'bg-amber-500',
        badge: 'bg-amber-100 text-amber-800 border-amber-300',
        label: 'Moderate Risk'
      };
    }
    return {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
      bar: 'bg-emerald-500',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      label: 'Low Risk'
    };
  };

  const risk = getRiskColor(appointment.riskLevel);
  const prob = appointment.noShowRiskScore ?? appointment.noShowProbability ?? 0;
  const doctor = appointment.dentistName || appointment.provider;
  const duration = appointment.duration || 45;
  const operatory = appointment.operatory || 'Operatory 2';
  const phone = appointment.patientPhone || '98765 43210';
  const isCancelled = appointment.status === 'Cancelled' || appointment.status === 'cancelled';

  const handleSimulateCancel = () => {
    simulateAppointmentCancellation(appointment.id);
    onClose();
    if (onOpenWaitlistOffer) {
      onOpenWaitlistOffer(appointment);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Appointment & AI Risk Diagnostics"
      subtitle={`Ref #${appointment.id.toUpperCase()} • ${appointment.procedure}`}
      maxWidth="xl"
    >
      <div className="space-y-5">
        {/* Patient & Booking Details */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-lg">
              {appointment.patientName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-slate-900 text-base">{appointment.patientName}</h4>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${risk.badge}`}>
                  {risk.label}
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <Phone className="w-3 h-3 text-slate-400" />
                {phone} • Operatory: {operatory}
              </p>
            </div>
          </div>

          <div className="text-right text-xs text-slate-600 bg-white border border-slate-200 px-3 py-2 rounded-lg">
            <div className="flex items-center gap-1.5 font-medium text-slate-900">
              <Calendar className="w-3.5 h-3.5 text-teal-600" />
              {appointment.date}
            </div>
            <div className="flex items-center gap-1.5 text-slate-500 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {appointment.time} ({duration} min)
            </div>
          </div>
        </div>

        {/* AI Predictive Risk Card */}
        <div className={`p-4.5 rounded-xl border ${risk.bg}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <div>
                <h4 className="text-sm font-bold text-slate-900">DentalFlow AI Predictive Assessment</h4>
                <p className="text-xs text-slate-600">Calculated via ML ensemble (booking history, lead-time, confirmation state)</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-slate-900">{prob}%</span>
              <span className="text-xs block text-slate-500">Risk Probability</span>
            </div>
          </div>

          {/* Probability Bar */}
          <div className="mt-3 w-full bg-slate-200/80 rounded-full h-2.5 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-700 ${risk.bar}`}
              style={{ width: `${prob}%` }}
            />
          </div>

          {/* Risk Factors */}
          {appointment.riskFactors && appointment.riskFactors.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-200/60">
              <span className="text-xs font-semibold text-slate-800 uppercase tracking-wider block mb-2">
                Identified Risk Factors ({appointment.riskFactors.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {appointment.riskFactors.map((factor, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs bg-white/70 border border-slate-200/60 p-2 rounded-lg text-slate-700">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{factor}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Actions */}
          {appointment.recommendedActions && appointment.recommendedActions.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-200/60">
              <span className="text-xs font-semibold text-slate-800 uppercase tracking-wider block mb-2">
                Recommended Front-Desk Actions
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {appointment.recommendedActions.map((action, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Appointment Metadata Details */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-slate-500 block">Treating Clinician</span>
            <span className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1">
              <Stethoscope className="w-3 h-3 text-teal-600" />
              {doctor}
            </span>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-slate-500 block">Lead Time</span>
            <span className="font-semibold text-slate-800 mt-0.5">{appointment.leadTimeDays || 14} days prior</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-slate-500 block">Confirmation Status</span>
            <span className="font-semibold text-slate-800 mt-0.5 capitalize">{appointment.confirmationStatus || 'Pending'}</span>
          </div>
        </div>

        {/* AI Disclaimer */}
        <div className="bg-slate-100/80 border border-slate-200 rounded-lg p-3 text-[11px] text-slate-600 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <p>{NO_SHOW_DISCLAIMER}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Close Diagnostics
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {!isCancelled ? (
              <button
                type="button"
                onClick={handleSimulateCancel}
                className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                Simulate Patient Cancellation
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenWaitlistOffer) onOpenWaitlistOffer(appointment);
                }}
                className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                Auto-Fill Waitlist Slot
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
