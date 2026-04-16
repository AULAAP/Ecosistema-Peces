
import * as React from 'react';
import { useState } from 'react';
import { 
  Play, CheckCircle2, BookOpen, Clock, 
  ChevronRight, Award, Star, Search,
  Lock, PlayCircle, FileText, MessageSquare
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
    <div className="flex h-full bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-xl animate-in fade-in zoom-in-95 duration-500">
      {/* Sidebar de Lecciones */}
      <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/50">
        <div className="p-6 border-bottom border-slate-100">
          <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter mb-4">Módulos</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar lección..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {TRAINING_DATA.map((module) => (
            <div key={module.id} className="space-y-2">
              <div className="flex items-center justify-between px-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{module.title}</span>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  {module.lessons.filter(l => l.completed).length}/{module.lessons.length}
                </span>
              </div>
              <div className="space-y-1">
                {module.lessons.filter(l => l.title.toLowerCase().includes(searchQuery.toLowerCase())).map((lesson) => (
                  <button
                    key={lesson.id}
                    disabled={lesson.locked}
                    onClick={() => setSelectedLesson(lesson)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left group ${
                      selectedLesson.id === lesson.id 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                        : 'hover:bg-white text-slate-600'
                    } ${lesson.locked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                      selectedLesson.id === lesson.id ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-blue-50'
                    }`}>
                      {lesson.locked ? (
                        <Lock className="w-4 h-4" />
                      ) : lesson.completed ? (
                        <CheckCircle2 className={`w-4 h-4 ${selectedLesson.id === lesson.id ? 'text-white' : 'text-emerald-500'}`} />
                      ) : (
                        <PlayCircle className={`w-4 h-4 ${selectedLesson.id === lesson.id ? 'text-white' : 'text-blue-600'}`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-black truncate">{lesson.title}</div>
                      <div className={`text-[9px] font-bold ${selectedLesson.id === lesson.id ? 'text-white/60' : 'text-slate-400'}`}>
                        {lesson.duration} • {lesson.type.toUpperCase()}
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
      <div className="flex-1 flex flex-col bg-white">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest rounded-full">Capacitación B</span>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Módulo 1</span>
            </div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">{selectedLesson.title}</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progreso Total</div>
              <div className="flex items-center gap-2">
                <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '35%' }} />
                </div>
                <span className="text-xs font-black text-slate-800">35%</span>
              </div>
            </div>
            <button className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors">
              <Star className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {/* Reproductor de Video Placeholder */}
          <div className="aspect-video bg-slate-900 rounded-[2rem] mb-8 relative overflow-hidden group flex items-center justify-center shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex flex-col items-center">
              <button className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 border border-white/20">
                <Play className="w-8 h-8 fill-current ml-1" />
              </button>
              <p className="mt-4 text-white/60 font-bold text-xs uppercase tracking-widest">Haga clic para iniciar lección</p>
            </div>
            {/* Overlay de información */}
            <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-bold">{selectedLesson.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-xs font-bold">Material Adjunto</span>
                </div>
              </div>
              <button className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/30 transition-colors">
                Pantalla Completa
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2 space-y-6">
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Descripción de la Lección
                </h4>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                  En esta sesión profundizaremos en los conceptos clave de la capacitación B. 
                  Aprenderás cómo aplicar las herramientas del ecosistema para maximizar el impacto 
                  en tu comunidad local. Analizaremos casos de éxito y mejores prácticas 
                  para la gestión de líderes y el seguimiento de nuevos miembros.
                </p>
              </div>

              <div className="flex items-center justify-between p-6 bg-blue-50 rounded-3xl border border-blue-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-blue-900 uppercase tracking-tight">¿Completaste esta lección?</div>
                    <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Marca para avanzar al siguiente nivel</div>
                  </div>
                </div>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                  Marcar como Completada
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Recursos Descargables</h4>
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-slate-100 text-slate-400 group-hover:text-blue-600 transition-colors">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight">Guía PDF</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-slate-100 text-slate-400 group-hover:text-blue-600 transition-colors">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight">Foro de Discusión</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl" />
                <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 relative z-10">Siguiente Paso</h4>
                <p className="text-xs font-bold mb-4 relative z-10">Completa este módulo para desbloquear el examen de certificación.</p>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 relative z-10">
                  <Star className="w-3 h-3" />
                  Puntos: +50 XP
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
