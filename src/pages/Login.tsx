import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, senha);
    } catch {
      setErro('Email ou senha incorretos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#15803d] to-[#166534] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black text-white tracking-tighter">
            SEFOR <span className="text-[#ca8a04]">3</span>
          </h1>
          <p className="text-green-200 mt-2 font-medium">Sistema de Gestão Educacional Profissional</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 border-b-8 border-[#ca8a04]">
          <h2 className="text-2xl font-black text-[#15803d] mb-6">Entrar no Sistema</h2>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-black uppercase text-gray-500 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#ca8a04] outline-none transition-colors text-lg"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-black uppercase text-gray-500 mb-2">Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#ca8a04] outline-none transition-colors text-lg"
                placeholder="••••••••"
                required
              />
            </div>

            {erro && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 p-3 rounded-xl text-sm font-bold">
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#15803d] text-white font-black py-4 rounded-xl hover:bg-[#166534] transition-all active:scale-95 text-lg disabled:opacity-60"
            >
              {loading ? 'Entrando...' : 'ENTRAR'}
            </button>
          </form>
        </div>

        <p className="text-center text-green-200 mt-6 text-sm">
          Problemas de acesso? Contate o administrador do sistema.
        </p>
      </div>
    </div>
  );
}
