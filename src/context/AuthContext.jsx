import React, { createContext, useContext, useState, useEffect } from 'react';
import { storeService } from '../services/store';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // role: 'admin' | 'tecnico' | 'publico'
  const [role, setRole] = useState(() => localStorage.getItem('rede_parceiros_role') || 'admin');
  const [currentTecnico, setCurrentTecnico] = useState(() => {
    const saved = localStorage.getItem('rede_parceiros_current_tecnico');
    return saved ? JSON.parse(saved) : storeService.getTecnicos()[0] || null;
  });
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    localStorage.setItem('rede_parceiros_role', role);
  }, [role]);

  useEffect(() => {
    if (currentTecnico) {
      localStorage.setItem('rede_parceiros_current_tecnico', JSON.stringify(currentTecnico));
    } else {
      localStorage.removeItem('rede_parceiros_current_tecnico');
    }
  }, [currentTecnico]);

  const showToast = (message, type = 'success') => {
    setNotification({ id: Date.now(), message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const loginAdmin = (password) => {
    if (password === 'admin123' || password === 'admin') {
      setRole('admin');
      showToast('Bem-vindo ao Painel do Administrador! 🚀');
      return true;
    } else {
      showToast('Senha de administrador incorreta (Dica: admin123)', 'error');
      return false;
    }
  };

  const loginTecnicoPorCodigo = (codigo) => {
    const tec = storeService.getTecnicoPorCodigo(codigo);
    if (tec) {
      setCurrentTecnico(tec);
      setRole('tecnico');
      showToast(`Bem-vindo ao seu painel, ${tec.nome}! 🎉`);
      return true;
    } else {
      showToast(`Código "${codigo}" não encontrado. Verifique se o admin cadastrou seu código.`, 'error');
      return false;
    }
  };

  const selecionarTecnicoParaDemonstracao = (tecId) => {
    const tec = storeService.getTecnicoPorId(tecId);
    if (tec) {
      setCurrentTecnico(tec);
      setRole('tecnico');
      showToast(`Alternado para o perfil do Técnico: ${tec.nome} (${tec.codigo})`);
    }
  };

  const logout = () => {
    setRole('publico');
    setCurrentTecnico(null);
    showToast('Sessão encerrada com sucesso.');
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        setRole,
        currentTecnico,
        setCurrentTecnico,
        loginAdmin,
        loginTecnicoPorCodigo,
        selecionarTecnicoParaDemonstracao,
        logout,
        notification,
        showToast
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return ctx;
}
