import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import {
  LayoutDashboard, School, Users, ClipboardCheck,
  BookOpen, MapPin, LogOut, Menu, X
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/escolas', icon: School, label: 'Escolas' },
  { to: '/frequencia', icon: Users, label: 'Frequência' },
  { to: '/notas', icon: ClipboardCheck, label: 'Notas' },
  { to: '/projetos', icon: BookOpen, label: 'Projetos' },
  { to: '/ambientes', icon: MapPin, label: 'Ambientes' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-[#f0f4f0]">
      <aside
        className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-[#15803d] text-white flex flex-col transition-all duration-300 sticky top-0 h-screen`}
      >
        <div className="p-4 border-b border-green-600 flex items-center justify-between">
          {sidebarOpen && (
            <span className="text-2xl font-black tracking-tighter">
              SEFOR <span className="text-[#ca8a04]">3</span>
            </span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-green-600 transition-all"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 py-4 space-y-1 px-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl transition-all font-bold text-sm
                ${isActive ? 'bg-white text-[#15803d]' : 'hover:bg-green-600 text-white'}`
              }
            >
              <Icon size={20} className="shrink-0" />
              {sidebarOpen && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-green-600">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-red-600 transition-all w-full font-bold text-sm"
          >
            <LogOut size={20} className="shrink-0" />
            {sidebarOpen && <span>Sair</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}
