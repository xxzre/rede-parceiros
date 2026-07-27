import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Copy, Check, Lock, Server, UserX, KeyRing } from 'lucide-react';

const firestoreRulesText = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isAdmin() {
      return isAuthenticated() && 
        (request.auth.token.admin == true || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // Coleção de Usuários e Proteção contra Elevação de Privilégios
    match /users/{userId} {
      allow read: if isAuthenticated() && (isOwner(userId) || isAdmin());
      allow create: if isAuthenticated() && (isAdmin() || (isOwner(userId) && request.resource.data.role == 'tecnico'));
      allow update: if isAuthenticated() && (isAdmin() || (isOwner(userId) && request.resource.data.role == resource.data.role));
    }

    // Coleção de Técnicos e Vínculo Imutável de Código
    match /tecnicos/{tecnicoId} {
      allow read: if true;
      allow create, delete: if isAdmin();
      allow update: if isAdmin() || (
        isAuthenticated() && 
        resource.data.uid == null && 
        request.resource.data.uid == request.auth.uid &&
        request.resource.data.codigo == resource.data.codigo
      );
    }

    // Coleção de Vendas - REGISTRO EXCLUSIVO DO ADMIN & LEITURA ISOLADA NO SERVIDOR
    match /vendas/{vendaId} {
      allow read: if isAdmin() || (
        isAuthenticated() && (
          resource.data.tecnicoUid == request.auth.uid ||
          resource.data.tecnicoCodigo == request.auth.token.codigo
        )
      );
      allow create, update, delete: if isAdmin();
    }

    // Solicitações Públicas
    match /solicitacoes/{solicitacaoId} {
      allow create: if true;
      allow read, update, delete: if isAdmin();
    }
  }
}`;

export default function AdminRules() {
  const { showToast } = useAuth();
  const [copied, setCopied] = useState(false);

  const handleCopyRules = () => {
    navigator.clipboard.writeText(firestoreRulesText);
    setCopied(true);
    showToast('Regras firestore.rules copiadas para a área de transferência!');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Cards com as 4 Regras de Ouro solicitadas pelo usuário */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        
        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', color: '#10b981' }}>
            <Lock size={20} />
            <h4 style={{ fontWeight: '700', fontSize: '0.95rem' }}>1. Registro Exclusivo Admin</h4>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Só você (admin) registra vendas. O técnico não pode inventar indicações para si mesmo (`allow create: if isAdmin()`).
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #6366f1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', color: '#6366f1' }}>
            <Server size={20} />
            <h4 style={{ fontWeight: '700', fontSize: '0.95rem' }}>2. Isolamento de Servidor</h4>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Cada técnico só enxerga as próprias indicações, garantido pelo servidor e não pelo JS (`tecnicoUid == request.auth.uid`).
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', color: '#f59e0b' }}>
            <ShieldCheck size={20} />
            <h4 style={{ fontWeight: '700', fontSize: '0.95rem' }}>3. Código Anti-Roubo</h4>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Um código de indicação vinculado a uma conta nunca pode ser roubado ou sobrescrito por outro usuário.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #ef4444' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', color: '#ef4444' }}>
            <UserX size={20} />
            <h4 style={{ fontWeight: '700', fontSize: '0.95rem' }}>4. Ninguém Vira Admin</h4>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Impedimento estrito no Firestore para que nenhum usuário altere seu próprio papel para `admin`.
          </p>
        </div>

      </div>

      {/* Editor / Visualizador do firestore.rules */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Arquivo de Seguraça: `firestore.rules`</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Este arquivo está salvo na raiz do projeto e pronto para deploy no Firebase Console.
            </p>
          </div>

          <button onClick={handleCopyRules} className="btn btn-secondary">
            {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
            {copied ? 'Copiado!' : 'Copiar firestore.rules'}
          </button>
        </div>

        <pre style={{
          background: 'rgba(11, 15, 25, 0.95)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '20px',
          color: '#a5b4fc',
          fontFamily: 'monospace',
          fontSize: '0.85rem',
          overflowX: 'auto',
          lineHeight: '1.6'
        }}>
          {firestoreRulesText}
        </pre>
      </div>

    </div>
  );
}
