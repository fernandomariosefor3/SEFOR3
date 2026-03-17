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
          <p className="text-4xl font-black tracking-tighter mb-2">SE
