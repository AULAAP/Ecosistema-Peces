
/* --- FILE: components/ChurchManagement.tsx --- */
import React, { useState, useRef } from 'react';
import { ChurchLeader, Meeting, ContactStatus } from '../types';
import { Search, Filter, MessageCircle, FileUp, MoreVertical, X, UserPlus, BookOpen } from 'lucide-react';
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
}

const ChurchManagement: React.FC<Props> = ({ churches, meetings, onOpenMessenger, onAddChurch, onBulkImport }) => {
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Directorio</h2>
        <div className="flex gap-2">
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg"><FileUp className="w-4 h-4" /> Importar Excel</button>
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".xlsx, .xls, .csv" className="hidden" />
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"><UserPlus className="w-4 h-4" /> Nuevo</button>
        </div>
      </div>
      <div className="bg-white rounded-[2rem] shadow-sm border overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input type="text" placeholder="Buscar líder o iglesia..." className="w-full pl-12 pr-6 py-3 bg-slate-50 rounded-2xl outline-none text-sm font-medium" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-widest border-b">
              <tr>
                <th className="px-8 py-4">Líder</th>
                <th className="px-8 py-4">Territorio</th>
                <th className="px-8 py-4">Sede (Columna I)</th>
                <th className="px-8 py-4">Libros</th>
                <th className="px-8 py-4">Reunión</th>
                <th className="px-8 py-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-all">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 border">{c.fullName.charAt(0)}</div>
                      <div>
                        <p className="font-black text-slate-800 leading-tight">{c.fullName}</p>
                        <p className="text-blue-600 text-[10px] font-bold uppercase tracking-tighter">{c.churchName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4"><p className="font-bold text-slate-700">{c.zone}</p></td>
                  <td className="px-8 py-4">
                    {c.suggestedVenue ? (
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">{c.suggestedVenue}</span>
                    ) : (
                      <span className="text-[10px] text-slate-300 italic">No definida</span>
                    )}
                  </td>
                  <td className="px-8 py-4 font-black text-slate-700"><BookOpen className="w-4 h-4 inline mr-2 text-amber-500" />{c.booksCount}</td>
                  <td className="px-8 py-4"><span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-1 rounded-lg border border-blue-100">{c.meetingId}</span></td>
                  <td className="px-8 py-4 text-right">
                    <button onClick={() => onOpenMessenger(c)} className="p-2 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl transition-all shadow-sm border border-transparent hover:border-emerald-700">
                      <MessageCircle className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No se encontraron resultados</div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ChurchManagement;
