import { ClipboardCheck } from 'lucide-react';

const turmas = [
  { nome: '9º Ano A — E.E. Santos Dumont', progresso: 87, aprovados: 22, recuperacao: 4, pendentes: 2 },
  { nome: '9º Ano B — E.E. Santos Dumont', progresso: 65, aprovados: 18, recuperacao: 6, pendentes: 5 },
  { nome: '1º EM A — E.E. Castro Alves', progresso: 92, aprovados: 28, recuperacao: 2, pendentes: 1 },
  { nome: '9º Ano A — E.E. Rui Barbosa', progresso: 45, aprovados: 14, recuperacao: 8, pendentes: 9 },
];

export default function Notas() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-[#15803d] flex items-center gap-2">
          <ClipboardCheck /> Notas
        </h1>
        <p className="text-gray-500 font-medium">Progresso de lançamento de avaliações</p>
      </div>

      <div className="space-y-4">
        {turmas.map((turma) => (
          <div key={turma.nome} className="bg-white rounded-2xl p-6 shadow border-b-4 border-[#ca8a04]">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-black text-gray-800">{turma.nome}</h3>
              <span className={`text-2xl font-black ${turma.progresso >= 80 ? 'text-green-600' : turma.progresso >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                {turma.progresso}%
              </span>
            </div>

            <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden mb-4">
              <div
                className={`h-full rounded-full transition-all duration-700 ${turma.progresso >= 80 ? 'bg-green-500' : turma.progresso >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${turma.progresso}%` }}
              />
            </div>

            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
                <span className="text-sm font-bold text-gray-600">Aprovados: <strong className="text-green-600">{turma.aprovados}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" />
                <span className="text-sm font-bold text-gray-600">Recuperação: <strong className="text-yellow-600">{turma.recuperacao}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                <span className="text-sm font-bold text-gray-600">Pendentes: <strong className="text-red-600">{turma.pendentes}</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
