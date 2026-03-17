import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Escolas from './pages/Escolas';
import Frequencia from './pages/Frequencia';
import Notas from './pages/Notas';
import Projetos from './pages/Projetos';
import Ambientes from './pages/Ambientes';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#15803d] flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-4xl font-black tracking-tighter mb-2">SEFOR 3</p>
          <p className="text-green-200 animate-pulse">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/*" element={user ? (
          <Layout>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/escolas" element={<Escolas />} />
              <Route path="/frequencia" element={<Frequencia />} />
              <Route path="/notas" element={<Notas />} />
              <Route path="/projetos" element={<Projetos />} />
              <Route path="/ambientes" element={<Ambientes />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </Layout>
        ) : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
