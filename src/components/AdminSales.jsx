import React, { useState } from 'react';
import { storeService } from '../services/store';
import { useAuth } from '../context/AuthContext';
import { 
  ShoppingBag, 
  DollarSign, 
  Calculator, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Search, 
  Download, 
  FileText, 
  Filter, 
  Printer, 
  CheckSquare, 
  X
} from 'lucide-react';

export default function AdminSales({ tecnicos, vendas, onUpdate }) {
  const { showToast } = useAuth();

  // Estado do formulário de inserção
  const [tecnicoCodigo, setTecnicoCodigo] = useState(tecnicos[0]?.codigo || '');
  const [cliente, setCliente] = useState('');
  const [produto, setProduto] = useState('');
  const [valor, setValor] = useState('');
  const [status, setStatus] = useState('pendente');

  // Estados de Filtros Avançados
  const [filtroBusca, setFiltroBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos'); // 'todos' | 'pendente' | 'pago'
  const [filtroTecnico, setFiltroTecnico] = useState('todos');

  // Estados de Ações em Lote (Batch Actions)
  const [selectedIds, setSelectedIds] = useState([]);

  // Estado do Modal de Comprovante de Pagamento
  const [comprovanteVenda, setComprovanteVenda] = useState(null);

  // Cálculo dinâmico em tempo real para o formulário
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

      showToast(`Venda de R$ ${novaVenda.valor.toLocaleString('pt-BR')} registrada com R$ ${novaVenda.comissaoValor.toLocaleString('pt-BR')} de comissão!`);

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
    if (window.confirm('Tem certeza que deseja excluir esta venda?')) {
      storeService.excluirVenda(vendaId);
      showToast('Registro de venda excluído.');
      onUpdate();
    }
  };

  // Seleção e Ações em Lote
  const handleToggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(vendasFiltradas.map(v => v.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelectRow = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleMarcarSelecionadosComoPago = () => {
    if (selectedIds.length === 0) return;
    selectedIds.forEach(id => {
      storeService.alterarStatusVenda(id, 'pago');
    });
    showToast(`${selectedIds.length} comissões foram marcadas como PAGAS!`);
    setSelectedIds([]);
    onUpdate();
  };

  // Exportar Relatório em CSV
  const handleExportCSV = () => {
    if (vendas.length === 0) return;
    
    let csv = 'Data,Tecnico,Codigo,Cliente,Produto,ValorVenda,ComissaoPorcentagem,ComissaoValor,Status\n';
    vendas.forEach(v => {
      csv += `"${v.data}","${v.tecnicoNome}","${v.tecnicoCodigo}","${v.cliente}","${v.produto}",${v.valor},${v.comissaoPorcentagem},${v.comissaoValor},"${v.status}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_comissoes_rede_parceiros_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showToast('Relatório CSV exportado com sucesso!');
  };

  // Aplicação dos Filtros Combinados
  const vendasFiltradas = vendas.filter(v => {
    const matchBusca = 
      v.cliente.toLowerCase().includes(filtroBusca.toLowerCase()) ||
      v.tecnicoNome.toLowerCase().includes(filtroBusca.toLowerCase()) ||
      v.tecnicoCodigo.toLowerCase().includes(filtroBusca.toLowerCase()) ||
      v.produto.toLowerCase().includes(filtroBusca.toLowerCase());

    const matchStatus = filtroStatus === 'todos' || v.status === filtroStatus;
    const matchTecnico = filtroTecnico === 'todos' || v.tecnicoCodigo === filtroTecnico;

    return matchBusca && matchStatus && matchTecnico;
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
      
      {/* Formulário de Registro de Venda (Apenas Admin) */}
      <div className="glass-panel" style={{ padding: '24px', gridColumn: 'span 1' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ padding: '8px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '10px', color: '#10b981' }}>
            <ShoppingBag size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Registrar Venda Indicada</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Comissão calculada automaticamente (% do técnico)</p>
          </div>
        </div>

        <form onSubmit={handleRegistrarVenda}>
          <div className="form-group">
            <label className="form-label">Técnico Indicador *</label>
            <select
              className="form-select"
              value={tecnicoCodigo}
              onChange={(e) => setTecnicoCodigo(e.target.value)}
              required
            >
              {tecnicos.map(t => (
                <option key={t.id} value={t.codigo}>
                  {t.nome} ({t.codigo}) — {t.comissaoPorcentagem}% comissão
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Cliente Adquirente *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ex: Oficina Mecânica Silva"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Produto ou Serviço *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ex: Treinamento Injeção Eletrônica"
              value={produto}
              onChange={(e) => setProduto(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Valor (R$) *</label>
              <input
                type="number"
                step="0.01"
                min="1"
                className="form-input"
                placeholder="1500.00"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status Inicial</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="pendente">⏳ Pendente</option>
                <option value="pago">✅ Pago</option>
              </select>
            </div>
          </div>

          {/* Card de Cálculo Automático */}
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
              <span>Comissão ({porcentagemAtual}%):</span>
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#10b981' }}>
              R$ {Number(comissaoCalculada).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>

          <button type="submit" className="btn btn-success" style={{ width: '100%' }}>
            <DollarSign size={16} /> Registrar Venda & Atribuir Comissão
          </button>
        </form>
      </div>

      {/* Painel Avançado de Histórico e Ações em Lote */}
      <div className="glass-panel" style={{ padding: '24px', gridColumn: 'span 2' }}>
        
        {/* Cabeçalho e Botão de Exportar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Gestão Avançada de Indicações</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Filtre por técnico, liquide comissões em lote e emita comprovantes</p>
          </div>

          <button onClick={handleExportCSV} className="btn btn-secondary btn-sm">
            <Download size={14} /> Exportar CSV
          </button>
        </div>

        {/* Barra de Filtros Avançados */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          marginBottom: '20px',
          background: 'rgba(15, 23, 42, 0.6)',
          padding: '12px',
          borderRadius: '12px',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Buscar por cliente, produto..."
              value={filtroBusca}
              onChange={(e) => setFiltroBusca(e.target.value)}
              style={{ paddingLeft: '32px', fontSize: '0.85rem' }}
            />
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-muted)' }} />
          </div>

          <div>
            <select
              className="form-select"
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              style={{ fontSize: '0.85rem' }}
            >
              <option value="todos">Todos os Status</option>
              <option value="pendente">⏳ Apenas Pendentes</option>
              <option value="pago">✅ Apenas Pagas</option>
            </select>
          </div>

          <div>
            <select
              className="form-select"
              value={filtroTecnico}
              onChange={(e) => setFiltroTecnico(e.target.value)}
              style={{ fontSize: '0.85rem' }}
            >
              <option value="todos">Todos os Técnicos</option>
              {tecnicos.map(t => (
                <option key={t.id} value={t.codigo}>{t.nome} ({t.codigo})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Barra de Ações em Lote quando há selecionados */}
        {selectedIds.length > 0 && (
          <div style={{
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '10px',
            padding: '10px 16px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            animation: 'fadeIn 0.2s ease'
          }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#a5b4fc' }}>
              <CheckSquare size={14} inline /> {selectedIds.length} vendas selecionadas
            </span>

            <button onClick={handleMarcarSelecionadosComoPago} className="btn btn-success btn-sm">
              <CheckCircle2 size={14} /> Marcar Selecionadas como PAGO
            </button>
          </div>
        )}

        {/* Tabela de Vendas */}
        <div className="table-container" style={{ maxHeight: '460px', overflowY: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <input
                    type="checkbox"
                    onChange={handleToggleSelectAll}
                    checked={selectedIds.length > 0 && selectedIds.length === vendasFiltradas.length}
                  />
                </th>
                <th>Técnico / Código</th>
                <th>Cliente / Produto</th>
                <th>Valor Venda</th>
                <th>Comissão (R$)</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {vendasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px' }}>
                    Nenhuma venda encontrada com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                vendasFiltradas.map((v) => (
                  <tr key={v.id} style={{ background: selectedIds.includes(v.id) ? 'rgba(99, 102, 241, 0.08)' : 'transparent' }}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(v.id)}
                        onChange={() => handleToggleSelectRow(v.id)}
                      />
                    </td>
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
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => setComprovanteVenda(v)}
                          className="btn btn-secondary btn-sm"
                          title="Gerar Recibo de Repasse"
                        >
                          <FileText size={14} />
                        </button>
                        <button
                          onClick={() => handleExcluirVenda(v.id)}
                          className="btn btn-secondary btn-sm"
                          style={{ color: '#ef4444' }}
                          title="Excluir Venda"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Comprovante de Pagamento de Comissão */}
      {comprovanteVenda && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="glass-panel animate-fade" style={{ width: '100%', maxWidth: '520px', padding: '30px', background: '#0f172a', border: '1px solid var(--border-color)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Recibo de Repasse de Comissão</h3>
              <button onClick={() => setComprovanteVenda(null)} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', border: '1px border var(--border-color)', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px dashed var(--border-color)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Beneficiário (Técnico):</span>
                <strong>{comprovanteVenda.tecnicoNome} ({comprovanteVenda.tecnicoCodigo})</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px dashed var(--border-color)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Cliente / Aquisição:</span>
                <strong>{comprovanteVenda.cliente}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px dashed var(--border-color)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Valor Bruto da Venda:</span>
                <strong>R$ {comprovanteVenda.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px dashed var(--border-color)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Percentual Acordado:</span>
                <strong>{comprovanteVenda.comissaoPorcentagem}%</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', fontSize: '1.2rem' }}>
                <span style={{ fontWeight: '700', color: '#fff' }}>Valor do Repasse:</span>
                <strong style={{ color: '#10b981' }}>R$ {comprovanteVenda.comissaoValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => window.print()} className="btn btn-primary" style={{ flex: 1 }}>
                <Printer size={16} /> Imprimir Recibo
              </button>
              <button onClick={() => setComprovanteVenda(null)} className="btn btn-secondary">
                Fechar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
