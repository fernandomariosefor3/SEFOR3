import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Users, ClipboardCheck, BookOpen, MapPin } from 'lucide-react';
import Frequencia from './pages/Frequencia';
import Avaliacoes from './pages/Avaliacoes';
import Projetos from './pages/Projetos';
import Ambientes from './pages/Ambientes';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <header className="bg-[#15803d] text-white shadow-2xl sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-3xl font-black tracking-tighter">
              SEFOR <span className="text-[#ca8a04]">3</span>
            </h1>
            <nav className="flex space-x-2 md:space-x-6">
              <Link to="/" className="flex items-center gap-1 hover:bg-[#166534] p-2 rounded-lg transition-all">
                <Users size={20} /> <span className="hidden md:inline">Frequência</span>
              </Link>
              <Link to="/avaliacoes" className="flex items-center gap-1 hover:bg-[#166534] p-2 rounded-lg transition-all">
                <ClipboardCheck size={20} /> <span className="hidden md:inline">Avaliações</span>
              </Link>
              <Link to="/projetos" className="flex items-center gap-1 hover:bg-[#166534] p-2 rounded-lg transition-all">
                <BookOpen size={20} /> <span className="hidden md:inline">Projetos</span>
              </Link>
              <Link to="/ambientes" className="flex items-center gap-1 hover:bg-[#166534] p-2 rounded-lg transition-all">
                <MapPin size={20} /> <span className="hidden md:inline">Ambientes</span>
              </Link>
            </nav>
          </div>
        </header>

        <main className="container mx-auto px-4 py-10 flex-grow">
          <Routes>
            <Route path="/" element={<Frequencia />} />
            <Route path="/avaliacoes" element={<Avaliacoes />} />
            <Route path="/projetos" element={<Projetos />} />
            <Route path="/ambientes" element={<Ambientes />} />
          </Routes>
        </main>

        <footer className="bg-white border-t p-6 text-center font-bold text-[#15803d]">
          SEFOR 3 - Sistema de Gestão Educacional Profissional
        </footer>
      </div>
    </BrowserRouter>
  );
}
