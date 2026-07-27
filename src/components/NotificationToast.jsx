import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function NotificationToast() {
  const { notification } = useAuth();

  if (!notification) return null;

  const isSuccess = notification.type === 'success';
  const isError = notification.type === 'error';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 20px',
        borderRadius: '12px',
        background: isSuccess
          ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.95), rgba(5, 150, 105, 0.95))'
          : isError
          ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.95), rgba(185, 28, 28, 0.95))'
          : 'linear-gradient(135deg, rgba(99, 102, 241, 0.95), rgba(79, 70, 229, 0.95))',
        color: '#ffffff',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(10px)',
        fontWeight: '600',
        fontSize: '0.9rem',
        maxWidth: '420px',
        animation: 'fadeIn 0.3s ease'
      }}
    >
      {isSuccess && <CheckCircle2 size={20} />}
      {isError && <AlertCircle size={20} />}
      {!isSuccess && !isError && <Info size={20} />}
      <span style={{ flex: 1 }}>{notification.message}</span>
    </div>
  );
}
