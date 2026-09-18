import React, { useState } from 'react';
import { useDentalFlow } from '../context/DentalFlowContext';
import { 
  Building2, 
  MessageSquare, 
  Sliders, 
  Sparkles, 
  ShieldCheck, 
  Save, 
  RotateCcw,
  CheckCircle2,
  Lock,
  UserCheck
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, resetDemoData, addToast } = useDentalFlow();

  const [activeTab, setActiveTab] = useState<'profile' | 'communication' | 'rules' | 'ai' | 'privacy'>('profile');

  // Local form state initialized from context
  const [clinicName, setClinicName] = useState(settings.clinicName);
  const [phone, setPhone] = useState(settings.phone);
  const [email, setEmail] = useState(settings.email);
  const [operatingHours, setOperatingHours] = useState(settings.operatingHours);
  const [requireStaffReview, setRequireStaffReview] = useState(settings.requireStaffReview);
  const [aiAssistanceEnabled, setAiAssistanceEnabled] = useState(settings.aiAssistanceEnabled);
  const [inactivityDays, setInactivityDays] = useState(settings.inactivityThresholdDays);
  const [scoringVisits, setScoringVisits] = useState(settings.scoringWeightVisits);
  const [scoringComms, setScoringComms] = useState(settings.scoringWeightCommunication);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      clinicName,
      phone,
      email,
      operatingHours,
      requireStaffReview,
      aiAssistanceEnabled,
      inactivityThresholdDays: Number(inactivityDays),
      scoringWeightVisits: Number(scoringVisits),
      scoringWeightCommunication: Number(scoringComms),
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Practice Settings & AI Safeguards
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage practice identity, automated communication thresholds, and clinical safety policies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetDemoData}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
        </div>
      </div>

      {/* Main Settings Container with Left Tab Nav */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle flex flex-col md:flex-row overflow-hidden min-h-[500px]">
        {/* Left Navigation */}
        <div className="w-full md:w-60 border-b md:border-b-0 md:border-r border-slate-200/80 bg-slate-50/50 p-3 space-y-1">
          {[
            { id: 'profile', label: 'Clinic Profile', icon: Building2 },
            { id: 'communication', label: 'Communication Preferences', icon: MessageSquare },
            { id: 'rules', label: 'Engagement Scoring Rules', icon: Sliders },
            { id: 'ai', label: 'AI Configuration & Safety', icon: Sparkles },
            { id: 'privacy', label: 'Privacy & Access Controls', icon: Lock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-left transition-all ${
                  isActive
                    ? 'bg-white text-teal-800 font-bold shadow-sm border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Tab Content */}
        <div className="flex-1 p-6">
          <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
            {/* Tab 1: Profile */}
            {activeTab === 'profile' && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-900">Clinic Profile</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Primary information displayed on patient correspondence</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Clinic Legal / Display Name
                    </label>
                    <input
                      type="text"
                      value={clinicName}
                      onChange={(e) => setClinicName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Front Desk Phone
                      </label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Inbound Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Operating Hours
                    </label>
                    <input
                      type="text"
                      value={operatingHours}
                      onChange={(e) => setOperatingHours(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Communication Preferences */}
            {activeTab === 'communication' && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-900">Communication Preferences</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Control how patient drafts are generated and approved</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Mandatory Review Before Sending</span>
                      <span className="text-[11px] text-slate-500">Require receptionist verification for every outgoing communication</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={requireStaffReview}
                      onChange={(e) => setRequireStaffReview(e.target.checked)}
                      className="w-4 h-4 text-teal-600 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Approved Template Library</label>
                    <div className="space-y-2 text-xs">
                      <div className="p-3 rounded-lg border border-slate-200 bg-white">
                        <span className="font-semibold text-slate-900">BrightSmile Approved Standard</span>
                        <p className="text-[11px] text-slate-500 mt-0.5">Warm, friendly receptionist greeting with front-desk phone callback</p>
                      </div>
                      <div className="p-3 rounded-lg border border-slate-200 bg-white">
                        <span className="font-semibold text-slate-900">Orthodontic Treatment Inquiry</span>
                        <p className="text-[11px] text-slate-500 mt-0.5">Clear aligner scope, complimentary 3D scan booking invite</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Engagement Rules */}
            {activeTab === 'rules' && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-900">Engagement Scoring Rules</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Configure weights for the operational patient engagement indicator</p>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <div className="flex justify-between mb-1 font-semibold text-slate-700">
                      <span>Visit Attendance Weight:</span>
                      <span className="text-teal-700">{scoringVisits}%</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="80"
                      value={scoringVisits}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setScoringVisits(val);
                        setScoringComms(100 - val);
                      }}
                      className="w-full accent-teal-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 font-semibold text-slate-700">
                      <span>Communication Responsiveness Weight:</span>
                      <span className="text-teal-700">{scoringComms}%</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="80"
                      value={scoringComms}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setScoringComms(val);
                        setScoringVisits(100 - val);
                      }}
                      className="w-full accent-teal-600"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Inactivity Lapsed Threshold (Days)
                    </label>
                    <input
                      type="number"
                      value={inactivityDays}
                      onChange={(e) => setInactivityDays(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Patients with no visit or enquiry past this threshold are marked "At Risk".
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: AI Configuration & Safety */}
            {activeTab === 'ai' && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-900">AI Configuration & Clinical Safeguards</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Parameters governing AI auto-classification and message drafting</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">AI Auto-Classification</span>
                      <span className="text-[11px] text-slate-500">Automatically classify incoming enquiries by treatment specialty & intent</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={aiAssistanceEnabled}
                      onChange={(e) => setAiAssistanceEnabled(e.target.checked)}
                      className="w-4 h-4 text-teal-600 rounded"
                    />
                  </div>

                  <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl text-xs space-y-2">
                    <div className="flex items-center gap-2 text-teal-950 font-bold">
                      <ShieldCheck className="w-4 h-4 text-teal-600" />
                      Strict Clinical Safety Boundary Enforced
                    </div>
                    <p className="text-[11px] text-teal-800 leading-relaxed">
                      DentalFlow AI is programmed never to diagnose conditions, promise medical outcomes, or prescribe medications. All system outputs remain administrative and receptionist-focused.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 5: Privacy & Access */}
            {activeTab === 'privacy' && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-900">Privacy & Access Controls</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Role-based permissions and demonstration privacy policies</p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="font-semibold text-slate-900 block">Demonstration Mode Active</span>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      All patient records, phone numbers, and communication drafts shown in this environment are synthetic and fictional. No live EHR or external clinic API connections are active.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-semibold text-slate-900 block">Current Staff Role</span>
                    <p className="text-[11px] text-slate-500">Alex Morgan — Practice Manager (Full Administrative Access)</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
