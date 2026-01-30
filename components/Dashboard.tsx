
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DocumentRecord } from '../types';

interface DashboardProps {
  records: DocumentRecord[];
  onNewExtraction: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ records, onNewExtraction }) => {
  const stats = [
    { label: 'Total Extractions', value: records.length, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { label: 'Successful', value: records.filter(r => r.status === 'completed').length, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Pending Review', value: records.filter(r => r.status === 'pending').length, color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'Failed', value: records.filter(r => r.status === 'failed').length, color: 'text-rose-600', bg: 'bg-rose-100' },
  ];

  const chartData = [
    { name: 'Mon', value: 12 },
    { name: 'Tue', value: 19 },
    { name: 'Wed', value: 3 },
    { name: 'Thu', value: 5 },
    { name: 'Fri', value: 2 },
    { name: 'Sat', value: 3 },
    { name: 'Sun', value: 9 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Welcome back!</h2>
          <p className="text-slate-500">Here's an overview of your document extraction activities.</p>
        </div>
        <button 
          onClick={onNewExtraction}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-semibold shadow-lg shadow-indigo-200 transition-all active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Start New Extraction
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
               <svg className={`w-6 h-6 ${stat.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-6">Extraction Volume (Weekly)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-6">Target Sectors</h3>
          <div className="space-y-4">
            <SectorRow label="Car Rental" percentage={45} color="bg-indigo-500" />
            <SectorRow label="Logistics" percentage={25} color="bg-emerald-500" />
            <SectorRow label="Insurance" percentage={18} color="bg-amber-500" />
            <SectorRow label="Administration" percentage={12} color="bg-slate-400" />
          </div>
          <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
             <p className="text-xs text-slate-500 leading-relaxed">
               Share In helps automate document verification for professional clients, reducing manual errors by up to 95%.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SectorRow = ({ label, percentage, color }: { label: string, percentage: number, color: string }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-sm">
      <span className="text-slate-600">{label}</span>
      <span className="font-semibold text-slate-800">{percentage}%</span>
    </div>
    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full ${color}`} style={{ width: `${percentage}%` }}></div>
    </div>
  </div>
);

export default Dashboard;
