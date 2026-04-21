
/* --- FILE: components/Dashboard.tsx --- */
import React, { useMemo, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { ChurchLeader, Meeting, ContactStatus } from '../types';
import { Users, MapPin, Calendar, CheckCircle, Clock, LayoutGrid, BookOpen } from 'lucide-react';
import ModernInfographic from './ModernInfographic';

interface Props {
  churches: ChurchLeader[];
  meetings: Meeting[];
}

const COLORS = ['#4169E1', '#00C9A7', '#FFBF00', '#ef4444', '#8b5cf6', '#ec4899'];

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
    <div className="space-y-8 pb-12">
      <ModernInfographic 
        items={dynamicZones} 
        selectedItem={selectedZone} 
        onSelect={setSelectedZone} 
      />

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">Estadísticas Detalladas</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon={<Users className="text-royal" />} title="Líderes" value={stats.totalChurches} color="bg-royal/10" />
        <StatCard icon={<BookOpen className="text-amber" />} title="Libros" value={stats.totalBooks} color="bg-amber/10" />
        <StatCard icon={<Calendar className="text-royal" />} title="Grupos" value={stats.totalMeetings} color="bg-indigo-100" />
        <StatCard icon={<CheckCircle className="text-sea" />} title="Contacto" value={`${stats.totalChurches > 0 ? Math.round((stats.sentCount / stats.totalChurches) * 100) : 0}%`} color="bg-sea/10" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[3rem] border subtle-shadow glossy-finish">
          <h3 className="text-xl font-black mb-10 uppercase tracking-tighter">Distribución por Zona</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.zoneChartData} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} fontSize={10} fontWeight="900" axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }} />
                <Bar dataKey="churches" fill="#4169E1" radius={[0, 12, 12, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-10 rounded-[3rem] border subtle-shadow glossy-finish flex flex-col items-center">
          <h3 className="text-xl font-black mb-10 w-full text-left uppercase tracking-tighter">Efectividad</h3>
          <div className="h-[300px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart><Pie data={stats.statusChartData} cx="50%" cy="50%" innerRadius={85} outerRadius={110} paddingAngle={8} dataKey="value" stroke="none">{stats.statusChartData.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }} /></PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enviados</p>
                <p className="text-4xl font-black text-slate-800 tracking-tighter">{Math.round((stats.sentCount / (stats.totalChurches || 1)) * 100)}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: number | string; color: string }> = ({ icon, title, value, color }) => (
  <div className="p-8 rounded-[2rem] border bg-white flex items-center gap-6 subtle-shadow transition-transform hover:-translate-y-1 duration-300">
    <div className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center shadow-inner`}>{icon}</div>
    <div><p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">{title}</p><p className="text-3xl font-black text-slate-800 tracking-tighter">{value}</p></div>
  </div>
);
export default Dashboard;
