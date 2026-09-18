import React, { useState } from 'react';
import { useDentalFlow } from '../context/DentalFlowContext';
import { Badge } from '../components/common/Badge';
import { PatientDetailDrawer } from '../components/patients/PatientDetailDrawer';
import { 
  Search, 
  UserPlus, 
  Activity, 
  Eye, 
  ChevronRight, 
  Mail, 
  Phone, 
  Calendar, 
  Info,
  ShieldAlert
} from 'lucide-react';
import { EngagementLevel } from '../types';

export const PatientsPage: React.FC = () => {
  const { 
    patients, 
    setSelectedPatient, 
    addPatient, 
    setIsNewFollowUpModalOpen 
  } = useDentalFlow();

  const [searchQuery, setSearchQuery] = useState('');
  const [engagementFilter, setEngagementFilter] = useState<string>('All');
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientPhone, setNewPatientPhone] = useState('');

  const filteredPatients = patients.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery);
    const matchesLevel = engagementFilter === 'All' || p.engagementLevel === engagementFilter;
    return matchesSearch && matchesLevel;
  });

  const handleAddPatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim()) return;
    addPatient({
      name: newPatientName,
      phone: newPatientPhone || '+1 (555) 000-0000',
      email: `${newPatientName.toLowerCase().replace(/\s+/g, '.')}@demo.example`
    });
    setNewPatientName('');
    setNewPatientPhone('');
    setIsAddPatientOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Patients & Engagement
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Understand engagement history, communication patterns, and upcoming follow-ups.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddPatientOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all hover:scale-[1.02]"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Demo Patient</span>
          </button>
        </div>
      </div>

      {/* Operational Disclaimer Banner */}
      <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start gap-3 text-xs text-slate-600">
        <Info className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-800">Non-Clinical Operational Workspace:</strong> This view centralizes practice communication history and front-desk engagement metrics. Clinical records, diagnostic imaging, and treatment charts remain hosted securely in your certified clinical practice management system.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patients by name, email, or phone..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium">Filter Level:</span>
          <select
            value={engagementFilter}
            onChange={(e) => setEngagementFilter(e.target.value)}
            className="text-xs py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="All">All Levels</option>
            <option value="Active">Active (75-100)</option>
            <option value="Moderate">Moderate (50-74)</option>
            <option value="At Risk">At Risk (&lt; 50)</option>
          </select>
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Patient Profile</th>
                <th className="py-3 px-4">Contact (Masked)</th>
                <th className="py-3 px-4">Last Visit</th>
                <th className="py-3 px-4">Next Scheduled</th>
                <th className="py-3 px-4">Engagement Index</th>
                <th className="py-3 px-4">Last Interaction</th>
                <th className="py-3 px-4">Coordinator</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {filteredPatients.map((patient) => (
                <tr
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-teal-600/10 text-teal-700 flex items-center justify-center font-bold text-xs">
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                          {patient.name}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {patient.id}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="text-slate-800">{patient.phone}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{patient.email}</div>
                  </td>

                  <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                    {patient.lastAppointment}
                  </td>

                  <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                    {patient.nextAppointment}
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="engagement">{patient.engagementLevel}</Badge>
                      <span className="font-semibold text-xs text-slate-700">
                        {patient.engagementScore}/100
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                    {patient.lastInteraction}
                  </td>

                  <td className="py-3 px-4 font-medium text-slate-700 whitespace-nowrap">
                    {patient.assignedStaff}
                  </td>

                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setSelectedPatient(patient)}
                      className="inline-flex items-center gap-1 text-xs text-teal-600 hover:text-teal-800 font-semibold px-2 py-1 rounded-lg hover:bg-teal-50 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Add Patient Modal */}
      {isAddPatientOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-modal max-w-md w-full p-5 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Add Demo Patient</h3>
            <p className="text-xs text-slate-500 mb-4">Create a fictional patient profile for engagement demonstration</p>

            <form onSubmit={handleAddPatientSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  placeholder="e.g. Liam Johnson"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={newPatientPhone}
                  onChange={(e) => setNewPatientPhone(e.target.value)}
                  placeholder="+1 (555) 432-8877"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddPatientOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Patient Detail Drawer */}
      <PatientDetailDrawer />
    </div>
  );
};
