import { useState } from 'react';
import { Users } from 'lucide-react';

export default function Frequencia() {
  const [turma, setTurma] = useState('');

  return (
    <div className="sefor-card">
      <h2 className="text-3xl font-bold text-[#15803d] mb-6 flex items-center gap-2">
        <Users /> Frequência Diária
      </h2>

      <div className="mb-8">
        <label className="block text-sm font-black uppercase text-gray-500 mb-2">Selecione a Turma</label>
        <select
          className="sefor-input text-lg font-bold"
          onChange={(e) => setTurma(e.target.value)}
        >
          <option value="">-- Escolha uma Turma --</option>
          <option value="9A">9º Ano A</option>
          <option value="9B">9º Ano B</option>
          <option value="1M">1º Ensino Médio</option>
        </select>
      </div>

      {turma ? (
        <div>
          <div className="flex justify-between items-center mb-4 p-2 bg-green-50 rounded-lg">
            <span className="font-bold text-[#15803d]">Turma: {turma}</span>
            <span className="text-sm font-bold">Data: {new Date().toLocaleDateString()}</span>
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between items-center p-4 border rounded-xl hover:bg-gray-50">
                <span className="font-bold">Aluno Exemplo {i}</span>
                <div className="flex gap-2">
                  <button className="bg-green-600 text-white w-10 h-10 rounded-full font-bold">P</button>
                  <button className="bg-red-600 text-white w-10 h-10 rounded-full font-bold">F</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400 font-bold border-4 border-dashed rounded-3xl">
          Selecione uma turma para iniciar a chamada
        </div>
      )}
    </div>
  );
}
