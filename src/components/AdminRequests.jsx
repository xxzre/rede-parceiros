import React, { useState } from 'react';
import { storeService } from '../services/store';
import { useAuth } from '../context/AuthContext';
import { FileText, CheckCircle2, UserCheck, Phone, MapPin, Mail, Sparkles } from 'lucide-react';

export default function AdminRequests({ solicitacoes, onUpdate, onSwitchTab }) {
  const { showToast } = useAuth();

  const handleAprovarSolicitacao = (sol) => {
    try {
      // Gera código de indicação automático baseado no primeiro nome
      const firstWord = sol.nome.trim().split(' ')[0].toUpperCase().replace(/[^A-Z0-9]/g, '');
      const randomNum = String(Math.floor(Math.random() * 90) + 10);
      const codigoGerado = `${firstWord}${randomNum}`;

      // Cadastra como técnico ativo/pendente de convite
      storeService.cadastrarTecnico({
        nome: sol.nome,
        email: sol.email,
        codigo: codigoGerado,
        comissaoPorcentagem: 10,
        whatsapp: sol.whatsapp
      });

      // Marca a solicitação como aprovada
      storeService.marcarSolicitacaoProcessada(sol.id);

      showToast(`Solicitação de ${sol.nome} APROVADA! Código gerado: ${codigoGerado}`);
      onUpdate();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const solicitacoesPendentes = solicitacoes.filter(s => s.status === 'pendente');
  const solicitacoesAprovadas = solicitacoes.filter(s => s.status === 'aprovada');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={24} color="var(--primary)" />
            <h2 style={{ fontSize: '1.3rem', fontWeight: '800' }}>Solicitações de Inscrição na Rede / Curso</h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Formulário público preenchido por novos técnicos que querem entrar na rede de parceiros.
          </p>
        </div>

        <div className="badge badge-code" style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
          {solicitacoesPendentes.length} Solicitações Pendentes
        </div>
      </div>

      {/* Grid de Cards de Solicitações Pendentes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {solicitacoesPendentes.length === 0 ? (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', gridColumn: '1 / -1', color: 'var(--text-muted)' }}>
            Nenhuma solicitação pendente no momento.
          </div>
        ) : (
          solicitacoesPendentes.map((sol) => (
            <div key={sol.id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyBetween: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>{sol.nome}</h3>
                  <span className="badge badge-pending">PENDENTE</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Mail size={14} /> {sol.email}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={14} /> {sol.whatsapp || 'Não informado'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} /> {sol.cidade || 'Não informada'}
                  </div>
                </div>

                <div style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  fontSize: '0.85rem',
                  fontStyle: 'italic',
                  color: 'var(--text-main)',
                  marginBottom: '16px'
                }}>
                  "{sol.experiencia}"
                </div>
              </div>

              <button
                onClick={() => handleAprovarSolicitacao(sol)}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                <Sparkles size={16} /> Aprovar & Gerar Código de Indicação
              </button>
            </div>
          ))
        )}
      </div>

      {/* Seção de Solicitações Já Aprovadas */}
      {solicitacoesAprovadas.length > 0 && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '16px', color: 'var(--text-muted)' }}>
            Solicitações Anteriormente Aprovadas ({solicitacoesAprovadas.length})
          </h3>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>WhatsApp</th>
                  <th>Cidade</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {solicitacoesAprovadas.map(s => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: '700' }}>{s.nome}</td>
                    <td>{s.email}</td>
                    <td>{s.whatsapp}</td>
                    <td>{s.cidade}</td>
                    <td><span className="badge badge-paid"><CheckCircle2 size={12} /> APROVADO</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
