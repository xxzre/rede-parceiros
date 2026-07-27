import React from 'react';
import { useAuth } from '../context/AuthContext';
import { isLiveFirebaseConfigured } from '../firebase';
import { 
  ShieldCheck, 
  UserCheck, 
  Award, 
  FileText, 
  LogOut, 
  Zap, 
  Flame,
  UserPlus
} from 'lucide-react';

export default function Navbar({ activeAdminTab, setActiveAdminTab, showPublicForm, setShowPublicForm }) {
  const { role, setRole, currentTecnico, logout, showToast } = useAuth();

  return (
    <header style={{
      background: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        
        {/* Logo & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--primary), var(--accent-purple))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px var(--primary-glow)'
            }}>
              <ShieldCheck size={24} color="#fff" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: '800', tracking: '-0.5px', background: 'linear-gradient(135deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                REDE PARCEIROS
              </h1>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '-2px' }}>
                Gestão de Comissões & Afiliados
              </span>
            </div>
          </div>

          {/* Badge Firebase */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: '600',
            background: isLiveFirebaseConfigured ? 'rgba(239, 68, 68, 0.15)' : 'rgba(99, 102, 241, 0.15)',
            color: isLiveFirebaseConfigured ? '#f87171' : '#a5b4fc',
            border: `1px solid ${isLiveFirebaseConfigured ? 'rgba(239, 68, 68, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`
          }} title={isLiveFirebaseConfigured ? 'Conectado ao Firebase Firestore real' : 'Executando com LocalStore Reativo'}>
            {isLiveFirebaseConfigured ? <Flame size={14} /> : <Zap size={14} />}
            {isLiveFirebaseConfigured ? 'Firestore Live' : 'Modo Demo (Reativo)'}
          </div>
        </div>

        {/* Navigation / Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          
          {/* Seletor de Perfil / Modos para fácil teste */}
          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '4px',
            borderRadius: '10px',
            border: '1px solid var(--border-color)'
          }}>
            <button
              onClick={() => { setRole('admin'); setShowPublicForm(false); }}
              className={`btn btn-sm ${role === 'admin' && !showPublicForm ? 'btn-primary' : 'btn-secondary'}`}
              style={{ border: 'none' }}
            >
              <ShieldCheck size={14} /> Painel Admin
            </button>

            <button
              onClick={() => { setRole('tecnico'); setShowPublicForm(false); }}
              className={`btn btn-sm ${role === 'tecnico' && !showPublicForm ? 'btn-primary' : 'btn-secondary'}`}
              style={{ border: 'none' }}
            >
              <UserCheck size={14} /> Visão do Técnico
            </button>

            <button
              onClick={() => { setShowPublicForm(true); }}
              className={`btn btn-sm ${showPublicForm ? 'btn-primary' : 'btn-secondary'}`}
              style={{ border: 'none' }}
            >
              <UserPlus size={14} /> Inscrição Pública
            </button>
          </div>

          {/* User Status / Logout */}
          {role === 'tecnico' && currentTecnico && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 12px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '10px',
              fontSize: '0.85rem'
            }}>
              <span style={{ fontWeight: '700', color: '#10b981' }}>{currentTecnico.nome}</span>
              <span className="badge badge-code">{currentTecnico.codigo}</span>
            </div>
          )}

          {role !== 'publico' && (
            <button 
              onClick={logout}
              className="btn btn-secondary btn-sm"
              title="Sair da conta"
            >
              <LogOut size={14} /> Sair
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
