import { School } from 'lucide-react';

const escolas = [
  { nome: 'E.E. Santos Dumont', municipio: 'Fortaleza', turmas: 12, alunos: 320 },
  { nome: 'E.E. Rui Barbosa', municipio: 'Caucaia', turmas: 9, alunos: 245 },
  { nome: 'E.E. Tiradentes', municipio: 'Maracanaú', turmas: 7, alunos: 198 },
  { nome: 'E.E. Castro Alves', municipio: 'Fortaleza', turmas: 15, alunos: 410 },
  { nome: 'E.E. Dom Pedro II', municipio: 'Pacatuba', turmas: 10, alunos: 276 },
];

export default function Escolas() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-[#15803d] flex items-center gap-2">
          <School /> Escolas
        </h1>
        <p className="text-gray-500 font-medium">Lista de escolas cadastradas no sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {escolas.map((escola) => (
          <div
            key={escola.nome}
            className="bg-white rounded-2xl p-6 shadow border-b-4 border-[#ca8a04] hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-xl">
                <School size={24} className="text-[#15803d]" />
              </div>
              <span className="text-xs font-black bg-green-50 text-[#15803d] px-3 py-1 rounded-full">
                {escola.municipio}
              </span>
            </div>
            <h3 className="text-lg font-black text-gray-800 mb-3">{escola.nome}</h3>
            <div className="flex gap-4">
              <div>
                <p className="text-xs font-black uppercase text-gray-400">Turmas</p>
                <p className="text-2xl font-black text-[#15803d]">{escola.turmas}</p>
              </div>
              <div>
                <p className="text-xs font-black uppercase text-gray-400">Alunos</p>
                <p className="text-2xl font-black text-[#ca8a04]">{escola.alunos}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
