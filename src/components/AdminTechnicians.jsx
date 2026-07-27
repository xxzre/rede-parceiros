import React, { useState } from 'react';
import { storeService } from '../services/store';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Copy, Check, Link, Percent, Phone, Mail, Award, Trash2 } from 'lucide-react';

export default function AdminTechnicians({ tecnicos, onUpdate }) {
  const { showToast, selecionarTecnicoParaDemonstracao } = useAuth();
  
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [comissaoPorcentagem, setComissaoPorcentagem] = useState(10);
  const [whatsapp, setWhatsapp] = useState('');
  
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
      
      // Limpar formulário
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

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
      
      {/* Formulário de Cadastro */}
      <div className="glass-panel" style={{ padding: '24px' }}>
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
            <label className="form-label">Nome Completo do Técnico *</label>
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
            <label className="form-label">E-mail para Login/Notificação</label>
            <input
              type="email"
              className="form-input"
              placeholder="tecnico@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">WhatsApp (para contato rápido)</label>
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

      {/* Lista de Técnicos Cadastrados */}
      <div className="glass-panel" style={{ padding: '24px', gridColumn: 'span 1' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Técnicos da Rede ({tecnicos.length})</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Copie o link de convite e envie ao técnico</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '500px', overflowY: 'auto', paddingRight: '4px' }}>
          {tecnicos.map((t) => (
            <div
              key={t.id}
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ flex: 1, minWidth: '180px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: '700', fontSize: '1rem', color: '#fff' }}>{t.nome}</span>
                  <span className="badge badge-code">{t.codigo}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span><Percent size={12} inline /> {t.comissaoPorcentagem}% comissão</span>
                  {t.whatsapp && <span><Phone size={12} inline /> {t.whatsapp}</span>}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => copiarLinkConvite(t.codigo, t.id)}
                  className="btn btn-secondary btn-sm"
                  title="Copiar Link de Convite"
                >
                  {copiedId === t.id ? <Check size={14} color="#10b981" /> : <Link size={14} />}
                  {copiedId === t.id ? 'Copiado!' : 'Copiar Link'}
                </button>

                <button
                  onClick={() => selecionarTecnicoParaDemonstracao(t.id)}
                  className="btn btn-sm"
                  style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.3)' }}
                  title="Simular visualização como este técnico"
                >
                  Ver Painel
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
