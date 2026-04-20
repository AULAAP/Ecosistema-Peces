
import React, { useState, useEffect } from 'react';
import { ChurchLeader, Meeting, ContactStatus } from '../types';
import { MessageSquare, Send, Sparkles, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { generateWhatsAppTemplate, parseTemplate } from '../services/geminiService';

interface Props {
  church?: ChurchLeader;
  meeting?: Meeting;
  onSent: (id: string) => void;
  onBack?: () => void;
}

const WhatsAppMessenger: React.FC<Props> = ({ church, meeting, onSent, onBack }) => {
  const [template, setTemplate] = useState('');
  const [preview, setPreview] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (church && meeting && template) {
      setPreview(parseTemplate(template, church, meeting));
    }
  }, [church, meeting, template]);

  const handleGenerateTemplate = async () => {
    if (!meeting) return;
    setIsGenerating(true);
    const text = await generateWhatsAppTemplate(meeting);
    setTemplate(text);
    setIsGenerating(false);
  };

  const handleSend = () => {
    if (!church) return;
    setIsSending(true);
    setTimeout(() => {
      onSent(church.id);
      setIsSending(false);
      
      // Construir link de WhatsApp real para coherencia con el envío masivo
      const msg = preview || parseTemplate(template, church, meeting!);
      const phone = church.whatsapp.toString().replace(/\D/g, '');
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
      
      if (onBack) {
        onBack();
      }
    }, 800);
  };

  if (!church || !meeting) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl h-[60vh] bg-white">
        <MessageSquare className="w-16 h-16 mb-4 opacity-10" />
        <h3 className="text-lg font-bold text-slate-600">Centro de Mensajería</h3>
        <p className="text-center max-w-xs mt-2">Selecciona un líder desde el directorio para redactar y enviar su invitación personalizada.</p>
        {onBack && (
          <button 
            onClick={onBack}
            className="mt-6 flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest hover:underline"
          >
            <ArrowLeft className="w-3 h-3" /> Volver
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center font-black text-xl">
            {church.fullName.charAt(0)}
          </div>
          <div>
            <h3 className="font-black text-slate-800">{church.fullName}</h3>
            <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">{church.churchName} • {church.whatsapp}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
            church.status === ContactStatus.SENT ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
          }`}>
            {church.status}
          </span>
          {onBack && (
            <button 
              onClick={onBack}
              className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors"
              title="Cerrar"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto space-y-8 bg-white">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-black text-slate-700 uppercase tracking-tight">Estructura del Mensaje</label>
            <button 
              onClick={handleGenerateTemplate}
              disabled={isGenerating}
              className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isGenerating ? 'Generando...' : 'Redactar con IA'}
            </button>
          </div>
          <textarea 
            className="w-full h-40 p-5 text-sm border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none resize-none bg-slate-50 transition-all"
            placeholder="Introduce tu mensaje aquí..."
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            {['{{nombre_completo}}', '{{nombre_iglesia}}', '{{comunidad}}', '{{reunion_asignada}}', '{{fecha}}', '{{hora}}', '{{sede}}'].map(tag => (
              <code key={tag} className="px-2 py-1 bg-slate-100 text-slate-500 rounded text-[10px] font-bold">{tag}</code>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-black text-emerald-800 uppercase tracking-widest flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Vista previa final
          </h4>
          <div className="relative">
            <div className="bg-[#E7FFDB] p-6 rounded-2xl shadow-sm text-sm text-slate-800 whitespace-pre-wrap leading-relaxed min-h-[120px] border border-emerald-100 relative z-10">
              {preview || <span className="text-slate-400 italic font-medium">La previsualización aparecerá aquí una vez redactes el mensaje...</span>}
            </div>
            <div className="absolute top-4 -left-2 w-4 h-4 bg-[#E7FFDB] rotate-45 border-l border-b border-emerald-100"></div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <AlertCircle className="w-4 h-4" />
          Envío vía WhatsApp
        </div>
        <button 
          onClick={handleSend}
          disabled={!preview || isSending}
          className="flex items-center gap-3 px-8 py-3 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-emerald-200"
        >
          {isSending ? 'PROCESANDO...' : (
            <>
              <Send className="w-5 h-5" />
              ABRIR CHAT Y ENVIAR
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default WhatsAppMessenger;
