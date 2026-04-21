
import React, { useMemo } from 'react';
import { Meeting, ChurchLeader, ContactStatus } from '../types';
import { MapPin, Calendar as CalendarIcon, Target, FileUp, ArrowRight, Layers, CheckCircle2, Trash2 } from 'lucide-react';

interface Props {
  meetings: Meeting[];
  churches: ChurchLeader[];
  onSelectGroup: (zone: string, meetingId: string) => void;
  onDeleteGroup: (zone: string, meetingId: string) => void;
}

const COLORS = ['#4169E1', '#FFBF00', '#00C9A7', '#424242', '#6366f1'];
const BG_CLASSES = ['bg-royal', 'bg-amber', 'bg-sea', 'bg-trolley', 'bg-indigo-600'];
const TEXT_CLASSES = ['text-royal', 'text-amber', 'text-sea', 'text-trolley', 'text-indigo-600'];
const SHADOW_CLASSES = ['shadow-royal/20', 'shadow-amber/20', 'shadow-sea/20', 'shadow-trolley/20', 'shadow-indigo-600/20'];

const MeetingManagement: React.FC<Props> = ({ meetings, churches, onSelectGroup, onDeleteGroup }) => {
  const extractNumber = (s: string) => {
    const match = s.match(/\d+/);
    return match ? parseInt(match[0], 10) : Infinity;
  };

  const groupData = useMemo(() => {
    const groups: Record<string, { zone: string; meetingId: string; count: number; sent: number; sample: ChurchLeader }> = {};
    
    churches.forEach(c => {
      const key = `${c.zone}-${c.meetingId}`;
      if (!groups[key]) {
        groups[key] = {
          zone: c.zone,
          meetingId: c.meetingId,
          count: 0,
          sent: 0,
          sample: c
        };
      }
      groups[key].count++;
      if (c.status === ContactStatus.SENT) {
        groups[key].sent++;
      }
    });

    return Object.values(groups).sort((a, b) => {
      const numA = extractNumber(a.meetingId);
      const numB = extractNumber(b.meetingId);
      if (numA !== numB) return numA - numB;
      return a.zone.localeCompare(b.zone);
    });
  }, [churches]);

  const getMeetingName = (id: string) => {
    const meeting = meetings.find(m => m.id === id);
    return meeting?.name || id;
  };

  if (churches.length === 0) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-center p-10 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 animate-in fade-in duration-700">
        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
          <FileUp className="w-10 h-10 text-blue-500" />
        </div>
        <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase mb-2">Sin datos territoriales</h2>
        <p className="text-slate-400 font-bold max-w-sm mb-8">
          Para ver los grupos de convocatoria, carga tu archivo Excel en la pestaña de Iglesias.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">Grupos de Convocatoria</h2>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-500" />
            Organización Territorial y Progreso
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {groupData.map((group, idx) => {
          const progress = Math.round((group.sent / group.count) * 100);
          const colorIdx = idx % COLORS.length;
          const bgClass = BG_CLASSES[colorIdx];
          const textClass = TEXT_CLASSES[colorIdx];
          const shadowClass = SHADOW_CLASSES[colorIdx];

          return (
            <div 
              key={`${group.zone}-${group.meetingId}-${idx}`} 
              className={`group bg-white rounded-[2.5rem] border border-slate-100 hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden flex flex-col relative subtle-shadow glossy-finish hover:-translate-y-2`}
              onClick={() => onSelectGroup(group.zone, group.meetingId)}
            >
              <div className="p-10 flex-1">
                <div className="flex items-center justify-between mb-8">
                  <span className={`px-5 py-2 ${bgClass} text-white text-[9px] font-black rounded-xl uppercase tracking-widest shadow-lg ${shadowClass}`}>
                    {group.zone}
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteGroup(group.zone, group.meetingId);
                      }}
                      className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm border border-red-100"
                      title="Eliminar Grupo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:${bgClass} group-hover:text-white transition-all duration-500 shadow-sm`}>
                      <ArrowRight className="w-6 h-6" />
                    </div>
                  </div>
                </div>
                
                <h3 className={`text-2xl font-black text-slate-800 mb-4 leading-[1.1] group-hover:${textClass} transition-colors uppercase tracking-tighter`}>
                  {getMeetingName(group.meetingId)}
                </h3>

                {/* BARRA DE PROGRESO EN TARJETA */}
                <div className="mb-8 space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-400">Avance</span>
                    <span className={progress === 100 ? 'text-emerald-500' : textClass}>{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${progress === 100 ? 'bg-emerald-500' : bgClass}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-slate-500 font-bold">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                      <Layers className="w-5 h-5 text-slate-400" />
                    </div>
                    <span className="tracking-tight">Grupo Territorial: {group.zone}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-400 font-bold">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                      <MapPin className={`w-5 h-5 ${textClass}`} />
                    </div>
                    <span className="truncate tracking-tight group-hover:text-slate-600 transition-colors">
                      {group.sample.suggestedVenue || 'Sede por definir'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-slate-100/30 border-t border-slate-100 flex items-center justify-between backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-2xl font-black text-slate-800 leading-none">{group.sent} <span className="text-slate-300 font-bold text-lg">/ {group.count}</span></p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Líderes Notificados</p>
                  </div>
                </div>
                <div className={`flex items-center gap-2 font-black text-[10px] uppercase tracking-widest group-hover:translate-x-1 transition-transform ${progress === 100 ? 'text-emerald-600' : textClass}`}>
                  {progress === 100 ? <><CheckCircle2 className="w-3 h-3" /> Finalizado</> : <>Programar <ArrowRight className="w-3 h-3" /></>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MeetingManagement;
