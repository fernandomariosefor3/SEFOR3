import { BookOpen } from 'lucide-react';

export default function Projetos() {
  return (
    <div className="sefor-card">
      <h2 className="text-3xl font-bold text-[#15803d] mb-8 flex items-center gap-2">
        <BookOpen /> Gestão de Projetos
      </h2>

      <div className="space-y-8">
        <div>
          <label className="block text-sm font-black text-gray-500 uppercase mb-2">Título Estratégico do Projeto</label>
          <input
            type="text"
            className="sefor-input font-bold text-lg"
            placeholder="Digite o nome do projeto..."
          />
        </div>

        <div>
          <label className="block text-sm font-black text-gray-500 uppercase mb-2">Detalhamento Técnico e Metodológico</label>
          <textarea
            rows={15}
            className="sefor-input"
            placeholder="Descreva aqui com detalhes: Objetivos, Público-alvo, Recursos Necessários, Cronograma de Execução e Resultados Esperados..."
          ></textarea>
        </div>

        <button type="button" className="sefor-button w-full text-xl py-5 shadow-2xl">
          SALVAR E PUBLICAR PROJETO
        </button>
      </div>
    </div>
  );
}
