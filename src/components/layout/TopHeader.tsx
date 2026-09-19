import React, { useState } from 'react';
import { useDentalFlow } from '../../context/DentalFlowContext';
import { 
  Search, 
  Bell, 
  Plus, 
  RotateCcw, 
  Menu, 
  CheckCircle2, 
  Sparkles, 
  Clock,
  User,
  ShieldAlert,
  ChevronDown
} from 'lucide-react';

interface TopHeaderProps {
  onOpenMobileMenu: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onOpenMobileMenu }) => {
  const { 
    activePage, 
    setIsNewEnquiryModalOpen, 
    setIsSearchModalOpen, 
    resetDemoData, 
    settings,
    enquiries,
    isBackendLive,
    isSyncing,
    checkBackendConnection 
  } = useDentalFlow();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const getPageMeta = () => {
    switch (activePage) {
      case 'dashboard':
        return { title: 'Dashboard', subtitle: 'Real-time overview of patient enquiries, follow-ups, and engagement' };
      case 'enquiries':
        return { title: 'Enquiries & Leads', subtitle: 'Manage incoming enquiries and keep every potential patient on track' };
      case 'patients':
        return { title: 'Patients', subtitle: 'Understand engagement history and upcoming communication needs' };
      case 'followups':
        return { title: 'Follow-ups', subtitle: 'Stay on top of pending communication and appointment-related tasks' };
      case 'workflows':
        return { title: 'Automation Workflows', subtitle: 'Create consistent patient engagement workflows with staff oversight' };
      case 'analytics':
        return { title: 'Analytics', subtitle: 'Understand enquiry trends, follow-up activity, and conversion performance' };
      case 'settings':
        return { title: 'Practice Settings', subtitle: 'Configure clinic profile, AI safeguards, and communication rules' };
      case 'ai-operations':
        return { title: 'AI Operations Engine', subtitle: 'Predictive chair defense, multi-member family scheduling & empathetic outreach' };
      default:
        return { title: 'Dashboard', subtitle: 'Real-time overview of patient enquiries, follow-ups, and engagement' };
    }
  };

  const meta = getPageMeta();

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3.5 flex items-center justify-between transition-all">
      {/* Left: Mobile Menu & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              {meta.title}
            </h1>
            <button
              onClick={() => checkBackendConnection()}
              className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-all border ${
                isBackendLive
                  ? 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100 shadow-sm'
                  : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
              }`}
              title={
                isBackendLive
                  ? 'Express backend connected on port 5000 with SQLite database. Click to re-sync.'
                  : 'Backend offline or unreachable. Operating in local demo mode. Click to check server.'
              }
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isBackendLive ? 'bg-teal-500 animate-pulse' : 'bg-amber-500'
                } ${isSyncing ? 'animate-spin' : ''}`}
              />
              {isSyncing ? 'Syncing...' : isBackendLive ? 'Backend Live (:5000)' : 'Local Demo Mode'}
            </button>
          </div>
          <p className="hidden md:block text-xs text-slate-500 mt-0.5">
            {meta.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Search, Actions, Notifications, Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Quick Search Bar */}
        <button
          onClick={() => setIsSearchModalOpen(true)}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100/80 hover:bg-slate-100 text-slate-500 hover:text-slate-700 rounded-xl text-xs border border-slate-200/70 transition-all w-48 md:w-56"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400 font-normal">Search clinic records...</span>
          <kbd className="ml-auto text-[10px] font-semibold bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-400">
            ⌘K
          </kbd>
        </button>

        {/* Reset Demo Data Button */}
        <button
          onClick={resetDemoData}
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          title="Reset demonstration data"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-500" />
          </button>

          {isNotifOpen && (
            <div 
              className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-dropdown border border-slate-200 p-3 animate-fade-in z-50"
              onMouseLeave={() => setIsNotifOpen(false)}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 px-1">
                <span className="text-xs font-semibold text-slate-900">Notifications</span>
                <span className="text-[10px] text-teal-600 font-medium">3 new</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                <div className="py-2.5 px-1 flex items-start gap-2.5">
                  <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg flex-shrink-0">
                    <ShieldAlert className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-900">Urgent Broken Tooth Enquiry</p>
                    <p className="text-[11px] text-slate-500">Daniel Mathew requested same-day evaluation</p>
                    <span className="text-[10px] text-slate-400">28 min ago</span>
                  </div>
                </div>
                <div className="py-2.5 px-1 flex items-start gap-2.5">
                  <div className="p-1.5 bg-teal-50 text-teal-600 rounded-lg flex-shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-900">New Orthodontic Lead</p>
                    <p className="text-[11px] text-slate-500">Sarah Thomas asked about Invisalign</p>
                    <span className="text-[10px] text-slate-400">12 min ago</span>
                  </div>
                </div>
                <div className="py-2.5 px-1 flex items-start gap-2.5">
                  <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg flex-shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-900">Lead Converted</p>
                    <p className="text-[11px] text-slate-500">Noah Williams booked 3D ortho scan</p>
                    <span className="text-[10px] text-slate-400">Yesterday</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Primary Action: + New Enquiry */}
        <button
          onClick={() => setIsNewEnquiryModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-teal-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Enquiry</span>
        </button>

        {/* User Avatar Dropdown */}
        <div className="relative pl-1">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              AM
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {isUserMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-dropdown border border-slate-200 p-2 animate-fade-in z-50"
              onMouseLeave={() => setIsUserMenuOpen(false)}
            >
              <div className="p-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-900">Alex Morgan</p>
                <p className="text-[11px] text-slate-500">Practice Manager</p>
                <p className="text-[10px] text-teal-600 font-medium mt-0.5">{settings.clinicName}</p>
              </div>
              <div className="pt-1">
                <div className="px-2 py-1.5 text-[11px] text-slate-500">
                  Role: Administrator / Front Desk
                </div>
                <div className="px-2 py-1.5 text-[11px] text-slate-400 italic">
                  Demo Session (Read & Write)
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
