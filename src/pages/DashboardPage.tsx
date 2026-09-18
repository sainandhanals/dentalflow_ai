import React, { useState } from 'react';
import { useDentalFlow } from '../context/DentalFlowContext';
import { Badge } from '../components/common/Badge';
import { 
  Inbox, 
  Clock, 
  Target, 
  TrendingUp, 
  ArrowUpRight, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  ShieldAlert, 
  Plus,
  Layers,
  ArrowRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { SPECIALTY_TAXONOMY } from '../data/specialtyTaxonomy';

export const DashboardPage: React.FC = () => {
  const { 
    enquiries, 
    followUps, 
    dateRange, 
    setDateRange, 
    setSelectedEnquiry, 
    updateFollowUpStatus, 
    setIsNewEnquiryModalOpen,
    setActivePage,
    addToast 
  } = useDentalFlow();

  const [dismissedInsights, setDismissedInsights] = useState<string[]>([]);

  // 7-day demo trend data for enquiry overview chart
  const trendData = [
    { day: 'Mon', newEnquiries: 6, followedUp: 5, booked: 4 },
    { day: 'Tue', newEnquiries: 8, followedUp: 7, booked: 5 },
    { day: 'Wed', newEnquiries: 5, followedUp: 5, booked: 3 },
    { day: 'Thu', newEnquiries: 9, followedUp: 8, booked: 6 },
    { day: 'Fri', newEnquiries: 11, followedUp: 9, booked: 8 },
    { day: 'Sat', newEnquiries: 4, followedUp: 4, booked: 3 },
    { day: 'Sun (Today)', newEnquiries: 5, followedUp: 4, booked: 3 },
  ];

  // Dynamic specialty breakdown calculation from enquiries
  const specialtyCounts = SPECIALTY_TAXONOMY.map(tax => {
    const count = enquiries.filter(e => {
      const s = e.aiClassification.specialty || e.specialty || e.service;
      return s === tax.specialty;
    }).length;
    return {
      specialty: tax.specialty,
      count,
    };
  }).filter(item => item.count > 0).sort((a, b) => b.count - a.count);

  // Include "Needs Staff Review" if any
  const needsReviewCount = enquiries.filter(e => {
    const s = e.aiClassification.specialty || e.specialty || e.service;
    return s === 'Needs Staff Review';
  }).length;

  if (needsReviewCount > 0) {
    specialtyCounts.push({
      specialty: 'Needs Staff Review',
      count: needsReviewCount,
    });
  }

  // Priority enquiries (top urgent or high)
  const priorityEnquiries = enquiries
    .filter(e => e.priority === 'Urgent Review' || e.priority === 'High' || e.priority === 'Medium')
    .slice(0, 4);

  // Active follow-ups needing attention
  const activeFollowUps = followUps.filter(f => f.status !== 'completed').slice(0, 4);

  const handleDismissInsight = (id: string) => {
    setDismissedInsights(prev => [...prev, id]);
    addToast({
      type: 'info',
      title: 'Insight Dismissed',
      message: 'Operational suggestion marked as reviewed.'
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Good morning, Alex
            </h2>
            <span className="text-lg">👋</span>
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-teal-600" />
            <span>Friday, September 18, 2026</span>
            <span>•</span>
            <span className="text-slate-700 font-medium">BrightSmile Dental Studio</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Date Range Selector */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600">
            {(['today', '7days', '30days'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setDateRange(r)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                  dateRange === r 
                    ? 'bg-white text-slate-900 font-semibold shadow-sm' 
                    : 'hover:text-slate-900'
                }`}
              >
                {r === 'today' ? 'Today' : r === '7days' ? '7 Days' : '30 Days'}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsNewEnquiryModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Enquiry</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: New Enquiries */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              New Enquiries
            </span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{enquiries.length}</span>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600">
              <ArrowUpRight className="w-3.5 h-3.5" /> +12.5%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Classified across {specialtyCounts.length} dental specialties</p>
        </div>

        {/* Card 2: Pending Follow-ups */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle hover:border-amber-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pending Follow-ups
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">16</span>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              Requires attention
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">2 urgent triage tasks</p>
        </div>

        {/* Card 3: Unbooked Leads */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Unbooked Leads
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">12</span>
            <span className="text-xs text-indigo-700 font-medium">
              High intent
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Potential conversion opportunities</p>
        </div>

        {/* Card 4: Conversion Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Appt. Conversion
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">68.4%</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              +4.1%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Demo period benchmark</p>
        </div>
      </div>

      {/* Main Dashboard Section: Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left / Larger: Enquiry Overview Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Enquiry & Booking Volume
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Past 7 days incoming enquiries vs completed follow-ups and bookings
              </p>
            </div>
            <span className="text-[11px] text-slate-400 font-medium bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
              Live Demo Feed
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEnquiries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBooked" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0b1b2b', 
                    borderRadius: '12px', 
                    border: 'none', 
                    color: '#fff',
                    fontSize: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area 
                  type="monotone" 
                  dataKey="newEnquiries" 
                  name="New Enquiries" 
                  stroke="#0d9488" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#colorEnquiries)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="booked" 
                  name="Booked / Converted" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorBooked)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right / Smaller: Priority Attention Queue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Priority Attention Queue
                </h3>
              </div>
              <button
                onClick={() => setActivePage('enquiries')}
                className="text-xs text-teal-600 hover:text-teal-700 font-semibold inline-flex items-center gap-0.5"
              >
                View all <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Non-clinical triage disclaimer */}
            <div className="mb-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
              <ShieldAlert className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
              <p className="leading-tight">
                Staff Review Queue: Urgent items reflect front-desk operational priority, not automated medical triage.
              </p>
            </div>

            {/* Priority Enquiries list */}
            <div className="space-y-2.5">
              {priorityEnquiries.map((enquiry) => (
                <div
                  key={enquiry.id}
                  onClick={() => setSelectedEnquiry(enquiry)}
                  className="p-3 rounded-xl border border-slate-100 hover:border-teal-200 hover:bg-teal-50/30 cursor-pointer transition-all space-y-1.5 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-teal-900">
                      {enquiry.patientName}
                    </span>
                    <Badge variant="priority">{enquiry.priority}</Badge>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/80">
                      {enquiry.aiClassification.procedure || enquiry.procedure}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      ({enquiry.aiClassification.specialty || enquiry.specialty})
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-1">
                    "{enquiry.enquirySummary}"
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                    <span className="flex items-center gap-1">
                      <Badge variant="source" size="sm">{enquiry.source}</Badge>
                      <span>{enquiry.receivedAt}</span>
                    </span>
                    <span className="text-teal-600 font-semibold group-hover:underline inline-flex items-center gap-1">
                      Review <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FEATURE SECTION: Enquiries by Dental Specialty */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-600" />
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Enquiries by Dental Specialty
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live breakdown of patient demand across configurable clinical specialties
            </p>
          </div>
          <button
            onClick={() => setActivePage('enquiries')}
            className="text-xs text-teal-600 hover:text-teal-800 font-semibold inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Explore All in Enquiries Table</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {specialtyCounts.map((item) => {
            const pct = Math.round((item.count / enquiries.length) * 100);
            return (
              <div
                key={item.specialty}
                onClick={() => setActivePage('enquiries')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer group ${
                  item.specialty === 'Needs Staff Review'
                    ? 'bg-amber-50/50 border-amber-200 hover:border-amber-300'
                    : 'bg-slate-50/60 border-slate-200/80 hover:border-teal-300 hover:bg-teal-50/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-xs font-bold truncate ${
                    item.specialty === 'Needs Staff Review' ? 'text-amber-900' : 'text-slate-900 group-hover:text-teal-900'
                  }`}>
                    {item.specialty}
                  </span>
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${
                    item.specialty === 'Needs Staff Review'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-teal-100 text-teal-800'
                  }`}>
                    {item.count}
                  </span>
                </div>

                <div className="w-full bg-slate-200/70 h-1.5 rounded-full overflow-hidden mb-1">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.specialty === 'Needs Staff Review' ? 'bg-amber-500' : 'bg-teal-600'
                    }`}
                    style={{ width: `${Math.max(10, pct)}%` }}
                  />
                </div>

                <span className="text-[10px] text-slate-400 font-medium">
                  {pct}% of active volume
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lower Dashboard: Follow-ups Table & AI Insights Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Follow-up Tasks */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Follow-up Task Queue
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Tasks requiring receptionist attention or communication dispatch
              </p>
            </div>
            <button
              onClick={() => setActivePage('followups')}
              className="text-xs text-teal-600 hover:text-teal-700 font-semibold inline-flex items-center gap-0.5"
            >
              Manage all tasks <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {activeFollowUps.map((task) => (
              <div key={task.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{task.patientName}</span>
                    <Badge variant="priority">{task.priority}</Badge>
                    <span className={`text-[11px] font-semibold ${task.status === 'overdue' ? 'text-rose-600' : 'text-slate-500'}`}>
                      {task.dueDate}
                    </span>
                  </div>
                  <p className="text-slate-600 truncate mt-0.5">{task.title}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => updateFollowUpStatus(task.id, 'completed')}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Complete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Engagement Insights Panel */}
        <div className="bg-gradient-to-br from-[#0b1b2b] to-[#122840] text-white p-5 rounded-2xl shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-500 text-white flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold tracking-tight text-white">
                  AI Engagement Insights
                </h3>
              </div>
              <span className="text-[10px] font-semibold bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full border border-teal-500/30">
                Operational
              </span>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed mb-4">
              Real-time operational suggestions based on practice communication patterns.
            </p>

            <div className="space-y-3">
              {/* Insight 1 */}
              {!dismissedInsights.includes('ins-1') && (
                <div className="p-3 rounded-xl bg-white/10 border border-white/10 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-teal-200">5 Uncontacted Web Leads</span>
                    <button
                      onClick={() => handleDismissInsight('ins-1')}
                      className="text-[10px] text-slate-400 hover:text-white"
                    >
                      Dismiss
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-200 leading-relaxed">
                    5 website enquiries from yesterday have not received a staff follow-up yet.
                  </p>
                  <button
                    onClick={() => setActivePage('enquiries')}
                    className="w-full text-center py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-[11px] font-semibold rounded-lg transition-colors"
                  >
                    Review Leads Now
                  </button>
                </div>
              )}

              {/* Insight 2 */}
              {!dismissedInsights.includes('ins-2') && (
                <div className="p-3 rounded-xl bg-white/10 border border-white/10 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-teal-200">Orthodontic Surge (+24%)</span>
                    <button
                      onClick={() => handleDismissInsight('ins-2')}
                      className="text-[10px] text-slate-400 hover:text-white"
                    >
                      Dismiss
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-200 leading-relaxed">
                    Invisalign and clear aligner enquiries increased significantly this week.
                  </p>
                  <button
                    onClick={() => setActivePage('enquiries')}
                    className="w-full text-center py-1.5 bg-white/15 hover:bg-white/25 text-white text-[11px] font-semibold rounded-lg transition-colors"
                  >
                    View Ortho Enquiries
                  </button>
                </div>
              )}

              {/* Insight 3 */}
              {!dismissedInsights.includes('ins-3') && (
                <div className="p-3 rounded-xl bg-white/10 border border-white/10 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-teal-200">Preventive Hygiene Due</span>
                    <button
                      onClick={() => handleDismissInsight('ins-3')}
                      className="text-[10px] text-slate-400 hover:text-white"
                    >
                      Dismiss
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-200 leading-relaxed">
                    3 active patients are eligible for 6-month hygiene recall reminders.
                  </p>
                  <button
                    onClick={() => setActivePage('patients')}
                    className="w-full text-center py-1.5 bg-white/15 hover:bg-white/25 text-white text-[11px] font-semibold rounded-lg transition-colors"
                  >
                    Check Eligible Patients
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 text-[10px] text-slate-400">
            * Suggestions assist administrative workflow only.
          </div>
        </div>
      </div>
    </div>
  );
};
