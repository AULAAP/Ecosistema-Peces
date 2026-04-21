
import * as React from 'react';
import { useState } from 'react';
import { 
  Play, CheckCircle2, BookOpen, Clock, 
  ChevronRight, Award, Star, Search,
  Lock, PlayCircle, FileText, MessageSquare, Sparkles
} from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  locked: boolean;
  type: 'video' | 'reading' | 'quiz';
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

const TRAINING_DATA: Module[] = [
  {
    id: 'm1',
    title: 'Fundamentos del Liderazgo',
    lessons: [
      { id: 'l1', title: 'Visión y Misión del Ecosistema', duration: '15:00', completed: true, locked: false, type: 'video' },
      { id: 'l2', title: 'Cualidades de un Líder Peces', duration: '10:00', completed: false, locked: false, type: 'video' },
      { id: 'l3', title: 'Ética y Responsabilidad', duration: '5:00', completed: false, locked: false, type: 'reading' },
    ]
  },
  {
    id: 'm2',
    title: 'Estrategias de Crecimiento',
    lessons: [
      { id: 'l4', title: 'Metodología de Consolidación', duration: '20:00', completed: false, locked: true, type: 'video' },
      { id: 'l5', title: 'Gestión de Grupos Pequeños', duration: '18:00', completed: false, locked: true, type: 'video' },
      { id: 'l6', title: 'Evaluación de Impacto', duration: '12:00', completed: false, locked: true, type: 'quiz' },
    ]
  },
  {
    id: 'm3',
    title: 'Herramientas Digitales',
    lessons: [
      { id: 'l7', title: 'Uso Avanzado del Dashboard', duration: '25:00', completed: false, locked: true, type: 'video' },
      { id: 'l8', title: 'Automatización con WhatsApp', duration: '15:00', completed: false, locked: true, type: 'video' },
    ]
  }
];

const CapacitacionB: React.FC = () => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson>(TRAINING_DATA[0].lessons[0]);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex h-full bg-white rounded-[3rem] overflow-hidden border border-slate-100 subtle-shadow animate-in fade-in zoom-in-95 duration-500 glossy-finish">
      {/* Sidebar de Lecciones */}
      <div className="w-80 border-r border-slate-100 flex flex-col bg-academic-bg/50">
        <div className="p-8 border-bottom border-slate-100">
          <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter mb-5">Módulos</h3>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar lección..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] uppercase font-black tracking-widest focus:outline-none focus:ring-4 focus:ring-royal/10 transition-all subtle-shadow"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {TRAINING_DATA.map((module) => (
            <div key={module.id} className="space-y-3">
              <div className="flex items-center justify-between px-2">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{module.title}</span>
                <span className="text-[9px] font-black text-royal bg-royal/10 px-2.5 py-1 rounded-full uppercase tracking-widest">
                  {module.lessons.filter(l => l.completed).length}/{module.lessons.length}
                </span>
              </div>
              <div className="space-y-2">
                {module.lessons.filter(l => l.title.toLowerCase().includes(searchQuery.toLowerCase())).map((lesson) => (
                  <button
                    key={lesson.id}
                    disabled={lesson.locked}
                    onClick={() => setSelectedLesson(lesson)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left group ${
                      selectedLesson.id === lesson.id 
                        ? 'bg-royal text-white shadow-xl shadow-royal/20 glossy-finish' 
                        : 'hover:bg-white text-slate-600 hover:subtle-shadow'
                    } ${lesson.locked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      selectedLesson.id === lesson.id ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-royal/5'
                    }`}>
                      {lesson.locked ? (
                        <Lock className="w-4 h-4" />
                      ) : lesson.completed ? (
                        <CheckCircle2 className={`w-5 h-5 ${selectedLesson.id === lesson.id ? 'text-white' : 'text-sea'}`} />
                      ) : (
                        <PlayCircle className={`w-5 h-5 ${selectedLesson.id === lesson.id ? 'text-white' : 'text-royal'}`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-black uppercase tracking-tight truncate leading-tight">{lesson.title}</div>
                      <div className={`text-[8px] font-black uppercase tracking-widest mt-1 ${selectedLesson.id === lesson.id ? 'text-white/60' : 'text-slate-400'}`}>
                        {lesson.duration} • {lesson.type}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-white relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-royal/10 text-royal text-[9px] font-black uppercase tracking-[0.2em] rounded-lg">Capacitación B</span>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Módulo Actual</span>
            </div>
            <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter leading-tight">{selectedLesson.title}</h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Progreso Total</div>
              <div className="flex items-center gap-3">
                <div className="w-40 h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-sea rounded-full" style={{ width: '35%' }} />
                </div>
                <span className="text-sm font-black text-slate-800">35%</span>
              </div>
            </div>
            <button className="p-4 bg-slate-50 hover:bg-slate-100 rounded-[1.5rem] transition-all subtle-shadow">
              <Star className="w-6 h-6 text-amber" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-10 relative">
          <div className="geometric-shape top-10 right-10 w-24 h-24 border-8 border-royal/5 rounded-full" />
          
          {/* Reproductor de Video Placeholder */}
          <div className="aspect-video bg-royal rounded-[3rem] mb-10 relative overflow-hidden group flex items-center justify-center subtle-shadow glossy-finish border-8 border-white">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex flex-col items-center">
              <button className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:scale-110 transition-all duration-300 border border-white/40 shadow-2xl glossy-finish">
                <Play className="w-10 h-10 fill-current ml-1.5" />
              </button>
              <p className="mt-6 text-white font-black text-[10px] uppercase tracking-[0.3em]">Haga clic para iniciar</p>
            </div>
            
            <div className="absolute bottom-10 left-10 right-10 flex items-center justify-between text-white opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-royal-200" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{selectedLesson.duration}</span>
                </div>
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-royal-200" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Material PDF</span>
                </div>
              </div>
              <button className="px-6 py-3 bg-white/20 backdrop-blur-xl rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/30 transition-colors border border-white/20">
                PANTALLA COMPLETA
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 subtle-shadow">
                <h4 className="text-[10px] font-black text-royal uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                  <FileText className="w-5 h-5" />
                  Descripción del Módulo
                </h4>
                <p className="text-slate-500 text-base leading-relaxed font-medium">
                  En esta sesión profundizaremos en los conceptos clave de la capacitación B. 
                  Aprenderás cómo aplicar las herramientas del ecosistema para maximizar el impacto 
                  en tu comunidad local. Analizaremos casos de éxito y mejores prácticas 
                  para la gestión de líderes y el seguimiento de nuevos miembros.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between p-8 bg-royal/5 rounded-[2.5rem] border border-royal/10">
                <div className="flex items-center gap-6 mb-6 sm:mb-0">
                  <div className="w-16 h-16 bg-royal rounded-3xl flex items-center justify-center text-white shadow-xl shadow-royal/20 glossy-finish">
                    <Award className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="text-[11px] font-black text-royal uppercase tracking-tight">¿Completaste esta lección?</div>
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Suma puntos para tu certificación</div>
                  </div>
                </div>
                <button className="w-full sm:w-auto px-8 py-5 bg-royal text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-royal/90 transition-all shadow-xl shadow-royal/20 glossy-finish">
                  Finalizar Lección
                </button>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 subtle-shadow glossy-finish">
                <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Recursos</h4>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-4 bg-academic-bg hover:bg-white rounded-[1.5rem] transition-all group hover:subtle-shadow border border-transparent hover:border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 text-slate-400 group-hover:text-royal transition-all">
                        <FileText className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Guía de Estudio</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </button>
                  <button className="w-full flex items-center justify-between p-4 bg-academic-bg hover:bg-white rounded-[1.5rem] transition-all group hover:subtle-shadow border border-transparent hover:border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 text-slate-400 group-hover:text-royal transition-all">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Comunidad</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </button>
                </div>
              </div>

              <div className="bg-trolley rounded-[2.5rem] p-8 text-white relative overflow-hidden subtle-shadow glossy-finish">
                <div className="absolute top-0 right-0 w-40 h-40 bg-royal/20 blur-[50px]" />
                <div className="absolute -bottom-8 -left-8 w-24 h-24 border-4 border-white/5 rounded-full" />
                <h4 className="text-[9px] font-black text-amber uppercase tracking-[0.3em] mb-3 relative z-10">Meta Próxima</h4>
                <p className="text-[11px] font-bold mb-6 relative z-10 leading-relaxed">Completa este módulo para desbloquear el examen de certificación global.</p>
                <div className="flex items-center gap-2.5 text-[9px] font-black uppercase tracking-[0.2em] text-white/50 relative z-10">
                  <Sparkles className="w-4 h-4 text-amber" />
                  Recompensa: +150 XP
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapacitacionB;
