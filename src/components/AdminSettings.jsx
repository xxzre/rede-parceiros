import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { storeService } from '../services/store';
import { Settings, Save, Download, RotateCcw, ShieldCheck, Percent, MessageSquare } from 'lucide-react';

export default function AdminSettings() {
  const { showToast } = useAuth();

  const [comissaoPadrao, setComissaoPadrao] = useState(10);
  const [mensagemBoasVindas, setMensagemBoasVindas] = useState(
    'Você foi convidado para a Rede de Parceiros! Ative sua conta e receba comissões em cada indicação.'
  );

  const handleSalvar = (e) => {
    e.preventDefault();
    showToast('Configurações salvas com sucesso!');
  };

  const handleExportBackup = () => {
    const backupData = {
      tecnicos: storeService.getTecnicos(),
      vendas: storeService.getVendas(),
      solicitacoes: storeService.getSolicitacoes(),
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_rede_parceiros_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('Backup dos dados baixado com sucesso!');
  };

  const handleResetarDadosDemonstracao = () => {
    if (window.confirm('Deseja restaurar os dados padrões de demonstração? Isso irá recarregar as vendas e técnicos iniciais.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
      
      {/* Formulário de Parâmetros da Rede */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ padding: '8px', background: 'rgba(99, 102, 241, 0.15)', borderRadius: '10px', color: 'var(--primary)' }}>
            <Settings size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Configurações Globais da Rede</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ajuste os parâmetros padrão para novos cadastros</p>
          </div>
        </div>

        <form onSubmit={handleSalvar}>
          <div className="form-group">
            <label className="form-label">Taxa de Comissão Padrão Inicial (%)</label>
            <div style={{ position: 'relative' }}>
              <input
                type="number"
                step="0.5"
                min="1"
                max="100"
                className="form-input"
                value={comissaoPadrao}
                onChange={(e) => setComissaoPadrao(e.target.value)}
              />
              <Percent size={14} style={{ position: 'absolute', right: '12px', top: '13px', color: 'var(--text-muted)' }} />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Esta taxa será pré-selecionada ao cadastrar novos técnicos.
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">Mensagem de Boas-Vindas da Tela de Convite</label>
            <textarea
              className="form-input"
              rows="3"
              value={mensagemBoasVindas}
              onChange={(e) => setMensagemBoasVindas(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
            <Save size={16} /> Salvar Parâmetros
          </button>
        </form>
      </div>

      {/* Backup e Utilitários de Manutenção */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ padding: '8px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '10px', color: '#10b981' }}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Backup e Manutenção de Dados</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Exporte backups e gerencie o armazenamento local</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid var(--border-color)'
          }}>
            <h4 style={{ fontWeight: '700', fontSize: '0.95rem', marginBottom: '4px' }}>Exportar Backup Completo (JSON)</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Baixe um arquivo JSON com todas as vendas, técnicos e solicitações registradas.
            </p>
            <button onClick={handleExportBackup} className="btn btn-secondary" style={{ width: '100%' }}>
              <Download size={16} /> Baixar Backup dos Dados
            </button>
          </div>

          <div style={{
            background: 'rgba(239, 68, 68, 0.05)',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}>
            <h4 style={{ fontWeight: '700', fontSize: '0.95rem', marginBottom: '4px', color: '#ef4444' }}>Restaurar Dados Iniciais</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Recarrega os dados demonstrativos de testes iniciais.
            </p>
            <button onClick={handleResetarDadosDemonstracao} className="btn btn-secondary" style={{ width: '100%', color: '#ef4444' }}>
              <RotateCcw size={16} /> Restaurar Demonstração
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
