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
      </div
