
/* --- FILE: components/Dashboard.tsx --- */
import React, { useMemo, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { ChurchLeader, Meeting, ContactStatus } from '../types';
import { Users, MapPin, Calendar, CheckCircle, Clock, LayoutGrid, BookOpen } from 'lucide-react';

interface Props {
  churches: ChurchLeader[];
  meetings: Meeting[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const Dashboard: React.FC<Props> = ({ churches, meetings }) => {
  const [selectedZone, setSelectedZone] = useState<string>('Todas');

  const dynamicZones = useMemo(() => {
    const zones = Array.from(new Set(churches.map(c => c.zone))).filter(Boolean) as string[];
    return zones.sort();
  }, [churches]);

  const stats = useMemo(() => {
    const filtered = selectedZone === 'Todas' ? churches : churches.filter(c => c.zone === selectedZone);
    const sentCount = filtered.filter(c => c.status === ContactStatus.SENT).length;
    const pendingCount = filtered.filter(c => c.status === ContactStatus.PENDING).length;
    const totalBooks = filtered.reduce((acc, curr) => acc + (curr.booksCount || 0), 0);
    const zoneData: Record<string, { name: string, churches: number, books: number }> = {};
    churches.forEach(c => {
      if (!zoneData[c.zone]) zoneData[c.zone] = { name: c.zone, churches: 0, books: 0 };
      zoneData[c.zone].churches += 1;
      zoneData[c.zone].books += (c.booksCount || 0);
    });
    return {
      totalChurches: filtered.length,
      totalMeetings: new Set(filtered.map(c => c.meetingId)).size,
      totalBooks,
      sentCount,
      pendingCount,
      zoneChartData: Object.values(zoneData).sort((a, b) => b.churches - a.churches),
      statusChartData: [{ name: 'Enviados', value: sentCount }, { name: 'Pendientes', value: pendingCount }]
    };
  }, [churches, selectedZone]);

  if (churches.length === 0) return (
    <div className="h-[70vh] flex flex-col items-center justify-center text-center p-10 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
      <LayoutGrid className="w-16 h-16 text-blue-100 mb-6" />
      <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Panel Vacío</h2>
      <p className="text-slate-400 font-bold max-w-sm">Importa registros para visualizar las métricas.</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">Vista Territorial</h2>
        <div className="flex gap-2 overflow-x-auto max-w-md p-1 bg-white rounded-2xl border">
          <button onClick={() => setSelectedZone('Todas')} className={`px-4 py-2 text-[9px] font-black rounded-xl uppercase transition-all ${selectedZone === 'Todas' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}>Todas</button>
          {dynamicZones.map(z => (<button key={z} onClick={() => setSelectedZone(z)} className={`px-4 py-2 text-[9px] font-black rounded-xl uppercase transition-all ${selectedZone === z ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}>{z}</button>))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={<Users className="text-blue-600" />} title="Líderes" value={stats.totalChurches} color="bg-blue-50" />
        <StatCard icon={<BookOpen className="text-amber-600" />} title="Libros" value={stats.totalBooks} color="bg-amber-50" />
        <StatCard icon={<Calendar className="text-indigo-600" />} title="Grupos" value={stats.totalMeetings} color="bg-indigo-50" />
        <StatCard icon={<CheckCircle className="text-emerald-600" />} title="Contacto" value={`${stats.totalChurches > 0 ? Math.round((stats.sentCount / stats.totalChurches) * 100) : 0}%`} color="bg-emerald-50" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border">
          <h3 className="text-lg font-black mb-8 uppercase tracking-tighter">Distribución por Zona</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.zoneChartData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} fontSize={9} fontWeight="bold" />
                <Tooltip />
                <Bar dataKey="churches" fill="#3b82f6" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border flex flex-col items-center">
          <h3 className="text-lg font-black mb-8 w-full text-left uppercase tracking-tighter">Efectividad</h3>
          <div className="h-[250px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart><Pie data={stats.statusChartData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={5} dataKey="value">{stats.statusChartData.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: number | string; color: string }> = ({ icon, title, value, color }) => (
  <div className="p-6 rounded-[1.5rem] shadow-sm border bg-white flex items-center gap-4">
    <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
    <div><p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{title}</p><p className="text-2xl font-black text-slate-800 tracking-tighter">{value}</p></div>
  </div>
);
export default Dashboard;
