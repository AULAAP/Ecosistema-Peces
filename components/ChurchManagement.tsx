
/* --- FILE: components/ChurchManagement.tsx --- */
import React, { useState, useRef } from 'react';
import { ChurchLeader, Meeting, ContactStatus } from '../types';
import { Search, Filter, MessageCircle, FileUp, MoreVertical, X, UserPlus, BookOpen, MapPin, Trash2 } from 'lucide-react';
import * as XLSX from 'xlsx';

const normalizeString = (str: any): string => {
  if (!str) return '';
  return String(str).trim().replace(/\s+/g, ' ').toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

interface Props {
  churches: ChurchLeader[];
  meetings: Meeting[];
  onOpenMessenger: (church: ChurchLeader) => void;
  onAddChurch: (church: Omit<ChurchLeader, 'id' | 'status'>) => void;
  onBulkImport: (churches: Omit<ChurchLeader, 'id' | 'status'>[]) => void;
  onDeleteChurch: (id: string) => void;
}

const ChurchManagement: React.FC<Props> = ({ churches, meetings, onOpenMessenger, onAddChurch, onBulkImport, onDeleteChurch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [zoneFilter, setZoneFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target?.result, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws, { header: "A" }) as any[];
      
      const imported: Omit<ChurchLeader, 'id' | 'status'>[] = data.slice(1).map(row => {
        const zoneRaw = normalizeString(row.H || '');
        const fallback = normalizeString(row.G || '');
        // El usuario indica que la columna I es ahora la de Sede de Reunión.
        // La columna K suele ser el nombre del grupo/reunión.
        return {
          fullName: normalizeString(row.A),
          whatsapp: String(row.B || '').trim().replace(/\D/g, ''),
          email: normalizeString(row.C),
          churchName: normalizeString(row.D),
          community: normalizeString(row.E),
          zone: (zoneRaw.toUpperCase().includes('OTRA') || !zoneRaw) ? (fallback || 'Sin Zona') : zoneRaw,
          meetingId: normalizeString(row.K || row.H || 'General'),
          booksCount: Number(row.G) || 0,
          responsibleEntity: normalizeString(row.F),
          suggestedVenue: normalizeString(row.I) // Mapeo solicitado: Columna I como Sede
        };
      });
      onBulkImport(imported);
    };
    reader.readAsBinaryString(file);
  };

  const filtered = churches.filter(c => 
    (c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
     c.churchName.toLowerCase().includes(searchTerm.toLowerCase())) && 
    (zoneFilter === 'all' || c.zone === zoneFilter)
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Directorio</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Gestión de Líderes y Territorios</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="flex items-center gap-2 px-6 py-3 bg-white text-slate-800 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm hover:shadow-md subtle-shadow"
          >
            <FileUp className="w-4 h-4 text-royal" /> 
            Importar Excel
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".xlsx, .xls, .csv" className="hidden" />
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="flex items-center gap-2 px-6 py-3 bg-royal text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-royal/90 transition-all shadow-xl shadow-royal/20 active:scale-95 glossy-finish"
          >
            <UserPlus className="w-4 h-4" /> 
            Nuevo Registro
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden subtle-shadow glossy-finish">
        <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Buscar líder, iglesia o territorio..." 
              className="w-full pl-14 pr-8 py-4 bg-white border border-slate-200 rounded-[1.5rem] outline-none text-sm font-medium focus:ring-4 focus:ring-royal/5 transition-all subtle-shadow" 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
            />
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-royal/5 rounded-2xl border border-royal/10">
            <Filter className="w-3.5 h-3.5 text-royal" />
            <span className="text-[10px] font-black text-royal uppercase tracking-widest">Filtrado inteligente</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-10 py-5">Líder / Ecosistema</th>
                <th className="px-10 py-5">Territorio</th>
                <th className="px-10 py-5">Sede Designada</th>
                <th className="px-10 py-5">Recursos</th>
                <th className="px-10 py-5">Reunión</th>
                <th className="px-10 py-5 text-right">Contacto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-royal/[0.02] transition-colors group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center font-black text-royal shadow-sm group-hover:scale-110 transition-transform">
                        {c.fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-slate-800 text-base leading-tight">{c.fullName}</p>
                        <p className="text-royal text-[10px] font-black uppercase tracking-widest mt-1 opacity-80">{c.churchName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                      {c.zone}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    {c.suggestedVenue ? (
                      <div className="flex items-center gap-2 text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-amber" />
                        <span className="text-[11px] font-bold">{c.suggestedVenue}</span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Pendiente</span>
                    )}
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-2 font-black text-slate-700">
                      <BookOpen className="w-4 h-4 text-amber" />
                      <span>{c.booksCount}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className="inline-flex items-center px-3 py-1.5 bg-royal/10 text-royal rounded-xl text-[10px] font-black uppercase tracking-widest border border-royal/10">
                      {c.meetingId}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => onOpenMessenger(c)} 
                          className="p-3 text-sea bg-sea/5 hover:bg-sea hover:text-white rounded-2xl transition-all shadow-sm border border-sea/10 hover:border-sea hover:shadow-lg hover:shadow-sea/20 transform active:scale-90"
                        >
                          <MessageCircle className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteChurch(c.id);
                          }} 
                          className="p-3 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-2xl transition-all shadow-sm border border-red-100 hover:border-red-500 hover:shadow-lg hover:shadow-red-200 transform active:scale-90"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-32 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <Search className="w-8 h-8 text-slate-200" />
              </div>
              <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">No se encontraron registros en el directorio</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ChurchManagement;
