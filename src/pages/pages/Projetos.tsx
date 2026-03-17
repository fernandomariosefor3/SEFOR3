import { useState } from 'react';
import { BookOpen, Plus } from 'lucide-react';

const projetosIniciais = [
  { titulo: 'Feira de Ciências 2025', escola: 'E.E. Castro Alves', status: 'Em andamento' },
  { titulo: 'Projeto Leitura Criativa', escola: 'E.E. Rui Barbosa', status: 'Concluído' },
  { titulo: 'Horta Escolar Sustentável', escola: 'E.E. Santos Dumont', status: 'Planejamento' },
];

export default function Projetos() {
  const [mostrarForm, setMostrarForm] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [escola, setEscola] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black text-[#15803d] flex items-center gap-2">
            <BookOpen /> Projetos
          </h1>
          <p className="text-gray-500 font-medium">Gestão de projetos pedagógicos</p>
        </div>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="flex items-center gap-2 bg-[#15803d] text-white font-black px-5 py-3 rounded-xl hover:bg-[#166534] transition-all"
        >
          <Plus size={18} /> Novo Projeto
        </button>
      </div>

      {/* Formulário */}
      {mostrarForm && (
        <div className="bg-white rounded-2xl p-6 shadow border-b-4 border-[#ca8a04]">
          <h2 className="text-xl font-black text-[#15803d] mb-5">Cadastrar Novo Projeto</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase text-gray-500 mb-2">Título do Projeto</label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#ca8a04] outline-none font-bold text-lg"
                placeholder="Digite o título..."
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-gray-500 mb-2">Escola</label>
              <select
                value={escola}
                onChange={(e) => setEscola(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#ca8a04] outline-none font-bold"
              >
                <option value="">-- Selecione --</option>
                <option>E.E. Santos Dumont</option>
                <option>E.E. Rui Barbosa</option>
                <option>E.E. Tiradentes</option>
                <option>E.E. Castro Alves</option>
                <option>E.E. Dom Pedro II</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-gray-500 mb-2">Descrição Detalhada</label>
              <textarea
                rows={8}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#ca8a04] outline-none resize-vertical"
                placeholder="Objetivos, metodologia, recursos, cronograma e resultados esperados..."
              />
            </div>
            <button className="w-full bg-[#15803d] text-white font-black py-4 rounded-xl hover:bg-[#166534] transition-all text-lg">
              SALVAR PROJETO
            </button>
          </div>
        </div>
      )}

      {/* Lista */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {projetosIniciais.map((p) => (
          <div key={p.titulo} className="bg-white rounded-2xl p-6 shadow border-b-4 border-[#15803d] hover:shadow-lg transition-all">
            <span className={`text-xs font-black px-3 py-1 rounded-full
              ${p.status === 'Concluído' ? 'bg-green-100 text-green-700' :
                p.status === 'Em andamento' ? 'bg-yellow-100 text-yellow-700' :
                'bg-blue-100 text-blue-700'}`}>
              {p.status}
            </span>
            <h3 className="text-lg font-black text-gray-800 mt-3 mb-1">{p.titulo}</h3>
            <p className="text-sm text-gray-500 font-bold">{p.escola}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
