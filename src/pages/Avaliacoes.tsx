import { ClipboardCheck } from 'lucide-react';

export default function Avaliacoes() {
  const progresso = 72;

  return (
    <div className="sefor-card">
      <h2 className="text-3xl font-bold text-[#15803d] mb-8 flex items-center gap-2">
        <ClipboardCheck /> Progresso de Avaliação
      </h2>

      <div className="mb-12">
        <div className="flex justify-between mb-3">
          <span className="font-black text-gray-700">Lançamento de Notas</span>
          <span className="font-black text-[#ca8a04] text-2xl">{progresso}%</span>
        </div>
        <div className="w-full bg-gray-200 h-10 rounded-2xl overflow-hidden border-4 border-white shadow-inner">
          <div
            className="bg-gradient-to-r from-[#15803d] to-[#ca8a04] h-full transition-all duration-1000"
            style={{ width: `${progresso}%` }}
          ></div>
        </div>
        <p className="mt-4 text-gray-500 font-medium italic">Faltam apenas 28% para concluir esta turma!</p>
      </div>

      <div className="bg-gray-50 p-6 rounded-2xl">
        <h3 className="font-bold mb-4 text-[#15803d]">Resumo por Categoria</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border-b-4 border-green-500 shadow">
            <p className="text-sm font-bold text-gray-400">APROVADOS</p>
            <p className="text-2xl font-black text-green-600">18</p>
          </div>
          <div className="bg-white p-4 rounded-xl border-b-4 border-yellow-500 shadow">
            <p className="text-sm font-bold text-gray-400">RECUPERAÇÃO</p>
            <p className="text-2xl font-black text-yellow-600">05</p>
          </div>
          <div className="bg-white p-4 rounded-xl border-b-4 border-red-500 shadow">
            <p className="text-sm font-bold text-gray-400">PENDENTES</p>
            <p className="text-2xl font-black text-red-600">03</p>
          </div>
        </div>
      </div>
    </div>
  );
}
