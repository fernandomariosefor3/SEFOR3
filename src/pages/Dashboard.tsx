import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const escolas = [
  { nome: 'E.E. Santos Dumont', frequencia: 87, notas: 74, projetos: 5 },
  { nome: 'E.E. Rui Barbosa', frequencia: 92, notas: 81, projetos: 8 },
  { nome: 'E.E. Tiradentes', frequencia: 78, notas: 68, projetos: 3 },
  { nome: 'E.E. Castro Alves', frequencia: 95, notas: 89, projetos: 11 },
  { nome: 'E.E. Dom Pedro II', frequencia: 83, notas: 76, projetos: 6 },
];

const ranking = [...escolas].sort((a, b) => b.frequencia - a.frequencia);

export default function Dashboard() {
  const totalEscolas = escolas.length;
  const mediaFrequencia = Math.round(escolas.reduce((s, e) => s + e.frequencia, 0) / totalEscolas);
  const mediaNotas = Math.round(escolas.reduce((s, e) => s + e.notas, 0) / totalEscolas);
  const totalProjetos = escolas.reduce((s, e) => s + e.projetos, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-[#15803d]">Dashboard</h1>
        <p className="text-gray-500 font-medium">Visão geral do desempenho das escolas</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border-b-4 border-[#15803d] shadow">
          <p className="text-xs font-black uppercase text-gray-400">Escolas</p>
          <p className="text-4xl font-black text-[#15803d]">{totalEscolas}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border-b-4 border-[#ca8a04] shadow">
          <p className="text-xs font-black uppercase text-gray-400">Freq. Média</p>
          <p className="text-4xl font-black text-[#ca8a04]">{mediaFrequencia}%</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border-b-4 border-blue-500 shadow">
          <p className="text-xs font-black uppercase text-gray-400">Média Notas</p>
          <p className="text-4xl font-black text-blue-600">{mediaNotas}%</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border-b-4 border-purple-500 shadow">
          <p className="text-xs font-black uppercase text-gray-400">Projetos</p>
          <p className="text-4xl font-black text-purple-600">{totalProjetos}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow border-b-4 border-[#ca8a04]">
        <h2 className="text-xl font-black text-[#15803d] mb-6">Comparativo entre Escolas</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={escolas} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="nome"
              tick={{ fontSize: 11, fontWeight: 'bold' }}
              angle={-25}
              textAnchor="end"
            />
            <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: '2px solid #ca8a04' }} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar dataKey="frequencia" name="Frequência %" fill="#15803d" radius={[6, 6, 0, 0]} />
            <Bar dataKey="notas" name="Notas %" fill="#ca8a04" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow border-b-4 border-[#15803d]">
        <h2 className="text-xl font-black text-[#15803d] mb-4">Ranking por Frequência</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#f0f4f0]">
                <th className="p-3 text-left font-black text-gray-500 rounded-l-xl">#</th>
                <th className="p-3 text-left font-black text-gray-500">Escola</th>
                <th className="p-3 text-center font-black text-gray-500">Frequência</th>
                <th className="p-3 text-center font-black text-gray-500">Notas</th>
                <th className="p-3 text-center font-black text-gray-500 rounded-r-xl">Projetos</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((escola, i) => (
                <tr key={escola.nome} className="border-b border-gray-100 hover:bg-green-50 transition-colors">
                  <td className="p-3 font-black text-[#ca8a04] text-lg">{i + 1}º</td>
                  <td
