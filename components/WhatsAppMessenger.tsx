
import React, { useState, useEffect } from 'react';
import { ChurchLeader, Meeting, ContactStatus } from '../types';
import { MessageSquare, Send, Sparkles, AlertCircle, CheckCircle2, ArrowLeft, X, Users } from 'lucide-react';
import { generateWhatsAppTemplate, parseTemplate } from '../services/geminiService';
import { copyToClipboard } from '../src/lib/clipboard';

interface Props {
  church?: ChurchLeader;
  meeting?: Meeting;
  churches?: ChurchLeader[]; // Added to allow group context
  onSent: (id: string) => void;
  onBack?: () => void;
}

const WhatsAppMessenger: React.FC<Props> = ({ church, meeting, churches, onSent, onBack }) => {
  const [template, setTemplate] = useState('');
  const [preview, setPreview] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [mode, setMode] = useState<'individual' | 'group'>(church ? 'individual' : 'group');

  useEffect(() => {
    if (meeting && template) {
        if (mode === 'individual' && church) {
            setPreview(parseTemplate(template, church, meeting));
        } else {
            // Mock church object for group preview
            const groupMock: ChurchLeader = {
                id: 'group',
                fullName: 'Líderes',
                whatsapp: '',
                email: '',
                churchName: '',
                community: '',
                zone: meeting.zone,
                meetingId: meeting.name,
                status: ContactStatus.PENDING,
                booksCount: 0,
                responsibleEntity: ''
            };
            setPreview(parseTemplate(template, groupMock, meeting));
        }
    }
  }, [church, meeting, template, mode]);

  const handleGenerateTemplate = async () => {
    if (!meeting) return;
    setIsGenerating(true);
    const text = await generateWhatsAppTemplate(meeting, mode);
    setTemplate(text);
    setIsGenerating(false);
  };

  const handleSend = () => {
    setIsSending(true);
    setTimeout(() => {
      const msg = preview || (mode === 'individual' && church ? parseTemplate(template, church, meeting!) : template);
      
      if (mode === 'individual' && church) {
          onSent(church.id);
          const phoneInput = church.whatsapp || '';
          let phone = phoneInput.toString().replace(/\D/g, '');
          if (phone.length === 10 && (phone.startsWith('809') || phone.startsWith('829') || phone.startsWith('849'))) {
              phone = '1' + phone;
          }
          window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
      } else {
          // Group Send
          copyToClipboard(msg);
          alert("Mensaje copiado. Selecciona tu grupo en WhatsApp y pégalo.");
          window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
      }
      
      setIsSending(false);
      if (onBack) onBack();
    }, 800);
  };

  if (!meeting) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl h-[60vh] bg-white">
        <MessageSquare className="w-16 h-16 mb-4 opacity-10" />
        <h3 className="text-lg font-bold text-slate-600">Centro de Mensajería</h3>
        <p className="text-center max-w-xs mt-2">Selecciona un grupo o líder para redactar la invitación.</p>
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
    <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 flex flex-col h-full overflow-hidden subtle-shadow glossy-finish animate-in fade-in zoom-in-95 duration-500">
      <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-academic-bg/50 backdrop-blur-md">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-white border border-slate-100 text-royal rounded-[1.25rem] flex items-center justify-center font-black text-2xl shadow-sm">
            {mode === 'individual' && church ? church.fullName.charAt(0) : <Users className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-slate-800 tracking-tight leading-tight">
                    {mode === 'individual' && church ? church.fullName : `Grupo: ${meeting.name}`}
                </h3>
                {church && (
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        <button onClick={() => setMode('individual')} className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase transition-all ${mode === 'individual' ? 'bg-white text-royal shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Individual</button>
                        <button onClick={() => setMode('group')} className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase transition-all ${mode === 'group' ? 'bg-white text-royal shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Grupal</button>
                    </div>
                )}
            </div>
            <div className="flex items-center gap-3 mt-1.5">
               <span className="text-[10px] font-black text-royal bg-royal/5 px-2.5 py-1 rounded-lg uppercase tracking-widest">
                   {mode === 'individual' && church ? church.churchName : `${churches?.length || 0} Líderes`}
               </span>
               {mode === 'individual' && church && (
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none border-l pl-3 border-slate-200">{church.whatsapp}</span>
               )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {mode === 'individual' && church && (
            <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                church.status === ContactStatus.SENT ? 'bg-sea/10 text-sea border border-sea/20' : 'bg-amber/10 text-amber border border-amber/20'
            }`}>
                {church.status}
            </span>
          )}
          {onBack && (
            <button 
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 rounded-2xl text-slate-400 transition-all active:scale-90"
              title="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 p-10 overflow-y-auto space-y-10 bg-white">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
               <label className="text-[11px] font-black text-slate-800 uppercase tracking-widest block mb-1">Estructura del Mensaje</label>
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em]">Define las variables inteligentes con IA</p>
            </div>
            <button 
              onClick={handleGenerateTemplate}
              disabled={isGenerating}
              className="flex items-center gap-3 px-5 py-2.5 bg-royal text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-royal/90 transition-all shadow-lg shadow-royal/20 disabled:opacity-50 active:scale-95 glossy-finish"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isGenerating ? 'Generando...' : 'Re-Redactar'}
            </button>
          </div>
          
          <div className="relative group">
            <textarea 
              className="w-full h-48 p-6 text-[13px] font-medium border border-slate-200 rounded-[2rem] focus:ring-4 focus:ring-royal/5 focus:border-royal/30 outline-none resize-none bg-slate-50 transition-all leading-relaxed group-hover:border-slate-300"
              placeholder="Introduce tu mensaje aquí..."
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
            />
            <div className="absolute top-4 right-4 flex gap-1.5">
               <div className="w-2 h-2 rounded-full bg-red-400/20"></div>
               <div className="w-2 h-2 rounded-full bg-amber-400/20"></div>
               <div className="w-2 h-2 rounded-full bg-sea-400/20"></div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2.5">
            {['{{nombre_completo}}', '{{nombre_iglesia}}', '{{comunidad}}', '{{reunion_asignada}}', '{{fecha}}', '{{hora}}', '{{sede}}'].map(tag => (
              <code key={tag} className="px-3 py-1.5 bg-slate-100 text-slate-500 rounded-xl text-[9px] font-black uppercase tracking-widest border border-slate-200/50 hover:bg-royal/5 hover:text-royal transition-colors cursor-default">{tag}</code>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
             <div className="w-6 h-6 bg-sea/10 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-sea" />
             </div>
             <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Vista previa del envío</h4>
          </div>
          
          <div className="relative">
            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed min-h-[140px] relative z-10 shadow-inner group transition-all hover:bg-white hover:border-slate-200">
              {preview ? (
                <div className="animate-in fade-in duration-500">{preview}</div>
              ) : (
                <span className="text-slate-300 italic font-medium">La previsualización aparecerá aquí una vez redactes el mensaje...</span>
              )}
            </div>
            {/* WhatsApp bubble tail */}
            <div className="absolute top-8 -left-2 w-5 h-5 bg-inherit border-l border-b border-inherit rotate-45 transform skew-x-12 z-0 hidden lg:block"></div>
          </div>
        </div>
      </div>

      <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm">
             <AlertCircle className="w-5 h-5" />
          </div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.1em] max-w-[120px] leading-tight">Canal Seguro vía WhatsApp API Cloud</p>
        </div>
        <button 
          onClick={handleSend}
          disabled={!preview || isSending}
          className="flex items-center gap-4 px-10 py-4 bg-sea text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-sea/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-sea/20 active:scale-95 transform glossy-finish"
        >
          {isSending ? 'PROCESANDO...' : (
            <>
              <Send className="w-5 h-5" />
              SOLICITAR ENVÍO
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default WhatsAppMessenger;
