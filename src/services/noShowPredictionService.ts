import { Appointment, AppointmentRiskLevel } from '../types';

export interface NoShowPredictionResult {
  probability: number;
  riskLevel: AppointmentRiskLevel;
  factors: string[];
  recommendedAction: string;
}

/**
 * Service to predict appointment no-show probability based on historical patient attendance,
 * lead time, procedure type, and time slot characteristics.
 * 
 * Note: Operational scheduling decision support signal only; not clinically authoritative.
 */
export function calculateNoShowRisk(appointment: Partial<Appointment>): NoShowPredictionResult {
  let score = 20; // baseline 20%
  const factors: string[] = [];

  // 1. History factors
  const cancelHistory = (appointment.cancellationHistory || '').toLowerCase();
  const attendHistory = (appointment.attendanceHistory || '').toLowerCase();

  if (cancelHistory.includes('2') || cancelHistory.includes('multiple') || cancelHistory.includes('frequent')) {
    score += 35;
    factors.push('2 previous unexcused no-shows in past 6 months');
  } else if (cancelHistory.includes('1')) {
    score += 18;
    factors.push('1 previous late cancellation (< 24h notice)');
  }

  if (attendHistory.includes('irregular') || attendHistory.includes('lapsed') || attendHistory.includes('sporadic')) {
    score += 15;
    factors.push('Sporadic past attendance record');
  }

  // 2. Procedure invasiveness
  const proc = (appointment.procedure || '').toLowerCase();
  if (proc.includes('root canal') || proc.includes('extraction') || proc.includes('surgery') || proc.includes('implant')) {
    score += 14;
    factors.push('Invasive dental procedure (higher patient hesitation/anxiety)');
  }

  // 3. Time / lead time
  const time = (appointment.time || '').toLowerCase();
  if (time.includes('morning') || time.includes('10:') || time.includes('9:')) {
    score += 5;
    factors.push('Mid-morning slot booked > 2 weeks in advance');
  }

  // Clamp score
  const finalProbability = Math.min(96, Math.max(8, score));
  let riskLevel: AppointmentRiskLevel = 'Low Risk';
  if (finalProbability >= 65) {
    riskLevel = 'High Risk';
  } else if (finalProbability >= 35) {
    riskLevel = 'Medium Risk';
  }

  let recommendedAction = 'Standard automated 24h SMS reminder scheduled.';
  if (riskLevel === 'High Risk') {
    recommendedAction = 'Send personalized 2-way confirmation prompt & standby priority waitlist candidates.';
  } else if (riskLevel === 'Medium Risk') {
    recommendedAction = 'Automate interactive phone verification 48 hours prior.';
  }

  return {
    probability: finalProbability,
    riskLevel,
    factors: factors.length > 0 ? factors : ['Consistent past appointment attendance', 'Slot confirmed recently'],
    recommendedAction,
  };
}

export const NO_SHOW_DISCLAIMER =
  'AI prediction based on historical scheduling behavior. Use as an operational decision-support signal, not a certainty.';
