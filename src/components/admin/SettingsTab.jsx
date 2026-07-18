import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';

const SettingsTab = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState({ type: '', text: '' });

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordStatus({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }

    setIsUpdatingPassword(true);
    setPasswordStatus({ type: '', text: '' });

    try {
      const { error: passwordError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (passwordError) throw passwordError;

      setPasswordStatus({ type: 'success', text: 'Security key successfully reconfigured.' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordStatus({ type: 'error', text: err.message });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const inputClass = "w-full bg-white border border-dark/10 focus:border-dark outline-none p-4 text-dark text-sm rounded-xl transition-all placeholder:text-dark/20";

  return (
    <motion.div 
      key="settings" 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -10 }} 
      transition={{ duration: 0.4 }} 
      className="space-y-8"
    >
      <div className="border-b border-dark/10 pb-6">
        <h2 className="text-3xl font-medium tracking-tight uppercase">Dashboard Settings</h2>
        <p className="text-xs text-dark/40 mt-1">Konfigurasi parameter kredensial internal dan proteksi pertahanan enkripsi studio.</p>
      </div>
      
      <div className="bg-[#fafafa] p-8 rounded-xl border border-dark/5 w-full">
        <form onSubmit={handleUpdatePassword} className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-dark mb-4">Reconfigure Security Key</h3>
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-dark/40">New Password</label>
            <input 
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="••••••••"
              className={inputClass}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-dark/40">Confirm New Password</label>
            <input 
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
              className={inputClass}
            />
          </div>

          {passwordStatus.text && (
            <p className={`text-[11px] font-bold uppercase tracking-wider p-3 rounded-lg border ${
              passwordStatus.type === 'success' 
                ? 'border-green-500/10 bg-green-50 text-green-600' 
                : 'border-red-500/10 bg-red-50 text-red-500'
            }`}>
              {passwordStatus.text}
            </p>
          )}

          <div className="flex justify-end">
            <button 
              type="submit"
              disabled={isUpdatingPassword}
              className="bg-dark text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-dark/80 transition-all disabled:opacity-50"
            >
              {isUpdatingPassword ? 'Updating Key...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default SettingsTab;