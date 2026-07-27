import React from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Award, Medal, TrendingUp, DollarSign, Star, Zap } from 'lucide-react';

export default function AdminRanking({ ranking }) {

  const dispararConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const top1 = ranking[0];
  const top2 = ranking[1];
  const top3 = ranking[2];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header com botão de comemoração */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Trophy size={28} color="#f59e0b" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Ranking da Rede & Gamificação</h2>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Classificação em tempo real dos técnicos que mais geraram indicações e resultados.
          </p>
        </div>

        <button onClick={dispararConfetti} className="btn btn-primary">
          <Star size={16} /> Celebrar Campeões 🎉
        </button>
      </div>

      {/* Pódio Gamificado (1º, 2º e 3º Lugar) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', alignItems: 'end' }}>
        
        {/* 2º LUGAR */}
        {top2 && (
          <div className="glass-panel" style={{
            padding: '24px',
            textAlign: 'center',
            background: 'linear-gradient(180deg, rgba(148, 163, 184, 0.15) 0%, rgba(18, 24, 38, 0.8) 100%)',
            border: '1px solid rgba(148, 163, 184, 0.3)',
            order: 1
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #cbd5e1, #64748b)',
              margin: '0 auto 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(148, 163, 184, 0.4)'
            }}>
              <Medal size={32} color="#fff" />
            </div>
            <span className="badge" style={{ background: 'rgba(148, 163, 184, 0.2)', color: '#e2e8f0', marginBottom: '8px' }}>
              2º LUGAR — PRATA
            </span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: '4px 0' }}>{top2.nome}</h3>
            <div className="badge badge-code" style={{ marginBottom: '12px' }}>{top2.codigo}</div>
            
            <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#10b981' }}>
              R$ {top2.totalValorIndicado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {top2.totalVendasNum} indicações concluídas
            </div>
          </div>
        )}

        {/* 1º LUGAR (CAMPEÃO) */}
        {top1 && (
          <div className="glass-panel" style={{
            padding: '30px 24px',
            textAlign: 'center',
            background: 'linear-gradient(180deg, rgba(245, 158, 11, 0.2) 0%, rgba(18, 24, 38, 0.9) 100%)',
            border: '2px solid rgba(245, 158, 11, 0.6)',
            boxShadow: '0 10px 30px rgba(245, 158, 11, 0.2)',
            transform: 'scale(1.05)',
            order: 0
          }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #fbbf24, #d97706)',
              margin: '0 auto 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 20px rgba(245, 158, 11, 0.5)'
            }}>
              <Trophy size={40} color="#fff" />
            </div>
            <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.3)', color: '#fbbf24', marginBottom: '8px' }}>
              🏆 1º LUGAR — OURO (CAMPEÃO)
            </span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', margin: '4px 0', color: '#fff' }}>{top1.nome}</h3>
            <div className="badge badge-code" style={{ marginBottom: '12px' }}>{top1.codigo}</div>
            
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#10b981' }}>
              R$ {top1.totalValorIndicado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {top1.totalVendasNum} indicações no total
            </div>
            <div style={{ marginTop: '8px', fontSize: '0.8rem', color: '#fbbf24', fontWeight: '600' }}>
              Comissão Ganha: R$ {top1.totalComissaoGanha.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
        )}

        {/* 3º LUGAR */}
        {top3 && (
          <div className="glass-panel" style={{
            padding: '24px',
            textAlign: 'center',
            background: 'linear-gradient(180deg, rgba(217, 119, 6, 0.15) 0%, rgba(18, 24, 38, 0.8) 100%)',
            border: '1px solid rgba(217, 119, 6, 0.3)',
            order: 2
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f97316, #c2410c)',
              margin: '0 auto 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(249, 115, 22, 0.4)'
            }}>
              <Award size={32} color="#fff" />
            </div>
            <span className="badge" style={{ background: 'rgba(249, 115, 22, 0.2)', color: '#fdba74', marginBottom: '8px' }}>
              3º LUGAR — BRONZE
            </span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: '4px 0' }}>{top3.nome}</h3>
            <div className="badge badge-code" style={{ marginBottom: '12px' }}>{top3.codigo}</div>
            
            <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#10b981' }}>
              R$ {top3.totalValorIndicado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {top3.totalVendasNum} indicações concluídas
            </div>
          </div>
        )}

      </div>

      {/* Tabela Completa do Ranking */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px' }}>Tabela Geral de Desempenho</h3>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Posição</th>
                <th>Técnico</th>
                <th>Código</th>
                <th>Nº Indicações</th>
                <th>Total Indicado (R$)</th>
                <th>Comissão Ganha (R$)</th>
                <th>Pendente (R$)</th>
                <th>Pago (R$)</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((tec, idx) => (
                <tr key={tec.id} style={{ background: idx === 0 ? 'rgba(245, 158, 11, 0.05)' : 'transparent' }}>
                  <td style={{ fontWeight: '800', fontSize: '1.1rem' }}>
                    {idx === 0 ? '🥇 1º' : idx === 1 ? '🥈 2º' : idx === 2 ? '🥉 3º' : `${idx + 1}º`}
                  </td>
                  <td style={{ fontWeight: '700', color: '#fff' }}>{tec.nome}</td>
                  <td><span className="badge badge-code">{tec.codigo}</span></td>
                  <td style={{ fontWeight: '700' }}>{tec.totalVendasNum}</td>
                  <td style={{ fontWeight: '700', color: '#10b981' }}>
                    R$ {tec.totalValorIndicado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ fontWeight: '700', color: '#818cf8' }}>
                    R$ {tec.totalComissaoGanha.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ color: 'var(--accent-warning)', fontWeight: '600' }}>
                    R$ {tec.comissaoPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ color: '#10b981', fontWeight: '600' }}>
                    R$ {tec.comissaoPaga.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
