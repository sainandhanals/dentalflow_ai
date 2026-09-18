import React, { useState } from 'react';
import { useDentalFlow } from '../../context/DentalFlowContext';
import { Modal } from '../common/Modal';
import { FollowUpTaskType, PriorityLevel } from '../../types';

export const NewFollowUpModal: React.FC = () => {
  const { isNewFollowUpModalOpen, setIsNewFollowUpModalOpen, addFollowUp, patients } = useDentalFlow();

  const [patientName, setPatientName] = useState(patients[0]?.name || 'Sarah Thomas');
  const [taskType, setTaskType] = useState<FollowUpTaskType>('Unbooked lead follow-up');
  const [priority, setPriority] = useState<PriorityLevel>('High');
  const [assignedStaff, setAssignedStaff] = useState('Alex Morgan');
  const [dueDate, setDueDate] = useState('Today, 3:00 PM');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) return;

    addFollowUp({
      title: `${taskType} (${patientName})`,
      patientName,
      taskType,
      priority,
      assignedStaff,
      dueDate: dueDate || 'Today, 4:00 PM',
      status: 'due_today',
      notes: notes || 'Front desk outreach queued.'
    });

    setIsNewFollowUpModalOpen(false);
    setNotes('');
  };

  return (
    <Modal
      isOpen={isNewFollowUpModalOpen}
      onClose={() => setIsNewFollowUpModalOpen(false)}
      title="Create Follow-up Task"
      subtitle="Schedule an operational patient follow-up or administrative reminder"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Target Patient / Lead *
          </label>
          <input
            type="text"
            required
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="e.g. Sarah Thomas"
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Task Type
          </label>
          <select
            value={taskType}
            onChange={(e) => setTaskType(e.target.value as FollowUpTaskType)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="Unbooked lead follow-up">Unbooked lead follow-up</option>
            <option value="Appointment reminder review">Appointment reminder review</option>
            <option value="Post-appointment feedback request">Post-appointment feedback request</option>
            <option value="Review communication draft">Review communication draft</option>
            <option value="Pending enquiry response">Pending enquiry response</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Priority
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
            Due Schedule
          </label>
          <input
            type="text"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            placeholder="e.g. Today, 3:30 PM or Tomorrow, 10:00 AM"
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Task Instructions / Context
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Instructions for receptionist or patient coordinator..."
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setIsNewFollowUpModalOpen(false)}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            Create Task
          </button>
        </div>
      </form>
    </Modal>
  );
};
