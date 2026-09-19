import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Household } from '../../types';
import { useDentalFlow } from '../../context/DentalFlowContext';
import { 
  Users, 
  Sparkles, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Phone, 
  MapPin, 
  Send, 
  Check, 
  Stethoscope, 
  ArrowRight,
  Smile
} from 'lucide-react';

interface HouseholdBundleModalProps {
  isOpen: boolean;
  onClose: () => void;
  household: Household | null;
}

export const HouseholdBundleModal: React.FC<HouseholdBundleModalProps> = ({
  isOpen,
  onClose,
  household
}) => {
  const { confirmHouseholdBundle } = useDentalFlow();
  const [selectedDay, setSelectedDay] = useState<string>('Saturday, Sep 23');
  const [selectedFormat, setSelectedFormat] = useState<'parallel' | 'staggered'>('parallel');

  if (!household) return null;

  const familyName = household.householdName || household.familyName || 'Family Bundle';
  const householdId = household.householdId || household.id || '';
  const isConfirmed = household.status === 'Bundled' || household.bundleStatus === 'confirmed';
  const contactName = household.primaryContactName || household.members[0]?.name || 'Primary Contact';
  const contactPhone = household.primaryContactPhone || '98765 43210';

  const handleConfirm = () => {
    confirmHouseholdBundle(householdId);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Family Household Itinerary & Multi-Chair Bundling"
      subtitle={`${familyName} • ${household.members.length} Family Members Scheduled`}
      maxWidth="2xl"
    >
      <div className="space-y-5">
        {/* Family Summary Card */}
        <div className="bg-gradient-to-r from-teal-50 via-sky-50 to-indigo-50 border border-teal-200/80 rounded-xl p-4.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black shadow-md">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-base">{familyName}</h4>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                    isConfirmed 
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                      : 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
                  }`}>
                    {isConfirmed ? '✓ Bundle Confirmed' : 'AI Opportunity Ready'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 flex items-center gap-2 mt-0.5">
                  <span className="font-medium text-slate-800">Primary: {contactName}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <Phone className="w-3 h-3 text-slate-400" />
                    {contactPhone}
                  </span>
                </p>
                {household.address && (
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {household.address}
                  </p>
                )}
              </div>
            </div>

            {/* Benefit Highlights */}
            <div className="text-right text-xs bg-white/90 border border-teal-200/60 p-2.5 rounded-lg shadow-xs">
              <div className="font-bold text-teal-800">Family Multi-Booking</div>
              <div className="text-[11px] text-slate-600 mt-0.5">
                ⚡ Saves family <strong className="text-teal-700">3 clinic trips</strong>
              </div>
              <div className="text-[11px] text-slate-600">
                ⚡ Eliminates <strong className="text-teal-700">45m chair downtime</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Scheduling Format Selector */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-teal-600" />
            <span className="font-semibold text-slate-800">Target Session:</span>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="Saturday, Sep 23">Saturday, Sep 23 (Morning Block)</option>
              <option value="Sunday, Sep 24">Sunday, Sep 24 (Weekend Special)</option>
              <option value="Friday, Sep 29">Friday, Sep 29 (Evening Block)</option>
            </select>
          </div>

          <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setSelectedFormat('parallel')}
              className={`px-2.5 py-1 rounded-md font-medium text-xs transition-colors ${
                selectedFormat === 'parallel' 
                  ? 'bg-teal-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Parallel Operatories
            </button>
            <button
              type="button"
              onClick={() => setSelectedFormat('staggered')}
              className={`px-2.5 py-1 rounded-md font-medium text-xs transition-colors ${
                selectedFormat === 'staggered' 
                  ? 'bg-teal-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Back-to-Back Chairs
            </button>
          </div>
        </div>

        {/* Members Interactive Itinerary Table */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              Unified Family Schedule Matrix ({household.members.length} Members)
            </h5>
            <span className="text-[11px] text-slate-500">Auto-allocated by procedure duration</span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-2.5 px-3">Family Member</th>
                  <th className="py-2.5 px-3">Age / Role</th>
                  <th className="py-2.5 px-3">Needed Dental Care</th>
                  <th className="py-2.5 px-3">Proposed Time Slot</th>
                  <th className="py-2.5 px-3">Chair & Clinician</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {household.members.map((member, idx) => {
                  const mId = member.memberId || member.id || `m-${idx}`;
                  const mAge = member.age ?? 32;
                  return (
                    <tr key={mId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3 font-semibold text-slate-900 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-100 text-teal-700 flex items-center justify-center font-bold text-xs border border-slate-200">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <div>{member.name}</div>
                          {member.isPrimary && (
                            <span className="text-[9px] text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded font-bold uppercase">
                              Primary
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-3 text-slate-600">
                        <div className="font-medium capitalize">{member.relationship}</div>
                        <div className="text-[11px] text-slate-400">{mAge} yrs old</div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-medium text-slate-800">{member.procedureNeeded || 'Dental Examination'}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {member.estimatedDurationMinutes || 45} mins
                        </div>
                      </td>

                    <td className="py-3 px-3">
                      <div className="font-semibold text-teal-700 bg-teal-50/80 px-2 py-1 rounded inline-flex items-center gap-1 border border-teal-200/50">
                        <Clock className="w-3 h-3 text-teal-600" />
                        {member.suggestedSlot || (idx % 2 === 0 ? '10:00 AM - 10:45 AM' : '10:45 AM - 11:30 AM')}
                      </div>
                    </td>

                    <td className="py-3 px-3 text-slate-700">
                      <div className="font-medium">{member.assignedOperatory || `Operatory ${idx % 2 === 0 ? '1' : '3'}`}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Stethoscope className="w-3 h-3 text-teal-600" />
                        {member.assignedDentist || (mAge < 12 ? 'Dr. Emily White (Pediatric)' : 'Dr. Sarah Wilson')}
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        isConfirmed 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {isConfirmed ? (
                          <>
                            <Check className="w-3 h-3" /> Confirmed
                          </>
                        ) : (
                          'Ready'
                        )}
                      </span>
                    </td>
                  </tr>
                );
              })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Consolidated Communication Preview */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-700">
          <div className="flex items-center gap-2 font-semibold text-slate-800 mb-1">
            <Send className="w-3.5 h-3.5 text-teal-600" />
            Consolidated Family SMS / WhatsApp Notification
          </div>
          <p className="text-slate-600 text-[11px] italic bg-white p-2.5 rounded-lg border border-slate-200">
            "Hello {household.primaryContactName}, we have coordinated your family visit for {household.members.length} members on {selectedDay}. Arun (10:00 AM, Op 1), Priya (10:00 AM, Op 3), Ayaan (10:45 AM, Op 3), Diya (10:45 AM, Op 1). Tap here to confirm all 4 slots in one click: [Link]"
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Close
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isConfirmed}
            className={`w-full sm:w-auto px-5 py-2.5 text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 ${
              isConfirmed
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/20'
            }`}
          >
            {isConfirmed ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                Family Bundle Confirmed & Booked
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                Confirm Family Bundle & Send Consolidated Notice
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
