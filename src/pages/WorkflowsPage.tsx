import React, { useState } from 'react';
import { useDentalFlow } from '../context/DentalFlowContext';
import { NewWorkflowModal } from '../components/workflows/NewWorkflowModal';
import { 
  Workflow, 
  Plus, 
  ArrowRight, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  Play, 
  Pause, 
  Activity, 
  CheckCircle2, 
  Zap,
  Info
} from 'lucide-react';

export const WorkflowsPage: React.FC = () => {
  const { workflows, toggleWorkflow, setIsNewWorkflowModalOpen, addToast } = useDentalFlow();

  const handleSimulateRun = (name: string) => {
    addToast({
      type: 'success',
      title: 'Workflow Trigger Simulated',
      message: `"${name}" executed test condition. Draft prepared for staff review.`
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Patient Engagement Automations
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure automated patient communication pipelines with mandatory staff review safeguards.
          </p>
        </div>

        <button
          onClick={() => setIsNewWorkflowModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Create Workflow</span>
        </button>
      </div>

      {/* Human-in-the-Loop Safeguard Notice */}
      <div className="p-3.5 bg-teal-50/60 border border-teal-200/80 rounded-2xl flex items-start gap-3 text-xs text-teal-900">
        <ShieldCheck className="w-4 h-4 text-teal-700 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="font-semibold text-teal-950">Staff Oversight Guarantee:</strong> DentalFlow AI operates as a human-in-the-loop system. Automated workflows prepare drafts and queue tasks; messages are never dispatched blindly without qualified practice administrator approval.
        </p>
      </div>

      {/* Workflow Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {workflows.map((wf) => (
          <div
            key={wf.id}
            className={`bg-white rounded-2xl border transition-all p-5 shadow-subtle flex flex-col justify-between ${
              wf.status === 'active' 
                ? 'border-slate-200/80 hover:border-teal-300' 
                : 'border-slate-200/60 opacity-80 bg-slate-50/50'
            }`}
          >
            <div>
              {/* Card Header: Title & Toggle */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                    wf.status === 'active' ? 'bg-teal-600 text-white shadow-sm' : 'bg-slate-200 text-slate-600'
                  }`}>
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {wf.name}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400">
                      ID: {wf.id} • {wf.executionsCount} triggers logged
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    wf.status === 'active' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}>
                    {wf.status === 'active' ? 'Active' : 'Paused'}
                  </span>
                  <button
                    onClick={() => toggleWorkflow(wf.id)}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      wf.status === 'active' 
                        ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-300'
                    }`}
                    title={wf.status === 'active' ? 'Pause workflow' : 'Activate workflow'}
                  >
                    {wf.status === 'active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {wf.description}
              </p>

              {/* Visual Pipeline Sequence */}
              <div className="space-y-2 py-3 px-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                {/* Step 1: Trigger */}
                <div className="flex items-center gap-2 text-slate-700">
                  <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                    1
                  </span>
                  <span className="text-slate-500 text-[11px] font-medium">Trigger:</span>
                  <span className="font-semibold text-slate-900 truncate">{wf.trigger}</span>
                </div>

                {/* Step 2: Condition */}
                <div className="flex items-center gap-2 text-slate-700">
                  <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                    2
                  </span>
                  <span className="text-slate-500 text-[11px] font-medium">Condition:</span>
                  <span className="font-semibold text-slate-900 truncate">{wf.condition}</span>
                </div>

                {/* Step 3: Action */}
                <div className="flex items-center gap-2 text-slate-700">
                  <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                    3
                  </span>
                  <span className="text-slate-500 text-[11px] font-medium">Action:</span>
                  <span className="font-semibold text-teal-800 truncate">{wf.action}</span>
                </div>
              </div>

              {/* Approval Badge & Template Info */}
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1 text-teal-700 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" /> Staff Review Mandatory
                </span>
                <span className="text-slate-400 truncate max-w-[200px]">
                  Template: {wf.messageTemplate}
                </span>
              </div>
            </div>

            {/* Card Footer: Simulation Button */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Delay setting: {wf.delayHours}h
              </span>
              <button
                onClick={() => handleSimulateRun(wf.name)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors"
              >
                <Play className="w-3 h-3 text-teal-600" />
                Simulate Trigger
              </button>
            </div>
          </div>
        ))}
      </div>

      <NewWorkflowModal />
    </div>
  );
};
