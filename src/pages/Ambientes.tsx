import { MapPin } from 'lucide-react';

export default function Ambientes() {
  const ambientes = [
    { nome: 'Laboratório de Tecnologia', icon: '💻', status: 'Livre' },
    { nome: 'Sala de Vídeo e Cinema', icon: '🎬', status: 'Ocupado' },
    { nome: 'Biblioteca Interativa', icon: '📚', status: 'Livre' },
    { nome: 'Espaço Maker', icon: '🛠️', status: 'Reservado' },
  ];

  return (
    <div className="sefor-card">
      <h2 className="text-3xl font-bold text-[#15803d] mb-8 flex items-center gap-2">
        <MapPin /> Ambientes de Aprendizagem
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {ambientes.map((amb) => (
          <div
            key={amb.nome}
            className="p-8 border-2 border-gray-100 rounded-[2rem] hover:border-[#ca8a04] transition-all cursor-pointer group"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{amb.icon}</div>
            <h3 className="text-xl font-black mb-2">{amb.nome}</h3>
            <div className="flex items-center gap-2">
              <span
                className={`h-3 w-3 rounded-full ${
                  amb.status === 'Livre' ? 'bg-green-500' : 'bg-red-500'
                }`}
              ></span>
              <span className="font-bold text-gray-500">{amb.status}</span>
            </div>
            <button className="mt-6 text-[#15803d] font-black border-b-2 border-[#15803d]">
              Reservar Agora
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
