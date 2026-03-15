import React, { useState, useEffect, ReactNode, ErrorInfo, Component } from 'react';
import { 
  School as SchoolIcon, 
  Users, 
  GraduationCap, 
  FolderKanban, 
  Calendar, 
  LayoutDashboard,
  Plus,
  Settings,
  Menu,
  X,
  CloudOff,
  Search,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  LogIn,
  LogOut,
  Cloud
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { School, FrequencyRecord, EvaluationRecord, AppData, Project, CalendarEvent } from './types';
import { auth, db } from './firebase';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  User
} from 'firebase/auth';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  query, 
  where,
  getDocFromServer
} from 'firebase/firestore';

// Error Handling Spec for Firestore Permissions
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
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Error Boundary Component
class AppErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      let errorMessage = "Ocorreu um erro inesperado.";
      try {
        const parsed = JSON.parse(this.state.error?.message || "");
        if (parsed.error && parsed.error.includes("Missing or insufficient permissions")) {
          errorMessage = "Você não tem permissão para realizar esta operação. Verifique se está logado corretamente.";
        }
      } catch (e) {
        // Not a JSON error
      }

      return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-xl max-w-md w-full text-center">
            <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
            <h2 className="text-xl font-bold text-stone-800 mb-2">Ops! Algo deu errado</h2>
            <p className="text-stone-500 mb-6">{errorMessage}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-stone-900 text-white px-6 py-2 rounded-xl font-medium hover:bg-stone-800 transition-all"
            >
              Recarregar Aplicativo
            </button>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}

// Toast Component
const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => (
  <motion.div 
    initial={{ opacity: 0, y: 50, x: '-50%' }}
    animate={{ opacity: 1, y: 0, x: '-50%' }}
    exit={{ opacity: 0, y: 20, x: '-50%' }}
    className={`fixed bottom-8 left-1/2 z-[100] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border ${
      type === 'success' ? 'bg-emerald-900 border-emerald-800 text-emerald-50' : 'bg-red-900 border-red-800 text-red-50'
    }`}
  >
    {type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
    <span className="text-sm font-medium">{message}</span>
  </motion.div>
);

function AppContent() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'schools' | 'frequency' | 'evaluations' | 'projects' | 'events'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [data, setData] = useState<AppData>({
    schools: [],
    freqRec: [],
    avalRec: [],
    projList: [],
    evtList: []
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Validate Connection to Firestore
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. ");
        }
      }
    }
    testConnection();
  }, []);

  // Sync Data from Firestore
  useEffect(() => {
    if (!user || !isAuthReady) {
      setData({ schools: [], freqRec: [], avalRec: [], projList: [], evtList: [] });
      return;
    }

    const qSchools = query(collection(db, 'schools'), where('ownerId', '==', user.uid));
    const unsubSchools = onSnapshot(qSchools, (snapshot) => {
      setData(prev => ({ ...prev, schools: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as School)) }));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'schools'));

    const qFreq = query(collection(db, 'frequency'), where('ownerId', '==', user.uid));
    const unsubFreq = onSnapshot(qFreq, (snapshot) => {
      setData(prev => ({ ...prev, freqRec: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FrequencyRecord)) }));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'frequency'));

    const qAval = query(collection(db, 'evaluations'), where('ownerId', '==', user.uid));
    const unsubAval = onSnapshot(qAval, (snapshot) => {
      setData(prev => ({ ...prev, avalRec: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EvaluationRecord)) }));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'evaluations'));

    const qProj = query(collection(db, 'projects'), where('ownerId', '==', user.uid));
    const unsubProj = onSnapshot(qProj, (snapshot) => {
      setData(prev => ({ ...prev, projList: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project)) }));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'projects'));

    const qEvt = query(collection(db, 'events'), where('ownerId', '==', user.uid));
    const unsubEvt = onSnapshot(qEvt, (snapshot) => {
      setData(prev => ({ ...prev, evtList: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CalendarEvent)) }));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'events'));

    return () => {
      unsubSchools();
      unsubFreq();
      unsubAval();
      unsubProj();
      unsubEvt();
    };
  }, [user, isAuthReady]);

  const login = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      showToast('Login realizado com sucesso!');
    } catch (error: any) {
      console.error("Erro de login:", error);
      let message = 'Falha no login.';
      if (error.code === 'auth/unauthorized-domain') {
        message = 'Domínio não autorizado no Firebase Console. Adicione este domínio aos domínios autorizados.';
      } else if (error.code === 'auth/popup-blocked') {
        message = 'O popup de login foi bloqueado pelo navegador.';
      } else if (error.message) {
        message = `Erro: ${error.message}`;
      }
      showToast(message, 'error');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      showToast('Sessão encerrada.');
    } catch (error) {
      console.error(error);
      showToast('Erro ao sair.', 'error');
    }
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'schools', label: 'Escolas', icon: SchoolIcon },
    { id: 'frequency', label: 'Frequência', icon: Users },
    { id: 'evaluations', label: 'Avaliações', icon: GraduationCap },
    { id: 'projects', label: 'Projetos', icon: FolderKanban },
    { id: 'events', label: 'Eventos', icon: Calendar },
  ];

  const addSchool = async (school: Omit<School, 'id'>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'schools'), { ...school, ownerId: user.uid });
      showToast('Escola cadastrada com sucesso!');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'schools');
    }
  };

  const deleteSchool = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'schools', id));
      showToast('Escola removida.');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `schools/${id}`);
    }
  };

  const addFrequency = async (record: Omit<FrequencyRecord, 'id'>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'frequency'), { ...record, ownerId: user.uid });
      showToast('Frequência registrada!');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'frequency');
    }
  };

  const addEvaluation = async (record: Omit<EvaluationRecord, 'id'>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'evaluations'), { ...record, ownerId: user.uid });
      showToast('Avaliação salva!');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'evaluations');
    }
  };

  const addProject = async (project: Omit<Project, 'id'>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'projects'), { ...project, ownerId: user.uid });
      showToast('Projeto criado!');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'projects');
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'projects', id));
      showToast('Projeto removido.');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `projects/${id}`);
    }
  };

  const addEvent = async (event: Omit<CalendarEvent, 'id'>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'events'), { ...event, ownerId: user.uid });
      showToast('Evento agendado!');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'events');
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'events', id));
      showToast('Evento removido.');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `events/${id}`);
    }
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-stone-200 border-t-stone-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex text-stone-900 font-sans">
      <AnimatePresence>
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-stone-200 transition-all duration-300 flex flex-col z-20`}>
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && (
            <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xl font-bold tracking-tighter text-stone-800">
              SEFOR 3
            </motion.h1>
          )}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-stone-100 rounded-lg transition-colors">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center p-3 rounded-xl transition-all ${
                activeTab === item.id 
                  ? 'bg-stone-900 text-white shadow-lg shadow-stone-200' 
                  : 'text-stone-500 hover:bg-stone-100 hover:text-stone-800'
              }`}
            >
              <item.icon size={20} className={isSidebarOpen ? 'mr-3' : 'mx-auto'} />
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-stone-100">
          <div className={`flex items-center ${isSidebarOpen ? 'px-2' : 'justify-center'}`}>
            {user ? (
              <>
                <img src={user.photoURL || ''} alt={user.displayName || ''} className="w-8 h-8 rounded-full border border-stone-200" />
                {isSidebarOpen && (
                  <div className="ml-3 overflow-hidden">
                    <p className="text-xs font-bold text-stone-800 truncate">{user.displayName}</p>
                    <button onClick={logout} className="text-[10px] text-red-500 hover:text-red-600 flex items-center gap-1">
                      <LogOut size={10} /> Sair
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button onClick={login} className={`flex items-center gap-2 text-stone-500 hover:text-stone-800 transition-colors ${isSidebarOpen ? 'px-2' : ''}`}>
                <LogIn size={20} />
                {isSidebarOpen && <span className="text-xs font-bold">Entrar</span>}
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-stone-200 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center">
            <h2 className="text-sm font-bold text-stone-400 uppercase tracking-widest">
              {navItems.find(i => i.id === activeTab)?.label}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              user ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-stone-100 text-stone-500 border-stone-200'
            }`}>
              {user ? <Cloud size={14} /> : <CloudOff size={14} />}
              <span>{user ? 'Sincronizado' : 'Modo Local'}</span>
            </div>
            <button className="p-2 text-stone-400 hover:text-stone-800 transition-colors">
              <Settings size={20} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {!user && activeTab !== 'dashboard' ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-6 bg-stone-100 rounded-full text-stone-400">
                <LogIn size={48} />
              </div>
              <h3 className="text-xl font-bold text-stone-800">Acesso Restrito</h3>
              <p className="text-stone-500 max-w-xs">Faça login para gerenciar seus dados e sincronizá-los com a nuvem.</p>
              <button onClick={login} className="bg-stone-900 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-stone-200 hover:bg-stone-800 transition-all">
                Entrar com Google
              </button>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'dashboard' && <DashboardView data={data} user={user} onLogin={login} />}
                {activeTab === 'schools' && <SchoolsView schools={data.schools} onAdd={addSchool} onDelete={deleteSchool} />}
                {activeTab === 'frequency' && <FrequencyView schools={data.schools} records={data.freqRec} onAdd={addFrequency} />}
                {activeTab === 'evaluations' && <EvaluationsView schools={data.schools} records={data.avalRec} onAdd={addEvaluation} />}
                {activeTab === 'projects' && <ProjectsView projects={data.projList} onAdd={addProject} onDelete={deleteProject} />}
                {activeTab === 'events' && <EventsView events={data.evtList} onAdd={addEvent} onDelete={deleteEvent} />}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppErrorBoundary>
      <AppContent />
    </AppErrorBoundary>
  );
}

function DashboardView({ data, user, onLogin }: { data: AppData, user: User | null, onLogin: () => void }) {
  const stats = [
    { label: 'Escolas', value: data.schools.length, icon: SchoolIcon, color: 'bg-blue-500' },
    { label: 'Frequências', value: data.freqRec.length, icon: Users, color: 'bg-emerald-500' },
    { label: 'Avaliações', value: data.avalRec.length, icon: GraduationCap, color: 'bg-indigo-500' },
  ];

  return (
    <div className="space-y-8">
      {!user && (
        <div className="bg-stone-900 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold mb-2 italic serif">Bem-vindo ao SEFOR 3</h3>
            <p className="text-stone-400">Seus dados estão sendo salvos localmente. Faça login para sincronizar e não perder nada.</p>
          </div>
          <button onClick={onLogin} className="bg-white text-stone-900 px-8 py-3 rounded-2xl font-bold hover:bg-stone-100 transition-all shrink-0">
            Fazer Login Agora
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.color} text-white`}>
                <stat.icon size={24} />
              </div>
              <span className="text-3xl font-bold text-stone-800">{stat.value}</span>
            </div>
            <p className="text-stone-500 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>
      
      <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
        <h3 className="text-lg font-bold mb-6 italic serif">Resumo de Atividades</h3>
        <div className="space-y-4">
          {data.freqRec.slice(-3).reverse().map(rec => (
            <div key={rec.id} className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Users size={16} /></div>
                <div>
                  <p className="text-sm font-bold text-stone-800">Frequência Lançada</p>
                  <p className="text-xs text-stone-400">{data.schools.find(s => s.id === rec.schoolId)?.name}</p>
                </div>
              </div>
              <p className="text-xs font-mono text-stone-400">{rec.date}</p>
            </div>
          ))}
          {data.freqRec.length === 0 && (
            <p className="text-center py-8 text-stone-400 italic text-sm">Nenhuma atividade recente.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function SchoolsView({ schools, onAdd, onDelete }: { schools: School[], onAdd: (s: Omit<School, 'id'>) => void, onDelete: (id: string) => void }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newInep, setNewInep] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSchools = schools.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (s.inep && s.inep.includes(searchTerm))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    onAdd({ name: newName, inep: newInep });
    setNewName(''); setNewInep(''); setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-2xl font-bold text-stone-800 italic serif">Escolas Cadastradas</h3>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar escola..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-200 w-64"
            />
          </div>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-stone-900 text-white px-5 py-2.5 rounded-2xl font-medium hover:bg-stone-800 transition-all shadow-lg shadow-stone-200">
            <Plus size={20} /> Nova Escola
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-100">
              <th className="px-6 py-4 text-[11px] font-bold text-stone-400 uppercase tracking-widest">Nome da Escola</th>
              <th className="px-6 py-4 text-[11px] font-bold text-stone-400 uppercase tracking-widest">INEP</th>
              <th className="px-6 py-4 text-[11px] font-bold text-stone-400 uppercase tracking-widest text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredSchools.length === 0 ? (
              <tr><td colSpan={3} className="px-6 py-12 text-center text-stone-400 italic">Nenhuma escola encontrada.</td></tr>
            ) : (
              filteredSchools.map((school) => (
                <tr key={school.id} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-stone-800">{school.name}</td>
                  <td className="px-6 py-4 text-stone-500 font-mono text-sm">{school.inep || '---'}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => onDelete(school.id)} className="p-2 text-stone-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl relative z-10">
              <h4 className="text-xl font-bold mb-6 italic serif">Cadastrar Nova Escola</h4>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase mb-1 tracking-widest">Nome da Escola</label>
                  <input autoFocus type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-200" placeholder="Ex: Escola Municipal..." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase mb-1 tracking-widest">Código INEP</label>
                  <input type="text" value={newInep} onChange={(e) => setNewInep(e.target.value)} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-200" placeholder="Ex: 12345678" />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-stone-500 font-medium hover:bg-stone-50 rounded-xl transition-colors">Cancelar</button>
                  <button type="submit" className="flex-1 py-3 bg-stone-900 text-white font-medium rounded-xl hover:bg-stone-800 transition-all shadow-lg shadow-stone-200">Salvar</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FrequencyView({ schools, records, onAdd }: { schools: School[], records: any[], onAdd: (r: any) => void }) {
  const [selectedSchool, setSelectedSchool] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [present, setPresent] = useState(0);
  const [absent, setAbsent] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchool) return;
    onAdd({ schoolId: selectedSchool, date, present, absent });
    setPresent(0); setAbsent(0);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6 italic serif">Lançar Frequência</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-400 uppercase mb-1 tracking-widest">Escola</label>
              <select value={selectedSchool} onChange={(e) => setSelectedSchool(e.target.value)} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-200">
                <option value="">Selecione...</option>
                {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-400 uppercase mb-1 tracking-widest">Data</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-200" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-400 uppercase mb-1 tracking-widest text-emerald-600">Presentes</label>
                <input type="number" value={present} onChange={(e) => setPresent(Number(e.target.value))} className="w-full p-3 bg-emerald-50 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-200" />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-400 uppercase mb-1 tracking-widest text-red-600">Ausentes</label>
                <input type="number" value={absent} onChange={(e) => setAbsent(Number(e.target.value))} className="w-full p-3 bg-red-50 border border-red-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-200" />
              </div>
            </div>
            <button type="submit" className="w-full py-4 bg-stone-900 text-white font-bold rounded-2xl hover:bg-stone-800 transition-all shadow-lg shadow-stone-200 flex items-center justify-center gap-2">
              <Plus size={20} /> Lançar
            </button>
          </form>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100">
                <th className="px-6 py-4 text-[11px] font-bold text-stone-400 uppercase tracking-widest">Escola</th>
                <th className="px-6 py-4 text-[11px] font-bold text-stone-400 uppercase tracking-widest">Data</th>
                <th className="px-6 py-4 text-[11px] font-bold text-stone-400 uppercase tracking-widest">Pres./Aus.</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr><td colSpan={3} className="px-6 py-12 text-center text-stone-400 italic">Nenhum registro de frequência.</td></tr>
              ) : (
                records.map((rec) => (
                  <tr key={rec.id} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-stone-800">{schools.find(s => s.id === rec.schoolId)?.name}</td>
                    <td className="px-6 py-4 text-stone-500 font-mono text-sm">{rec.date}</td>
                    <td className="px-6 py-4">
                      <span className="text-emerald-600 font-bold">{rec.present}</span>
                      <span className="mx-1 text-stone-300">/</span>
                      <span className="text-red-600 font-bold">{rec.absent}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function EvaluationsView({ schools, records, onAdd }: { schools: School[], records: any[], onAdd: (r: any) => void }) {
  const [selectedSchool, setSelectedSchool] = useState('');
  const [student, setStudent] = useState('');
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchool || !student) return;
    onAdd({ schoolId: selectedSchool, studentName: student, subject, grade, date: new Date().toISOString().split('T')[0] });
    setStudent(''); setGrade(0);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6 italic serif">Registrar Avaliação</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-400 uppercase mb-1 tracking-widest">Escola</label>
              <select value={selectedSchool} onChange={(e) => setSelectedSchool(e.target.value)} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-200">
                <option value="">Selecione...</option>
                {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-400 uppercase mb-1 tracking-widest">Aluno</label>
              <input type="text" value={student} onChange={(e) => setStudent(e.target.value)} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-200" placeholder="Nome do aluno" />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-400 uppercase mb-1 tracking-widest">Disciplina</label>
              <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-200" placeholder="Ex: Matemática" />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-400 uppercase mb-1 tracking-widest">Nota</label>
              <input type="number" step="0.1" value={grade} onChange={(e) => setGrade(Number(e.target.value))} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-200" />
            </div>
            <button type="submit" className="w-full py-4 bg-stone-900 text-white font-bold rounded-2xl hover:bg-stone-800 transition-all shadow-lg shadow-stone-200 flex items-center justify-center gap-2">
              <Plus size={20} /> Salvar Avaliação
            </button>
          </form>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100">
                <th className="px-6 py-4 text-[11px] font-bold text-stone-400 uppercase tracking-widest">Aluno</th>
                <th className="px-6 py-4 text-[11px] font-bold text-stone-400 uppercase tracking-widest">Disciplina</th>
                <th className="px-6 py-4 text-[11px] font-bold text-stone-400 uppercase tracking-widest text-right">Nota</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr><td colSpan={3} className="px-6 py-12 text-center text-stone-400 italic">Nenhuma avaliação registrada.</td></tr>
              ) : (
                records.map((rec) => (
                  <tr key={rec.id} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-stone-800">{rec.studentName}</td>
                    <td className="px-6 py-4 text-stone-500 text-sm">{rec.subject}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${rec.grade >= 7 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {rec.grade.toFixed(1)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ProjectsView({ projects, onAdd, onDelete }: { projects: any[], onAdd: (p: any) => void, onDelete: (id: string) => void }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    onAdd({ title, description: desc, status: 'planejado', startDate: new Date().toISOString().split('T')[0] });
    setTitle(''); setDesc(''); setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-stone-800 italic serif">Projetos Educacionais</h3>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-stone-900 text-white px-5 py-2.5 rounded-2xl font-medium hover:bg-stone-800 transition-all shadow-lg shadow-stone-200">
          <Plus size={20} /> Novo Projeto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.length === 0 ? (
          <div className="md:col-span-2 py-20 text-center bg-white rounded-3xl border-2 border-dashed border-stone-100">
            <p className="text-stone-400 italic">Nenhum projeto cadastrado.</p>
          </div>
        ) : (
          projects.map(proj => (
            <div key={proj.id} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    {proj.status.replace('-', ' ')}
                  </span>
                  <button onClick={() => onDelete(proj.id)} className="text-stone-300 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                </div>
                <h4 className="text-lg font-bold text-stone-800 mb-2">{proj.title}</h4>
                <p className="text-sm text-stone-500 line-clamp-2 mb-4">{proj.description}</p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-stone-50">
                <span className="text-xs text-stone-400 font-mono">Início: {proj.startDate}</span>
                <button className="text-stone-900 font-bold text-xs flex items-center gap-1">Ver Detalhes <ArrowRight size={12} /></button>
              </div>
            </div>
          ))
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl relative z-10">
              <h4 className="text-xl font-bold mb-6 italic serif">Novo Projeto</h4>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase mb-1 tracking-widest">Título</label>
                  <input autoFocus type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-200" placeholder="Nome do projeto" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase mb-1 tracking-widest">Descrição</label>
                  <textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-200 h-24 resize-none" placeholder="Breve descrição..." />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-stone-500 font-medium hover:bg-stone-50 rounded-xl transition-colors">Cancelar</button>
                  <button type="submit" className="flex-1 py-3 bg-stone-900 text-white font-medium rounded-xl hover:bg-stone-800 transition-all shadow-lg shadow-stone-200">Criar</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EventsView({ events, onAdd, onDelete }: { events: any[], onAdd: (e: any) => void, onDelete: (id: string) => void }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) return;
    onAdd({ title, date, location, description: '' });
    setTitle(''); setDate(''); setLocation(''); setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-stone-800 italic serif">Calendário de Eventos</h3>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-stone-900 text-white px-5 py-2.5 rounded-2xl font-medium hover:bg-stone-800 transition-all shadow-lg shadow-stone-200">
          <Plus size={20} /> Agendar Evento
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-8">
          {events.length === 0 ? (
            <div className="py-12 text-center border-2 border-dashed border-stone-100 rounded-2xl">
              <p className="text-stone-400 italic">Nenhum evento agendado.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(evt => (
                <div key={evt.id} className="flex items-center justify-between p-6 bg-stone-50 rounded-2xl border border-stone-100 hover:border-stone-200 transition-all group">
                  <div className="flex items-center gap-6">
                    <div className="text-center min-w-[60px]">
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{new Date(evt.date).toLocaleDateString('pt-BR', { month: 'short' })}</p>
                      <p className="text-2xl font-bold text-stone-800">{new Date(evt.date).getDate()}</p>
                    </div>
                    <div className="h-10 w-px bg-stone-200" />
                    <div>
                      <h4 className="font-bold text-stone-800">{evt.title}</h4>
                      <p className="text-xs text-stone-400 flex items-center gap-1"><Search size={10} /> {evt.location || 'Local não definido'}</p>
                    </div>
                  </div>
                  <button onClick={() => onDelete(evt.id)} className="opacity-0 group-hover:opacity-100 p-2 text-stone-300 hover:text-red-600 transition-all"><Trash2 size={18} /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl relative z-10">
              <h4 className="text-xl font-bold mb-6 italic serif">Agendar Evento</h4>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase mb-1 tracking-widest">Título do Evento</label>
                  <input autoFocus type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-200" placeholder="Ex: Reunião de Pais" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase mb-1 tracking-widest">Data</label>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-200" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase mb-1 tracking-widest">Local</label>
                  <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-200" placeholder="Ex: Auditório Principal" />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-stone-500 font-medium hover:bg-stone-50 rounded-xl transition-colors">Cancelar</button>
                  <button type="submit" className="flex-1 py-3 bg-stone-900 text-white font-medium rounded-xl hover:bg-stone-800 transition-all shadow-lg shadow-stone-200">Agendar</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
