
import * as React from 'react';
import { useState } from 'react';
import { 
  GraduationCap, BookOpen, CheckCircle2, Circle, Play, 
  Calendar, ChevronRight, Search, Filter, Award,
  Clock, Users, Target, Sparkles
} from 'lucide-react';
import { WeeklyPlan, TrainingTopic } from '../types';
import { INITIAL_WEEKLY_PLANS, TRAINING_TOPICS } from '../constants';

const TrainingModule: React.FC = () => {
  const [plans, setPlans] = useState<WeeklyPlan[]>(INITIAL_WEEKLY_PLANS);
  const [topics] = useState<TrainingTopic[]>(TRAINING_TOPICS);
  const [activeTab, setActiveTab] = useState<'plans' | 'topics'>('plans');
  const [searchQuery, setSearchQuery] = useState('');

  const togglePlanCompletion = (weekNumber: number) => {
    setPlans(prev => prev.map(p => 
      p.weekNumber === weekNumber ? { ...p, isCompleted: !p.isCompleted } : p
    ));
  };

  const completedCount = plans.filter(p => p.isCompleted).length;
  const progress = Math.round((completedCount / plans.length) * 100);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-50 rounded-full blur-3xl group-hover:bg-blue-100 transition-colors duration-500" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Centro de Capacitación</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Entrenamiento Avanzado para Líderes de Peces.io</p>
              </div>
            </div>
            
            <div className="flex items-center gap-8">
              <div className="flex-1">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progreso del Programa</span>
                  <span className="text-2xl font-black text-blue-600">{progress}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(37,99,235,0.3)]" 
                    style={{ width: `${progress}%` }} 
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="text-2xl font-black text-slate-800">{completedCount}</div>
                  <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Completados</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-slate-800">{plans.length}</div>
                  <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Total Planes</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-20">
            <Award className="w-24 h-24" />
          </div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="px-3 py-1 bg-blue-500/20 rounded-full text-[8px] font-black uppercase tracking-widest inline-block mb-4 border border-blue-500/30">Próximo Hito</div>
              <h3 className="text-xl font-black uppercase tracking-tight leading-tight mb-2">Certificación de Pastor de Zona</h3>
              <p className="text-slate-400 text-xs font-medium leading-relaxed">Completa 5 planes semanales para obtener tu insignia de liderazgo territorial.</p>
            </div>
            <button className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-50 transition-all mt-6">
              Ver Requisitos
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
          <button 
            onClick={() => setActiveTab('plans')}
            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'plans' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Planes Semanales
          </button>
          <button 
            onClick={() => setActiveTab('topics')}
            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'topics' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Biblioteca de Temas
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar contenido..." 
              className="pl-11 pr-6 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-100 transition-all w-64 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-800 transition-all shadow-sm">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      {activeTab === 'plans' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`bg-white rounded-[2.5rem] border transition-all duration-500 overflow-hidden group ${plan.isCompleted ? 'border-emerald-100 shadow-emerald-50' : 'border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-1'}`}
            >
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${plan.isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                    <Calendar className="w-6 h-6" />
                  </div>
                  <button 
                    onClick={() => togglePlanCompletion(plan.weekNumber!)}
                    className={`p-2 rounded-xl transition-all ${plan.isCompleted ? 'text-emerald-600 bg-emerald-50' : 'text-slate-300 hover:text-blue-600 hover:bg-blue-50'}`}
                  >
                    {plan.isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                  </button>
                </div>

                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-2">{plan.title}</h3>
                <p className="text-slate-500 text-xs font-medium leading-relaxed mb-6">{plan.description}</p>

                <div className="space-y-3 mb-8">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Temas a cubrir:</p>
                  {plan.topics.map((topic, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs font-bold text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100/50">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                      {topic}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{plan.date}</span>
                  </div>
                  {plan.youtubeUrl && (
                    <a 
                      href={plan.youtubeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest hover:gap-3 transition-all"
                    >
                      Ver Video <Play className="w-3 h-3 fill-current" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {topics.map((topic) => (
            <div key={topic.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden group hover:-translate-y-1 transition-all">
              <div className="h-48 bg-slate-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10" />
                <img 
                  src={`https://picsum.photos/seed/${topic.id}/600/400`} 
                  alt={topic.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[8px] font-black text-white uppercase tracking-widest border border-white/30">
                    {topic.category}
                  </span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-500">
                    <Play className="w-6 h-6 fill-current ml-1" />
                  </div>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-2">{topic.title}</h3>
                <p className="text-slate-500 text-xs font-medium leading-relaxed mb-6 line-clamp-2">{topic.content}</p>
                <button className="w-full py-4 bg-slate-50 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2">
                  Leer Contenido <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrainingModule;
