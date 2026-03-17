import { useState } from 'react';
import { Users } from 'lucide-react';

const turmasPorEscola: Record<string, string[]> = {
  'E.E. Santos Dumont': ['9º Ano A', '9º Ano B', '1º EM A'],
  'E.E. Rui Barbosa': ['8º Ano A', '9º Ano A', '1º EM B'],
  'E.E. Tiradentes': ['7º Ano A', '8º Ano B'],
  'E.E. Castro Alves': ['9º Ano A', '9º Ano B', '9º Ano C', '1º EM A'],
  'E.E. Dom Pedro II': ['8º Ano A', '9º Ano A', '1º EM A'],
};

const alunosExemplo = ['Ana Silva', 'Bruno Costa', 'Carlos Mendes', 'Diana Souza', 'Eduardo Lima'];

export default function Frequencia() {
  const [escola, setEscola] = useState('');
  const [turma, setTurma] = useState('');
  const [presencas, setPresencas] = useState<Record<string, 'P' | 'F' | null>>({});

  const togglePresenca = (aluno: string, status: 'P' | 'F') => {
    setPresencas((prev) => ({ ...prev, [aluno]: prev[aluno] === status ? null : status }));
  };

  const presentes = Object.values(presencas).filter((v) => v === 'P').length;
  const total = alunosExemplo.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-[#15803d] flex items-center gap-2">
          <Users /> Frequência
        </h1>
        <p className="text-gray-500 font-medium">Registro de presença diária</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow border-b-4 border-[#ca8a04]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-black uppercase text-gray-500 mb-2">Escola</label>
            <select
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#ca8a04] outline-none font-bold"
              onChange={(e) => { setEscola(e.target.value); setTurma(''); }}
              value={escola}
            >
              <option value="">-- Selecione a Escola --</option>
              {Object.keys(turmasPorEscola).map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-black uppercase text-gray-500 mb-2">Turma</label>
            <select
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#ca8a04] outline-none font-bold"
              onChange={(e) => setTurma(e.target.value)}
              value={turma}
              disabled={!escola}
            >
              <option value="">-- Selecione a Turma --</option>
              {escola && turmasPorEscola[escola].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {turma ? (
          <div>
            <div className="flex justify-between items-center mb-4 p-3 bg-green-50 rounded-xl">
              <span className="font-black text-[#15803d]">{turma} — {new Date().toLocaleDateString('pt-BR')}</span>
              <span className="font-black text-[#ca8a04]">{presentes}/{total} presentes</span>
            </div>

            <div className="space-y-3">
              {alunosExemplo.map((aluno) => (
                <div key={aluno} className="flex justify-between items-center p-4 border-2 border-gray-100 rounded-xl hover:bg-gray-50">
                  <span className="font-bold text-gray-800">{aluno}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => togglePresenca(aluno, 'P')}
                      className={`w-11 h-11 rounded-full font-black transition-all
                        ${presencas[aluno] === 'P' ? 'bg-green-600 text-white scale-110' : 'bg-gray-100 text-gray-500 hover:bg-green-100'}`}
                    >P</button>
                    <button
                      onClick={() => togglePresenca(aluno, 'F')}
                      className={`w-11 h-11 rounded-full font-black transition-all
                        ${presencas[aluno] === 'F' ? 'bg-red-600 text-white scale-110' : 'bg-gray-100 text-gray-500 hover:bg-red-100'}`}
                    >F</button>
                  </div>
                </di
