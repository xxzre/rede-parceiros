import React, { useState } from 'react';
import { storeService } from '../services/store';
import { useAuth } from '../context/AuthContext';
import { 
  UserPlus, 
  Copy, 
  Check, 
  Link, 
  Percent, 
  Phone, 
  Mail, 
  Award, 
  Search, 
  MessageSquare,
  Calculator,
  TrendingUp,
  DollarSign
} from 'lucide-react';

export default function AdminTechnicians({ tecnicos, onUpdate }) {
  const { showToast, selecionarTecnicoParaDemonstracao } = useAuth();
  
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [comissaoPorcentagem, setComissaoPorcentagem] = useState(10);
  const [whatsapp, setWhatsapp] = useState('');
  const [filtroBusca, setFiltroBusca] = useState('');
  
  const [copiedId, setCopiedId] = useState(null);

  // Auto-gerar código ao digitar o nome (ex: JOAO01)
  const handleNomeChange = (val) => {
    setNome(val);
    if (val && !codigo) {
      const firstWord = val.trim().split(' ')[0].toUpperCase().replace(/[^A-Z0-9]/g, '');
      const randomNum = String(Math.floor(Math.random() * 90) + 10);
      setCodigo(`${firstWord}${randomNum}`);
    }
  };

  const handleCadastrar = (e) => {
    e.preventDefault();
    if (!nome || !codigo) {
      showToast('Preencha o Nome e o Código de indicação.', 'error');
      return;
    }

    try {
      const novo = storeService.cadastrarTecnico({
        nome,
        email,
        codigo,
        comissaoPorcentagem,
        whatsapp
      });

      showToast(`Técnico ${novo.nome} (${novo.codigo}) cadastrado com sucesso!`);
      
      setNome('');
      setEmail('');
      setCodigo('');
      setComissaoPorcentagem(10);
      setWhatsapp('');
      onUpdate();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const copiarLinkConvite = (codigoTec, id) => {
    const inviteUrl = `${window.location.origin}${window.location.pathname}?convite=${codigoTec}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedId(id);
    showToast(`Link de convite para ${codigoTec} copiado!`);
    setTimeout(() => setCopiedId(null), 3000);
  };

  // Vendas acumuladas para calcular estatísticas por técnico
  const vendas = storeService.getVendas();

  const tecnicosFiltrados = tecnicos.filter(t => 
    t.nome.toLowerCase().includes(filtroBusca.toLowerCase()) ||
    t.codigo.toLowerCase().includes(filtroBusca.toLowerCase()) ||
    t.email.toLowerCase().includes(filtroBusca.toLowerCase())
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
      
      {/* Formulário de Cadastro */}
      <div className="glass-panel" style={{ padding: '24px', gridColumn: 'span 1' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ padding: '8px', background: 'rgba(99, 102, 241, 0.15)', borderRadius: '10px', color: 'var(--primary)' }}>
            <UserPlus size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Cadastrar Novo Técnico</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Gere um código único e defina a comissão %</p>
          </div>
        </div>

        <form onSubmit={handleCadastrar}>
          <div className="form-group">
            <label className="form-label">Nome Completo *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ex: João da Silva"
              value={nome}
              onChange={(e) => handleNomeChange(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Código Único (ex: JOAO01) *</label>
              <input
                type="text"
                className="form-input"
                placeholder="JOAO01"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                style={{ fontFamily: 'monospace', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '1px' }}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Comissão (% Individual) *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max="100"
                  className="form-input"
                  value={comissaoPorcentagem}
                  onChange={(e) => setComissaoPorcentagem(e.target.value)}
                  required
                />
                <Percent size={14} style={{ position: 'absolute', right: '12px', top: '13px', color: 'var(--text-muted)' }} />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">E-mail do Técnico</label>
            <input
              type="email"
              className="form-input"
              placeholder="tecnico@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">WhatsApp (com DDD)</label>
            <input
              type="text"
              className="form-input"
              placeholder="(11) 99999-8888"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
            <UserPlus size={16} /> Cadastrar & Gerar Convite
          </button>
        </form>
      </div>

      {/* Lista de Técnicos Cadastrados com Métricas Individuais */}
      <div className="glass-panel" style={{ padding: '24px', gridColumn: 'span 2' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Técnicos da Rede ({tecnicos.length})</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Gerencie permissões, links de convite e acompanhe resultados</p>
          </div>

          <div style={{ position: 'relative', minWidth: '220px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Buscar por nome ou código..."
              value={filtroBusca}
              onChange={(e) => setFiltroBusca(e.target.value)}
              style={{ paddingLeft: '32px', fontSize: '0.85rem' }}
            />
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-muted)' }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '520px', overflowY: 'auto', paddingRight: '4px' }}>
          {tecnicosFiltrados.map((t) => {
            const vendasTecnico = vendas.filter(v => v.tecnicoCodigo === t.codigo);
            const totalFaturado = vendasTecnico.reduce((acc, v) => acc + v.valor, 0);
            const totalComissao = vendasTecnico.reduce((acc, v) => acc + v.comissaoValor, 0);
            const cleanWhatsapp = t.whatsapp ? t.whatsapp.replace(/[^0-9]/g, '') : '';

            return (
              <div
                key={t.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '14px',
                  padding: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ flex: 1, minWidth: '220px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: '800', fontSize: '1.05rem', color: '#fff' }}>{t.nome}</span>
                    <span className="badge badge-code">{t.codigo}</span>
                    <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
                      {t.comissaoPorcentagem}% comissão
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                    {t.email && <span><Mail size={12} inline /> {t.email}</span>}
                    {t.whatsapp && <span><Phone size={12} inline /> {t.whatsapp}</span>}
                  </div>

                  {/* Badges de estatísticas individuais */}
                  <div style={{ display: 'flex', gap: '12px', marginTop: '10px', fontSize: '0.8rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '4px 10px', borderRadius: '6px' }}>
                      Indicado: <strong style={{ color: '#10b981' }}>R$ {totalFaturado.toLocaleString('pt-BR')}</strong>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '4px 10px', borderRadius: '6px' }}>
                      Comissão: <strong style={{ color: '#818cf8' }}>R$ {totalComissao.toLocaleString('pt-BR')}</strong>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '4px 10px', borderRadius: '6px' }}>
                      Vendas: <strong style={{ color: '#fff' }}>{vendasTecnico.length}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  {cleanWhatsapp && (
                    <a
                      href={`https://wa.me/55${cleanWhatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                      style={{ color: '#25D366' }}
                      title="Enviar mensagem via WhatsApp"
                    >
                      <MessageSquare size={14} /> WhatsApp
                    </a>
                  )}

                  <button
                    onClick={() => copiarLinkConvite(t.codigo, t.id)}
                    className="btn btn-secondary btn-sm"
                  >
                    {copiedId === t.id ? <Check size={14} color="#10b981" /> : <Link size={14} />}
                    {copiedId === t.id ? 'Copiado!' : 'Copiar Convite'}
                  </button>

                  <button
                    onClick={() => selecionarTecnicoParaDemonstracao(t.id)}
                    className="btn btn-sm"
                    style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.3)' }}
                  >
                    Painel
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
