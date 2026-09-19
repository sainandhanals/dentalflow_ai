export interface NoShowPredictionInput {
  appointmentId?: string;
  patientName: string;
  leadTimeDays?: number;
  confirmationStatus?: string;
  attendanceHistory?: string;
  cancellationHistory?: string;
  procedure?: string;
  time?: string;
}

export interface NoShowPredictionOutput {
  riskLevel: 'Low' | 'Medium' | 'High';
  riskScore: number;
  noShowProbability: number;
  factors: string[];
  recommendedActions: string[];
  isDemo: boolean;
  disclaimer: string;
}

export class NoShowPredictionService {
  public static calculateRisk(input: NoShowPredictionInput): NoShowPredictionOutput {
    let score = 20; // baseline score
    const factors: string[] = [];
    const recommendedActions: string[] = [];

    // Confirmation status factor
    const status = (input.confirmationStatus || 'unconfirmed').toLowerCase();
    if (status === 'confirmed') {
      score -= 15;
      factors.push('Patient confirmed via two-way communication (-15 risk)');
    } else if (status === 'unconfirmed') {
      score += 25;
      factors.push('Unconfirmed booking within 48h (+25 risk)');
    }

    // Lead time factor
    const leadTime = input.leadTimeDays ?? 3;
    if (leadTime > 14) {
      score += 20;
      factors.push(`Booked ${leadTime} days in advance without recent touchpoint (+20 risk)`);
    } else if (leadTime <= 2) {
      score -= 5;
      factors.push('Short lead time booking; high immediate presence (-5 risk)');
    }

    // Attendance history factor
    const attendance = (input.attendanceHistory || '').toLowerCase();
    if (attendance.includes('missed') && !attendance.includes('0 missed')) {
      score += 25;
      factors.push('History of prior missed appointments (+25 risk)');
    } else if (attendance.includes('0 missed') || attendance.includes('attended')) {
      score -= 10;
      factors.push('Consistent historical appointment attendance (-10 risk)');
    }

    // Cancellation history
    const cancellation = (input.cancellationHistory || '').toLowerCase();
    if (cancellation.includes('late') && !cancellation.includes('0 late')) {
      score += 20;
      factors.push('Prior late cancellations documented (+20 risk)');
    }

    // Slot time factor (Friday afternoons or Monday early mornings have slightly higher historical churn)
    const time = (input.time || '').toLowerCase();
    if (time.includes('pm') && (time.includes('4:') || time.includes('5:'))) {
      score += 10;
      factors.push('Late afternoon time slot (+10 risk)');
    }

    // Normalize score 5-95
    score = Math.min(Math.max(score, 5), 95);
    const noShowProbability = Math.round((score / 100) * 100) / 100;

    let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
    if (score >= 60) {
      riskLevel = 'High';
      recommendedActions.push('Direct phone confirmation call from reception team');
      recommendedActions.push('Stage waitlist candidate on standby if unconfirmed 4 hours prior');
      recommendedActions.push('Require deposit or advance verbal verification for future bookings');
    } else if (score >= 35) {
      riskLevel = 'Medium';
      recommendedActions.push('Send two-way interactive SMS reminder 24 hours prior');
      recommendedActions.push('Check patient transportation or child care availability if noted');
    } else {
      riskLevel = 'Low';
      recommendedActions.push('Send automated standard SMS/calendar reminder');
      recommendedActions.push('No administrative intervention required');
    }

    return {
      riskLevel,
      riskScore: score,
      noShowProbability,
      factors,
      recommendedActions,
      isDemo: true,
      disclaimer:
        'Notice: This no-show risk score is an operational estimation based on administrative scheduling logistics, not clinical patient data.',
    };
  }
}
