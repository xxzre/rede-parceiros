import React from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  Users, 
  ShoppingBag, 
  Percent, 
  ArrowUpRight, 
  Activity,
  Award,
  Zap
} from 'lucide-react';

export default function AdminOverview({ tecnicos, vendas, ranking, solicitacoes, onNavigateTab }) {
  
  // Métricas Globais
  const totalFaturado = vendas.reduce((acc, v) => acc + v.valor, 0);
  const totalComissoes = vendas.reduce((acc, v) => acc + v.comissaoValor, 0);
  const comissoesPendentes = vendas.filter(v => v.status === 'pendente').reduce((acc, v) => acc + v.comissaoValor, 0);
  const comissoesPagas = vendas.filter(v => v.status === 'pago').reduce((acc, v) => acc + v.comissaoValor, 0);
  const ticketMedio = vendas.length > 0 ? (totalFaturado / vendas.length).toFixed(2) : 0;
  const porcentagemPaga = totalComissoes > 0 ? Math.round((comissoesPagas / totalComissoes) * 100) : 0;

  // Atividades Recentes Sintetizadas
  const ultimasVendas = vendas.slice(0, 4);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Banner de Boas-Vindas Executivo */}
      <div className="glass-panel" style={{
        padding: '28px 32px',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.1) 50%, rgba(18, 24, 38, 0.8) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span className="badge badge-paid" style={{ fontSize: '0.8rem' }}>
              <Zap size={12} /> PAINEL DE CONTROLE EXECUTIVO
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Rede Parceiros V1.0
            </span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff', tracking: '-0.5px' }}>
            Visão Geral e Performance da Rede
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Acompanhe o faturamento total, taxas de repasse, volume de indicações e métricas dos técnicos em um só lugar.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => onNavigateTab('vendas')} className="btn btn-primary">
            <ShoppingBag size={16} /> Nova Venda
          </button>
          <button onClick={() => onNavigateTab('tecnicos')} className="btn btn-secondary">
            <Users size={16} /> Add Técnico
          </button>
        </div>
      </div>

      {/* Grid de Cards KPIs de Alto Nível */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        
        {/* TOTAL FATURADO */}
        <div className="glass-panel" style={{ padding: '22px', borderLeft: '4px solid #6366f1' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#818cf8', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Faturado</span>
            <TrendingUp size={20} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#fff' }}>
            R$ {totalFaturado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowUpRight size={14} color="#10b981" />
            <span>Gerado por <strong>{vendas.length}</strong> indicações</span>
          </div>
        </div>

        {/* COMISSÕES GERAIS */}
        <div className="glass-panel" style={{ padding: '22px', borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#a78bfa', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Comissões Geradas</span>
            <DollarSign size={20} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#fff' }}>
            R$ {totalComissoes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Média de comissão: <strong>{vendas.length > 0 ? ((totalComissoes / totalFaturado) * 100).toFixed(1) : 0}%</strong>
          </div>
        </div>

        {/* COMISSÃO PENDENTE */}
        <div className="glass-panel" style={{ padding: '22px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#f59e0b', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>A Pagar (Pendente)</span>
            <Clock size={20} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#f59e0b' }}>
            R$ {comissoesPendentes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            {vendas.filter(v => v.status === 'pendente').length} lançamentos pendentes
          </div>
        </div>

        {/* COMISSÃO PAGA */}
        <div className="glass-panel" style={{ padding: '22px', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#10b981', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Comissões Pagas</span>
            <CheckCircle2 size={20} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#10b981' }}>
            R$ {comissoesPagas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '6px', fontWeight: '600' }}>
            {porcentagemPaga}% do total liquidado
          </div>
        </div>

        {/* TICKET MÉDIO */}
        <div className="glass-panel" style={{ padding: '22px', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#60a5fa', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ticket Médio</span>
            <ShoppingBag size={20} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#fff' }}>
            R$ {Number(ticketMedio).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Valor médio por venda indicada
          </div>
        </div>

      </div>

      {/* Seção Gráfica e Analítica de Desempenho dos Técnicos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        
        {/* Gráfico de Barras de Faturamento por Técnico */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyBetween: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff' }}>Faturamento por Técnico (R$)</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Volume total de vendas gerado por cada parceiro</p>
            </div>
            <Activity size={20} color="var(--primary)" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '220px', justifyContent: 'center' }}>
            {ranking.slice(0, 5).map((tec) => {
              const porcentagemLargura = totalFaturado > 0 ? Math.max((tec.totalValorIndicado / totalFaturado) * 100, 8) : 0;
              return (
                <div key={tec.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ fontWeight: '700', color: '#fff' }}>
                      {tec.nome} <span className="badge badge-code" style={{ fontSize: '0.75rem' }}>{tec.codigo}</span>
                    </span>
                    <span style={{ fontWeight: '800', color: '#10b981' }}>
                      R$ {tec.totalValorIndicado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div style={{ width: '100%', height: '10px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '6px', overflow: 'hidden', position: 'relative' }}>
                    <div style={{
                      width: `${porcentagemLargura}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #6366f1, #10b981)',
                      borderRadius: '6px',
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card de Liquidação e Distribuição de Status de Comissões */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyBetween: 'space-between' }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff' }}>Status de Liquidação da Rede</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Proporção de comissões pagas vs pendentes de repasse</p>
          </div>

          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '110px',
              height: '110px',
              borderRadius: '50%',
              background: `conic-gradient(#10b981 0% ${porcentagemPaga}%, rgba(245, 158, 11, 0.4) ${porcentagemPaga}% 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
              position: 'relative'
            }}>
              <div style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                background: '#0b0f19',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '1.4rem', fontWeight: '900', color: '#fff' }}>{porcentagemPaga}%</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>PAGO</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', width: '100%', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
                <span>Pagas: <strong>R$ {comissoesPagas.toLocaleString('pt-BR')}</strong></span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
                <span>Pendentes: <strong>R$ {comissoesPendentes.toLocaleString('pt-BR')}</strong></span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Feed de Atividades Recentes e Solicitações de Novos Parceiros */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff' }}>Últimas Vendas Indicadas Registradas</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Lançamentos mais recentes efetuados pela administração</p>
          </div>
          <button onClick={() => onNavigateTab('vendas')} className="btn btn-secondary btn-sm">
            Ver Todas ({vendas.length})
          </button>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Técnico</th>
                <th>Cliente / Produto</th>
                <th>Valor Venda</th>
                <th>Comissão R$</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {ultimasVendas.map((v) => (
                <tr key={v.id}>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {new Date(v.data).toLocaleDateString('pt-BR')}
                  </td>
                  <td>
                    <div style={{ fontWeight: '700', color: '#fff' }}>{v.tecnicoNome}</div>
                    <span className="badge badge-code">{v.tecnicoCodigo}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: '600' }}>{v.cliente}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{v.produto}</div>
                  </td>
                  <td style={{ fontWeight: '600' }}>R$ {v.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td style={{ fontWeight: '700', color: '#10b981' }}>
                    R$ {v.comissaoValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td>
                    <span className={`badge ${v.status === 'pago' ? 'badge-paid' : 'badge-pending'}`}>
                      {v.status === 'pago' ? 'PAGO' : 'PENDENTE'}
                    </span>
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
