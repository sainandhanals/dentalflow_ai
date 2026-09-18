import React, { useState } from 'react';
import { useDentalFlow } from '../../context/DentalFlowContext';
import { Modal } from './Modal';
import { Search, ArrowRight, UserRound, MessageSquare, CheckSquare } from 'lucide-react';
import { Badge } from './Badge';

export const SearchModal: React.FC = () => {
  const { 
    isSearchModalOpen, 
    setIsSearchModalOpen, 
    enquiries, 
    patients, 
    followUps,
    setSelectedEnquiry,
    setSelectedPatient,
    setActivePage
  } = useDentalFlow();

  const [query, setQuery] = useState('');

  const filteredEnquiries = query.trim() === '' ? [] : enquiries.filter(
    (e) =>
      e.patientName.toLowerCase().includes(query.toLowerCase()) ||
      e.enquirySummary.toLowerCase().includes(query.toLowerCase()) ||
      e.service.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4);

  const filteredPatients = query.trim() === '' ? [] : patients.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.email.toLowerCase().includes(query.toLowerCase()) ||
      p.phone.includes(query)
  ).slice(0, 4);

  const filteredFollowUps = query.trim() === '' ? [] : followUps.filter(
    (t) =>
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.patientName.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const handleSelectEnquiry = (enquiry: typeof enquiries[0]) => {
    setSelectedEnquiry(enquiry);
    setActivePage('enquiries');
    setIsSearchModalOpen(false);
    setQuery('');
  };

  const handleSelectPatient = (patient: typeof patients[0]) => {
    setSelectedPatient(patient);
    setActivePage('patients');
    setIsSearchModalOpen(false);
    setQuery('');
  };

  const handleSelectFollowUp = () => {
    setActivePage('followups');
    setIsSearchModalOpen(false);
    setQuery('');
  };

  return (
    <Modal
      isOpen={isSearchModalOpen}
      onClose={() => {
        setIsSearchModalOpen(false);
        setQuery('');
      }}
      title="Quick Search"
      subtitle="Search enquiries, patient profiles, and follow-up tasks"
      maxWidth="xl"
    >
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a patient name, service (e.g. Invisalign), or enquiry..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 transition-all placeholder:text-slate-400"
            autoFocus
          />
        </div>

        {query.trim() === '' ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            Start typing to search across BrightSmile clinic data...
          </div>
        ) : (
          <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
            {/* Enquiries results */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                Enquiries & Leads ({filteredEnquiries.length})
              </div>
              {filteredEnquiries.length > 0 ? (
                <div className="space-y-1.5">
                  {filteredEnquiries.map((e) => (
                    <div
                      key={e.id}
                      onClick={() => handleSelectEnquiry(e)}
                      className="group flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-teal-200 hover:bg-teal-50/40 cursor-pointer transition-all"
                    >
                      <div className="min-w-0 flex-1 pr-3">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-slate-900">{e.patientName}</span>
                          <Badge variant="status" size="sm">{e.status}</Badge>
                          <Badge variant="service" size="sm">{e.service}</Badge>
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{e.enquirySummary}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No matching enquiries found.</p>
              )}
            </div>

            {/* Patients results */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                <UserRound className="w-3.5 h-3.5 text-teal-600" />
                Patients ({filteredPatients.length})
              </div>
              {filteredPatients.length > 0 ? (
                <div className="space-y-1.5">
                  {filteredPatients.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleSelectPatient(p)}
                      className="group flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-teal-200 hover:bg-teal-50/40 cursor-pointer transition-all"
                    >
                      <div className="min-w-0 flex-1 pr-3">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-slate-900">{p.name}</span>
                          <Badge variant="engagement" size="sm">{p.engagementLevel}</Badge>
                          <span className="text-xs text-slate-400">Score: {p.engagementScore}</span>
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{p.email} • {p.nextAppointment}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No matching patients found.</p>
              )}
            </div>

            {/* Follow-up tasks results */}
            {filteredFollowUps.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  <CheckSquare className="w-3.5 h-3.5 text-teal-600" />
                  Follow-up Tasks ({filteredFollowUps.length})
                </div>
                <div className="space-y-1.5">
                  {filteredFollowUps.map((t) => (
                    <div
                      key={t.id}
                      onClick={handleSelectFollowUp}
                      className="group flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-teal-200 hover:bg-teal-50/40 cursor-pointer transition-all"
                    >
                      <div className="min-w-0 flex-1 pr-3">
                        <span className="font-semibold text-xs text-slate-900">{t.title}</span>
                        <p className="text-xs text-slate-500 truncate mt-0.5">Due: {t.dueDate} • Assigned: {t.assignedStaff}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
