import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { supabase } from '../../lib/supabaseClient';
import SEO from '../../components/common/SEO';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('email'); 
  const [inquiries, setInquiries] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [replyTarget, setReplyTarget] = useState(null); 
  const [replyMessage, setReplyMessage] = useState(''); 
  const [isSendingReply, setIsSendingReply] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState({ type: '', text: '' });

  useEffect(() => {
    const guardAdminPanel = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/dauphine-admin/login');
      } else {
        fetchInquiries();
        fetchFeedbacks();
      }
    };
    guardAdminPanel();
  }, [navigate]);

  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setInquiries(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFeedbacks = async () => {
    setIsFeedbackLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('feedbacks')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setFeedbacks(data || []);
    } catch (err) {
      console.error(err.message);
    } finally {
      setIsFeedbackLoading(false);
    }
  };

  const handleToggleReplyForm = async (item) => {
    if (replyTarget?.id === item.id) {
      setReplyTarget(null);
      return;
    }

    setReplyTarget(item);

    if (!item.is_read) {
      try {
        const { error: updateError } = await supabase
          .from('inquiries')
          .update({ is_read: true })
          .eq('id', item.id);

        if (updateError) throw updateError;

        setInquiries(prev => 
          prev.map(inq => inq.id === item.id ? { ...inq, is_read: true } : inq)
        );
      } catch (err) {
        alert("Sync Error (Read Status): " + err.message);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const { error: deleteError } = await supabase
        .from('inquiries')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      setInquiries(inquiries.filter(item => item.id !== id));
      if (replyTarget?.id === id) setReplyTarget(null);
    } catch (err) {
      alert("Failed to delete: " + err.message);
    }
  };

  const handleDeleteFeedback = async (id) => {
    if (!window.confirm("Delete this client feedback permanently?")) return;
    try {
      const { error: deleteError } = await supabase
        .from('feedbacks')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      setFeedbacks(feedbacks.filter(item => item.id !== id));
    } catch (err) {
      alert("Failed to delete feedback: " + err.message);
    }
  };

  const handleSendReply = async (e, item) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;
    setIsSendingReply(true);

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_REPLY_TEMPLATE_ID, 
        {
          to_name: item.name,
          to_email: item.email,
          reply_message: replyMessage, 
          reply_to: "dauphinecreative@gmail.com"
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      const { error: updateReplyError } = await supabase
        .from('inquiries')
        .update({ is_replied: true })
        .eq('id', item.id);

      if (updateReplyError) throw updateReplyError;

      setInquiries(prev => 
        prev.map(inq => inq.id === item.id ? { ...inq, is_replied: true } : inq)
      );

      alert(`Reply successfully dispatched via Gmail to ${item.email}`);
      setReplyTarget(null); 
      setReplyMessage('');  
    } catch (err) {
      alert("Sync Error (Reply Status): " + err.message);
    } finally {
      setIsSendingReply(false);
    }
  };

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

  const handleSignOut = async () => {
    if (!window.confirm("Are you sure you want to sign out?")) return;
    await supabase.auth.signOut();
    navigate('/dauphine-admin/login');
  };

  const unreadCount = inquiries.filter(item => !item.is_read).length;
  const inputClass = "w-full bg-white border border-dark/10 focus:border-dark outline-none p-4 text-dark text-sm rounded-xl transition-all placeholder:text-dark/20";

  return (
    <div className="bg-white min-h-screen flex text-dark selection:bg-dark selection:text-white">
      <SEO title="Studio Management - Dauphiné" description="Admin management panel." />
      
      <div className="w-64 md:w-80 border-r border-dark/10 min-h-screen p-8 flex flex-col justify-between bg-white fixed left-0 top-0 h-full z-10">
        <div className="space-y-12">
          <div>
            <h2 className="text-2xl font-medium tracking-tighter uppercase">Dauphiné Admin</h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-dark/40 mt-1">Management Hub</p>
          </div>

          <nav className="flex flex-col space-y-2">
            {[
              { id: 'email', label: 'Email Logs' },
              { id: 'feedback', label: 'Client Feedback' },
              { id: 'settings', label: 'Settings' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setReplyTarget(null); 
                  setPasswordStatus({ type: '', text: '' });
                }}
                className={`w-full text-left px-5 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-between ${
                  activeTab === tab.id 
                    ? 'bg-dark text-white' 
                    : 'text-dark/50 hover:bg-[#fafafa] hover:text-dark'
                }`}
              >
                <span>{tab.label}</span>
                {tab.id === 'email' && unreadCount > 0 && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${activeTab === 'email' ? 'bg-white text-dark' : 'bg-dark text-white'}`}>
                    {unreadCount}
                  </span>
                )}
                {tab.id === 'feedback' && feedbacks.length > 0 && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${activeTab === 'feedback' ? 'bg-white text-dark' : 'bg-dark/10 text-dark'}`}>
                    {feedbacks.length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="space-y-4">
          <button onClick={handleSignOut} className="text-[11px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors block text-left">
            → Sign Out Session
          </button>
          <div className="text-[10px] font-bold uppercase tracking-tight text-dark/30">
            ©2026 Dauphiné Creative. All rights reserved.
          </div>
        </div>
      </div>

      <div className="flex-grow pl-64 md:pl-80 w-full">
        <div className="max-w-[1100px] mx-auto p-8 md:p-12 w-full">
          
          <AnimatePresence mode="wait">
            
            {activeTab === 'email' && (
              <motion.div key="email" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }} className="space-y-8">
                <div className="flex justify-between items-center border-b border-dark/10 pb-6">
                  <div>
                    <h2 className="text-3xl font-medium tracking-tight uppercase">Email Logs</h2>
                    <p className="text-xs text-dark/40 mt-1">Daftar rekaman formulir masuk dari database.</p>
                  </div>
                  <button onClick={fetchInquiries} className="border border-dark/10 hover:border-dark text-dark px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all">
                    Refresh
                  </button>
                </div>

                {isLoading ? (
                  <div className="text-xs font-bold uppercase tracking-widest text-dark/30 py-20 text-center">Fetching incoming records...</div>
                ) : inquiries.length === 0 ? (
                  <div className="text-xs font-bold uppercase tracking-widest text-dark/30 py-20 text-center">No structural records found.</div>
                ) : (
                  <div className="space-y-6">
                    {inquiries.map((item) => (
                      <div 
                        key={item.id} 
                        className={`p-6 md:p-8 rounded-xl border space-y-6 transition-all ${
                          !item.is_read 
                            ? 'bg-[#f4f7fa] border-dark/20 shadow-sm' 
                            : 'bg-[#fafafa] border-dark/5'
                        }`}
                      >
                        
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-3">
                              <p className="text-sm font-bold tracking-tight">
                                {item.name} <span className="text-xs font-normal text-dark/40 font-mono">({item.email})</span>
                              </p>
                              
                              {item.is_replied && (
                                <span className="text-[9px] font-bold uppercase tracking-widest bg-green-100 text-green-700 px-2.5 py-0.5 rounded-md border border-green-200">
                                  Replied
                                </span>
                              )}

                              {!item.is_read && (
                                <span className="text-[9px] font-bold uppercase tracking-widest bg-dark text-white px-2 py-0.5 rounded-md">
                                  New
                                </span>
                              )}
                            </div>
                            
                            <p className="text-sm text-dark/70 leading-relaxed whitespace-pre-line">{item.message}</p>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-dark/30">
                              {new Date(item.created_at).toLocaleString('id-ID')}
                            </p>
                          </div>
                          
                          <div className="flex gap-4 items-center shrink-0">
                            <button 
                              onClick={() => handleToggleReplyForm(item)}
                              className={`text-xs font-bold uppercase tracking-widest border py-1.5 px-3 rounded transition-all ${
                                replyTarget?.id === item.id 
                                  ? 'bg-dark text-white border-dark' 
                                  : 'text-dark/60 hover:text-dark border-dark/10 hover:border-dark/30'
                              }`}
                            >
                              {replyTarget?.id === item.id ? 'Cancel' : 'Reply'}
                            </button>
                            <button onClick={() => handleDelete(item.id)} className="text-[11px] font-bold uppercase tracking-widest text-red-500/60 hover:text-red-600 py-1.5 px-2">
                              Remove
                            </button>
                          </div>
                        </div>

                        <AnimatePresence>
                          {replyTarget?.id === item.id && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }} 
                              animate={{ opacity: 1, height: 'auto' }} 
                              exit={{ opacity: 0, height: 0 }}
                              className="border-t border-dark/5 pt-6 mt-4"
                            >
                              <form onSubmit={(e) => handleSendReply(e, item)} className="space-y-4">
                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold uppercase tracking-widest text-dark/40">
                                    Balasan Resmi ke {item.email}
                                  </label>
                                  <textarea 
                                    rows="4"
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                    required
                                    placeholder="Tulis draf pesan balasan profesional Anda di sini..."
                                    className="w-full bg-white border border-dark/10 focus:border-dark outline-none p-4 text-dark text-sm rounded-xl resize-none transition-all placeholder:text-dark/20 leading-relaxed"
                                  />
                                </div>
                                <div className="flex justify-end">
                                  <button 
                                    type="submit"
                                    disabled={isSendingReply}
                                    className="bg-dark text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-dark/80 transition-all disabled:opacity-50"
                                  >
                                    {isSendingReply ? 'Sending Mail...' : 'Send Reply'}
                                  </button>
                                </div>
                              </form>
                            </motion.div>
                          )}
                        </AnimatePresence>

                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'feedback' && (
              <motion.div key="feedback" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }} className="space-y-8">
                <div className="flex justify-between items-center border-b border-dark/10 pb-6">
                  <div>
                    <h2 className="text-3xl font-medium tracking-tight uppercase">Client Feedback</h2>
                    <p className="text-xs text-dark/40 mt-1">Ulasan khusus, penilaian kualitas, dan validasi kepuasan klien.</p>
                  </div>
                  <button onClick={fetchFeedbacks} className="border border-dark/10 hover:border-dark text-dark px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all">
                    Refresh
                  </button>
                </div>

                {isFeedbackLoading ? (
                  <div className="text-xs font-bold uppercase tracking-widest text-dark/30 py-20 text-center">Loading testimonials...</div>
                ) : feedbacks.length === 0 ? (
                  <div className="text-xs font-bold uppercase tracking-widest text-dark/30 py-20 text-center">No feedback recorded yet.</div>
                ) : (
                  <div className="space-y-4">
                    {feedbacks.map((fb) => (
                      <div key={fb.id} className="bg-[#fafafa] p-6 rounded-xl border border-dark/5 flex justify-between items-start gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <p className="text-sm font-bold tracking-tight">
                              {fb.name} <span className="text-xs font-normal text-dark/40 font-mono">({fb.project})</span>
                            </p>
                            <span className="text-xs bg-dark/5 px-2 py-0.5 rounded text-dark/70 font-mono font-bold">
                              ★ {fb.rating}/5
                            </span>
                          </div>
                          <p className="text-sm text-dark/70 leading-relaxed whitespace-pre-line">"{fb.comment}"</p>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-dark/30">
                            {new Date(fb.created_at).toLocaleString('id-ID')}
                          </p>
                        </div>
                        <button onClick={() => handleDeleteFeedback(fb.id)} className="text-[11px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors p-2">
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }} className="space-y-8">
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
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;