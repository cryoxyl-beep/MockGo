import React, { useState } from 'react';
import { 
  GraduationCap, 
  ShieldCheck, 
  Lock,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';

interface AuthViewProps {
  onBack: () => void;
}

export default function AuthView({ onBack }: AuthViewProps) {
  const { loginWithGoogle } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setError('');
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error("Login failed:", err);
      setError('Authentication failed. Please ensure cookies are allowed or try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div id="auth-screen" className="min-h-screen bg-[#090909] text-[#EDEDED] flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans">
      
      {/* Soft dark-gray layout circle glowing */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-950 via-transparent to-transparent pointer-events-none" />

      {/* Decorative clean brand icon on top */}
      <div 
        onClick={onBack}
        className="absolute top-8 left-8 flex items-center gap-2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
      >
        <GraduationCap className="w-5 h-5 text-[#888]" />
        <span className="font-sans font-semibold text-xs text-[#888]">Back to Home</span>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm bg-[#0C0C0C] rounded-2xl border border-[#1F1F1F] shadow-2xl p-8 relative"
      >
        <div className="flex flex-col items-center text-center mb-8 font-sans">
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(255,255,255,0.15)]">
            <Lock className="w-5 h-5 text-black stroke-[2.5]" />
          </div>
          <h2 className="font-sans font-bold text-2xl text-white tracking-tight mb-2">
            Secure Academic Login
          </h2>
          <p className="font-sans text-xs text-[#888] font-light max-w-xs leading-relaxed">
            Please log in with Google to securely process syllabus collections, customize layouts, and save mock report metrics.
          </p>
        </div>

        {/* Primary and only real Google Authentication CTA */}
        <button
          id="auth-google-btn"
          type="button"
          disabled={isSigningIn}
          onClick={handleGoogleSignIn}
          className="w-full py-3.5 px-4 bg-white text-black hover:bg-zinc-100 border border-transparent rounded flex items-center justify-center gap-3 transition-all font-bold font-sans text-xs shadow-[0_0_15px_rgba(255,255,255,0.1)] cursor-pointer disabled:opacity-50"
        >
          {isSigningIn ? (
            <RefreshCw className="w-4 h-4 animate-spin text-black" />
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.2-5.136 4.2A5.727 5.727 0 0 1 8.1 12.8a5.727 5.727 0 0 1 5.89-5.8 5.617 5.617 0 0 1 3.96 1.63l3.054-3.05A10 10 0 0 0 13.99 2c-5.523 0-10 4.477-10 10s4.477 10 10 10c5.73 0 9.77-3.93 9.77-9.76a8.88 8.88 0 0 0-.22-2l-7.3 1.045z"
              />
            </svg>
          )}
          <span>{isSigningIn ? 'Opening Google Auth...' : 'Sign In with Google'}</span>
        </button>

        {error && (
          <div className="mt-4 flex gap-2.5 bg-red-950/20 py-2.5 px-3.5 rounded border border-red-900/40 text-xs text-red-400 font-sans">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-[#1F1F1F] text-center flex items-center justify-center gap-1.5 text-[#555] font-mono text-[9px] font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Compliant Academic Client Sandbox v1.2</span>
        </div>
      </motion.div>
    </div>
  );
}
