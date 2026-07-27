import React, { useState } from 'react';
import { storeService } from '../services/store';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, DollarSign, Calculator, CheckCircle2, Clock, Trash2, Tag, Search } from 'lucide-react';

export default function AdminSales({ tecnicos, vendas, onUpdate }) {
  const { showToast } = useAuth();

  const [tecnicoCodigo, setTecnicoCodigo] = useState(tecnicos[0]?.codigo || '');
  const [cliente, setCliente] = useState('');
  const [produto, setProduto] = useState('');
  const [valor, setValor] = useState('');
  const [status, setStatus] = useState('pendente');
  const [filtroBusca, setFiltroBusca] = useState('');

  // Encontra o técnico selecionado para mostrar o % e o cálculo em tempo real!
  const tecnicoSelecionado = tecnicos.find(t => t.codigo === tecnicoCodigo) || tecnicos[0];
  const porcentagemAtual = tecnicoSelecionado ? tecnicoSelecionado.comissaoPorcentagem : 10;
  
  const valorNum = parseFloat(valor) || 0;
  const comissaoCalculada = (valorNum * (porcentagemAtual / 100)).toFixed(2);

  const handleRegistrarVenda = (e) => {
    e.preventDefault();
    if (!tecnicoCodigo || !cliente || !produto || !valor) {
      showToast('Preencha todos os campos obrigatórios da venda.', 'error');
      return;
    }

    try {
      const novaVenda = storeService.registrarVenda({
        tecnicoCodigo,
        cliente,
        produto,
        valor,
        status
      });

      showToast(`Venda registrada! Comissão de R$ ${novaVenda.comissaoValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} atribuída a ${novaVenda.tecnicoNome}.`);

      setCliente('');
      setProduto('');
      setValor('');
      setStatus('pendente');
      onUpdate();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleAlternarStatus = (vendaId, statusAtual) => {
    const novoStatus = statusAtual === 'pendente' ? 'pago' : 'pendente';
    storeService.alterarStatusVenda(vendaId, novoStatus);
    showToast(`Status da comissão alterado para ${novoStatus.toUpperCase()}!`);
    onUpdate();
  };

  const handleExcluirVenda = (vendaId) => {
    if (window.confirm('Tem certeza que deseja excluir este registro de venda?')) {
      storeService.excluirVenda(vendaId);
      showToast('Registro de venda excluído.');
      onUpdate();
    }
  };

  const vendasFiltradas = vendas.filter(v => 
    v.cliente.toLowerCase().includes(filtroBusca.toLowerCase()) ||
    v.tecnicoNome.toLowerCase().includes(filtroBusca.toLowerCase()) ||
    v.tecnicoCodigo.toLowerCase().includes(filtroBusca.toLowerCase()) ||
    v.produto.toLowerCase().includes(filtroBusca.toLowerCase())
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
      
      {/* Formulário de Registro de Venda (Apenas Admin) */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ padding: '8px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '10px', color: '#10b981' }}>
            <ShoppingBag size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Registrar Venda Indicada</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>A comissão é calculada automaticamente (% do técnico)</p>
          </div>
        </div>

        <form onSubmit={handleRegistrarVenda}>
          <div className="form-group">
            <label className="form-label">Técnico / Parceiro Indicador *</label>
            <select
              className="form-select"
              value={tecnicoCodigo}
              onChange={(e) => setTecnicoCodigo(e.target.value)}
              required
            >
              {tecnicos.map(t => (
                <option key={t.id} value={t.codigo}>
                  {t.nome} ({t.codigo}) — Comissão: {t.comissaoPorcentagem}%
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Nome do Cliente Adquirente *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ex: Assistência Técnica Express"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Produto / Serviço Vendido *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ex: Curso de Solda BGA / Licença Software"
              value={produto}
              onChange={(e) => setProduto(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Valor Total (R$) *</label>
              <input
                type="number"
                step="0.01"
                min="1"
                className="form-input"
                placeholder="1000.00"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status da Comissão</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="pendente">⏳ Pendente</option>
                <option value="pago">✅ Pago ao Técnico</option>
              </select>
            </div>
          </div>

          {/* Card de Pré-Visualização do Cálculo Automático */}
          <div style={{
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '12px',
            padding: '14px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#a5b4fc' }}>
              <Calculator size={16} />
              <span>Comissão Automática ({porcentagemAtual}%):</span>
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#10b981' }}>
              R$ {Number(comissaoCalculada).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>

          <button type="submit" className="btn btn-success" style={{ width: '100%' }}>
            <DollarSign size={16} /> Confirmar & Registrar Venda
          </button>
        </form>
      </div>

      {/* Tabela de Vendas Registradas */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Histórico de Vendas Indicadas</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Gerencie o pagamento de comissões aos técnicos</p>
          </div>

          <div style={{ position: 'relative', minWidth: '200px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Buscar por cliente, técnico..."
              value={filtroBusca}
              onChange={(e) => setFiltroBusca(e.target.value)}
              style={{ paddingLeft: '32px', fontSize: '0.85rem' }}
            />
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-muted)' }} />
          </div>
        </div>

        <div className="table-container" style={{ maxHeight: '480px', overflowY: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Técnico / Código</th>
                <th>Cliente / Produto</th>
                <th>Valor Venda</th>
                <th>Comissão (R$)</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Ação</th>
              </tr>
            </thead>
            <tbody>
              {vendasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px' }}>
                    Nenhuma venda encontrada.
                  </td>
                </tr>
              ) : (
                vendasFiltradas.map((v) => (
                  <tr key={v.id}>
                    <td>
                      <div style={{ fontWeight: '700', color: '#fff' }}>{v.tecnicoNome}</div>
                      <span className="badge badge-code">{v.tecnicoCodigo}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: '600' }}>{v.cliente}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{v.produto}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: '600' }}>R$ {v.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: '700', color: '#10b981' }}>
                        R$ {v.comissaoValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: '4px' }}>({v.comissaoPorcentagem}%)</span>
                      </div>
                    </td>
                    <td>
                      <button
                        onClick={() => handleAlternarStatus(v.id, v.status)}
                        className={`badge ${v.status === 'pago' ? 'badge-paid' : 'badge-pending'}`}
                        style={{ border: 'none', cursor: 'pointer' }}
                        title="Clique para alternar o status de pagamento"
                      >
                        {v.status === 'pago' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                        {v.status === 'pago' ? 'PAGO' : 'PENDENTE'}
                      </button>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => handleExcluirVenda(v.id)}
                        className="btn btn-secondary btn-sm"
                        style={{ color: '#ef4444' }}
                        title="Excluir Venda"
                      >
                        <Trash2 size={14} />
                      </button>
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
