import React, { useState } from 'react';

// --- ESTILOS RÁPIDOS (Para garantir que não fique feio) ---
const styles = {
  nav: { backgroundColor: '#15803d', padding: '15px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '5px solid #ca8a04', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  container: { padding: '20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' },
  card: { backgroundColor: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', borderLeft: '8px solid #ca8a04', marginTop: '20px' },
  button: { backgroundColor: '#15803d', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' },
  input: { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '2px solid #ddd', fontSize: '16px' },
  tabBtn: { background: 'none', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer', margin: '0 10px', fontSize: '14px' },
  progressBar: { width: '100%', backgroundColor: '#eee', borderRadius: '10px', height: '20px', marginTop: '10px', overflow: 'hidden' },
  progressFill: (percent) => ({ width: `${percent}%`, backgroundColor: '#ca8a04', height: '100%', transition: 'width 0.5s' }),
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }
};

export default function App() {
  const [tab, setTab] = useState('dashboard');
  const [turma, setTurma] = useState('');

  return (
    <div style={{ backgroundColor: '#f4f7f4', minHeight: '100vh' }}>
      {/* MENU SUPERIOR */}
      <nav style={styles.nav}>
        <h1 style={{ margin: 0, color: '#ca8a04', fontWeight: '900' }}>SEFOR 3</h1>
        <div>
          <button onClick={() => setTab('dashboard')} style={styles.tabBtn}>Dashboard</button>
          <button onClick={() => setTab('frequencia')} style={styles.tabBtn}>Frequência</button>
          <button onClick={() => setTab('notas')} style={styles.tabBtn}>Notas %</button>
          <button onClick={() => setTab('projetos')} style={styles.tabBtn}>Projetos</button>
          <button onClick={() => setTab('ambientes')} style={styles.tabBtn}>Ambientes</button>
        </div>
      </nav>

      <div style={styles.container}>
        
        {/* ABA: DASHBOARD */}
        {tab === 'dashboard' && (
          <div style={styles.card}>
            <h2 style={{ color: '#15803d' }}>Bem-vindo ao Painel SEFOR</h2>
            <p>Selecione uma das abas acima para gerenciar sua turma.</p>
            <div style={styles.grid}>
              <div style={{textAlign: 'center', padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '10px'}}>
                <h3 style={{margin: 0}}>12</h3>
                <p style={{fontSize: '12px'}}>Turmas Ativas</p>
              </div>
              <div style={{textAlign: 'center', padding: '20px', backgroundColor: '#fff9c4', borderRadius: '10px'}}>
                <h3 style={{margin: 0}}>85%</h3>
                <p style={{fontSize: '12px'}}>Frequência Média</p>
              </div>
            </div>
          </div>
        )}

        {/* ABA: FREQUÊNCIA POR TURMA */}
        {tab === 'frequencia' && (
          <div style={styles.card}>
            <h2 style={{ color: '#15803d' }}>Frequência por Turma</h2>
            <select 
              style={styles.input} 
              onChange={(e) => setTurma(e.target.value)}
            >
              <option value="">-- Selecione a Turma --</option>
              <option value="9A">9º Ano A</option>
              <option value="1B">1º Ano Médio B</option>
            </select>

            {turma ? (
              <div>
                <p><b>Lista de Alunos - Turma {turma}</b></p>
                <div style={{ borderBottom: '1px solid #eee', padding: '10px 0', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Abner Silva</span>
                  <div>
                    <button style={{backgroundColor: '#2e7d32', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', marginRight: '5px'}}>P</button>
                    <button style={{backgroundColor: '#c62828', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px'}}>F</button>
                  </div>
                </div>
                <div style={{ borderBottom: '1px solid #eee', padding: '10px 0', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Beatriz Souza</span>
                  <div>
                    <button style={{backgroundColor: '#2e7d32', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', marginRight: '5px'}}>P</button>
                    <button style={{backgroundColor: '#c62828', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px'}}>F</button>
                  </div>
                </div>
              </div>
            ) : <p style={{color: '#999'}}>Aguardando seleção de turma...</p>}
          </div>
        )}

        {/* ABA: AVALIAÇÃO POR PORCENTAGEM */}
        {tab === 'notas' && (
          <div style={styles.card}>
            <h2 style={{ color: '#15803d' }}>Progresso de Notas</h2>
            <p>Porcentagem de informações lançadas no sistema:</p>
            <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 'bold'}}>
              <span>Status da Turma 9A</span>
              <span style={{color: '#ca8a04'}}>75%</span>
            </div>
            <div style={styles.progressBar}>
              <div style={styles.progressFill(75)}></div>
            </div>
            <p style={{fontSize: '12px', marginTop: '10px', color: '#666'}}>Faltam 5 alunos para completar 100%.</p>
          </div>
        )}

        {/* ABA: PROJETOS COM MAIS ESPAÇO */}
        {tab === 'projetos' && (
          <div style={styles.card}>
            <h2 style={{ color: '#15803d' }}>Cadastro de Projeto Pedagógico</h2>
            <input type="text" placeholder="Título do Projeto" style={styles.input} />
            <textarea 
              placeholder="Descreva aqui detalhadamente os objetivos, metodologia, recursos e cronograma..." 
              style={{ ...styles.input, height: '300px', resize: 'vertical' }}
            />
            <button style={styles.button}>SALVAR PROJETO COMPLETO</button>
          </div>
        )}

        {/* ABA: AMBIENTES DE APRENDIZAGEM */}
        {tab === 'ambientes' && (
          <div style={styles.card}>
            <h2 style={{ color: '#15803d' }}>Ambientes de Aprendizagem</h2>
            <div style={styles.grid}>
              {['Lab. Informática', 'Biblioteca', 'Sala de Vídeo', 'Quadra', 'Auditório'].map(sala => (
                <div key={sala} style={{ border: '2px solid #eee', padding: '15px', borderRadius: '10px', textAlign: 'center' }}>
                  <span style={{ fontSize: '30px' }}>📍</span>
                  <h4 style={{ margin: '10px 0' }}>{sala}</h4>
                  <span style={{ color: '#15803d', fontWeight: 'bold', fontSize: '12px' }}>Disponível</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
