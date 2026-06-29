import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Lock, User, Sparkles, ShieldCheck, AlertCircle } from 'lucide-react';
import Logo from './Logo';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Simple emulation of verify with a tiny timeout to feel realistic and highly professional
    setTimeout(() => {
      if (username === 'amielgateaux' && password === 'gateauxnep2026') {
        onLoginSuccess();
        setUsername('');
        setPassword('');
        setError(null);
        onClose();
      } else {
        setError('Login ou senha incorretos. Por favor, tente novamente.');
      }
      setIsSubmitting(false);
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-bento-dark/60 backdrop-blur-sm"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', duration: 0.4 }}
        className="relative bg-white rounded-[32px] shadow-2xl border border-bento-border max-w-md w-full overflow-hidden flex flex-col z-10 p-6 sm:p-8"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-stone-100 transition-colors text-bento-dark/40 hover:text-bento-dark cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-3 mb-6">
          <Logo size={56} className="shadow-sm" />
          <div>
            <h3 className="text-xl font-bold text-bento-dark font-serif tracking-tight flex items-center justify-center gap-1.5">
              Acesso Restrito <ShieldCheck className="w-5 h-5 text-bento-amber" />
            </h3>
            <p className="text-xs text-bento-dark/50 font-semibold mt-1 uppercase tracking-wider">
              Área do Gestor Amiel Gâteaux
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 bg-rose-50 border border-rose-100 text-rose-800 rounded-xl flex items-start gap-2 text-xs font-semibold leading-relaxed"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Username Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-bento-dark/60">
              Usuário (Login)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-bento-dark/40">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Digite seu usuário"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-bento-border focus:outline-none focus:ring-2 focus:ring-bento-amber/10 focus:border-bento-amber text-bento-dark placeholder-bento-dark/30 bg-[#FAF7F2]/40 transition-all text-sm font-medium"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-bento-dark/60">
              Senha de Segurança
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-bento-dark/40">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-bento-border focus:outline-none focus:ring-2 focus:ring-bento-amber/10 focus:border-bento-amber text-bento-dark placeholder-bento-dark/30 bg-[#FAF7F2]/40 transition-all text-sm font-medium"
              />
            </div>
          </div>

          {/* Tips block */}
          <div className="bg-[#FAF7F2] border border-bento-border/60 p-3.5 rounded-2xl text-[10px] text-bento-dark/60 leading-relaxed font-medium">
            🔒 Entre com as credenciais do administrador para gerenciar o catálogo ativo (inserir, editar preços, ingredientes e apagar itens do cardápio).
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-bento-dark hover:bg-bento-amber text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-98 duration-150 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="animate-pulse">Validando credenciais...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-bento-amber-bright" />
                Autenticar Gestor
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
