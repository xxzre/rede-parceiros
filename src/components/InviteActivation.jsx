import React, { useState } from 'react';
import { storeService } from '../services/store';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Key, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export default function InviteActivation({ conviteCodigo, onActivated }) {
  const { loginTecnicoPorCodigo, showToast } = useAuth();
  
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');

  const tecnico = storeService.getTecnicoPorCodigo(conviteCodigo);

  const handleAtivar = (e) => {
    e.preventDefault();

    if (!senha || senha.length < 4) {
      showToast('Crie uma senha de pelo menos 4 caracteres.', 'error');
      return;
    }

    if (senha !== confirmSenha) {
      showToast('As senhas não coincidem.', 'error');
      return;
    }

    if (tecnico) {
      // Vincula o UID/Status do técnico no store
      const uidSimulado = `uid_${tecnico.codigo.toLowerCase()}_${Date.now()}`;
      storeService.vincularUidTecnico(tecnico.codigo, uidSimulado);
      
      loginTecnicoPorCodigo(tecnico.codigo);
      showToast(`Conta ativada com sucesso! Bem-vindo(a), ${tecnico.nome}.`);
      if (onActivated) onActivated();
    }
  };

  if (!tecnico) {
    return (
      <div className="glass-panel" style={{ padding: '40px 24px', textAlign: 'center', maxWidth: '500px', margin: '40px auto' }}>
        <AlertCircle size={48} color="#ef4444" style={{ margin: '0 auto 16px' }} />
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '8px' }}>Convite Inválido ou Expirado</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
          O código <strong>"{conviteCodigo}"</strong> não foi encontrado na base de técnicos cadastrados.
        </p>
        <button onClick={() => window.location.href = window.location.pathname} className="btn btn-secondary">
          Voltar ao Início
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '520px', margin: '40px auto' }}>
      <div className="glass-panel" style={{ padding: '36px 28px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span className="badge badge-paid" style={{ marginBottom: '12px' }}>
            <CheckCircle2 size={12} /> CONVITE VÁLIDO
          </span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', marginTop: '6px' }}>Ativação de Conta de Parceiro</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Você foi convidado pela administração para a <strong>Rede Parceiros</strong>!
          </p>
        </div>

        {/* Card do Técnico */}
        <div style={{
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontWeight: '700', color: '#fff', fontSize: '1.05rem' }}>{tecnico.nome}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{tecnico.email || 'E-mail cadastrado pelo admin'}</div>
          </div>
          <span className="badge badge-code" style={{ fontSize: '1rem', padding: '6px 12px' }}>
            {tecnico.codigo}
          </span>
        </div>

        <form onSubmit={handleAtivar}>
          <div className="form-group">
            <label className="form-label">Crie sua Senha de Acesso *</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
              <Key size={16} style={{ position: 'absolute', right: '12px', top: '12px', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirme sua Senha *</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={confirmSenha}
              onChange={(e) => setConfirmSenha(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '1rem', marginTop: '10px' }}>
            Ativar Minha Conta & Acessar Painel <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
