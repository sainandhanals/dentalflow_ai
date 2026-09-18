import React, { useState } from 'react';
import { useDentalFlow } from '../context/DentalFlowContext';
import { Badge } from '../components/common/Badge';
import { EnquiryDetailDrawer } from '../components/enquiries/EnquiryDetailDrawer';
import { NewEnquiryModal } from '../components/enquiries/NewEnquiryModal';
import { 
  Search, 
  RotateCcw, 
  Plus, 
  Sparkles, 
  Eye, 
  CheckCircle2,
  Check,
  Filter
} from 'lucide-react';
import { DentalSpecialty } from '../types';
import { SPECIALTY_TAXONOMY, INTENT_CATEGORIES } from '../data/specialtyTaxonomy';

export const EnquiriesPage: React.FC = () => {
  const { 
    enquiries, 
    setSelectedEnquiry, 
    setIsNewEnquiryModalOpen,
    openAIAssistant,
    selectedSpecialtyFilter,
    setSelectedSpecialtyFilter
  } = useDentalFlow();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(selectedSpecialtyFilter || 'All');

  React.useEffect(() => {
    if (selectedSpecialtyFilter) {
      setSelectedSpecialty(selectedSpecialtyFilter);
    }
  }, [selectedSpecialtyFilter]);
  const [selectedIntent, setSelectedIntent] = useState<string>('All');
  const [selectedSource, setSelectedSource] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Summary counts
  const totalCount = enquiries.length;
  const newCount = enquiries.filter(e => e.status === 'New').length;
  const pendingCount = enquiries.filter(e => e.status === 'Pending Review').length;
  const followUpCount = enquiries.filter(e => e.status === 'Follow-up Required').length;
  const convertedCount = enquiries.filter(e => e.status === 'Converted').length;
  const closedCount = enquiries.filter(e => e.status === 'Closed' || e.status === 'Responded').length;

  // Filtered list
  const filteredEnquiries = enquiries.filter((e) => {
    const procedure = e.aiClassification.procedure || e.procedure || '';
    const specialty = e.aiClassification.specialty || e.specialty || e.service;
    const intent = e.aiClassification.intent || '';

    const matchesSearch = 
      e.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.enquirySummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.fullMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      procedure.toLowerCase().includes(searchQuery.toLowerCase()) ||
      specialty.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSpecialty = selectedSpecialty === 'All' || specialty === selectedSpecialty;
    const matchesIntent = selectedIntent === 'All' || intent === selectedIntent;
    const matchesSource = selectedSource === 'All' || e.source === selectedSource;
    const matchesPriority = selectedPriority === 'All' || e.priority === selectedPriority;
    const matchesStatus = selectedStatus === 'All' || e.status === selectedStatus;

    return matchesSearch && matchesSpecialty && matchesIntent && matchesSource && matchesPriority && matchesStatus;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSpecialty('All');
    setSelectedSpecialtyFilter('All');
    setSelectedIntent('All');
    setSelectedSource('All');
    setSelectedPriority('All');
    setSelectedStatus('All');
  };

  const hasActiveFilters = 
    searchQuery !== '' || 
    selectedSpecialty !== 'All' || 
    selectedIntent !== 'All' ||
    selectedSource !== 'All' || 
    selectedPriority !== 'All' || 
    selectedStatus !== 'All';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Title and Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Enquiries & Leads
            </h2>
            <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
              AI Procedure Triage Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage incoming patient enquiries with automated procedure detection and specialty categorization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNewEnquiryModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Enquiry</span>
          </button>
        </div>
      </div>

      {/* Summary Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div 
          onClick={() => setSelectedStatus('All')} 
          className={`p-3 rounded-xl border transition-all cursor-pointer ${
            selectedStatus === 'All' 
              ? 'bg-white border-teal-500 shadow-sm ring-1 ring-teal-500/20' 
              : 'bg-white border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Total
          </span>
          <span className="text-lg font-bold text-slate-900 mt-0.5 block">
            {totalCount}
          </span>
        </div>

        <div 
          onClick={() => setSelectedStatus('New')} 
          className={`p-3 rounded-xl border transition-all cursor-pointer ${
            selectedStatus === 'New' 
              ? 'bg-sky-50 border-sky-500 shadow-sm ring-1 ring-sky-500/20' 
              : 'bg-white border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider block">
            New
          </span>
          <span className="text-lg font-bold text-sky-900 mt-0.5 block">
            {newCount}
          </span>
        </div>

        <div 
          onClick={() => setSelectedStatus('Pending Review')} 
          className={`p-3 rounded-xl border transition-all cursor-pointer ${
            selectedStatus === 'Pending Review' 
              ? 'bg-amber-50 border-amber-500 shadow-sm ring-1 ring-amber-500/20' 
              : 'bg-white border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
            Pending Review
          </span>
          <span className="text-lg font-bold text-amber-900 mt-0.5 block">
            {pendingCount}
          </span>
        </div>

        <div 
          onClick={() => setSelectedStatus('Follow-up Required')} 
          className={`p-3 rounded-xl border transition-all cursor-pointer ${
            selectedStatus === 'Follow-up Required' 
              ? 'bg-indigo-50 border-indigo-500 shadow-sm ring-1 ring-indigo-500/20' 
              : 'bg-white border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">
            Follow-up
          </span>
          <span className="text-lg font-bold text-indigo-900 mt-0.5 block">
            {followUpCount}
          </span>
        </div>

        <div 
          onClick={() => setSelectedStatus('Converted')} 
          className={`p-3 rounded-xl border transition-all cursor-pointer ${
            selectedStatus === 'Converted' 
              ? 'bg-emerald-50 border-emerald-500 shadow-sm ring-1 ring-emerald-500/20' 
              : 'bg-white border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
            Converted
          </span>
          <span className="text-lg font-bold text-emerald-900 mt-0.5 block">
            {convertedCount}
          </span>
        </div>

        <div 
          onClick={() => setSelectedStatus('Responded')} 
          className={`p-3 rounded-xl border transition-all cursor-pointer ${
            selectedStatus === 'Responded' 
              ? 'bg-slate-100 border-slate-400 shadow-sm ring-1 ring-slate-400/20' 
              : 'bg-white border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Responded / Closed
          </span>
          <span className="text-lg font-bold text-slate-800 mt-0.5 block">
            {closedCount}
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-subtle flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient, procedure (e.g. braces, implants), or concern..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Specialty filter */}
          <select
            value={selectedSpecialty}
            onChange={(e) => {
              setSelectedSpecialty(e.target.value);
              setSelectedSpecialtyFilter(e.target.value);
            }}
            className="text-xs py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium"
          >
            <option value="All">All Specialties</option>
            {SPECIALTY_TAXONOMY.map((r) => (
              <option key={r.specialty} value={r.specialty}>
                {r.specialty}
              </option>
            ))}
            <option value="Needs Staff Review">Needs Staff Review</option>
          </select>

          {/* Intent filter */}
          <select
            value={selectedIntent}
            onChange={(e) => setSelectedIntent(e.target.value)}
            className="text-xs py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="All">All Intents</option>
            {INTENT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Source filter */}
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="text-xs py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="All">All Sources</option>
            <option value="Website">Website</option>
            <option value="Email">Email</option>
            <option value="Phone">Phone</option>
            <option value="Referral">Referral</option>
          </select>

          {/* Priority filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="text-xs py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="All">All Priorities</option>
            <option value="Urgent Review">Urgent Review</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Data Table with Procedure & Specialty Columns */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Patient / Lead</th>
                <th className="py-3 px-4">Enquiry Summary</th>
                <th className="py-3 px-4">Detected Procedure</th>
                <th className="py-3 px-4">Dental Specialty</th>
                <th className="py-3 px-4">Inferred Intent</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Staff</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {filteredEnquiries.length > 0 ? (
                filteredEnquiries.map((enquiry) => {
                  const procedureName = enquiry.aiClassification.procedure || enquiry.procedure || 'General consultation';
                  const specialtyName = enquiry.aiClassification.specialty || enquiry.specialty || enquiry.service;
                  const isConfirmed = enquiry.aiClassification.isConfirmedByStaff;

                  return (
                    <tr
                      key={enquiry.id}
                      onClick={() => setSelectedEnquiry(enquiry)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                    >
                      {/* Patient */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                          {enquiry.patientName}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {enquiry.source} • {enquiry.receivedAt}
                        </div>
                      </td>

                      {/* Enquiry Excerpt */}
                      <td className="py-3 px-4 max-w-xs">
                        <p className="truncate text-slate-800 font-medium">
                          {enquiry.enquirySummary}
                        </p>
                        <p className="truncate text-[11px] text-slate-400">
                          {enquiry.fullMessage}
                        </p>
                      </td>

                      {/* Detected Procedure */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-800 text-xs">
                            {procedureName}
                          </span>
                          {isConfirmed && (
                            <span title="Confirmed by staff" className="inline-flex items-center">
                              <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                            </span>
                          )}
                        </div>
                        {enquiry.aiClassification.detectedProcedures && enquiry.aiClassification.detectedProcedures.length > 1 && (
                          <span className="text-[10px] text-teal-700 font-medium">
                            +{enquiry.aiClassification.detectedProcedures.length - 1} more procedure
                          </span>
                        )}
                      </td>

                      {/* Dental Specialty */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          specialtyName === 'Needs Staff Review' 
                            ? 'bg-amber-50 text-amber-800 border-amber-200' 
                            : 'bg-teal-50 text-teal-800 border-teal-200'
                        }`}>
                          {specialtyName}
                        </span>
                      </td>

                      {/* Inferred Intent */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="text-slate-700 font-medium text-[11px] bg-slate-100 px-2 py-0.5 rounded-md">
                          {enquiry.aiClassification.intent}
                        </span>
                      </td>

                      {/* Priority */}
                      <td className="py-3 px-4">
                        <Badge variant="priority">{enquiry.priority}</Badge>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <Badge variant="status">{enquiry.status}</Badge>
                      </td>

                      {/* Assigned Staff */}
                      <td className="py-3 px-4 font-medium text-slate-700 whitespace-nowrap">
                        {enquiry.assignedStaff}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openAIAssistant({ 
                              enquiry, 
                              procedure: procedureName, 
                              specialty: specialtyName,
                              objective: 'Consultation Booking Offer' 
                            })}
                            className="p-1.5 text-teal-600 hover:text-teal-800 hover:bg-teal-50 rounded-lg transition-colors"
                            title="Generate AI Draft"
                          >
                            <Sparkles className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setSelectedEnquiry(enquiry)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <p className="text-sm">No enquiries match the current filters.</p>
                    <button
                      onClick={clearFilters}
                      className="mt-2 text-xs text-teal-600 font-semibold hover:underline"
                    >
                      Clear all filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Enquiry Drawer */}
      <EnquiryDetailDrawer />
      
      {/* Modal for adding enquiry */}
      <NewEnquiryModal />
    </div>
  );
};
