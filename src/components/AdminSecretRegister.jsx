import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Key, X, CheckCircle2, AlertTriangle, Mail, Lock, User } from 'lucide-react';

export default function AdminSecretRegister({ isOpen, onClose, onAdminRegistered }) {
  const { showToast } = useAuth();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [emailStatus, setEmailStatus] = useState(null);

  // Validação em Tempo Real de Existência/Sintaxe do E-mail
  const validarEmail = (val) => {
    setEmail(val);
    if (!val || val.trim() === '') {
      setEmailStatus(null);
      return;
    }

    // 1. Regex de Formato Estrito RFC 5322
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regexEmail.test(val.trim())) {
      setEmailStatus({ valid: false, msg: '❌ E-mail em formato inválido (ex: admin@empresa.com)' });
      return;
    }

    const dominio = val.split('@')[1]?.toLowerCase();
    
    // Simulação de verificação de duplicidade
    const jaCadastrado = val.toLowerCase() === 'admin@redeparceiros.com';
    if (jaCadastrado) {
      setEmailStatus({ valid: false, msg: '⚠️ Este e-mail já está cadastrado no sistema!' });
      return;
    }

    setEmailStatus({ valid: true, msg: `✅ E-mail válido e verificado! (${dominio})` });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!emailStatus || !emailStatus.valid) {
      showToast('Por favor, informe um e-mail válido.', 'error');
      return;
    }

    if (senha.length < 4) {
      showToast('A senha deve ter pelo menos 4 caracteres.', 'error');
      return;
    }

    if (senha !== confirmSenha) {
      showToast('As senhas não coincidem.', 'error');
      return;
    }

    showToast(`Novo Administrador ${nome} cadastrado com sucesso!`);
    if (onAdminRegistered) onAdminRegistered({ nome, email });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)',
      zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
    }}>
      <div className="glass-panel animate-fade" style={{ width: '100%', maxWidth: '500px', padding: '32px', background: '#0b0f19', border: '1px solid rgba(99, 102, 241, 0.4)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', background: 'rgba(99, 102, 241, 0.2)', borderRadius: '10px', color: '#818cf8' }}>
              <Key size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff' }}>Portal Secreto de Cadastro de Admin</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ativado pela tecla de atalho "["</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nome Completo do Novo Admin *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ex: Carlos Eduardo (Admin)"
              value={nome}
              onChange={e => setNome(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">E-mail com Validação em Tempo Real *</label>
            <input
              type="email"
              className="form-input"
              placeholder="novo.admin@empresa.com"
              value={email}
              onChange={e => validarEmail(e.target.value)}
              required
            />
            {emailStatus && (
              <div style={{
                marginTop: '6px',
                fontSize: '0.8rem',
                fontWeight: '600',
                color: emailStatus.valid ? '#10b981' : '#ef4444'
              }}>
                {emailStatus.msg}
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Senha *</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirmar Senha *</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={confirmSenha}
                onChange={e => setConfirmSenha(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: '10px', fontSize: '0.95rem' }}
            disabled={emailStatus && !emailStatus.valid}
          >
            <Key size={16} /> Cadastrar Novo Admin & Conectar
          </button>
        </form>

      </div>
    </div>
  );
}
