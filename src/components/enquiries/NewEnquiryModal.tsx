import React, { useState, useEffect } from 'react';
import { useDentalFlow } from '../../context/DentalFlowContext';
import { Modal } from '../common/Modal';
import { DentalSpecialty, EnquirySource, PriorityLevel } from '../../types';
import { classifyEnquiry } from '../../services/classificationService';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { SPECIALTY_TAXONOMY } from '../../data/specialtyTaxonomy';

export const NewEnquiryModal: React.FC = () => {
  const { isNewEnquiryModalOpen, setIsNewEnquiryModalOpen, addEnquiry } = useDentalFlow();

  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [source, setSource] = useState<EnquirySource>('Website');
  const [priority, setPriority] = useState<PriorityLevel>('High');
  const [assignedStaff, setAssignedStaff] = useState('Alex Morgan');
  const [enquirySummary, setEnquirySummary] = useState('');
  const [fullMessage, setFullMessage] = useState('');

  // Live Auto-Classification State
  const [detectedProcedure, setDetectedProcedure] = useState('General dental consultation');
  const [detectedSpecialty, setDetectedSpecialty] = useState<DentalSpecialty>('General Dentistry');
  const [detectedConfidence, setDetectedConfidence] = useState(90);
  const [isManualOverride, setIsManualOverride] = useState(false);

  // Re-classify on message change
  useEffect(() => {
    const textToClassify = fullMessage || enquirySummary;
    if (textToClassify.trim().length > 3 && !isManualOverride) {
      const result = classifyEnquiry(textToClassify);
      setDetectedProcedure(result.procedure);
      setDetectedSpecialty(result.specialty);
      setDetectedConfidence(result.confidence);
    }
  }, [fullMessage, enquirySummary, isManualOverride]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) return;

    const classification = classifyEnquiry(fullMessage || enquirySummary);
    // If user manually changed specialty, respect it
    if (isManualOverride) {
      classification.procedure = detectedProcedure;
      classification.specialty = detectedSpecialty;
      classification.serviceCategory = detectedSpecialty;
      classification.isConfirmedByStaff = true;
    }

    addEnquiry({
      patientName,
      patientEmail: patientEmail || `${patientName.toLowerCase().replace(/\s+/g, '.')}@demo.example`,
      patientPhone: patientPhone || '+1 (555) 000-0000',
      service: detectedSpecialty,
      procedure: detectedProcedure,
      specialty: detectedSpecialty,
      source,
      priority,
      assignedStaff,
      enquirySummary: enquirySummary || `Consultation request for ${detectedProcedure}`,
      fullMessage: fullMessage || `Patient contacted clinic inquiring about ${detectedProcedure} services and scheduling.`,
      aiClassification: classification
    });

    setIsNewEnquiryModalOpen(false);
    // Reset fields
    setPatientName('');
    setPatientEmail('');
    setPatientPhone('');
    setEnquirySummary('');
    setFullMessage('');
    setIsManualOverride(false);
  };

  return (
    <Modal
      isOpen={isNewEnquiryModalOpen}
      onClose={() => setIsNewEnquiryModalOpen(false)}
      title="Add New Patient Enquiry"
      subtitle="Log an incoming phone call, walk-in, or manual clinic enquiry with AI procedure detection"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Patient / Lead Name *
            </label>
            <input
              type="text"
              required
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="e.g. Jessica Miller"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              value={patientPhone}
              onChange={(e) => setPatientPhone(e.target.value)}
              placeholder="+1 (555) 341-9988"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={patientEmail}
              onChange={(e) => setPatientEmail(e.target.value)}
              placeholder="jessica.m@demo.example"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Enquiry Source
            </label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value as EnquirySource)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="Website">Website Form</option>
              <option value="Email">Email</option>
              <option value="Phone">Phone Call</option>
              <option value="Referral">Doctor Referral</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Patient Inquiry Message / Description *
          </label>
          <textarea
            required
            rows={3}
            value={fullMessage}
            onChange={(e) => setFullMessage(e.target.value)}
            placeholder="e.g. I am interested in getting braces. Can someone explain the options and cost?"
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none leading-relaxed"
          />
        </div>

        {/* Real-time AI Procedure & Specialty Preview */}
        <div className="p-3.5 bg-gradient-to-br from-teal-50/70 to-slate-50 border border-teal-200 rounded-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-teal-950">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              Live AI Procedure Detection
            </div>
            <span className="text-[10px] font-semibold text-teal-800 bg-white px-2 py-0.5 rounded-full border border-teal-200">
              {detectedConfidence}% Match
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div>
              <span className="text-[10px] font-semibold text-slate-500 block mb-0.5">
                Detected Procedure
              </span>
              <input
                type="text"
                value={detectedProcedure}
                onChange={(e) => {
                  setDetectedProcedure(e.target.value);
                  setIsManualOverride(true);
                }}
                className="w-full text-xs px-2 py-1 bg-white border border-slate-200 rounded-lg text-slate-900 font-semibold"
              />
            </div>

            <div>
              <span className="text-[10px] font-semibold text-slate-500 block mb-0.5">
                Dental Specialty
              </span>
              <select
                value={detectedSpecialty}
                onChange={(e) => {
                  setDetectedSpecialty(e.target.value as DentalSpecialty);
                  setIsManualOverride(true);
                }}
                className="w-full text-xs px-2 py-1 bg-white border border-slate-200 rounded-lg text-teal-900 font-semibold"
              >
                {SPECIALTY_TAXONOMY.map((r) => (
                  <option key={r.specialty} value={r.specialty}>
                    {r.specialty}
                  </option>
                ))}
                <option value="Needs Staff Review">Needs Staff Review</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Operational Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as PriorityLevel)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="Urgent Review">Urgent Review</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Assign Front-Desk Staff
            </label>
            <select
              value={assignedStaff}
              onChange={(e) => setAssignedStaff(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="Alex Morgan">Alex Morgan (Practice Manager)</option>
              <option value="Olivia Reed">Olivia Reed (Receptionist)</option>
              <option value="James Wilson">James Wilson (Coordinator)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setIsNewEnquiryModalOpen(false)}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Add & Auto-Classify
          </button>
        </div>
      </form>
    </Modal>
  );
};
