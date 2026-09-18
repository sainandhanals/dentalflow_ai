import React, { useState } from 'react';
import { useDentalFlow } from '../../context/DentalFlowContext';
import { Modal } from '../common/Modal';
import { Workflow, ArrowDown, ShieldCheck } from 'lucide-react';

export const NewWorkflowModal: React.FC = () => {
  const { isNewWorkflowModalOpen, setIsNewWorkflowModalOpen, addWorkflow } = useDentalFlow();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [trigger, setTrigger] = useState('New Website or Email Enquiry');
  const [condition, setCondition] = useState('Enquiry unreviewed after 30 minutes');
  const [action, setAction] = useState('Generate AI draft and alert receptionist');
  const [staffApprovalRequired, setStaffApprovalRequired] = useState(true);
  const [messageTemplate, setMessageTemplate] = useState('BrightSmile Approved Standard');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addWorkflow({
      name,
      description: description || 'Configured automated follow-up sequence with mandatory staff review.',
      trigger,
      condition,
      action,
      status: 'active',
      staffApprovalRequired,
      messageTemplate,
      delayHours: 1,
    });

    setIsNewWorkflowModalOpen(false);
    setName('');
    setDescription('');
  };

  return (
    <Modal
      isOpen={isNewWorkflowModalOpen}
      onClose={() => setIsNewWorkflowModalOpen(false)}
      title="Create Automation Workflow"
      subtitle="Define patient communication rules with built-in staff oversight"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Workflow Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Cosmetic Whitening Lead Nurturing"
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Short Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Automatically follows up on cosmetic enquiries that haven't booked in 48 hours"
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        {/* Visual Step Builder */}
        <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2.5">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Workflow Pipeline Sequence
          </span>

          {/* Trigger */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              1. Event Trigger
            </label>
            <select
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
            >
              <option value="New Website or Email Enquiry">New Website or Email Enquiry</option>
              <option value="Enquiry Marked Interested">Enquiry Marked Interested (Unbooked)</option>
              <option value="Appointment Status Marked Completed">Appointment Completed (Post-Visit)</option>
              <option value="Elapsed Time Since Last Hygiene Exam >= 180 Days">6 Months Since Last Hygiene Cleaning</option>
            </select>
          </div>

          <div className="flex justify-center text-slate-400">
            <ArrowDown className="w-4 h-4" />
          </div>

          {/* Condition */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              2. Eligibility Condition & Delay
            </label>
            <input
              type="text"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              placeholder="e.g. No booking recorded after 24 hours"
              className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
            />
          </div>

          <div className="flex justify-center text-slate-400">
            <ArrowDown className="w-4 h-4" />
          </div>

          {/* Action */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              3. Operational Action
            </label>
            <input
              type="text"
              value={action}
              onChange={(e) => setAction(e.target.value)}
              placeholder="e.g. Generate approved AI draft and assign review task"
              className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
            />
          </div>
        </div>

        {/* Human in the loop toggle */}
        <div className="flex items-center justify-between p-3 bg-teal-50/50 rounded-xl border border-teal-100">
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-xs font-bold text-teal-950 block">
                Require Staff Approval Before Dispatch
              </span>
              <span className="text-[11px] text-teal-700">
                Staff must review, adjust, and authorize generated messages
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={staffApprovalRequired}
            onChange={(e) => setStaffApprovalRequired(e.target.checked)}
            className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setIsNewWorkflowModalOpen(false)}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            Save & Activate Workflow
          </button>
        </div>
      </form>
    </Modal>
  );
};
