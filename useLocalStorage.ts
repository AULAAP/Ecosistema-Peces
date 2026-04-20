
import * as React from 'react';
import { ExternalLink, GraduationCap, Sparkles, ShieldCheck } from 'lucide-react';

const AulaApp: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center py-10 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      <div className="max-w-2xl w-full bg-white rounded-[3rem] p-12 border border-slate-100 shadow-2xl text-center relative overflow-hidden group">
        {/* Elementos decorativos de fondo */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-50 rounded-full blur-3xl group-hover:bg-indigo-100 transition-colors duration-500" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-slate-50 rounded-full blur-3xl group-hover:bg-slate-100 transition-colors duration-500" />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-200 mb-8 transform group-hover:scale-110 transition-transform duration-500">
            <GraduationCap className="w-12 h-12" />
          </div>
          
          <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tighter mb-4">
            AulaApp
          </h2>
          
          <p className="text-slate-500 text-lg mb-10 max-w-md mx-auto leading-relaxed">
            Bienvenido a tu plataforma de formación avanzada. Accede a recursos exclusivos, clases en vivo y materiales de estudio para tu crecimiento ministerial.
          </p>

          <div className="grid grid-cols-2 gap-4 w-full mb-10 text-left">
            <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-lg transition-all duration-300">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-slate-800 font-black text-sm uppercase tracking-tight">Recursos Pro</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Contenido exclusivo</div>
            </div>
            <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-lg transition-all duration-300">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-slate-800 font-black text-sm uppercase tracking-tight">Acceso Seguro</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Conexión encriptacion</div>
            </div>
          </div>

          <a 
            href="https://aulaa-pfinal.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-indigo-200 transition-all hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-3 active:scale-95"
          >
            Iniciar APP
            <ExternalLink className="w-5 h-5" />
          </a>
          
          <p className="mt-6 text-[10px] font-black text-slate-300 uppercase tracking-widest">
            Se abrirá en una nueva pestaña por seguridad y para una mejor experiencia
          </p>
        </div>
      </div>
    </div>
  );
};

export default AulaApp;
