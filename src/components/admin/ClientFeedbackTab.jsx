import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';

const ClientFeedbackTab = ({ feedbacks = [], isFeedbackLoading, fetchFeedbacks, setFeedbacks }) => {
  const [reviewingId, setEditingId] = useState(null);
  const [adminReply, setAdminReply] = useState('');
  const [statusUpdate, setStatusUpdate] = useState('Approved');
  const [isUpdating, setIsUpdating] = useState(false);
  const [ratingFilter, setRatingFilter] = useState('All');

  // Perhitungan Metrik Analitik
  const totalFeedbacks = feedbacks.length;
  
  const avgRating = totalFeedbacks > 0
    ? (feedbacks.reduce((acc, curr) => acc + (curr.rating || 0), 0) / totalFeedbacks).toFixed(1)
    : "0.0";

  const pendingReview = feedbacks.filter(f => (f.status || 'Pending') === 'Pending').length;

  // Distribusi Rating (1 - 5 Bintang)
  const ratingDistribution = feedbacks.reduce((acc, curr) => {
    const r = Math.round(curr.rating) || 5;
    acc[r] = (acc[r] || 0) + 1;
    return acc;
  }, { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });

  const handleOpenReviewPanel = (item) => {
    setEditingId(item.id);
    setAdminReply(item.admin_reply || '');
    setStatusUpdate(item.status || 'Approved');
  };

  const handleSaveReview = async (id) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('feedbacks')
        .update({
          status: statusUpdate,
          admin_reply: adminReply
        })
        .eq('id', id);

      if (error) throw error;

      setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, status: statusUpdate, admin_reply: adminReply } : f));
      alert('Sertifikasi ulasan partner berhasil dikonfigurasi ulang.');
      setEditingId(null);
    } catch (err) {
      alert('Gagal memperbarui ulasan: ' + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteFeedback = async (id) => {
    if (!window.confirm("Hapus ulasan atau testimoni klien ini secara permanen dari server database?")) return;
    try {
      const { error } = await supabase.from('feedbacks').delete().eq('id', id);
      if (error) throw error;
      setFeedbacks(feedbacks.filter(f => f.id !== id));
    } catch (err) {
      alert('Gagal menghapus feedback: ' + err.message);
    }
  };

  // Filter Data Testimoni
  const filteredFeedbacks = feedbacks.filter(f => {
    if (ratingFilter === 'All') return true;
    if (ratingFilter === 'Critical') return (f.rating || 5) <= 3;
    return Math.round(f.rating) === parseInt(ratingFilter);
  });

  const inputClass = "w-full bg-white border border-dark/10 focus:border-dark outline-none p-3 text-xs rounded-xl transition-all";
  const labelClass = "text-[9px] font-bold uppercase tracking-widest text-dark/40 block mb-1 ms-0.5";

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }} className="space-y-8">
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center border-b border-dark/10 pb-6">
        <div>
          <h2 className="text-3xl font-medium tracking-tight uppercase">Client Feedback</h2>
          <p className="text-xs text-dark/40 mt-1">Ulasan khusus, penilaian kualitas, dan validasi kepuasan klien.</p>
        </div>
        <button onClick={fetchFeedbacks} className="border border-dark/10 hover:border-dark text-dark px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all">
          Refresh Data
        </button>
      </div>

      {/* METRICS & DIAGRAM GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CARD CARD METRICS */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="bg-[#fafafa] p-6 rounded-2xl border border-dark/5 shadow-sm flex-1 flex flex-col justify-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-dark/40">Average Satisfaction Score</p>
            <p className="text-5xl font-mono font-medium tracking-tighter text-dark mt-2">{avgRating} <span className="text-xl text-dark/30">/ 5.0</span></p>
            <p className="text-xs text-dark/40 mt-3 border-t border-dark/5 pt-3">Dioptimasi dari total {totalFeedbacks} ukt eksternal.</p>
          </div>

          <div className="bg-[#fafafa] p-6 rounded-2xl border border-dark/5 shadow-sm flex-1 flex flex-col justify-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-dark/40">Pending Moderation Task</p>
            <p className={`text-5xl font-mono font-medium tracking-tighter mt-2 ${pendingReview > 0 ? 'text-amber-600' : 'text-dark/30'}`}>{pendingReview}</p>
            <p className="text-xs text-dark/40 mt-3 border-t border-dark/5 pt-3">Testimoni masuk yang belum diverifikasi admin.</p>
          </div>
        </div>

        {/* DIAGRAM HORIZONTAL: RATING DISTRIBUTION */}
        <div className="lg:col-span-2 bg-[#fafafa] p-6 rounded-2xl border border-dark/5 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-dark">Rating Frequency Weight</h3>
            <p className="text-[11px] text-dark/40 mt-0.5">Proporsi sebaran persepsi kualitas output studio berdasarkan skala bintang.</p>
          </div>

          <div className="space-y-2.5 my-auto py-2">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = ratingDistribution[stars] || 0;
              const barPercentage = totalFeedbacks > 0 ? Math.round((count / totalFeedbacks) * 100) : 0;
              
              return (
                <div key={stars} className="flex items-center gap-4 text-xs font-bold">
                  <span className="w-12 font-mono text-dark/50 shrink-0 uppercase text-[10px]">{stars} Stars</span>
                  <div className="flex-1 bg-dark/5 h-3 rounded-full overflow-hidden relative flex items-center">
                    <div className="bg-dark h-full transition-all duration-1000" style={{ width: `${barPercentage}%` }} />
                  </div>
                  <span className="w-16 text-right font-mono text-dark/40 font-semibold text-[11px]">({count}) {barPercentage}%</span>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-dark/5 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-dark/30">Akumulasi Grafik Skala Kepuasan</p>
          </div>
        </div>
      </div>

      {/* FILTER CONTROL NAV */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#fafafa] p-3 rounded-2xl border border-dark/5">
        <div className="flex gap-1.5 overflow-x-auto w-full pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'All', label: 'All Reviews' },
            { id: '5', label: '5 Stars' },
            { id: '4', label: '4 Stars' },
            { id: 'Critical', label: 'Critical (≤ 3)' }
          ].map((tab) => (
            <button key={tab.id} onClick={() => setRatingFilter(tab.id)} className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${ratingFilter === tab.id ? 'bg-dark text-white' : 'text-dark/40 hover:text-dark bg-dark/5'}`}>
              {tab.label}
            </button>
          ))}
        </div>
        <div className="text-[9px] font-bold tracking-widest uppercase text-dark/40 font-mono pr-2">
          Showing: {filteredFeedbacks.length} Items
        </div>
      </div>

      {/* FEEDBACK LIST PIPELINE */}
      {isFeedbackLoading ? (
        <div className="text-xs font-bold uppercase tracking-widest text-dark/30 py-20 text-center">Synchronizing satisfaction ledger...</div>
      ) : filteredFeedbacks.length === 0 ? (
        <div className="text-xs font-bold uppercase tracking-widest text-dark/30 py-20 text-center">No review logs inside this category.</div>
      ) : (
        <div className="space-y-4">
          {filteredFeedbacks.map((item) => {
            const isReviewing = reviewingId === item.id;
            const currentStatus = item.status || 'Pending';

            return (
              <div key={item.id} className="bg-white rounded-2xl border border-dark/10 p-6 shadow-sm space-y-4 hover:border-dark/20 transition-all">
                
                {/* CARD BODY DEFAULT */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-dark uppercase tracking-wide">{item.name}</h4>
                      {item.company && (
                        <span className="text-[10px] font-mono font-bold text-dark/40">({item.company})</span>
                      )}
                      <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${
                        currentStatus === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' :
                        currentStatus === 'Hidden' ? 'bg-gray-50 text-gray-500 border-gray-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {currentStatus}
                      </span>
                    </div>
                    <p className="text-xs text-dark/80 italic font-medium leading-relaxed">"{item.comment || 'No comment text left.'}"</p>
                    <p className="text-[10px] font-mono text-dark/30 font-bold">
                      {item.created_at ? new Date(item.created_at).toLocaleString('id-ID') : '—'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 sm:text-right sm:flex-col sm:items-end">
                    <span className="bg-dark text-white font-mono text-[10px] font-bold px-3 py-1 rounded-lg tracking-wider">
                      ★ {item.rating || 5} / 5
                    </span>
                    <div className="flex gap-2">
                      <button onClick={() => handleOpenReviewPanel(item)} className="text-[10px] font-bold uppercase tracking-widest border border-dark/10 hover:border-dark text-dark px-3 py-1.5 rounded-lg transition-all bg-[#fafafa]">
                        Review / Reply
                      </button>
                      <button onClick={() => handleDeleteFeedback(item.id)} className="text-[10px] font-bold uppercase tracking-widest text-red-500/50 hover:text-red-600 px-2 py-1.5 transition-all">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>

                {/* ADMIN REPLY SHOWN UNDER COMMENT IF EXISTS */}
                {item.admin_reply && !isReviewing && (
                  <div className="bg-dark/[0.02] border-l-2 border-dark/30 p-3.5 rounded-r-xl ms-2 space-y-1">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-dark/40 font-mono">Dauphiné Studio Response:</p>
                    <p className="text-xs text-dark/70 font-medium">"{item.admin_reply}"</p>
                  </div>
                )}

                {/* EXPANDABLE REVIEW PANEL SHEET */}
                <AnimatePresence>
                  {isReviewing && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="pt-4 border-t border-dark/5 space-y-4 overflow-hidden">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1">
                          <label className={labelClass}>Publication Status</label>
                          <select value={statusUpdate} onChange={(e) => setStatusUpdate(e.target.value)} className={inputClass}>
                            <option value="Pending">Pending (In Moderation)</option>
                            <option value="Approved">Approved (Publicly Visible)</option>
                            <option value="Hidden">Hidden / Archived</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className={labelClass}>Admin Note / Client Response Reply</label>
                          <input type="text" placeholder="Tulis ucapan terimakasih atau catatan review internal di sini..." value={adminReply} onChange={(e) => setAdminReply(e.target.value)} className={inputClass} />
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2 text-[10px] font-bold uppercase tracking-wider">
                        <button type="button" onClick={() => setEditingId(null)} className="border border-dark/10 text-dark px-3 py-1.5 rounded-lg bg-white">
                          Cancel
                        </button>
                        <button type="button" onClick={() => handleSaveReview(item.id)} disabled={isUpdating} className="bg-dark text-white px-4 py-1.5 rounded-lg disabled:opacity-50">
                          {isUpdating ? 'Saving...' : 'Verify Review'}
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

export default ClientFeedbackTab;