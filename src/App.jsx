import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { storeService, subscribeStore } from './services/store';
import Navbar from './components/Navbar';
import AdminTechnicians from './components/AdminTechnicians';
import AdminSales from './components/AdminSales';
import AdminRanking from './components/AdminRanking';
import AdminRequests from './components/AdminRequests';
import AdminRules from './components/AdminRules';
import TechnicianDashboard from './components/TechnicianDashboard';
import PublicForm from './components/PublicForm';
import InviteActivation from './components/InviteActivation';
import NotificationToast from './components/NotificationToast';

import { UserCheck, ShoppingBag, Trophy, FileText, ShieldCheck, UserPlus, Sparkles } from 'lucide-react';

function AppContent() {
  const { role, setRole } = useAuth();

  // State reativo dos dados
  const [tecnicos, setTecnicos] = useState(() => storeService.getTecnicos());
  const [vendas, setVendas] = useState(() => storeService.getVendas());
  const [solicitacoes, setSolicitacoes] = useState(() => storeService.getSolicitacoes());
  const [ranking, setRanking] = useState(() => storeService.getRanking());

  // Aba ativa do Admin
  const [adminTab, setAdminTab] = useState('vendas'); // 'vendas' | 'tecnicos' | 'ranking' | 'solicitacoes' | 'regras'
  const [showPublicForm, setShowPublicForm] = useState(false);
  const [inviteCode, setInviteCode] = useState(null);

  // Inscreve no store para atualizações instantâneas
  const recarregarDados = () => {
    setTecnicos(storeService.getTecnicos());
    setVendas(storeService.getVendas());
    setSolicitacoes(storeService.getSolicitacoes());
    setRanking(storeService.getRanking());
  };

  useEffect(() => {
    const unsubscribe = subscribeStore(recarregarDados);
    return () => unsubscribe();
  }, []);

  // Checa se a URL tem parâmetro de convite (ex: ?convite=JOAO01)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('convite');
    if (code) {
      setInviteCode(code.toUpperCase());
    }
  }, []);

  // Se houver parâmetro de convite na URL
  if (inviteCode) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar 
          activeAdminTab={adminTab} 
          setActiveAdminTab={setAdminTab} 
          showPublicForm={showPublicForm} 
          setShowPublicForm={setShowPublicForm} 
        />
        <main style={{ flex: 1, padding: '24px' }}>
          <InviteActivation 
            conviteCodigo={inviteCode} 
            onActivated={() => setInviteCode(null)} 
          />
        </main>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header com Navegação e Seletor de Perfil */}
      <Navbar 
        activeAdminTab={adminTab} 
        setActiveAdminTab={setAdminTab} 
        showPublicForm={showPublicForm} 
        setShowPublicForm={setShowPublicForm} 
      />

      {/* Conteúdo Principal */}
      <main style={{ flex: 1, maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '24px' }}>
        
        {/* Se o usuário clicou em Formulário Público */}
        {showPublicForm ? (
          <PublicForm onSuccess={() => setShowPublicForm(false)} />
        ) : role === 'admin' ? (
          
          /* PAINEL DO ADMINISTRADOR */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Navegação por Abas no Admin */}
            <div className="glass-panel" style={{ padding: '8px', display: 'flex', gap: '8px', overflowX: 'auto' }}>
              
              <button
                onClick={() => setAdminTab('vendas')}
                className={`btn btn-sm ${adminTab === 'vendas' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ border: 'none' }}
              >
                <ShoppingBag size={16} /> Registrar Venda Indicada
              </button>

              <button
                onClick={() => setAdminTab('tecnicos')}
                className={`btn btn-sm ${adminTab === 'tecnicos' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ border: 'none' }}
              >
                <UserCheck size={16} /> Cadastrar Técnico ({tecnicos.length})
              </button>

              <button
                onClick={() => setAdminTab('ranking')}
                className={`btn btn-sm ${adminTab === 'ranking' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ border: 'none' }}
              >
                <Trophy size={16} /> Aba Ranking (Gamificação)
              </button>

              <button
                onClick={() => setAdminTab('solicitacoes')}
                className={`btn btn-sm ${adminTab === 'solicitacoes' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ border: 'none', position: 'relative' }}
              >
                <FileText size={16} /> Aba Solicitações
                {solicitacoes.filter(s => s.status === 'pendente').length > 0 && (
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#ef4444',
                    position: 'absolute',
                    top: '6px',
                    right: '6px'
                  }} />
                )}
              </button>

              <button
                onClick={() => setAdminTab('regras')}
                className={`btn btn-sm ${adminTab === 'regras' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ border: 'none' }}
              >
                <ShieldCheck size={16} /> Regras Firestore (.rules)
              </button>

            </div>

            {/* Conteúdo da Aba Ativa */}
            <div className="animate-fade">
              {adminTab === 'vendas' && (
                <AdminSales tecnicos={tecnicos} vendas={vendas} onUpdate={recarregarDados} />
              )}
              {adminTab === 'tecnicos' && (
                <AdminTechnicians tecnicos={tecnicos} onUpdate={recarregarDados} />
              )}
              {adminTab === 'ranking' && (
                <AdminRanking ranking={ranking} />
              )}
              {adminTab === 'solicitacoes' && (
                <AdminRequests solicitacoes={solicitacoes} onUpdate={recarregarDados} onSwitchTab={setAdminTab} />
              )}
              {adminTab === 'regras' && (
                <AdminRules />
              )}
            </div>

          </div>
        ) : (

          /* PAINEL RESTRITO DO TÉCNICO */
          <div className="animate-fade">
            <TechnicianDashboard tecnicos={tecnicos} />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '20px',
        borderTop: '1px solid var(--border-color)',
        color: 'var(--text-dim)',
        fontSize: '0.8rem',
        marginTop: 'auto'
      }}>
        Rede Parceiros © 2026 — Sistema de Gestão de Comissões, Indicações e Gamificação com Firestore Rules
      </footer>

      {/* Componente de Toasts */}
      <NotificationToast />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
