import React, { useState } from 'react';
import { useDentalFlow } from '../context/DentalFlowContext';
import { 
  Download, 
  TrendingUp, 
  Users, 
  Clock, 
  CheckCircle2, 
  BarChart2, 
  Info,
  Calendar
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const { addToast } = useDentalFlow();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  // Chart 1: Daily volume
  const volumeData = [
    { date: 'Sep 1', enquiries: 12, bookings: 8 },
    { date: 'Sep 4', enquiries: 18, bookings: 11 },
    { date: 'Sep 7', enquiries: 15, bookings: 9 },
    { date: 'Sep 10', enquiries: 22, bookings: 16 },
    { date: 'Sep 13', enquiries: 28, bookings: 19 },
    { date: 'Sep 16', enquiries: 24, bookings: 17 },
    { date: 'Sep 18', enquiries: 31, bookings: 22 },
  ];

  // Chart 2: Source distribution
  const sourceData = [
    { name: 'Website Form', value: 52, color: '#0d9488' },
    { name: 'Email Direct', value: 24, color: '#3b82f6' },
    { name: 'Phone Calls', value: 14, color: '#f59e0b' },
    { name: 'Doctor Referral', value: 10, color: '#8b5cf6' },
  ];

  // Chart 3: Conversion Funnel
  const funnelData = [
    { stage: '1. Ingested Enquiries', count: 142, fill: '#0d9488' },
    { stage: '2. Staff Reviewed', count: 128, fill: '#14b8a6' },
    { stage: '3. Follow-up Dispatched', count: 112, fill: '#2dd4bf' },
    { stage: '4. Consult Scheduled', count: 97, fill: '#38bdf8' },
    { stage: '5. Patient Converted', count: 82, fill: '#10b981' },
  ];

  // Chart 4: Service breakdown
  const serviceBreakdown = [
    { service: 'Orthodontics (Invisalign)', enquiries: 54 },
    { service: 'General Dentistry', enquiries: 38 },
    { service: 'Cosmetic (Whitening)', enquiries: 26 },
    { service: 'Preventive Hygiene', enquiries: 18 },
    { service: 'Pediatric Care', enquiries: 6 },
  ];

  // Chart 5: Follow-up completion trend
  const completionTrend = [
    { day: 'Mon', completed: 18, pending: 3 },
    { day: 'Tue', completed: 22, pending: 4 },
    { day: 'Wed', completed: 16, pending: 2 },
    { day: 'Thu', completed: 25, pending: 5 },
    { day: 'Fri', completed: 21, pending: 3 },
  ];

  const handleExport = () => {
    addToast({
      type: 'success',
      title: 'Report Export Simulated',
      message: 'Practice communication & conversion report compiled (demo CSV format).'
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Practice Engagement Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Understand enquiry trends, communication responsiveness, and lead conversion performance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time range selector */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600">
            {(['7d', '30d', '90d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 rounded-lg uppercase transition-all ${
                  timeRange === r 
                    ? 'bg-white text-slate-900 font-semibold shadow-sm' 
                    : 'hover:text-slate-900'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Total Enquiries
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">142</span>
            <span className="text-xs font-semibold text-emerald-600">+14.2%</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">During selected {timeRange} window</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Follow-ups Completed
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">118</span>
            <span className="text-xs font-semibold text-teal-700">83% resolution rate</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Staff outreach tasks completed</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Lead Conversion Rate
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">68.4%</span>
            <span className="text-xs font-semibold text-emerald-600">+5.3%</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Enquiry to confirmed booking</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Avg. Front-Desk Response
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">18 min</span>
            <span className="text-xs font-semibold text-teal-700">-6 min faster</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">From receipt to first staff review</p>
        </div>
      </div>

      {/* Row 1: Volume Trend & Source Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Volume Area Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Enquiry & Booking Trend ({timeRange.toUpperCase()})
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 mb-4">
            Volume of incoming patient enquiries compared against scheduled appointments
          </p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="anEnq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="anBook" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0b1b2b', 
                    borderRadius: '12px', 
                    border: 'none', 
                    color: '#fff',
                    fontSize: '12px' 
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="enquiries" name="Enquiries Ingested" stroke="#0d9488" strokeWidth={2.5} fill="url(#anEnq)" />
                <Area type="monotone" dataKey="bookings" name="Appointments Booked" stroke="#3b82f6" strokeWidth={2} fill="url(#anBook)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Source Distribution Donut Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Enquiry Channel Breakdown
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 mb-2">
              Where patient leads originate from
            </p>
            <div className="h-52 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0b1b2b', 
                      borderRadius: '12px', 
                      color: '#fff',
                      fontSize: '12px' 
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
            {sourceData.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-slate-600 truncate">{s.name} ({s.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Funnel & Service Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 3: Conversion Funnel */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Lead Status Funnel
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 mb-4">
            Patient progression from inbound web/phone inquiry to completed appointment
          </p>

          <div className="space-y-3">
            {funnelData.map((item, idx) => {
              const pct = Math.round((item.count / funnelData[0].count) * 100);
              return (
                <div key={item.stage} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{item.stage}</span>
                    <span className="font-mono text-slate-500">{item.count} leads ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: item.fill }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 4: Service Enquiry Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Service Demand Breakdown
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 mb-4">
            Distribution of patient inquiries by clinical specialty category
          </p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serviceBreakdown} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="service" type="category" tick={{ fontSize: 11, fill: '#64748b' }} width={120} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0b1b2b', 
                    borderRadius: '12px', 
                    border: 'none', 
                    color: '#fff',
                    fontSize: '12px' 
                  }}
                />
                <Bar dataKey="enquiries" name="Inquiries" fill="#0d9488" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Demo Disclaimer */}
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center text-slate-400 text-xs">
        * Analytics metrics are demonstration figures simulated for BrightSmile Dental Studio. No real patient data is used.
      </div>
    </div>
  );
};
