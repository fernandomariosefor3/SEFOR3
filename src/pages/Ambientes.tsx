import { useState } from 'react';
import { MapPin } from 'lucide-react';

const ambientesData = [
  { nome: 'Laboratório de Tecnologia', icon: '💻', status: 'Livre', escola: 'E.E. Castro Alves' },
  { nome: 'Sala de Vídeo e Cinema', icon: '🎬', status: 'Ocupado', escola: 'E.E. Santos Dumont' },
  { nome: 'Biblioteca Interativa', icon: '📚', status: 'Livre', escola: 'E.E. Rui Barbosa' },
  { nome: 'Espaço Maker', icon: '🛠️', status: 'Reservado', escola: 'E.E. Castro Alves' },
  { nome: 'Quadra Poliesportiva', icon: '⚽', status: 'Livre', escola: 'E.E. Tiradentes' },
  { nome: 'Auditório', icon: '🎭', status: 'Reservado', escola: 'E.E. Dom Pedro II' },
];

const statusColor = {
  'Livre': 'bg-green-500',
  'Ocupado': 'bg-red-500',
  'Reservado': 'bg-yellow-500',
};

const statusBadge = {
  'Livre': 'bg-green-100 text-green-700',
  'Ocupado': 'bg-red-100 text-red-700',
  'Reservado': 'bg-yellow-100 text-yellow-700',
};

export default function Ambientes() {
  const [filtro, setFiltro] = useState('Todos');

  const filtrados = filtro === 'Todos' ? ambientesData : ambientesData.filter((a) => a.status === filtro);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-[#15803d] flex items-center gap-2">
          <MapPin /> Ambientes de Aprendizagem
        </h1>
        <p className="text-gray-500 font-medium">Disponibilidade dos espaços educacionais</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['Todos', 'Livre', 'Ocupado', 'Reservado'].map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`px-5 py-2 rounded-xl font-black text-sm transition-all
              ${filtro === f ? 'bg-[#15803d] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtrados.map((amb) => (
          <div
            key={amb.nome}
            className="bg-white p-6 rounded-2xl shadow border-b-4 border-[#ca8a04] hover:shadow-lg transition-all group"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{amb.icon}</div>
            <h3 className="text-lg font-black text-gray-800 mb-1">{amb.nome}</h3>
            <p className="text-sm text-gray-500 font-bold mb-3">{amb.escola}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`h-3 w-3 rounded-full ${statusColor[amb.status as keyof typeof statusColor]}`} />
                <span className={`text-xs font-black px-3 py-1 rounded-full ${statusBadge[amb.status as keyof typeof statusBadge]}`}>
                  {amb.status}
                </span>
              </div>
              {amb.status === 'Livre' && (
                <button className="text-[#15803d] font-black text-sm border-b-2 border-[#15803d] hover:text-[#ca8a04] hover:border-[#ca8a04] transition-all">
                  Reservar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
