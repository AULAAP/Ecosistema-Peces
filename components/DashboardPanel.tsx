import React, { useEffect, useState, useRef } from 'react';
import type { Cluster, TrainingChurch } from '../types';
import { Download, TrendingUp, Award, Users, LayoutGrid } from 'lucide-react';
// @ts-ignore
import html2canvas from 'html2canvas';
// @ts-ignore
import { jsPDF } from 'jspdf';

interface DashboardPanelProps {
    clusters: Cluster[];
    churches: TrainingChurch[];
    churchProgressData: Record<number, Record<number, boolean>>;
    clusterProgressData: Record<number, Record<number, boolean>>;
    totalPlanCount: number;
}

interface StatCardProps {
    title: string;
    value: number;
    suffix?: string;
    gradient: string;
    delay?: number;
    description?: React.ReactNode;
    icon: React.ReactNode;
}

const useCountUp = (end: number, duration: number = 2000) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime: number | null = null;
        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }, [end, duration]);

    return count;
};

const StatCard: React.FC<StatCardProps> = ({ title, value, suffix = '', gradient, delay = 0, description, icon }) => {
    const displayValue = useCountUp(value);
    
    return (
        <div 
            className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 transform transition-all duration-700 hover:scale-[1.02] hover:shadow-2xl flex flex-col justify-between overflow-hidden relative group subtle-shadow glossy-finish"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-5 blur-3xl -mr-16 -mt-16 group-hover:opacity-20 transition-opacity`}></div>
            
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-slate-50 border border-slate-100/50 rounded-2xl flex items-center justify-center text-royal shadow-sm">
                        {icon}
                    </div>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{title}</p>
                </div>
                <div className="flex items-baseline mb-4">
                    <span className="text-6xl font-black text-slate-800 tracking-tighter block animate-in slide-in-from-bottom-4 duration-1000">{displayValue}</span>
                    <span className="text-2xl font-black text-slate-400 ml-1.5 uppercase tracking-tighter">{suffix}</span>
                </div>
            </div>
            {description && (
                <div className="mt-8 pt-8 border-t border-slate-50 relative z-10">
                    <div className="text-[11px] text-slate-600 leading-relaxed font-medium">
                        {description}
                    </div>
                </div>
            )}
        </div>
    );
};

const DashboardPanel: React.FC<DashboardPanelProps> = ({ clusters, churches, churchProgressData, clusterProgressData, totalPlanCount }) => {
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const dashboardRef = useRef<HTMLDivElement>(null);
    
    // --- Cálculos Estadísticos ---

    let totalCompletedLessons = 0;
    Object.values(churchProgressData).forEach(progress => {
        totalCompletedLessons += Object.keys(progress).length;
    });
    
    const totalPossibleLessons = churches.length * totalPlanCount;
    const globalProgressPercentage = totalPossibleLessons > 0 
        ? Math.round((totalCompletedLessons / totalPossibleLessons) * 100) 
        : 0;

    const churchPerformance = churches.map(church => {
        const progress = churchProgressData[church.id] || {};
        const count = Object.keys(progress).length;
        return { ...church, count, percentage: totalPlanCount > 0 ? (count / totalPlanCount) * 100 : 0 };
    }).sort((a, b) => b.count - a.count);

    const topChurch = churchPerformance[0];
    
    let topChurchContent: React.ReactNode = <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest">Sin registros activos</span>;
    
    if (topChurch && topChurch.count > 0) {
        const belongingCluster = clusters.find(c => c.churchIds.includes(topChurch.id));
        const clusterName = belongingCluster ? belongingCluster.name : "Sin Clúster";
        
        topChurchContent = (
            <div className="flex flex-col gap-2">
                <span className="font-black text-slate-700 text-sm uppercase tracking-tighter leading-none" title={topChurch.name}>{topChurch.name}</span>
                <div className="flex items-center gap-3">
                    <span className="text-[9px] font-black text-royal py-1 px-2.5 bg-royal/5 rounded-lg uppercase tracking-widest">
                        {clusterName}
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full bg-sea pulse"></div>
                </div>
            </div>
        );
    }

    const clusterPerformance = clusters.map(cluster => {
        const leaderProgress = clusterProgressData[cluster.id] || {};
        const leaderCount = Object.keys(leaderProgress).length;
        const leaderPercentage = totalPlanCount > 0 ? (leaderCount / totalPlanCount) * 100 : 0;

        let clusterChurchesTotal = 0;
        const clusterChurches = churches.filter(c => cluster.churchIds.includes(c.id));
        
        clusterChurches.forEach(c => {
            const p = churchProgressData[c.id] || {};
            clusterChurchesTotal += Object.keys(p).length;
        });
        
        const churchesPossible = clusterChurches.length * totalPlanCount;
        const churchesAvgPercentage = churchesPossible > 0 
            ? (clusterChurchesTotal / churchesPossible) * 100 
            : 0;

        return { 
            ...cluster, 
            leaderPercentage, 
            churchesAvgPercentage,
            churchCount: clusterChurches.length
        };
    });

    const handleDownloadPDF = async () => {
        if (!dashboardRef.current) return;
        
        setIsGeneratingPdf(true);
        dashboardRef.current.classList.add('is-generating-pdf');
        
        try {
            const canvas = await html2canvas(dashboardRef.current, {
                scale: 2,
                backgroundColor: '#FAFAFA',
                useCORS: true,
                logging: false,
                windowWidth: dashboardRef.current.scrollWidth,
                windowHeight: dashboardRef.current.scrollHeight,
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            
            const margin = 10;
            const availableWidth = pdfWidth - (margin * 2);
            const ratio = availableWidth / imgWidth;
            
            const finalWidth = availableWidth;
            const finalHeight = imgHeight * ratio;
            
            let heightLeft = finalHeight;
            let position = margin;

            pdf.addImage(imgData, 'PNG', margin, position, finalWidth, finalHeight);
            heightLeft -= (pdfHeight - margin * 2);

            while (heightLeft > 0) {
                position = heightLeft - finalHeight + margin;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', margin, position, finalWidth, finalHeight);
                heightLeft -= pdfHeight;
            }
            
            const date = new Date().toLocaleDateString().replace(/\//g, '-');
            pdf.save(`REPORTE-ACADEMICO-${date}.pdf`);
            
        } catch (error) {
            console.error("Error generando PDF:", error);
            alert("Hubo un error al generar el PDF.");
        } finally {
            if (dashboardRef.current) {
                dashboardRef.current.classList.remove('is-generating-pdf');
            }
            setIsGeneratingPdf(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 no-print">
                <div className="text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-royal/10 text-royal rounded-full text-[9px] font-black uppercase tracking-widest mb-4 border border-royal/10">
                        Inteligencia de Datos
                    </div>
                    <h2 className="text-5xl font-black text-slate-800 tracking-tighter uppercase leading-none mb-3">Reporte General</h2>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px]">Consolidado de avance ministerial y hito de formación</p>
                </div>
                
                <button
                    onClick={handleDownloadPDF}
                    disabled={isGeneratingPdf}
                    className={`flex items-center gap-4 px-10 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] text-white shadow-xl transition-all glossy-finish transform active:scale-95
                        ${isGeneratingPdf 
                            ? 'bg-slate-400 cursor-not-allowed' 
                            : 'bg-slate-800 hover:bg-slate-900 shadow-slate-900/20'
                        }`}
                >
                    {isGeneratingPdf ? (
                        <>
                            <div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                            <span>GENERANDO...</span>
                        </>
                    ) : (
                        <>
                            <Download className="w-5 h-5" />
                            <span>DESCARGAR MEMORIA TÉCNICA</span>
                        </>
                    )}
                </button>
            </div>

            <div ref={dashboardRef} className="space-y-10 transition-all">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <StatCard 
                        title="Zonas Operativas" 
                        value={clusters.length} 
                        gradient="from-royal to-indigo-600" 
                        icon={<LayoutGrid className="w-6 h-6" />}
                    />
                    <StatCard 
                        title="Ecosistemas" 
                        value={churches.length} 
                        gradient="from-sea to-emerald-600" 
                        delay={100} 
                        icon={<Users className="w-6 h-6" />}
                    />
                    <StatCard 
                        title="Meta Académica" 
                        value={globalProgressPercentage} 
                        suffix="%" 
                        gradient="from-amber to-orange-500" 
                        delay={200} 
                        icon={<TrendingUp className="w-6 h-6" />}
                    />
                    <StatCard 
                        title="Máxima Tracción" 
                        value={topChurch ? Math.round(topChurch.percentage) : 0} 
                        suffix="%" 
                        gradient="from-royal to-sky-600" 
                        delay={300} 
                        description={topChurchContent}
                        icon={<Award className="w-6 h-6" />}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Rendimiento por Zona */}
                    <div className="lg:col-span-2 bg-white rounded-[3.5rem] shadow-sm p-12 border border-slate-100 subtle-shadow glossy-finish">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 border-b border-slate-50 pb-8 gap-6">
                            <div>
                                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Monitoreo Territorial</h3>
                                <p className="text-[10px] text-slate-400 mt-2 font-black uppercase tracking-[0.2em]">Desbalance: Mentoría vs Aplicación Local</p>
                            </div>
                            <div className="flex gap-8 text-[9px] font-black uppercase tracking-widest">
                                <div className="flex items-center gap-3"><span className="w-4 h-4 rounded-lg bg-royal shadow-md shadow-royal/20"></span> LÍDER ZONAL</div>
                                <div className="flex items-center gap-3"><span className="w-4 h-4 rounded-lg bg-sea shadow-md shadow-sea/20"></span> IGLESIAS AVG</div>
                            </div>
                        </div>
                        
                        <div className="space-y-12">
                            {clusterPerformance.map((cluster) => (
                                <div key={cluster.id} className="group">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center gap-4">
                                           <div className="w-2 h-8 bg-royal/10 group-hover:bg-royal transition-colors rounded-full"></div>
                                           <span className="font-black text-slate-800 text-lg uppercase tracking-tight">{cluster.name}</span>
                                        </div>
                                        <span className="text-[9px] font-black text-slate-400 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-100 uppercase tracking-widest">{cluster.churchCount} OPERATIVOS</span>
                                    </div>
                                    <div className="relative h-12 w-full bg-slate-50 rounded-2xl overflow-hidden shadow-inner border border-slate-100">
                                        <div 
                                            className="absolute top-0 left-0 h-full bg-sea transition-all duration-1000 ease-out flex items-center justify-end px-5 glossy-finish"
                                            style={{ width: `${Math.max(5, cluster.churchesAvgPercentage)}%` }}
                                        >
                                            {cluster.churchesAvgPercentage > 15 && <span className="text-[10px] font-black text-white">{Math.round(cluster.churchesAvgPercentage)}%</span>}
                                        </div>
                                        <div 
                                            className="absolute top-2 bottom-2 left-2 h-auto bg-royal rounded-xl shadow-xl transition-all duration-1000 ease-out flex items-center justify-end px-5 border border-white/10"
                                            style={{ width: `${Math.max(5, cluster.leaderPercentage)}%` }}
                                        >
                                            {cluster.leaderPercentage > 15 && <span className="text-[10px] font-black text-white">{Math.round(cluster.leaderPercentage)}%</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {clusterPerformance.length === 0 && (
                                <div className="text-center py-24 flex flex-col items-center">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4"><Users className="text-slate-200" /></div>
                                    <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Sin inteligencia territorial disponible</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Ranking Iglesias */}
                    <div className="bg-white rounded-[3.5rem] shadow-sm p-12 border border-slate-100 flex flex-col subtle-shadow glossy-finish">
                        <div className="mb-10 pb-8 border-b border-slate-50">
                             <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter leading-none mb-2">Cuadro de Honor</h3>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Iglesias con mayor tracción</p>
                        </div>
                        <div className="flex-grow overflow-y-auto max-h-[550px] pr-2 space-y-5 custom-scrollbar">
                            {churchPerformance.map((church, index) => {
                                const cluster = clusters.find(c => c.churchIds.includes(church.id));
                                
                                return (
                                    <div key={church.id} className="flex items-center gap-5 p-6 rounded-[2rem] bg-white hover:bg-royal/[0.02] transition-all duration-500 border border-slate-50 hover:border-royal/20 group">
                                        <div className={`
                                            w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-2xl font-black text-sm shadow-sm transition-transform group-hover:scale-110
                                            ${index === 0 ? 'bg-amber text-white shadow-xl shadow-amber/20' : 
                                            index === 1 ? 'bg-royal text-white shadow-xl shadow-royal/20' : 
                                            index === 2 ? 'bg-sea text-white shadow-xl shadow-sea/20' : 'bg-slate-50 text-slate-400'}\n                                        `}>
                                            {index + 1}
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <p className="font-black text-base text-slate-800 group-hover:text-royal transition-colors leading-tight break-words tracking-tight">{church.name}</p>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1.5">{cluster ? cluster.name : 'MISIÓN LIBRE'}</p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <span className="block text-xl font-black text-royal tracking-tighter">{Math.round(church.percentage)}%</span>
                                        </div>
                                    </div>
                                );
                            })}
                            {churchPerformance.length === 0 && (
                                <div className="text-center py-24">
                                     <p className="text-slate-300 font-black uppercase tracking-[0.2em] text-[9px]">Aún sin competidores</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPanel;
