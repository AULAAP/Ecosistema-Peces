
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
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
      {/* Header & Stats */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white rounded-[3.5rem] p-12 border border-slate-100 shadow-sm relative overflow-hidden group subtle-shadow glossy-finish">
          <div className="absolute top-0 right-0 w-96 h-96 bg-royal/5 rounded-full blur-3xl -mr-32 -mt-32 opacity-60 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="flex items-center gap-6 mb-10">
              <div className="w-16 h-16 bg-white border border-slate-100/50 rounded-[1.5rem] flex items-center justify-center text-royal shadow-sm group-hover:rotate-6 transition-transform">
                <GraduationCap className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tighter leading-none mb-2">Centro Académico</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Formación técnica para estrategas territoriales</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 w-full">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Acreditación Académica</span>
                  <span className="text-3xl font-black text-royal tracking-tighter">{progress}%</span>
                </div>
                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-50 shadow-inner">
                  <div 
                    className="h-full bg-royal transition-all duration-1000 ease-out shadow-lg shadow-royal/20 glossy-finish" 
                    style={{ width: `${progress}%` }} 
                  />
                </div>
              </div>
              <div className="flex gap-8 shrink-0">
                <div className="text-center">
                  <div className="text-4xl font-black text-slate-800 tracking-tighter">{completedCount}</div>
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Hitos</div>
                </div>
                <div className="w-px h-12 bg-slate-100"></div>
                <div className="text-center">
                  <div className="text-4xl font-black text-slate-800 tracking-tighter">{plans.length}</div>
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Módulos</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white shadow-xl relative overflow-hidden glossy-finish group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Award className="w-32 h-32" />
          </div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="px-4 py-1.5 bg-white/10 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] inline-block mb-6 border border-white/10">Próxima Certificación</div>
              <h3 className="text-2xl font-black uppercase tracking-tighter leading-tight mb-4 group-hover:text-royal transition-colors">Maestría en Gestión Zonal</h3>
              <p className="text-slate-400 text-xs font-medium leading-relaxed">Avalado por el ecosistema Peces.io para la supervisión de múltiples clústers.</p>
            </div>
            <button className="w-full py-5 bg-white text-slate-800 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-slate-100 transition-all active:scale-95 shadow-xl shadow-white/5 mt-8">
              Postular Diploma
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="flex bg-white p-2 rounded-[1.5rem] border border-slate-100 shadow-sm subtle-shadow">
          <button 
            onClick={() => setActiveTab('plans')}
            className={`px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all transform active:scale-95 ${activeTab === 'plans' ? 'bg-royal text-white shadow-xl shadow-royal/20 glossy-finish' : 'text-slate-400 hover:text-royal hover:bg-royal/5'}`}
          >
            Syllabus Semanal
          </button>
          <button 
            onClick={() => setActiveTab('topics')}
            className={`px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all transform active:scale-95 ${activeTab === 'topics' ? 'bg-royal text-white shadow-xl shadow-royal/20 glossy-finish' : 'text-slate-400 hover:text-royal hover:bg-royal/5'}`}
          >
            Repositorio Temático
          </button>
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:flex-none">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Explorar currículum..." 
              className="w-full lg:w-80 pl-14 pr-8 py-4 bg-white border border-slate-100 rounded-[1.5rem] text-[12px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-royal/5 focus:border-royal/20 transition-all shadow-sm group-hover:shadow-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="w-14 h-14 bg-white border border-slate-100 rounded-[1.5rem] text-slate-400 hover:text-royal hover:border-royal/30 transition-all shadow-sm flex items-center justify-center">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      {activeTab === 'plans' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`bg-white rounded-[3.5rem] border transition-all duration-700 overflow-hidden group subtle-shadow glossy-finish ${plan.isCompleted ? 'border-sea/30 shadow-sea/5' : 'border-slate-100 hover:border-royal/30 hover:shadow-2xl hover:-translate-y-2'}`}
            >
              <div className="p-10">
                <div className="flex items-start justify-between mb-8">
                  <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-700 shadow-sm ${plan.isCompleted ? 'bg-sea/10 text-sea rotate-6' : 'bg-royal/5 text-royal group-hover:-rotate-6'}`}>
                    <Calendar className="w-8 h-8" />
                  </div>
                  <button 
                    onClick={() => togglePlanCompletion(plan.weekNumber!)}
                    className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all shadow-sm active:scale-90 ${plan.isCompleted ? 'text-sea bg-sea/10' : 'text-slate-300 hover:text-royal hover:bg-royal/5 border border-slate-50'}`}
                  >
                    {plan.isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                  </button>
                </div>

                <h3 className={`text-2xl font-black uppercase tracking-tighter mb-4 transition-colors ${plan.isCompleted ? 'text-sea' : 'text-slate-800'}`}>{plan.title}</h3>
                <p className="text-slate-500 text-[13px] font-medium leading-relaxed mb-8">{plan.description}</p>

                <div className="space-y-4 mb-10">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Sparkles className="w-3 h-3" /> Objetivos pedagógicos
                    </p>
                  {plan.topics.map((topic, i) => (
                    <div key={i} className="flex items-center gap-4 text-xs font-bold text-slate-600 bg-slate-50/50 p-4 rounded-[1.25rem] border border-slate-50 group-hover:bg-white transition-colors">
                      <div className="w-2 h-2 bg-royal/20 rounded-full group-hover:bg-royal/50 transition-colors" />
                      {topic}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                  <div className="flex items-center gap-3 text-slate-400">
                    <Clock className="w-4 h-4 text-royal opacity-50" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{plan.date}</span>
                  </div>
                  {plan.youtubeUrl && (
                    <a 
                      href={plan.youtubeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-6 py-2.5 bg-royal/[0.03] rounded-xl text-royal font-black text-[10px] uppercase tracking-[0.1em] hover:bg-royal hover:text-white transition-all shadow-sm"
                    >
                      Certificar Módulo <Play className="w-3.5 h-3.5 fill-current" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {topics.map((topic) => (
            <div key={topic.id} className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden group hover:-translate-y-2 transition-all duration-700 subtle-shadow glossy-finish">
              <div className="h-56 bg-slate-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent z-10" />
                <img 
                  src={`https://picsum.photos/seed/${topic.id}/600/400`} 
                  alt={topic.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-6 left-6 z-20">
                  <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-xl text-[9px] font-black text-white uppercase tracking-[0.2em] border border-white/20">
                    {topic.category}
                  </span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-royal shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-500 shadow-royal/20">
                    <Play className="w-7 h-7 fill-current ml-1" />
                  </div>
                </div>
              </div>
              <div className="p-10">
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter mb-3 leading-tight group-hover:text-royal transition-colors">{topic.title}</h3>
                <p className="text-slate-500 text-[13px] font-medium leading-relaxed mb-8 line-clamp-2">{topic.content}</p>
                <button className="w-full py-5 bg-slate-50 text-slate-400 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-royal hover:text-white transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-lg">
                  Explorar Material <ChevronRight className="w-4 h-4" />
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
