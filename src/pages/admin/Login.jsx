import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';
import SEO from '../../components/common/SEO';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkActiveSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) navigate('/dauphine-admin');
    };
    checkActiveSession();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      navigate('/dauphine-admin');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full bg-transparent border-b border-dark/20 focus:border-dark outline-none py-3 text-dark transition-all text-sm placeholder:text-dark/20";

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-6 selection:bg-dark selection:text-white">
      <SEO title="Studio Authentication - Dauphiné" description="Admin workspace access gate." />

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[400px] space-y-10"
      >
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-medium tracking-tighter uppercase">Dauphiné Creative</h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-dark/40">
            Secure Gateway Access
          </p>
        </div>

        <div className="bg-[#fafafa] p-8 rounded-2xl border border-dark/5 shadow-sm">
          <form onSubmit={handleLogin} className="space-y-6">
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-dark/40">Identity Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className={inputClass} 
                placeholder="admin@dauphine.com" 
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-dark/40">Security Key</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className={inputClass} 
                placeholder="••••••••" 
              />
            </div>

            {error && (
              <p className="text-[11px] font-bold uppercase tracking-wider text-red-500 bg-red-50 p-3 rounded-lg border border-red-500/10">
                {error}
              </p>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-dark text-white py-4 rounded-xl text-xs font-bold uppercase tracking-[0.2em] hover:bg-dark/90 transition-all disabled:opacity-50 mt-2"
            >
              {isLoading ? 'Verifying...' : 'Authorize Access'}
            </button>
          </form>
        </div>

        <div className="text-center">
          <button 
            onClick={() => navigate('/')}
            className="text-[10px] font-bold uppercase tracking-widest text-dark/30 hover:text-dark transition-colors"
          >
            Return to public website
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;