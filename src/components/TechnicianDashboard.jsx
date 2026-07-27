import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { storeService } from '../services/store';
import { 
  UserCheck, 
  Copy, 
  Check, 
  Clock, 
  CheckCircle2, 
  DollarSign, 
  TrendingUp, 
  ShoppingBag, 
  Share2, 
  Lock,
  Percent,
  Sparkles
} from 'lucide-react';

export default function TechnicianDashboard({ tecnicos }) {
  const { currentTecnico, selecionarTecnicoParaDemonstracao, showToast } = useAuth();
  
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Se nenhum técnico estiver selecionado, pega o primeiro para demonstração
  const tecnicoAtivo = currentTecnico || tecnicos[0];

  if (!tecnicoAtivo) {
    return (
      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
        Nenhum técnico cadastrado ainda no sistema.
      </div>
    );
  }

  // Busca as vendas restritas estritamente a este código de técnico
  const minhasVendas = storeService.getVendasDoTecnico(tecnicoAtivo.codigo);

  const totalIndicado = minhasVendas.reduce((acc, v) => acc + v.valor, 0);
  const totalComissaoGanha = minhasVendas.reduce((acc, v) => acc + v.comissaoValor, 0);
  const comissaoPendente = minhasVendas.filter(v => v.status === 'pendente').reduce((acc, v) => acc + v.comissaoValor, 0);
  const comissaoPaga = minhasVendas.filter(v => v.status === 'pago').reduce((acc, v) => acc + v.comissaoValor, 0);

  const copiarCodigo = () => {
    navigator.clipboard.writeText(tecnicoAtivo.codigo);
    setCopiedCode(true);
    showToast(`Código ${tecnicoAtivo.codigo} copiado!`);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const copiarLinkCliente = () => {
    const link = `${window.location.origin}${window.location.pathname}?ref=${tecnicoAtivo.codigo}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    showToast(`Seu link de indicação foi copiado! Envie aos seus clientes.`);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Selector de Perfil do Técnico para Demonstração */}
      <div className="glass-panel" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <Lock size={16} color="#10b981" />
          <span>Visão Restrita do Técnico: <strong>{tecnicoAtivo.nome}</strong></span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Alternar Perfil:</span>
          <select
            className="form-select"
            value={tecnicoAtivo.id}
            onChange={(e) => selecionarTecnicoParaDemonstracao(e.target.value)}
            style={{ padding: '6px 12px', fontSize: '0.85rem', width: 'auto' }}
          >
            {tecnicos.map(t => (
              <option key={t.id} value={t.id}>
                {t.nome} ({t.codigo})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Card Principal do Técnico com Seu Código & Links */}
      <div className="glass-panel" style={{
        padding: '30px',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(18, 24, 38, 0.85) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '24px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
              CONTA ATIVA
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Sua Taxa de Comissão: <strong style={{ color: '#fff' }}>{tecnicoAtivo.comissaoPorcentagem}%</strong>
            </span>
          </div>

          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', margin: '4px 0', color: '#fff' }}>
            Olá, {tecnicoAtivo.nome}! 👋
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Acompanhe em tempo real suas indicações, comissões pendentes e valores já pagos.
          </p>
        </div>

        {/* Bloco do Código Único */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px border var(--border-color)',
          borderRadius: '16px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          minWidth: '280px'
        }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Seu Código de Indicação
          </span>

          <div style={{
            fontSize: '1.8rem',
            fontWeight: '900',
            fontFamily: 'monospace',
            color: '#818cf8',
            letterSpacing: '2px',
            background: 'rgba(99, 102, 241, 0.15)',
            padding: '6px 20px',
            borderRadius: '10px',
            border: '1px dashed rgba(99, 102, 241, 0.5)'
          }}>
            {tecnicoAtivo.codigo}
          </div>

          <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
            <button onClick={copiarCodigo} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
              {copiedCode ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              {copiedCode ? 'Copiado!' : 'Copiar Código'}
            </button>

            <button onClick={copiarLinkCliente} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
              {copiedLink ? <Check size={14} /> : <Share2 size={14} />}
              {copiedLink ? 'Link Copiado!' : 'Copiar Link'}
            </button>
          </div>
        </div>

      </div>

      {/* Cards de Métricas e Saldos em Tempo Real */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        
        {/* COMISSÃO PENDENTE */}
        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#f59e0b', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' }}>Comissão Pendente</span>
            <Clock size={20} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#fff' }}>
            R$ {comissaoPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Aguardando repasse do admin
          </div>
        </div>

        {/* COMISSÃO PAGA */}
        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#10b981', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' }}>Comissão Paga</span>
            <CheckCircle2 size={20} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#fff' }}>
            R$ {comissaoPaga.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '4px' }}>
            Recebido na sua conta
          </div>
        </div>

        {/* TOTAL GANHO */}
        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #818cf8' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#818cf8', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' }}>Total Acumulado</span>
            <DollarSign size={20} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#fff' }}>
            R$ {totalComissaoGanha.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Soma de todas as indicações
          </div>
        </div>

        {/* TOTAL DE INDICAÇÕES */}
        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #a855f7' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#a855f7', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' }}>Vendas Concluídas</span>
            <ShoppingBag size={20} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#fff' }}>
            {minhasVendas.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Total de {R$ = totalIndicado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} indicados
          </div>
        </div>

      </div>

      {/* Tabela de Indicações do Próprio Técnico */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Minhas Indicações Registradas</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Registros autenticados e confirmados pela administração</p>
          </div>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Cliente Adquirente</th>
                <th>Produto / Serviço</th>
                <th>Valor da Venda</th>
                <th>Sua Comissão (%)</th>
                <th>Comissão A Receber</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {minhasVendas.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px' }}>
                    Você ainda não possui indicações registradas pelo admin. Compartilhe seu código <strong>{tecnicoAtivo.codigo}</strong>!
                  </td>
                </tr>
              ) : (
                minhasVendas.map((v) => (
                  <tr key={v.id}>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {new Date(v.data).toLocaleDateString('pt-BR')}
                    </td>
                    <td style={{ fontWeight: '700', color: '#fff' }}>{v.cliente}</td>
                    <td>{v.produto}</td>
                    <td style={{ fontWeight: '600' }}>R$ {v.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td><span className="badge badge-code">{v.comissaoPorcentagem}%</span></td>
                    <td style={{ fontWeight: '800', color: '#10b981' }}>
                      R$ {v.comissaoValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td>
                      <span className={`badge ${v.status === 'pago' ? 'badge-paid' : 'badge-pending'}`}>
                        {v.status === 'pago' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                        {v.status === 'pago' ? 'PAGO' : 'PENDENTE'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
