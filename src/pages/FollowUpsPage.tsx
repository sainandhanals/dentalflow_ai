import React, { useState } from 'react';
import { useDentalFlow } from '../context/DentalFlowContext';
import { Badge } from '../components/common/Badge';
import { NewFollowUpModal } from '../components/followups/NewFollowUpModal';
import { 
  CheckSquare, 
  Clock, 
  AlertTriangle, 
  Calendar, 
  CheckCircle2, 
  Plus, 
  Sparkles, 
  User, 
  MoreVertical,
  RotateCcw
} from 'lucide-react';
import { FollowUpStatus, FollowUpTaskType } from '../types';

export const FollowUpsPage: React.FC = () => {
  const { 
    enquiries,
    followUps, 
    updateFollowUpStatus, 
    snoozeFollowUp, 
    reassignFollowUp, 
    setIsNewFollowUpModalOpen,
    openAIAssistant 
  } = useDentalFlow();

  const [statusFilter, setStatusFilter] = useState<string>('all_active');
  const [staffFilter, setStaffFilter] = useState<string>('All');

  // Summary counts
  const dueTodayCount = followUps.filter(f => f.status === 'due_today').length;
  const overdueCount = followUps.filter(f => f.status === 'overdue').length;
  const scheduledCount = followUps.filter(f => f.status === 'scheduled').length;
  const completedCount = followUps.filter(f => f.status === 'completed').length;

  const filteredTasks = followUps.filter((task) => {
    let matchesStatus = true;
    if (statusFilter === 'all_active') matchesStatus = task.status !== 'completed';
    else if (statusFilter === 'due_today') matchesStatus = task.status === 'due_today';
    else if (statusFilter === 'overdue') matchesStatus = task.status === 'overdue';
    else if (statusFilter === 'scheduled') matchesStatus = task.status === 'scheduled';
    else if (statusFilter === 'completed') matchesStatus = task.status === 'completed';

    const matchesStaff = staffFilter === 'All' || task.assignedStaff === staffFilter;

    return matchesStatus && matchesStaff;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Follow-up Workflows & Tasks
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Prioritize patient outreach, review unbooked leads, and dispatch post-visit communications.
          </p>
        </div>

        <button
          onClick={() => setIsNewFollowUpModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Create Follow-up</span>
        </button>
      </div>

      {/* Task Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div 
          onClick={() => setStatusFilter('due_today')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'due_today' 
              ? 'bg-amber-50/70 border-amber-500 shadow-sm ring-1 ring-amber-500/20' 
              : 'bg-white border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Due Today</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{dueTodayCount}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Requires same-day response</p>
        </div>

        <div 
          onClick={() => setStatusFilter('overdue')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'overdue' 
              ? 'bg-rose-50/70 border-rose-500 shadow-sm ring-1 ring-rose-500/20' 
              : 'bg-white border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-rose-700 uppercase tracking-wider">
            <span>Overdue</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-bold text-rose-700 mt-2">{overdueCount}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Past target schedule</p>
        </div>

        <div 
          onClick={() => setStatusFilter('scheduled')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'scheduled' 
              ? 'bg-blue-50/70 border-blue-500 shadow-sm ring-1 ring-blue-500/20' 
              : 'bg-white border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Scheduled</span>
            <Calendar className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{scheduledCount}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Upcoming this week</p>
        </div>

        <div 
          onClick={() => setStatusFilter('completed')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'completed' 
              ? 'bg-emerald-50/70 border-emerald-500 shadow-sm ring-1 ring-emerald-500/20' 
              : 'bg-white border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            <span>Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-700 mt-2">{completedCount}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Tasks resolved</p>
        </div>
      </div>

      {/* Toolbar Filter */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-subtle flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Filter View:</span>
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setStatusFilter('all_active')}
              className={`px-3 py-1 rounded-lg transition-all ${
                statusFilter === 'all_active' ? 'bg-white text-slate-900 font-semibold shadow-sm' : 'text-slate-600'
              }`}
            >
              All Active
            </button>
            <button
              onClick={() => setStatusFilter('due_today')}
              className={`px-3 py-1 rounded-lg transition-all ${
                statusFilter === 'due_today' ? 'bg-white text-slate-900 font-semibold shadow-sm' : 'text-slate-600'
              }`}
            >
              Due Today
            </button>
            <button
              onClick={() => setStatusFilter('overdue')}
              className={`px-3 py-1 rounded-lg transition-all ${
                statusFilter === 'overdue' ? 'bg-white text-slate-900 font-semibold shadow-sm' : 'text-slate-600'
              }`}
            >
              Overdue
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1 rounded-lg transition-all ${
                statusFilter === 'completed' ? 'bg-white text-slate-900 font-semibold shadow-sm' : 'text-slate-600'
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Staff:</span>
          <select
            value={staffFilter}
            onChange={(e) => setStaffFilter(e.target.value)}
            className="text-xs py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
          >
            <option value="All">All Staff</option>
            <option value="Alex Morgan">Alex Morgan</option>
            <option value="Olivia Reed">Olivia Reed</option>
            <option value="James Wilson">James Wilson</option>
          </select>
        </div>
      </div>

      {/* Task List Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Task Description</th>
                <th className="py-3 px-4">Patient / Lead</th>
                <th className="py-3 px-4">Task Type</th>
                <th className="py-3 px-4">Due Schedule</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Assigned Staff</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => {
                  const relatedEnquiry = task.enquiryId ? enquiries.find(e => e.id === task.enquiryId) : null;
                  return (
                  <tr key={task.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs">
                      {task.title}
                      {relatedEnquiry && (
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                            {relatedEnquiry.aiClassification?.procedure || relatedEnquiry.procedure}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            ({relatedEnquiry.aiClassification?.specialty || relatedEnquiry.specialty})
                          </span>
                        </div>
                      )}
                      {task.notes && (
                        <p className="text-[11px] font-normal text-slate-400 truncate mt-0.5">
                          {task.notes}
                        </p>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-800 whitespace-nowrap">
                      {task.patientName}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-medium bg-teal-50 text-teal-800 border border-teal-200">
                        {task.taskType}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-medium">
                      <span className={task.status === 'overdue' ? 'text-rose-600 font-semibold' : 'text-slate-600'}>
                        {task.dueDate}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge variant="priority">{task.priority}</Badge>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-700 whitespace-nowrap">
                      {task.assignedStaff}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {task.status === 'completed' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                        </span>
                      ) : task.status === 'overdue' ? (
                        <span className="inline-flex items-center gap-1 text-rose-700 font-semibold text-xs">
                          <AlertTriangle className="w-3.5 h-3.5" /> Overdue
                        </span>
                      ) : (
                        <span className="text-amber-700 font-medium text-xs">
                          Active
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            if (relatedEnquiry) {
                              openAIAssistant({
                                enquiry: relatedEnquiry,
                                procedure: relatedEnquiry.aiClassification?.procedure || relatedEnquiry.procedure,
                                specialty: relatedEnquiry.aiClassification?.specialty || relatedEnquiry.specialty,
                                objective: 'Consultation Booking Offer'
                              });
                            } else {
                              openAIAssistant({ patient: { name: task.patientName } as any, objective: 'Consultation Booking Offer' });
                            }
                          }}
                          className="p-1.5 text-teal-600 hover:text-teal-800 hover:bg-teal-50 rounded-lg transition-colors"
                          title="Generate message draft"
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>

                        {task.status !== 'completed' ? (
                          <>
                            <button
                              onClick={() => snoozeFollowUp(task.id, 2)}
                              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                              title="Snooze 2 days"
                            >
                              Snooze
                            </button>
                            <button
                              onClick={() => updateFollowUpStatus(task.id, 'completed')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
                            >
                              Done
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => updateFollowUpStatus(task.id, 'due_today')}
                            className="text-xs text-slate-400 hover:text-slate-600 underline"
                          >
                            Reopen
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400">
                    No follow-up tasks match the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <NewFollowUpModal />
    </div>
  );
};
