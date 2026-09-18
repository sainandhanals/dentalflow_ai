import React from 'react';
import { useDentalFlow, PageId } from '../../context/DentalFlowContext';
import { 
  LayoutDashboard, 
  MessageSquareText, 
  Users, 
  CheckSquare, 
  Workflow, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Activity
} from 'lucide-react';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { 
    activePage, 
    setActivePage, 
    enquiries, 
    followUps, 
    settings,
    resetDemoData,
    addToast
  } = useDentalFlow();

  const newEnquiriesCount = enquiries.filter(e => e.status === 'New').length;
  const overdueFollowUpsCount = followUps.filter(t => t.status === 'overdue').length;

  const navItems: { id: PageId; label: string; icon: React.ElementType; badge?: number; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { 
      id: 'enquiries', 
      label: 'Enquiries & Leads', 
      icon: MessageSquareText, 
      badge: newEnquiriesCount > 0 ? newEnquiriesCount : undefined,
      badgeColor: 'bg-teal-500 text-white'
    },
    { id: 'patients', label: 'Patients', icon: Users },
    { 
      id: 'followups', 
      label: 'Follow-ups', 
      icon: CheckSquare,
      badge: overdueFollowUpsCount > 0 ? overdueFollowUpsCount : undefined,
      badgeColor: 'bg-rose-500 text-white animate-pulse'
    },
    { id: 'workflows', label: 'Automation', icon: Workflow },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const handleNavClick = (pageId: PageId) => {
    setActivePage(pageId);
    if (onCloseMobile) onCloseMobile();
  };

  const handleHelpClick = () => {
    addToast({
      type: 'info',
      title: 'Practice Guide',
      message: 'Demo tip: Test converting an enquiry to see live celebration & score updating!'
    });
  };

  return (
    <aside className="w-64 h-full bg-[#0b1b2b] text-slate-300 flex flex-col justify-between border-r border-slate-800/80 select-none">
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-teal-900/30">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C8.5 2 7 5 7 8c0 4.5 2 9 5 14 3-5 5-9.5 5-14 0-3-1.5-6-5-6z"/>
                <path d="M9 10a3 3 0 0 0 6 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white tracking-tight text-base">DentalFlow</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">
                Practice Engagement
              </p>
            </div>
          </div>
        </div>

        {/* Primary Navigation */}
        <div className="px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-teal-600/15 text-teal-300 font-semibold border border-teal-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Secondary Navigation */}
        <div className="px-3 py-2 space-y-1 border-t border-slate-800/80">
          <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Management
          </div>
          <button
            onClick={() => handleNavClick('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              activePage === 'settings'
                ? 'bg-teal-600/15 text-teal-300 font-semibold border border-teal-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Settings</span>
          </button>
          <button
            onClick={handleHelpClick}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
          >
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>Help & Tour</span>
          </button>
        </div>
      </div>

      {/* Sidebar Footer / Clinic Profile */}
      <div className="p-3 border-t border-slate-800/80 bg-navy-950/40">
        <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-teal-400 font-semibold text-xs flex-shrink-0">
              AM
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {settings.clinicName}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                <span>Alex Morgan (PM)</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => handleNavClick('settings')}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
            title="Clinic settings"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
