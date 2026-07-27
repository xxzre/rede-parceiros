import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, UserCheck, ShieldCheck, UserPlus, Key } from 'lucide-react';

export default function LoginScreen({ tecnicos, onLoginSuccess }) {
  const { loginAdmin, loginTecnicoPorCodigo, showToast } = useAuth();

  const [activeTab, setActiveTab] = useState('admin'); // 'admin' | 'tecnico' | 'cadastrar'

  // Admin login inputs
  const [adminEmail, setAdminEmail] = useState('admin@redeparceiros.com');
  const [adminPassword, setAdminPassword] = useState('admin123');

  // Técnico login inputs
  const [codigoTecnico, setCodigoTecnico] = useState('');

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    if (loginAdmin(adminPassword)) {
      if (onLoginSuccess) onLoginSuccess('admin');
    }
  };

  const handleTecnicoSubmit = (e) => {
    e.preventDefault();
    if (!codigoTecnico) {
      showToast('Digite seu código de indicação.', 'error');
      return;
    }
    if (loginTecnicoPorCodigo(codigoTecnico)) {
      if (onLoginSuccess) onLoginSuccess('tecnico');
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '40px auto' }} className="animate-fade">
      <div className="glass-panel" style={{ padding: '32px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, var(--primary), var(--accent-purple))',
            margin: '0 auto 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 20px var(--primary-glow)'
          }}>
            <Lock size={28} color="#fff" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff' }}>Acessar Plataforma</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Entre com suas credenciais de Administrador ou Técnico
          </p>
        </div>

        {/* Abas de Login */}
        <div style={{ display: 'flex', gap: '6px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '10px', marginBottom: '20px' }}>
          <button
            onClick={() => setActiveTab('admin')}
            className={`btn btn-sm ${activeTab === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ flex: 1, border: 'none' }}
          >
            <ShieldCheck size={14} /> Admin
          </button>
          <button
            onClick={() => setActiveTab('tecnico')}
            className={`btn btn-sm ${activeTab === 'tecnico' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ flex: 1, border: 'none' }}
          >
            <UserCheck size={14} /> Técnico
          </button>
        </div>

        {activeTab === 'admin' && (
          <form onSubmit={handleAdminSubmit}>
            <div className="form-group">
              <label className="form-label">E-mail do Administrador</label>
              <input
                type="email"
                className="form-input"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Senha</label>
              <input
                type="password"
                className="form-input"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '8px' }}>
              Entrar no Painel Admin
            </button>
          </form>
        )}

        {activeTab === 'tecnico' && (
          <form onSubmit={handleTecnicoSubmit}>
            <div className="form-group">
              <label className="form-label">Seu Código de Indicação (ex: JOAO01)</label>
              <input
                type="text"
                className="form-input"
                placeholder="JOAO01"
                value={codigoTecnico}
                onChange={(e) => setCodigoTecnico(e.target.value.toUpperCase())}
                style={{ fontFamily: 'monospace', textTransform: 'uppercase', fontWeight: '700' }}
                required
              />
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Exemplo para teste: Digite <strong>JOAO01</strong>, <strong>CARLOS02</strong> ou <strong>MARI03</strong>
            </div>
            <button type="submit" className="btn btn-success" style={{ width: '100%', padding: '12px' }}>
              Acessar Meu Painel de Técnico
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
