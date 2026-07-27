import React, { useState } from 'react';
import { storeService } from '../services/store';
import { useAuth } from '../context/AuthContext';
import { Send, CheckCircle2, UserPlus, ShieldCheck, Sparkles, MapPin, Phone, Mail } from 'lucide-react';

export default function PublicForm({ onSuccess }) {
  const { showToast } = useAuth();
  
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [cidade, setCidade] = useState('');
  const [experiencia, setExperiencia] = useState('');
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nome || !email || !whatsapp) {
      showToast('Preencha os campos obrigatórios.', 'error');
      return;
    }

    try {
      storeService.enviarSolicitacao({
        nome,
        email,
        whatsapp,
        cidade,
        experiencia
      });

      setEnviado(true);
      showToast('Sua solicitação foi enviada com sucesso! Entraremos em contato.');
      if (onSuccess) onSuccess();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  if (enviado) {
    return (
      <div className="glass-panel" style={{ padding: '48px 24px', textAlign: 'center', maxWidth: '600px', margin: '40px auto' }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'rgba(16, 185, 129, 0.15)',
          color: '#10b981',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px'
        }}>
          <CheckCircle2 size={40} />
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '10px' }}>Inscrição Recebida! 🎉</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px', lineHeight: '1.6' }}>
          Obrigado pelo seu interesse em se tornar um Técnico Parceiro da nossa Rede. Nossa equipe de administração revisará seus dados e enviará seu <strong>código exclusivo de indicação</strong> diretamente no seu e-mail e WhatsApp!
        </p>

        <button onClick={() => setEnviado(false)} className="btn btn-secondary">
          Enviar Outra Solicitação
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '680px', margin: '20px auto' }}>
      
      <div className="glass-panel" style={{ padding: '36px 30px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex',
            padding: '12px',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))',
            borderRadius: '16px',
            color: '#818cf8',
            marginBottom: '12px'
          }}>
            <Sparkles size={32} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#fff' }}>
            Quero me tornar Técnico Parceiro
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px' }}>
            Cadastre-se para receber seu código de indicação, indicar novos clientes e alunos e ganhar comissões em cada venda!
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Seu Nome Completo *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ex: Carlos Eduardo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">E-mail Principal *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="form-input"
                  placeholder="seu.email@dominio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Mail size={16} style={{ position: 'absolute', right: '12px', top: '12px', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">WhatsApp com DDD *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="(11) 99999-8888"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  required
                />
                <Phone size={16} style={{ position: 'absolute', right: '12px', top: '12px', color: 'var(--text-muted)' }} />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Sua Cidade e Estado</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: São Paulo - SP"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
              />
              <MapPin size={16} style={{ position: 'absolute', right: '12px', top: '12px', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Conte um pouco sobre sua experiência ou interesse</label>
            <textarea
              className="form-input"
              rows="3"
              placeholder="Ex: Sou técnico em eletrônica há 3 anos e gostaria de indicar clientes para o treinamento e cursos..."
              value={experiencia}
              onChange={(e) => setExperiencia(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '10px' }}>
            <Send size={18} /> Enviar Inscrição para Aprovação
          </button>
        </form>
      </div>

    </div>
  );
}
