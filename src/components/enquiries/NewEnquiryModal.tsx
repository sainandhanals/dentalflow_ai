import React, { useState } from 'react';
import { useDentalFlow } from '../../context/DentalFlowContext';
import { Modal } from '../common/Modal';
import { ServiceType, EnquirySource, PriorityLevel } from '../../types';
import { Sparkles } from 'lucide-react';

export const NewEnquiryModal: React.FC = () => {
  const { isNewEnquiryModalOpen, setIsNewEnquiryModalOpen, addEnquiry } = useDentalFlow();

  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [service, setService] = useState<ServiceType>('Orthodontics');
  const [source, setSource] = useState<EnquirySource>('Website');
  const [priority, setPriority] = useState<PriorityLevel>('High');
  const [assignedStaff, setAssignedStaff] = useState('Alex Morgan');
  const [enquirySummary, setEnquirySummary] = useState('');
  const [fullMessage, setFullMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) return;

    addEnquiry({
      patientName,
      patientEmail: patientEmail || `${patientName.toLowerCase().replace(/\s+/g, '.')}@demo.example`,
      patientPhone: patientPhone || '+1 (555) 000-0000',
      service,
      source,
      priority,
      assignedStaff,
      enquirySummary: enquirySummary || `Consultation request for ${service}`,
      fullMessage: fullMessage || `Patient contacted clinic inquiring about ${service} services and scheduling.`,
      aiClassification: {
        intent: 'Consultation Request',
        serviceCategory: service,
        suggestedAction: `Contact patient to offer approved ${service} consultation slots.`,
        confidence: 94,
        priorityReasoning: 'Newly entered enquiry logged by front desk staff.',
      }
    });

    setIsNewEnquiryModalOpen(false);
    // Reset fields
    setPatientName('');
    setPatientEmail('');
    setPatientPhone('');
    setEnquirySummary('');
    setFullMessage('');
  };

  return (
    <Modal
      isOpen={isNewEnquiryModalOpen}
      onClose={() => setIsNewEnquiryModalOpen(false)}
      title="Add New Patient Enquiry"
      subtitle="Log an incoming phone call, walk-in, or manual clinic enquiry"
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
              Service Requested
            </label>
            <select
              value={service}
              onChange={(e) => setService(e.target.value as ServiceType)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="Orthodontics">Orthodontics (Aligners, Braces)</option>
              <option value="General Dentistry">General Dentistry</option>
              <option value="Cosmetic Dentistry">Cosmetic Dentistry (Whitening, Veneers)</option>
              <option value="Preventive Dentistry">Preventive Dentistry (Hygiene & Exam)</option>
              <option value="Pediatric Dentistry">Pediatric Dentistry</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Enquiry Source
            </label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value as EnquirySource)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="Website">Website</option>
              <option value="Email">Email</option>
              <option value="Phone">Phone</option>
              <option value="Referral">Referral</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Initial Priority
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
              Assigned Staff
            </label>
            <select
              value={assignedStaff}
              onChange={(e) => setAssignedStaff(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="Alex Morgan">Alex Morgan (PM)</option>
              <option value="Olivia Reed">Olivia Reed (Reception)</option>
              <option value="James Wilson">James Wilson (Coord.)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Short Summary
          </label>
          <input
            type="text"
            value={enquirySummary}
            onChange={(e) => setEnquirySummary(e.target.value)}
            placeholder="e.g. Interested in clear aligner package & Saturday availability"
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Full Notes / Patient Message
          </label>
          <textarea
            rows={3}
            value={fullMessage}
            onChange={(e) => setFullMessage(e.target.value)}
            placeholder="Paste raw email, intake note, or caller comments here..."
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none leading-relaxed"
          />
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
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Add & Auto-Classify
          </button>
        </div>
      </form>
    </Modal>
  );
};
