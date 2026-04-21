
import React from 'react';
import { Briefcase, Lightbulb, Clock, Zap, Leaf, Award, Pencil, NotebookText, Sparkles, MapPin } from 'lucide-react';

interface Props {
  items: string[];
  selectedItem: string;
  onSelect: (item: string) => void;
}

const COLORS = ['#4169E1', '#FFBF00', '#00C9A7', '#424242', '#6366f1', '#ec4899', '#8b5cf6'];

const ModernInfographic: React.FC<Props> = ({ items, selectedItem, onSelect }) => {
  const allItems = ['Todas', ...items];

  // Common icons for all panels (Meeting/Reunion concept)
  const commonIcons = [
    <Clock key="clock" className="w-6 h-6" />,
    <Pencil key="pencil" className="w-5 h-5 opacity-70" />,
    <NotebookText key="note" className="w-6 h-6" />
  ];

  return (
    <div className="relative w-full py-10 px-4 overflow-hidden bg-academic-bg rounded-[3rem] shadow-inner mb-6">
      {/* Floating Geometric Shapes */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-royal/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-amber/10 rotate-45 blur-xl"></div>
      <div className="absolute top-1/2 left-1/4 w-10 h-10 border-4 border-sea/10 rotate-12"></div>
      
      <div className="flex flex-wrap lg:flex-nowrap gap-4 justify-center relative z-10">
        {allItems.map((item, index) => {
          const isSelected = selectedItem === item;
          const color = COLORS[index % COLORS.length];
          
          return (
            <button 
              key={item}
              onClick={() => onSelect(item)}
              className={`flex-1 min-w-[180px] h-56 rounded-[2.5rem] p-6 flex flex-col justify-between transition-all duration-500 
                ${isSelected ? 'scale-105 rotate-1 shadow-2xl z-20 ring-4 ring-white/30' : 'opacity-60 grayscale-[0.3] hover:opacity-100 hover:grayscale-0 hover:scale-102'} 
                subtle-shadow glossy-finish text-white group overflow-hidden relative`}
              style={{ backgroundColor: color }}
            >
              {/* Highlight effect for selection */}
              {isSelected && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl -mr-10 -mt-10" />
              )}
              
              <div className="relative z-10">
                <div className="flex items-center gap-2.5 mb-4 opacity-90 transition-transform group-hover:scale-110 duration-500">
                  {commonIcons}
                </div>
                <h3 className="text-xl font-black uppercase tracking-tighter leading-none mb-1 text-left">
                  {item}
                </h3>
                <p className="text-[9px] font-black uppercase tracking-widest opacity-60 text-left">
                  {isSelected ? 'Seleccionado' : 'Ver Detalles'}
                </p>
              </div>
            </button>
          );
        })}
      </div>
      
      {/* More floating elements */}
      <div className="absolute top-20 right-1/4 w-4 h-4 bg-sea/20 rounded-full"></div>
      <div className="absolute bottom-20 left-1/3 w-6 h-6 border-2 border-royal/20 rotate-45"></div>
    </div>
  );
};

export default ModernInfographic;
