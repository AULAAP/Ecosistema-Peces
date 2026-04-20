
/* --- FILE: App.tsx --- */
import * as React from 'react';
import { useState, useMemo, useEffect, useRef, Component, ReactNode } from 'react';
import { 
  LayoutDashboard, Church, CalendarDays, MessageSquareText, Settings, 
  Menu, Bell, Waves, ArrowLeft, MessageCircle, Calendar, X,
  ExternalLink, Trash2, Loader2, Sparkles, AlertTriangle, ChevronDown, 
  CheckCircle2, Users, Download, Upload, ShieldCheck, Zap, GraduationCap,
  LayoutGrid, TrendingUp
} from 'lucide-react';

// --- Error Boundary Component ---
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: any }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-12 text-center border border-red-100">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-4">Algo salió mal</h2>
            <p className="text-slate-500 font-bold mb-8 leading-relaxed">
              La aplicación encontró un error inesperado. Por favor, intenta recargar la página.
            </p>
            <div className="bg-slate-50 rounded-2xl p-4 mb-8 text-left overflow-auto max-h-40">
              <code className="text-[10px] text-red-600 font-mono break-all">
                {this.state.error?.message || "Error desconocido"}
              </code>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg"
            >
              Recargar Aplicación
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
import { ViewType, ChurchLeader, Meeting, ContactStatus, WeeklyPlan, TrainingChurch, Cluster } from './types';
import { INITIAL_CHURCHES, INITIAL_MEETINGS } from './constants';
import { weeklyPlanData as initialWeeklyPlan, churchesData as initialChurches, clustersData as initialClusters } from './data';
import Dashboard from './components/Dashboard';
import ChurchManagement from './components/ChurchManagement';
import MeetingManagement from './components/MeetingManagement';
import WhatsAppMessenger from './components/WhatsAppMessenger';
import CapacitacionB from './components/CapacitacionB';
import AulaApp from './components/AulaApp';
import ClustersPanel from './components/ClustersPanel';
import ChurchesPanel from './components/ChurchesPanel';
import MonitoringPanel from './components/MonitoringPanel';
import DashboardPanel from './components/DashboardPanel';
import TopicCard from './components/TopicCard';
import { generateWhatsAppTemplate, parseTemplate, extractTopicsFromDocument, getYouTubeRecommendation } from './services/geminiService';
import useLocalStorage from './hooks/useLocalStorage';
import { auth, db, signInWithGoogle, logout, onAuthStateChanged, User as FirebaseUser } from './firebase';
import { 
  collection, onSnapshot, doc, setDoc, deleteDoc, writeBatch, 
  getDocs, query, limit, getDocFromServer 
} from 'firebase/firestore';

const CHURCHES_STORAGE_KEY = 'ecosistema_peces_churches_v1';
const CONFIG_STORAGE_KEY = 'ecosistema_peces_group_configs_v1';
const MEETINGS_STORAGE_KEY = 'ecosistema_peces_meetings_v1';
const UI_STATE_STORAGE_KEY = 'ecosistema_peces_ui_state_v1';

const sanitizeId = (id: string) => id.replace(/\//g, '_');

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

interface GroupConfig {
  venue: string;
  date: string;
  time: string;
  template: string;
  lastIndex?: number; // Persistencia de en qué mensaje se quedó el usuario
}

const App: React.FC = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [cloudCount, setCloudCount] = useState({ churches: 0, meetings: 0 });
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  // --- Training Plan State ---
  const [plans, setPlans] = useLocalStorage<WeeklyPlan[]>('customWeeklyPlans', initialWeeklyPlan);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [isProcessingDoc, setIsProcessingDoc] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');

  const [clusters, setClusters] = useLocalStorage<Cluster[]>('clustersData', initialClusters);
  const [trainingChurches, setTrainingChurches] = useLocalStorage<TrainingChurch[]>('trainingChurchesData', initialChurches);
  
  const [churchProgressData, setChurchProgressData] = useLocalStorage<Record<number, Record<number, boolean>>>('trainingProgress', {});
  const [clusterProgressData, setClusterProgressData] = useLocalStorage<Record<number, Record<number, boolean>>>('clusterTrainingProgress', {});

  const [appState, setAppState] = useLocalStorage<{ clusterId: number | null, churchId: number | null }>('trainingAppState', {
    clusterId: null,
    churchId: null,
  });

  const selectedTrainingCluster = clusters.find(c => c.id === appState.clusterId) || null;
  const selectedTrainingChurch = trainingChurches.find(c => c.id === appState.churchId) || null;

  const currentViewPlans = useMemo(() => {
    if (!selectedTrainingChurch && !selectedTrainingCluster) return [];
    
    let progress: Record<number, boolean> = {};
    if (selectedTrainingChurch) {
        progress = churchProgressData[selectedTrainingChurch.id] || {};
    } else if (selectedTrainingCluster) {
        progress = clusterProgressData[selectedTrainingCluster.id] || {};
    }

    return plans.map(plan => ({
      ...plan,
      isCompleted: progress[plan.weekNumber] === true,
    }));
  }, [plans, selectedTrainingChurch, selectedTrainingCluster, churchProgressData, clusterProgressData]);

  const handleToggleComplete = (weekNumber: number) => {
    if (selectedTrainingChurch) {
        setChurchProgressData(prev => {
            const next = { ...prev };
            const newEntityProgress = { ...(next[selectedTrainingChurch.id] || {}) };
            if (newEntityProgress[weekNumber]) delete newEntityProgress[weekNumber];
            else newEntityProgress[weekNumber] = true;
            next[selectedTrainingChurch.id] = newEntityProgress;
            return next;
        });
    } else if (selectedTrainingCluster) {
        const isCurrentlyCompleted = !!(clusterProgressData[selectedTrainingCluster.id] && clusterProgressData[selectedTrainingCluster.id][weekNumber]);
        
        setClusterProgressData(prev => {
            const next = { ...prev };
            const newEntityProgress = { ...(next[selectedTrainingCluster.id] || {}) };
            if (isCurrentlyCompleted) delete newEntityProgress[weekNumber];
            else newEntityProgress[weekNumber] = true;
            next[selectedTrainingCluster.id] = newEntityProgress;
            return next;
        });

        setChurchProgressData(prev => {
            const next = { ...prev };
            selectedTrainingCluster.churchIds.forEach(id => {
                const churchProg = { ...(next[id] || {}) };
                if (isCurrentlyCompleted) delete churchProg[weekNumber];
                else churchProg[weekNumber] = true;
                next[id] = churchProg;
            });
            return next;
        });
    }
  };

  const handleFileUploadPlan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingDoc(true);
    setLoadingMsg('Analizando programa de capacitación...');

    try {
        const text = await file.text();
        const extractedTopics = await extractTopicsFromDocument(text);
        
        const newPlans: WeeklyPlan[] = [];
        for (let i = 0; i < extractedTopics.length; i++) {
            setLoadingMsg(`Buscando recursos para tema ${i + 1} de ${extractedTopics.length}...`);
            const recommendation = await getYouTubeRecommendation(extractedTopics[i].topic);
            newPlans.push({
                weekNumber: i + 1,
                id: `wp-${i + 1}`,
                title: extractedTopics[i].topic,
                description: recommendation.lessonObjective,
                topics: [extractedTopics[i].topic],
                youtubeUrl: recommendation.videoUrl,
                date: new Date().toISOString().split('T')[0],
                topic: extractedTopics[i].topic,
                videoTitle: recommendation.videoTitle,
                videoUrl: recommendation.videoUrl,
                question: recommendation.question,
                lessonObjective: recommendation.lessonObjective,
                isCompleted: false
            });
        }
        
        setPlans(newPlans);
        alert("¡Plan generado exitosamente!");
    } catch (error) {
        console.error(error);
        alert("Error al procesar el documento.");
    } finally {
        setIsProcessingDoc(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddChurch = (church: Omit<ChurchLeader, 'id' | 'status'>) => {
    const newChurch: ChurchLeader = {
      ...church,
      meetingId: sanitizeId(church.meetingId),
      id: `c${Date.now()}`,
      status: ContactStatus.PENDING
    };
    setChurches(prev => [...prev, newChurch]);
    
    if (user) {
      setDoc(doc(db, 'churches', newChurch.id), newChurch)
        .catch(err => handleFirestoreError(err, OperationType.WRITE, `churches/${newChurch.id}`));
    }
  };

  const [currentView, setCurrentView] = useState<ViewType>(() => {
    try {
      const saved = localStorage.getItem(UI_STATE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.currentView || 'dashboard';
      }
    } catch (e) {}
    return 'dashboard';
  });
  const [prevView, setPrevView] = useState<ViewType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    try {
      const saved = localStorage.getItem(UI_STATE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.isSidebarOpen !== undefined ? parsed.isSidebarOpen : true;
      }
    } catch (e) {}
    return true;
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [lastSaved, setLastSaved] = useState<string>(() => new Date().toLocaleTimeString());
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Estado de Iglesias con persistencia
  const [churches, setChurches] = useState<ChurchLeader[]>(() => {
    try {
      const saved = localStorage.getItem(CHURCHES_STORAGE_KEY);
      if (saved !== null) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_CHURCHES;
  });

  // Estado de Configuraciones de Grupo con persistencia
  const [groupConfigs, setGroupConfigs] = useState<Record<string, GroupConfig>>(() => {
    try {
      const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (saved !== null) return JSON.parse(saved);
    } catch (e) {}
    return {};
  });

  const [defaultConfig, setDefaultConfig] = useState<GroupConfig>(() => {
    try {
      const saved = localStorage.getItem('ecosistema_peces_default_config_v1');
      if (saved !== null) return JSON.parse(saved);
    } catch (e) {}
    return { venue: '', date: '', time: '', template: '', lastIndex: 0 };
  });
  
  const [meetings, setMeetings] = useState<Meeting[]>(() => {
    try {
      const saved = localStorage.getItem(MEETINGS_STORAGE_KEY);
      if (saved !== null) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_MEETINGS;
  });

  const [selectedChurch, setSelectedChurch] = useState<ChurchLeader | undefined>(() => {
    try {
      const saved = localStorage.getItem(UI_STATE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.selectedChurch || undefined;
      }
    } catch (e) {}
    return undefined;
  });
  const [activeGroup, setActiveGroup] = useState<{ zone: string; meetingId: string } | null>(() => {
    try {
      const saved = localStorage.getItem(UI_STATE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.activeGroup || null;
      }
    } catch (e) {}
    return null;
  });
  const [isGeneratingTemplate, setIsGeneratingTemplate] = useState(false);
  const [isBulkSending, setIsBulkSending] = useState(false);
  const [currentQueueIndex, setCurrentQueueIndex] = useState(0);
  
  const handleFirestoreError = (error: unknown, operationType: OperationType, path: string | null) => {
    const errInfo: FirestoreErrorInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
        emailVerified: auth.currentUser?.emailVerified,
        isAnonymous: auth.currentUser?.isAnonymous,
        tenantId: (auth.currentUser as any)?.tenantId,
        providerInfo: auth.currentUser?.providerData.map(provider => ({
          providerId: provider.providerId,
          displayName: provider.displayName,
          email: provider.email,
          photoUrl: provider.photoURL
        })) || []
      },
      operationType,
      path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
  };

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Firestore Sync - Fetch on Login
  useEffect(() => {
    if (!user) {
      setCloudCount({ churches: 0, meetings: 0 });
      setLastSyncTime(null);
      return;
    }

    setIsSyncing(true);
    
    // Escuchar cambios en tiempo real desde Firestore
    const unsubChurches = onSnapshot(collection(db, 'churches'), (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data() as ChurchLeader);
      setCloudCount(prev => ({ ...prev, churches: data.length }));
      if (data.length > 0) {
        setChurches(data);
        setLastSyncTime(new Date().toLocaleTimeString());
      }
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'churches'));

    const unsubMeetings = onSnapshot(collection(db, 'meetings'), (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data() as Meeting);
      setCloudCount(prev => ({ ...prev, meetings: data.length }));
      if (data.length > 0) setMeetings(data);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'meetings'));

    const unsubConfigs = onSnapshot(collection(db, 'groupConfigs'), (snapshot) => {
      const configs: Record<string, GroupConfig> = {};
      snapshot.docs.forEach(doc => {
        configs[doc.id] = doc.data() as GroupConfig;
      });
      if (Object.keys(configs).length > 0) setGroupConfigs(configs);
      setIsSyncing(false);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'groupConfigs'));

    const unsubDefaultConfig = onSnapshot(doc(db, 'settings', 'defaultConfig'), (snapshot) => {
      if (snapshot.exists()) {
        setDefaultConfig(snapshot.data() as GroupConfig);
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, 'settings/defaultConfig'));

    return () => {
      unsubChurches();
      unsubMeetings();
      unsubConfigs();
      unsubDefaultConfig();
    };
  }, [user]);

  // Sincronizar índice de cola cuando cambia el grupo activo (útil al restaurar sesión)
  useEffect(() => {
    if (activeGroup) {
      const configKey = sanitizeId(`${activeGroup.zone}-${activeGroup.meetingId}`);
      const savedConfig = groupConfigs[configKey];
      if (savedConfig?.lastIndex !== undefined) {
        setCurrentQueueIndex(savedConfig.lastIndex);
      } else {
        setCurrentQueueIndex(0);
      }
    }
  }, [activeGroup, groupConfigs]);

  // Guardado automático en LocalStorage
  useEffect(() => {
    const uiState = { currentView, activeGroup, selectedChurch, isSidebarOpen };
    localStorage.setItem(UI_STATE_STORAGE_KEY, JSON.stringify(uiState));
    setLastSaved(new Date().toLocaleTimeString());
  }, [currentView, activeGroup, selectedChurch, isSidebarOpen]);

  useEffect(() => {
    localStorage.setItem(CHURCHES_STORAGE_KEY, JSON.stringify(churches));
    setLastSaved(new Date().toLocaleTimeString());
  }, [churches]);

  useEffect(() => {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(groupConfigs));
    setLastSaved(new Date().toLocaleTimeString());
  }, [groupConfigs]);

  useEffect(() => {
    localStorage.setItem(MEETINGS_STORAGE_KEY, JSON.stringify(meetings));
    setLastSaved(new Date().toLocaleTimeString());
  }, [meetings]);

  useEffect(() => {
    localStorage.setItem('ecosistema_peces_default_config_v1', JSON.stringify(defaultConfig));
    if (user) {
      setDoc(doc(db, 'settings', 'defaultConfig'), defaultConfig)
        .catch(err => handleFirestoreError(err, OperationType.WRITE, 'settings/defaultConfig'));
    }
  }, [defaultConfig, user]);

  const activeConfigKey = activeGroup ? sanitizeId(`${activeGroup.zone}-${activeGroup.meetingId}`) : null;
  const currentConfig = activeConfigKey ? groupConfigs[activeConfigKey] || defaultConfig : defaultConfig;

  const handleSaveAsDefault = () => {
    if (!activeConfigKey) return;
    const configToSave = groupConfigs[activeConfigKey] || currentConfig;
    setDefaultConfig({
      ...configToSave,
      lastIndex: 0 // No queremos guardar el índice de progreso como defecto
    });
    alert("Configuración guardada como predeterminada para nuevos grupos.");
  };

  const updateActiveConfig = (updates: Partial<GroupConfig>) => {
    if (!activeConfigKey) return;
    const newConfig = {
      ...(groupConfigs[activeConfigKey] || defaultConfig),
      ...updates
    };
    
    setGroupConfigs(prev => ({
      ...prev,
      [activeConfigKey]: newConfig
    }));

    // Sync to Firestore
    if (user) {
      setDoc(doc(db, 'groupConfigs', activeConfigKey), newConfig)
        .catch(err => handleFirestoreError(err, OperationType.WRITE, `groupConfigs/${activeConfigKey}`));
    }
  };

  const handleExportBackup = () => {
    const backupData = { churches, groupConfigs, exportDate: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_peces_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target?.result as string);
        if (data.churches) setChurches(data.churches);
        if (data.groupConfigs) setGroupConfigs(data.groupConfigs);
        alert("¡Copia de seguridad restaurada correctamente!");
      } catch (err) {
        alert("Error al leer el archivo de respaldo.");
      }
    };
    reader.readAsText(file);
  };

  const handleClearExcelData = async () => {
    setChurches([]);
    setGroupConfigs({});
    setMeetings(INITIAL_MEETINGS);
    localStorage.setItem(CHURCHES_STORAGE_KEY, JSON.stringify([]));
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify({}));
    localStorage.setItem(MEETINGS_STORAGE_KEY, JSON.stringify(INITIAL_MEETINGS));
    localStorage.removeItem(UI_STATE_STORAGE_KEY);
    
    // Clear Firestore if logged in
    if (user) {
      try {
        const churchDocs = await getDocs(collection(db, 'churches'));
        const meetingDocs = await getDocs(collection(db, 'meetings'));
        const configDocs = await getDocs(collection(db, 'groupConfigs'));
        
        const batch = writeBatch(db);
        churchDocs.forEach(d => batch.delete(d.ref));
        meetingDocs.forEach(d => batch.delete(d.ref));
        configDocs.forEach(d => batch.delete(d.ref));
        await batch.commit();
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, 'bulk-clear');
      }
    }

    setIsDeleteModalOpen(false);
    setCurrentView('dashboard');
    setActiveGroup(null);
    setSelectedChurch(undefined);
  };

  const handleLogin = async () => {
    if (isSigningIn) return;
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handlePushToCloud = async () => {
    if (!user) {
      alert("Inicie sesión con Google para usar el almacenamiento en la nube.");
      return;
    }

    setIsSyncing(true);
    try {
      const batch = writeBatch(db);
      
      // Clear existing first for clean cloud state
      // (This is what the user implies by "permanent database")
      churches.forEach(c => {
        batch.set(doc(db, 'churches', c.id), c);
      });
      
      meetings.forEach(m => {
        batch.set(doc(db, 'meetings', m.id), m);
      });
      
      await batch.commit();
      alert(`¡Sincronización exitosa! ${churches.length} registros guardados permanentemente en la nube.`);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'push-to-cloud');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleOpenMessenger = (church: ChurchLeader) => {
    setPrevView(currentView);
    setSelectedChurch(church);
    setCurrentView('whatsapp');
  };

  const handleBulkImport = (newChurches: Omit<ChurchLeader, 'id' | 'status'>[]) => {
    const formatted: ChurchLeader[] = newChurches.map((c, i) => ({
      ...c,
      meetingId: sanitizeId(c.meetingId),
      id: `imp-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 5)}`,
      status: ContactStatus.PENDING
    }));
    // Reemplazamos los datos actuales con los del nuevo Excel para mantener integridad
    setChurches(formatted);
    
    // Generar reuniones básicas a partir de los datos del Excel si no existen
    const uniqueMeetingIds = Array.from(new Set(formatted.map(c => c.meetingId)));
    const newMeetings: Meeting[] = uniqueMeetingIds.map(mId => {
      const sample = formatted.find(c => c.meetingId === mId);
      // Encontrar el nombre original del meetingId (antes de sanitizar)
      // Como ya sanitizamos en 'formatted', necesitamos el original de 'newChurches'
      // Pero es más fácil buscar en 'newChurches' directamente
      const originalMeetingId = newChurches.find(nc => sanitizeId(nc.meetingId) === mId)?.meetingId || mId;
      
      return {
        id: mId,
        name: originalMeetingId,
        date: '',
        time: '',
        venue: sample?.suggestedVenue || '',
        zone: sample?.zone || 'General'
      };
    });
    setMeetings(newMeetings);

    // Bulk Sync to Firestore
    if (user) {
      const batch = writeBatch(db);
      formatted.forEach(c => {
        batch.set(doc(db, 'churches', c.id), c);
      });
      newMeetings.forEach(m => {
        batch.set(doc(db, 'meetings', m.id), m);
      });
      batch.commit().then(() => {
        alert(`¡Éxito! Se han guardado ${formatted.length} líderes permanentemente en la nube.`);
      }).catch(err => handleFirestoreError(err, OperationType.WRITE, 'bulk-import'));
    } else {
      alert(`¡Éxito! Se han cargado ${formatted.length} líderes localmente.\n\n⚠️ RECOMENDACIÓN: Inicie sesión para guardar estos datos permanentemente en la nube.`);
    }
    
    setCurrentView('meetings');
  };

  const handleSent = (churchId: string) => {
    const updatedChurches = churches.map(c => 
      c.id === churchId 
      ? { ...c, status: ContactStatus.SENT, lastContactDate: new Date().toISOString() } 
      : c
    );
    setChurches(updatedChurches);
    
    // Sync individual change to Firestore
    if (user) {
      const church = updatedChurches.find(c => c.id === churchId);
      if (church) {
        setDoc(doc(db, 'churches', churchId), church)
          .catch(err => handleFirestoreError(err, OperationType.WRITE, `churches/${churchId}`));
      }
    }
  };

  const filteredChurchesForGroup = useMemo(() => {
    if (!activeGroup) return [];
    return churches.filter(c => 
      c.zone === activeGroup.zone && 
      c.meetingId === activeGroup.meetingId
    );
  }, [churches, activeGroup]);

  const activeMeetingName = useMemo(() => {
    if (!activeGroup) return '';
    const meeting = meetings.find(m => m.id === activeGroup.meetingId);
    return meeting?.name || activeGroup.meetingId;
  }, [activeGroup, meetings]);

  const handleGenerateIAInvitation = async () => {
    if (!activeGroup) return;
    setIsGeneratingTemplate(true);
    try {
      const template = await generateWhatsAppTemplate({
        id: activeGroup.meetingId,
        name: activeMeetingName,
        date: currentConfig.date,
        time: currentConfig.time,
        venue: currentConfig.venue,
        zone: activeGroup.zone
      });
      updateActiveConfig({ template });
    } catch (err) {
      alert("Error con la IA.");
    } finally {
      setIsGeneratingTemplate(false);
    }
  };

  const sendNextInQueue = () => {
    const church = filteredChurchesForGroup[currentQueueIndex];
    if (!church || !activeGroup) return;
    
    const msg = parseTemplate(currentConfig.template, church, {
      id: activeGroup.meetingId,
      name: activeGroup.meetingId,
      date: currentConfig.date,
      time: currentConfig.time,
      venue: currentConfig.venue,
      zone: activeGroup.zone
    });
    
    const phone = church.whatsapp.toString().replace(/\D/g, '');
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    
    handleSent(church.id);
    
    const nextIdx = currentQueueIndex + 1;
    if (nextIdx < filteredChurchesForGroup.length) {
      setCurrentQueueIndex(nextIdx);
      updateActiveConfig({ lastIndex: nextIdx });
    } else {
      setIsBulkSending(false);
      updateActiveConfig({ lastIndex: 0 }); // Reiniciar al completar
      alert("¡Envío masivo completado!");
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard churches={churches} meetings={meetings} />;
      case 'churches': return <ChurchManagement churches={churches} meetings={meetings} onOpenMessenger={handleOpenMessenger} onAddChurch={handleAddChurch} onBulkImport={handleBulkImport} />;
      case 'meetings': return <MeetingManagement meetings={meetings} churches={churches} onSelectGroup={(zone, mId) => { 
        setActiveGroup({ zone, meetingId: mId }); 
        const configKey = sanitizeId(`${zone}-${mId}`);
        
        // Cargar índice guardado
        const savedConfig = groupConfigs[configKey];
        if (savedConfig?.lastIndex) {
          setCurrentQueueIndex(savedConfig.lastIndex);
        } else {
          setCurrentQueueIndex(0);
        }

        // Pre-llenado automático de sede si está vacía
        if (!groupConfigs[configKey]?.venue) {
          const sampleWithVenue = churches.find(c => 
            c.zone === zone && 
            c.meetingId === mId && 
            c.suggestedVenue && 
            c.suggestedVenue.trim() !== ''
          );
          
          if (sampleWithVenue?.suggestedVenue) {
            setGroupConfigs(prev => ({
              ...prev,
              [configKey]: {
                ...(prev[configKey] || { venue: '', date: '', time: '', template: '', lastIndex: 0 }),
                venue: sampleWithVenue.suggestedVenue
              }
            }));
          }
        }
        setCurrentView('meeting-detail'); 
      }} />;
      case 'meeting-detail': return (
        <div className="space-y-8 animate-in slide-in-from-right duration-500 pb-24">
          <button onClick={() => setCurrentView('meetings')} className="flex items-center gap-2 text-slate-400 hover:text-slate-800 font-black text-xs uppercase tracking-widest transition-colors"><ArrowLeft className="w-4 h-4" /> Volver al Calendario</button>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 sticky top-32">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter">Logística Grupal</h3>
                  <div className="px-3 py-1 bg-emerald-50 rounded-full text-[8px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Memoria Activa</div>
                </div>
                
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Sede</label>
                    <input 
                      type="text" 
                      placeholder="Ubicación de la sede..." 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm focus:ring-2 focus:ring-blue-100 transition-all shadow-sm" 
                      value={currentConfig.venue} 
                      onChange={(e) => updateActiveConfig({ venue: e.target.value })} 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Fecha</label>
                      <input type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm focus:ring-2 focus:ring-blue-100 outline-none" value={currentConfig.date} onChange={(e) => updateActiveConfig({ date: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Hora</label>
                      <input type="time" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm focus:ring-2 focus:ring-blue-100 outline-none" value={currentConfig.time} onChange={(e) => updateActiveConfig({ time: e.target.value })} />
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <button 
                      onClick={handleGenerateIAInvitation} 
                      disabled={isGeneratingTemplate} 
                      className="w-full py-3 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 hover:bg-blue-100 transition-all border border-blue-100/50"
                    >
                      {isGeneratingTemplate ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} Generar Texto IA
                    </button>
                    <button 
                      onClick={handleSaveAsDefault}
                      className="w-full py-2 bg-slate-50 text-slate-500 text-[9px] font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 hover:bg-slate-100 transition-all border border-slate-200/50"
                    >
                      <Settings className="w-3 h-3" /> Guardar como por defecto
                    </button>
                  </div>

                  <textarea 
                    className="w-full h-36 p-5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-blue-100 outline-none resize-none leading-relaxed" 
                    placeholder="Escriba la invitación..." 
                    value={currentConfig.template} 
                    onChange={(e) => updateActiveConfig({ template: e.target.value })} 
                  />

                  <div className="space-y-3">
                    <button 
                      onClick={() => setIsBulkSending(true)} 
                      disabled={!currentConfig.template || !currentConfig.venue} 
                      className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50"
                    >
                      {currentConfig.lastIndex && currentConfig.lastIndex > 0 ? `Continuar Despacho (${currentConfig.lastIndex + 1}/${filteredChurchesForGroup.length})` : `Iniciar Despacho (${filteredChurchesForGroup.length})`}
                    </button>
                    {currentConfig.lastIndex && currentConfig.lastIndex > 0 && (
                      <button 
                        onClick={() => { setCurrentQueueIndex(0); updateActiveConfig({ lastIndex: 0 }); setIsBulkSending(true); }}
                        className="w-full py-2 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
                      >
                        Reiniciar desde el primero
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-[3rem] shadow-xl border overflow-hidden">
                <div className="p-10 flex items-center justify-between border-b bg-slate-50/30">
                  <div>
                    <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter leading-none">{activeMeetingName}</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{activeGroup?.zone}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg mb-2"><Users className="w-6 h-6" /></div>
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                      {filteredChurchesForGroup.filter(c => c.status === ContactStatus.SENT).length} / {filteredChurchesForGroup.length} Enviados
                    </span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b">
                      <tr><th className="px-10 py-6 text-left">Líder / Iglesia</th><th className="px-10 py-6 text-left">WhatsApp</th><th className="px-10 py-6 text-center">Estado</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredChurchesForGroup.map(c => (
                        <tr key={c.id} className="hover:bg-slate-50/50">
                          <td className="px-10 py-6 font-black text-slate-800">{c.fullName}<br/><span className="text-[10px] text-blue-500 font-bold uppercase tracking-tight">{c.churchName}</span></td>
                          <td className="px-10 py-6 font-bold text-slate-400">{c.whatsapp}</td>
                          <td className="px-10 py-6 text-center">
                            <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${c.status === ContactStatus.SENT ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                              {c.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {isBulkSending && filteredChurchesForGroup[currentQueueIndex] && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/95 backdrop-blur-xl p-6 overflow-y-auto">
              <div className="bg-white rounded-[3.5rem] shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 my-auto">
                <div className="p-10 border-b flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg"><Zap className="w-6 h-6" /></div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Despacho Territorial</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{activeMeetingName} • {activeGroup?.zone}</p>
                    </div>
                  </div>
                  <button onClick={() => setIsBulkSending(false)} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors"><X className="w-7 h-7 text-slate-400" /></button>
                </div>
                
                <div className="p-12 space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Enviados</p>
                      <p className="text-3xl font-black text-blue-600">{currentQueueIndex + 1}</p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Iglesias</p>
                      <p className="text-3xl font-black text-slate-800">{filteredChurchesForGroup.length}</p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Restantes</p>
                      <p className="text-3xl font-black text-amber-600">{filteredChurchesForGroup.length - (currentQueueIndex + 1)}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progreso Global</span>
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{Math.round(((currentQueueIndex + 1) / filteredChurchesForGroup.length) * 100)}%</span>
                    </div>
                    <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                      <div 
                        className="h-full bg-blue-600 transition-all duration-700 shadow-[0_0_15px_rgba(37,99,235,0.4)] relative" 
                        style={{ width: `${((currentQueueIndex + 1) / filteredChurchesForGroup.length) * 100}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <div className="p-10 bg-blue-50/50 rounded-[2.5rem] border border-blue-100 shadow-inner">
                        <p className="text-[11px] font-black text-blue-400 uppercase tracking-widest mb-3">Destinatario Actual:</p>
                        <p className="text-3xl font-black text-slate-800 leading-tight">{filteredChurchesForGroup[currentQueueIndex].fullName}</p>
                        <p className="text-xs font-black text-blue-500 uppercase tracking-widest mt-1 mb-3">
                          <Church className="w-3.5 h-3.5 inline mr-1.5" />
                          {filteredChurchesForGroup[currentQueueIndex].churchName}
                        </p>
                        <p className="text-blue-600 font-bold text-lg bg-white/60 inline-block px-4 py-1 rounded-xl border border-blue-100">{filteredChurchesForGroup[currentQueueIndex].whatsapp}</p>
                        <div className="mt-6 flex items-center gap-3">
                           <div className="w-3 h-3 rounded-full bg-blue-600 animate-ping"></div>
                           <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Memoria Activa: El progreso se guardará automáticamente.</span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={sendNextInQueue} 
                        className="w-full py-8 bg-emerald-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4 shadow-2xl hover:bg-emerald-700 active:scale-95 transition-all group"
                      >
                        <ExternalLink className="w-6 h-6 group-hover:rotate-12 transition-transform" /> 
                        Abrir WhatsApp y Continuar ({currentQueueIndex + 1}/{filteredChurchesForGroup.length})
                      </button>
                    </div>

                    <div className="relative group">
                      <div className="bg-[#DCF8C6] p-10 rounded-[2.5rem] text-sm italic text-slate-800 h-[320px] overflow-auto border border-[#BEDE9F] relative leading-relaxed shadow-lg">
                        <div className="absolute top-8 -left-2 w-4 h-4 bg-[#DCF8C6] rotate-45 border-l border-b border-[#BEDE9F]"></div>
                        {parseTemplate(currentConfig.template, filteredChurchesForGroup[currentQueueIndex], { 
                          id: '', 
                          name: activeGroup?.meetingId || '', 
                          date: currentConfig.date, 
                          time: currentConfig.time, 
                          venue: currentConfig.venue, 
                          zone: activeGroup?.zone || '' 
                        })}
                      </div>
                      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-white rounded-full border shadow-sm text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Vista previa del mensaje</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      );
      case 'whatsapp': return <div className="space-y-6 h-full flex flex-col"><button onClick={() => setCurrentView(prevView)} className="flex items-center gap-2 text-slate-400 font-black text-xs uppercase tracking-widest transition-colors"><ArrowLeft className="w-4 h-4" /> Volver</button><WhatsAppMessenger church={selectedChurch} meeting={meetings.find(m => m.id === selectedChurch?.meetingId) || { id: 't', name: 'R', date: '', time: '', venue: '', zone: '' }} onSent={handleSent} onBack={() => setCurrentView(prevView)} /></div>;
      case 'capacitacion': return (
        <div className="w-full flex flex-col items-center py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="max-w-2xl w-full bg-white rounded-[3rem] p-12 border border-slate-100 shadow-2xl text-center relative overflow-hidden group">
            {/* Elementos decorativos de fondo */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-50 rounded-full blur-3xl group-hover:bg-blue-100 transition-colors duration-500" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-50 rounded-full blur-3xl group-hover:bg-indigo-100 transition-colors duration-500" />
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-blue-200 mb-8 transform group-hover:scale-110 transition-transform duration-500">
                <GraduationCap className="w-12 h-12" />
              </div>
              
              <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tighter mb-4">
                Portal de Capacitación
              </h2>
              
              <p className="text-slate-500 text-lg mb-10 max-w-md mx-auto leading-relaxed">
                Accede a nuestra plataforma de entrenamiento para líderes y pastores. Aprende las metodologías de crecimiento y consolidación.
              </p>

              <div className="grid grid-cols-2 gap-4 w-full mb-10">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="text-blue-600 font-black text-xl mb-1">12+</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Módulos</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="text-blue-600 font-black text-xl mb-1">Certificado</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Al finalizar</div>
                </div>
              </div>

              <a 
                href="https://ais-pre-um7xhy3ztstywl4vne5mvp-90346729134.us-west2.run.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-blue-200 transition-all hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-3"
              >
                Comenzar Entrenamiento
                <ExternalLink className="w-5 h-5" />
              </a>
              
              <p className="mt-6 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                Se abrirá en una nueva pestaña por seguridad
              </p>
            </div>
          </div>
        </div>
      );
      case 'capacitacion-b': return (
        <div className="h-[calc(100vh-12rem)] min-h-[600px]">
          <CapacitacionB />
        </div>
      );
      case 'aulaapp': return (
        <div className="h-full">
          <AulaApp />
        </div>
      );
      case 'clusters':
        return <ClustersPanel 
            clusters={clusters} 
            selectedClusterId={selectedTrainingCluster?.id} 
            onSelectCluster={(c) => {
                setAppState(prev => ({ ...prev, clusterId: c.id, churchId: null }));
                setCurrentView('churches-training');
            }} 
            onAddCluster={(name) => setClusters(prev => [...prev, { id: Date.now(), name, churchIds: [] }])} 
            onDeleteCluster={(id) => setClusters(prev => prev.filter(c => c.id !== id))} 
            onResetClusterProgress={(id) => setClusterProgressData(prev => ({ ...prev, [id]: {} }))} 
            totalPlanCount={plans.length} 
            clusterProgressData={clusterProgressData} 
        />;
      case 'churches-training':
        if (!selectedTrainingCluster) return <div className="text-center p-20 font-black text-slate-400 uppercase tracking-widest">Selecciona un clúster</div>;
        return <ChurchesPanel 
            churches={trainingChurches.filter(c => selectedTrainingCluster.churchIds.includes(c.id))} 
            selectedChurchId={selectedTrainingChurch?.id} 
            onSelectChurch={(c) => {
                setAppState(prev => ({ ...prev, churchId: c.id }));
                setCurrentView('plan');
            }} 
            onSelectClusterPlan={() => {
                setAppState(prev => ({ ...prev, churchId: null }));
                setCurrentView('plan');
            }} 
            onAddChurch={(name) => {
                const id = Date.now();
                setTrainingChurches(prev => [...prev, { id, name }]);
                setClusters(prev => prev.map(cl => cl.id === selectedTrainingCluster.id ? { ...cl, churchIds: [...cl.churchIds, id] } : cl));
            }} 
            onDeleteChurch={(id) => {
                setTrainingChurches(prev => prev.filter(c => c.id !== id));
                setClusters(prev => prev.map(cl => ({ ...cl, churchIds: cl.churchIds.filter(cid => cid !== id) })));
            }} 
            onResetChurchProgress={(id) => setChurchProgressData(prev => ({ ...prev, [id]: {} }))} 
            totalPlanCount={plans.length} 
            progressData={churchProgressData} 
        />;
      case 'plan':
        if (!selectedTrainingChurch && !selectedTrainingCluster) return <div className="text-center p-20 font-black text-slate-400 uppercase tracking-widest">Selecciona una entidad</div>;
        
        const plansByMonth = currentViewPlans.reduce((acc, plan) => {
            const month = Math.ceil(plan.weekNumber / 4);
            if (!acc[month]) acc[month] = [];
            acc[month].push(plan);
            return acc;
        }, {} as Record<number, WeeklyPlan[]>);
        const months = Object.keys(plansByMonth).map(Number).sort((a, b) => a - b);

        if (selectedMonth === null) {
            return (
                <div className="animate-in fade-in duration-700 pb-10">
                    <div className="flex flex-col items-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-widest mb-4 border border-indigo-100">
                           Plan de {selectedTrainingChurch ? "Iglesia" : "Clúster (Grupal)"}
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-6 uppercase">Ruta de Aprendizaje</h2>
                        <div className="flex gap-4 mb-6">
                            <input type="file" onChange={handleFileUploadPlan} className="hidden" id="plan-upload" />
                            <label 
                                htmlFor="plan-upload"
                                className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-slate-800 transition-all cursor-pointer"
                            >
                                <Upload className="w-5 h-5" /> Subir Programa (IA)
                            </label>
                        </div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest text-center max-w-md">Genera un plan personalizado basado en tu visión ministerial</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
                        {months.map(month => {
                            const monthPlans = plansByMonth[month];
                            const completedCount = monthPlans.filter(p => p.isCompleted).length;
                            const totalCount = monthPlans.length;
                            const percent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
                            return (
                                <button key={month} onClick={() => setSelectedMonth(month)} className="group flex flex-col bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 text-left overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 group-hover:bg-indigo-100 transition-colors" />
                                    <div className="flex justify-between items-start mb-6 relative z-10">
                                        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900 text-white shadow-lg"><span className="text-3xl font-black">{month}</span></div>
                                        <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg uppercase tracking-widest">Mes</span>
                                    </div>
                                    <h3 className="text-xl font-black text-slate-800 mb-8 relative z-10">Capacitación Mensual</h3>
                                    <div className="mt-auto w-full relative z-10">
                                        <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100">
                                            <div className="flex justify-between mb-3"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progreso</span><span className="text-xs font-black text-indigo-900">{Math.round(percent)}%</span></div>
                                            <div className="w-full h-2.5 bg-white rounded-full overflow-hidden shadow-inner"><div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${percent}%` }}></div></div>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            );
        }

        const currentMonthPlans = plansByMonth[selectedMonth] || [];
        return (
          <div className="animate-in fade-in duration-700 pb-12 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <button onClick={() => setSelectedMonth(null)} className="group flex items-center gap-2 px-6 py-3 text-xs font-black uppercase tracking-widest text-slate-500 bg-white/60 rounded-2xl hover:bg-white transition-all border border-white/50 shadow-sm"><ArrowLeft className="w-4 h-4" /> Volver</button>
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Mes {selectedMonth}</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {currentMonthPlans.map(plan => (<TopicCard key={plan.weekNumber} plan={plan} onToggleComplete={() => handleToggleComplete(plan.weekNumber)} />))}
                </div>
          </div>
        );
      case 'progress-training':
        return <MonitoringPanel 
            plans={currentViewPlans} 
            onTopicSelect={(week) => {
                setSelectedMonth(Math.ceil(week / 4));
                setCurrentView('plan');
            }} 
            churchName={selectedTrainingChurch?.name || selectedTrainingCluster?.name || "Entidad"} 
        />;
      case 'dashboard-training':
        return <DashboardPanel 
            clusters={clusters} 
            churches={trainingChurches} 
            churchProgressData={churchProgressData} 
            clusterProgressData={clusterProgressData} 
            totalPlanCount={plans.length} 
        />;
      default: return <Dashboard churches={churches} meetings={meetings} />;
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'churches', label: 'Iglesias', icon: <Church className="w-5 h-5" /> },
    { id: 'meetings', label: 'Calendario', icon: <CalendarDays className="w-5 h-5" /> },
    { id: 'whatsapp', label: 'Mensajería', icon: <MessageSquareText className="w-5 h-5" /> },
    { id: 'capacitacion', label: 'Capacitación', icon: <GraduationCap className="w-5 h-5" /> },
    { id: 'capacitacion-b', label: 'Capacitación B', icon: <GraduationCap className="w-5 h-5" /> },
    { id: 'aulaapp', label: 'AulaApp', icon: <GraduationCap className="w-5 h-5" /> },
    { id: 'clusters', label: 'Clústers', icon: <LayoutGrid className="w-5 h-5" /> },
    { id: 'progress-training', label: 'Monitoreo', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'dashboard-training', label: 'Reporte Plan', icon: <TrendingUp className="w-5 h-5" /> },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <aside className={`${isSidebarOpen ? 'w-72' : 'w-24'} bg-white border-r flex flex-col h-full transition-all duration-300 z-[100]`}>
        <div className="p-8 flex items-center gap-4 shrink-0">
          <div className="bg-blue-600 p-2.5 rounded-2xl text-white shadow-lg shrink-0"><Waves className="w-6 h-6" /></div>
          {isSidebarOpen && <span className="font-black text-slate-800 text-xl tracking-tighter uppercase">Peces<span className="text-blue-600">.io</span></span>}
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button key={item.id} onClick={() => setCurrentView(item.id as ViewType)} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${(currentView === item.id || (item.id === 'meetings' && currentView === 'meeting-detail')) ? 'bg-slate-900 text-white font-black' : 'hover:bg-slate-50 text-slate-400 font-bold'}`}>
              <div className={(currentView === item.id || (item.id === 'meetings' && currentView === 'meeting-detail')) ? 'text-blue-400' : ''}>{item.icon}</div>
              {isSidebarOpen && <span className="text-xs uppercase tracking-widest">{item.label}</span>}
            </button>
          ))}
          
          {isSidebarOpen && churches.length > 0 && (
            <div className="mt-8 px-4 py-6 bg-slate-50 rounded-[2rem] border border-slate-100 mx-2">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-3">Estado de la Base</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500">Cloud Status</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-black ${cloudCount.churches >= churches.length ? 'text-emerald-600' : 'text-amber-500'}`}>
                      {user ? `${cloudCount.churches} / ${churches.length}` : 'Desconectado'}
                    </span>
                    {user && cloudCount.churches < churches.length && (
                      <button 
                        onClick={handlePushToCloud}
                        className="p-1 hover:bg-white rounded shadow-sm text-blue-600 animate-pulse"
                        title="Sincronizar ahora"
                      >
                        <Upload className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500">Grupos</span>
                  <span className="text-[10px] font-black text-indigo-600">{new Set(churches.map(c => c.meetingId)).size}</span>
                </div>
                <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden mt-2">
                  <div 
                    className="h-full bg-emerald-500" 
                    style={{ width: `${(churches.filter(c => c.status === ContactStatus.SENT).length / churches.length) * 100}%` }}
                  />
                </div>
                <p className="text-[7px] font-black text-emerald-600 uppercase tracking-tight">
                  {Math.round((churches.filter(c => c.status === ContactStatus.SENT).length / churches.length) * 100)}% Completado
                </p>
              </div>
            </div>
          )}
        </nav>
        
        <div className="p-4 border-t bg-white space-y-1">
          <input type="file" ref={fileInputRef} onChange={handleImportBackup} accept=".json" className="hidden" />
          <button onClick={handleExportBackup} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-blue-600 hover:bg-blue-50 transition-all font-black text-[9px] uppercase tracking-widest">
            <Download className="w-4 h-4" /> {isSidebarOpen && <span>Exportar Backup</span>}
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-indigo-600 hover:bg-indigo-50 transition-all font-black text-[9px] uppercase tracking-widest">
            <Upload className="w-4 h-4" /> {isSidebarOpen && <span>Importar Backup</span>}
          </button>
          <button onMouseDown={() => setIsDeleteModalOpen(true)} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-black text-[9px] uppercase tracking-widest">
            <Trash2 className="w-4 h-4" /> {isSidebarOpen && <span>Limpiar Base</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-24 bg-white/80 backdrop-blur-md border-b flex items-center justify-between px-10 shrink-0 sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-3 hover:bg-slate-50 rounded-2xl text-slate-400 transition-colors"><Menu className="w-6 h-6" /></button>
            <div className="flex flex-col">
              <h1 className="text-2xl font-black text-slate-800 tracking-tighter uppercase leading-none">{currentView === 'meeting-detail' ? 'Despacho Grupal' : menuItems.find(i => i.id === currentView)?.label}</h1>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-1.5 h-1.5 rounded-full ${user ? 'bg-blue-500' : 'bg-emerald-500'} animate-pulse`}></div>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  {user ? `Cloud: ${cloudCount.churches} / Local: ${churches.length} (${user.email})` : `Solo Local: ${lastSaved}`}
                  {isSyncing && ' (Sincronizando...)'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-black text-slate-800 uppercase tracking-tighter leading-none">{user.displayName || 'Usuario'}</p>
                  <button onClick={logout} className="text-[8px] font-black text-red-500 uppercase tracking-widest hover:underline">Cerrar Sesión</button>
                </div>
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="h-12 w-12 rounded-2xl border shadow-sm object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-white border shadow-sm uppercase">{user.email?.charAt(0)}</div>
                )}
              </div>
            ) : (
              <button 
                onClick={handleLogin}
                disabled={isSigningIn}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSigningIn ? <Loader2 className="w-4 h-4 animate-spin text-blue-600" /> : <ShieldCheck className="w-4 h-4 text-blue-600" />}
                {isSigningIn ? 'Iniciando...' : 'Iniciar Sesión Cloud'}
              </button>
            )}
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-10 bg-[#fbfcfd]">
          <div className="max-w-7xl mx-auto">{renderContent()}</div>
        </div>
      </main>

      {isProcessingDoc && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] p-12 flex flex-col items-center max-w-sm text-center shadow-2xl animate-in zoom-in-95">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6 relative">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
              <div className="absolute inset-0 bg-indigo-400/20 rounded-full animate-ping" />
            </div>
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter mb-2">Procesando con IA</h3>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest leading-relaxed">{loadingMsg}</p>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden p-8 text-center animate-in zoom-in-95">
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6"><AlertTriangle className="w-10 h-10" /></div>
            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-4">¿Borrar todo?</h3>
            <p className="text-slate-500 font-bold text-sm leading-relaxed mb-8">
              <span className="text-red-600 block mb-2 font-black">ADVERTENCIA CRÍTICA</span>
              Esta acción eliminará permanentemente todos los líderes y configuraciones tanto en este navegador como en la nube. Asegúrese de haber exportado un backup.
            </p>
            <div className="flex flex-col gap-3">
              <button onClick={handleClearExcelData} className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-red-700 transition-all">Sí, borrar base</button>
              <button onClick={() => setIsDeleteModalOpen(false)} className="w-full py-4 bg-slate-100 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

// Wrap App with ErrorBoundary
const Root = () => (
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

export { Root as App };
