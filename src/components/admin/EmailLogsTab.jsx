import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';

const EmailLogsTab = ({ inquiries = [], isLoading, fetchInquiries, setInquiries }) => {
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');

  // 1. Perhitungan Metrik Analitik Utama
  const totalEmails = inquiries.length;
  const unreadEmails = inquiries.filter(e => !e.is_read).length;
  // Mengakomodasi indikator badge REPLIED seperti pada referensi berkas image_7ecaaf.png
  const repliedEmails = inquiries.filter(e => e.status === 'Replied' || e.is_replied).length; 

  const responseRate = totalEmails > 0 
    ? Math.round((repliedEmails / totalEmails) * 100) 
    : 0;

  // 2. Perhitungan Distribusi Provider Email (Domain Analysis)
  const domainDistribution = inquiries.reduce((acc, curr) => {
    if (!curr.email) return acc;
    const domain = curr.email.split('@')[1]?.toLowerCase();
    if (!domain) return acc;
    
    if (domain.includes('gmail.com')) {
      acc['Gmail'] = (acc['Gmail'] || 0) + 1;
    } else if (domain.includes('yahoo') || domain.includes('ymail')) {
      acc['Yahoo'] = (acc['Yahoo'] || 0) + 1;
    } else {
      acc['Corporate / Other'] = (acc['Corporate / Other'] || 0) + 1;
    }
    return acc;
  }, { 'Gmail': 0, 'Yahoo': 0, 'Corporate / Other': 0 });

  // 3. Fungsi Aksi Mengubah Status / Reply
  const handleOpenReply = (item) => {
    setReplyingId(item.id);
    setReplyText(item.admin_reply_text || '');
    
    // Otomatis tandai sebagai terbaca (Read) saat admin membuka email ini
    if (!item.is_read) {
      handleMarkAsRead(item.id);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await supabase.from('inquiries').update({ is_read: true }).eq('id', id);
      setInquiries(prev => prev.map(e => e.id === id ? { ...e, is_read: true } : e));
    } catch (err) {
      console.error('Gagal menandai terbaca:', err.message);
    }
  };

  const handleSendReply = async (id) => {
    setIsSubmittingReply(true);
    try {
      // Perbarui status menjadi Replied di database Supabase
      const { error } = await supabase
        .from('inquiries')
        .update({
          status: 'Replied',
          is_read: true,
          admin_reply_text: replyText
        })
        .eq('id', id);

      if (error) throw error;

      setInquiries(prev => prev.map(e => e.id === id ? { ...e, status: 'Replied', is_read: true, admin_reply_text: replyText } : e));
      alert('Email berhasil ditandai sebagai terbalas (Replied).');
      setReplyingId(null);
    } catch (err) {
      alert('Gagal mengirim respon: ' + err.message);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleDeleteEmail = async (id) => {
    if (!window.confirm("Hapus rekaman log pesan masuk ini secara permanen dari database?")) return;
    try {
      const { error } = await supabase.from('inquiries').delete().eq('id', id);
      if (error) throw error;
      setInquiries(inquiries.filter(e => e.id !== id));
    } catch (err) {
      alert('Gagal menghapus log email: ' + err.message);
    }
  };

  // 4. Jalur Filter Data
  const filteredEmails = inquiries.filter(e => {
    if (statusFilter === 'All') return true;
    if (statusFilter === 'Unread') return !e.is_read;
    if (statusFilter === 'Replied') return e.status === 'Replied' || e.is_replied;
    return true;
  });

  const inputClass = "w-full bg-white border border-dark/10 focus:border-dark outline-none p-3.5 text-xs rounded-xl transition-all";
  const labelClass = "text-[9px] font-bold uppercase tracking-widest text-dark/40 block mb-1.5 ms-0.5";

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }} className="space-y-8">
      
      {/* HEADER SECTION CONTROLS */}
      <div className="flex justify-between items-center border-b border-dark/10 pb-6">
        <div>
          <h2 className="text-3xl font-medium tracking-tight uppercase">Email Logs</h2>
          <p className="text-xs text-dark/40 mt-1">Daftar rekaman formulir masuk dari database.</p>
        </div>
        <button onClick={fetchInquiries} className="border border-dark/10 hover:border-dark text-dark px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all">
          Refresh Inbox
        </button>
      </div>

      {/* GRAPHIC VISUALIZATION & ANALYTICS WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COUNTER CARDS BLOCK */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="bg-[#fafafa] p-5 rounded-2xl border border-dark/5 shadow-sm flex-1 flex flex-col justify-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-dark/40">Response Performance</p>
            <p className="text-5xl font-mono font-medium tracking-tighter text-dark mt-1.5">{responseRate}%</p>
            <p className="text-xs text-dark/40 mt-2.5 border-t border-dark/5 pt-2.5">Rasio pesan masuk yang berhasil ditangani studio.</p>
          </div>

          <div className="bg-[#fafafa] p-5 rounded-2xl border border-dark/5 shadow-sm flex-1 flex flex-col justify-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-dark/40">Unread Alert Inbox</p>
            <p className={`text-5xl font-mono font-medium tracking-tighter mt-1.5 ${unreadEmails > 0 ? 'text-red-500' : 'text-dark/20'}`}>{unreadEmails}</p>
            <p className="text-xs text-dark/40 mt-2.5 border-t border-dark/5 pt-2.5">Jumlah antrean formulir baru yang butuh review.</p>
          </div>
        </div>

        {/* DIAGRAM PROFILE WEIGHT: DOMAIN ANALYSIS */}
        <div className="lg:col-span-2 bg-[#fafafa] p-6 rounded-2xl border border-dark/5 shadow-sm space-y-5 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-dark">Lead Email Domain Channels</h3>
            <p className="text-[11px] text-dark/40 mt-0.5">Analisis segmentasi asal akun korespondensi pengirim pesan.</p>
          </div>

          <div className="space-y-3 my-auto py-1">
            {Object.entries(domainDistribution).map(([domainName, count]) => {
              const barPercentage = totalEmails > 0 ? Math.round((count / totalEmails) * 100) : 0;
              return (
                <div key={domainName} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold uppercase tracking-wide">
                    <span className="text-dark/60">{domainName} ({count})</span>
                    <span className="font-mono text-dark">{barPercentage}%</span>
                  </div>
                  <div className="w-full bg-dark/5 h-2.5 rounded-full overflow-hidden relative">
                    <div className="bg-dark h-full transition-all duration-1000" style={{ width: `${barPercentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-dark/5 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-dark/30">Proporsi Saluran Rujukan Pengirim</p>
          </div>
        </div>

      </div>

      {/* FILTER CONTROL NAV PIPE */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#fafafa] p-3 rounded-2xl border border-dark/5">
        <div className="flex gap-1.5 overflow-x-auto w-full pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'All', label: 'All Inquiries' },
            { id: 'Unread', label: 'Unread / New' },
            { id: 'Replied', label: 'Replied History' }
          ].map((tab) => (
            <button key={tab.id} onClick={() => setStatusFilter(tab.id)} className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${statusFilter === tab.id ? 'bg-dark text-white' : 'text-dark/40 hover:text-dark bg-dark/5'}`}>
              {tab.label}
            </button>
          ))}
        </div>
        <div className="text-[9px] font-bold tracking-widest uppercase text-dark/40 font-mono pr-2">
          Total Queue: {filteredEmails.length} Records
        </div>
      </div>

      {/* EMAIL PIPELINE CARD COMPONENT */}
      {isLoading ? (
        <div className="text-xs font-bold uppercase tracking-widest text-dark/30 py-20 text-center">Synchronizing communications server...</div>
      ) : filteredEmails.length === 0 ? (
        <div className="text-xs font-bold uppercase tracking-widest text-dark/30 py-20 text-center">Inbox is empty for this selected category.</div>
      ) : (
        <div className="space-y-4">
          {filteredEmails.map((item) => {
            const isReplying = replyingId === item.id;
            const isRepliedStatus = item.status === 'Replied' || item.is_replied;

            return (
              <div key={item.id} className={`bg-white rounded-2xl border p-6 transition-all shadow-sm space-y-4 ${!item.is_read ? 'border-blue-600/30 bg-blue-50/[0.02]' : 'border-dark/10 hover:border-dark/20'}`}>
                
                {/* CARD BODY INBOX LAYOUT */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-dark uppercase tracking-wide truncate max-w-[220px]">{item.name}</h4>
                      <span className="text-[10px] font-mono text-dark/40 font-semibold truncate">({item.email})</span>
                      
                      {/* Sistem badge status cerdas sesuai referensi file image_7ecaaf.png */}
                      {isRepliedStatus ? (
                        <span className="text-[8px] font-bold uppercase tracking-widest bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded">
                          Replied
                        </span>
                      ) : !item.is_read ? (
                        <span className="text-[8px] font-bold uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded">
                          New Message
                        </span>
                      ) : (
                        <span className="text-[8px] font-bold uppercase tracking-widest bg-gray-50 text-gray-500 border border-gray-200 px-2 py-0.5 rounded">
                          Read
                        </span>
                      )}
                    </div>
                    
                    <p className="text-xs text-dark/80 font-medium leading-relaxed break-words">
                      "{item.message || 'No body message text provided.'}"
                    </p>
                    
                    <p className="text-[10px] font-mono text-dark/30 font-bold">
                      {item.created_at ? new Date(item.created_at).toLocaleString('id-ID') : '—'}
                    </p>
                  </div>

                  {/* ACTION TRIGGER SIDEKICK */}
                  <div className="flex gap-2 shrink-0 items-center sm:items-end select-none">
                    <button onClick={() => handleOpenReply(item)} className="text-[10px] font-bold uppercase tracking-widest border border-dark/10 hover:border-dark text-dark px-3 py-1.5 rounded-lg transition-all bg-[#fafafa]">
                      {isRepliedStatus ? 'View History' : 'Reply / Resolve'}
                    </button>
                    <button onClick={() => handleDeleteEmail(item.id)} className="text-[10px] font-bold uppercase tracking-widest text-red-500/50 hover:text-red-600 px-2 py-1.5 transition-all">
                      Remove
                    </button>
                  </div>
                </div>

                {/* ARCHIVED REPLY CONTEXT SHEET IF STORED */}
                {item.admin_reply_text && !isReplying && (
                  <div className="bg-dark/[0.01] border-l-2 border-dark/20 p-3.5 rounded-r-xl ms-1 space-y-1">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-dark/40 font-mono">Dauphiné Studio Outgoing Ledger:</p>
                    <p className="text-xs text-dark/60 font-medium">"{item.admin_reply_text}"</p>
                  </div>
                )}

                {/* MODULAR QUICK REPLY DRAWER */}
                <AnimatePresence>
                  {isReplying && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="pt-4 border-t border-dark/5 space-y-3.5 overflow-hidden">
                      <div>
                        <label className={labelClass}>Internal Response / Resolution Log Text</label>
                        <textarea rows="2" placeholder="Tuliskan catatan tindak lanjut email atau isi template balasan tim di sini..." value={replyText} onChange={(e) => setReplyText(e.target.value)} className={`${inputClass} resize-none`} />
                      </div>
                      
                      <div className="flex justify-end gap-2 text-[10px] font-bold uppercase tracking-wider">
                        <button type="button" onClick={() => setReplyingId(null)} className="border border-dark/10 text-dark px-3 py-1.5 rounded-lg bg-white">
                          Close
                        </button>
                        <button type="button" onClick={() => handleSendReply(item.id)} disabled={isSubmittingReply} className="bg-dark text-white px-4 py-1.5 rounded-lg disabled:opacity-50">
                          {isSubmittingReply ? 'Recording...' : 'Mark as Resolved'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default EmailLogsTab;