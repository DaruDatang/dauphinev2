import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';
import { jsPDF } from 'jspdf';
import emailjs from '@emailjs/browser';

const PROPOSALS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const PROPOSALS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const ADMIN_REPLY_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_REPLY_TEMPLATE_ID;

const ProposalsTab = ({ proposals, isLoading, fetchProposals, setProposals }) => {
  const [reviewingId, setReviewingId] = useState(null);
  const [emailMessage, setEmailMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');

  // State untuk Custom Styled Toast Notification Box
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const triggerToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  const handleOpenReview = (item) => {
    setReviewingId(item.id);
    setEmailMessage(
      `Halo ${item.studio_leads?.name || 'Partner'},\n\n` +
      `Kami telah meninjau proposal penawaran untuk instansi ${item.studio_leads?.institution || '—'}.\n\n` +
      `Kami menyetujui alokasi parameter investasi senilai ${formatCurrency(item.system_final_offer)} dengan rincian cakupan kerja yang telah ditentukan.\n\n` +
      `Mari jadwalkan pertemuan singkat minggu ini untuk penandatanganan kesepakatan produksi.`
    );
  };

  // Memperbaiki mekanisme update status independen dengan verifikasi mutasi baris data
  const handleUpdateStatusInline = async (id, newStatus) => {
    try {
      // Menggunakan .select() untuk memaksa Supabase mengembalikan baris data yang berhasil diubah
      const { data, error } = await supabase
        .from('studio_proposals')
        .update({ deal_status: newStatus })
        .eq('id', id)
        .select();

      if (error) throw error;

      // Jika data kosong, artinya RLS memblokir otorisasi UPDATE Anda di server
      if (!data || data.length === 0) {
        triggerToast('Aksi Ditolak: Aktifkan Policy UPDATE untuk role public di dashboard Supabase Anda!', 'error');
        return;
      }

      // Sinkronisasi mutasi state lokal jika berhasil lolos verifikasi database
      if (setProposals) {
        setProposals(prev => prev.map(p => p.id === id ? { ...p, deal_status: newStatus } : p));
      }

      triggerToast(`Status pipeline berhasil diperbarui ke tingkat: ${newStatus}`, 'success');
      if (fetchProposals) fetchProposals();
    } catch (err) {
      triggerToast('Gagal menyinkronkan status: ' + err.message, 'error');
    }
  };

  const handleSendEmailResponse = async (e, item) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const templateParams = {
        to_name: item.studio_leads?.name,
        to_email: item.studio_leads?.email,
        institution: item.studio_leads?.institution,
        final_offer: formatCurrency(item.system_final_offer),
        message: emailMessage,
      };

      await emailjs.send(
        PROPOSALS_SERVICE_ID,
        ADMIN_REPLY_TEMPLATE_ID,
        templateParams,
        PROPOSALS_PUBLIC_KEY
      );

      triggerToast('Tanggapan kustom resmi berhasil di-dispatch via EmailJS.', 'success');
      setReviewingId(null);
      if (fetchProposals) fetchProposals();
    } catch (err) {
      const friendlyErrorMessage = err?.text || err?.message || 'Terjadi gangguan konfigurasi API';
      triggerToast('Aksi penolakan server: ' + friendlyErrorMessage, 'error');
    } finally {
      setIsSending(false);
    }
  };

  const handleDownloadPDF = (item) => {
    const doc = new jsPDF();
    
    doc.setFillColor(30, 30, 30);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(20);
    doc.text("DAUPHINÉ CREATIVE", 20, 26);
    
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(10);
    doc.setFont("Helvetica", "normal");
    doc.text(`Tanggal Dokumen: ${new Date(item.created_at).toLocaleDateString('id-ID')}`, 140, 55);
    
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.text("OFFICIAL PROJECT PROPOSAL PITCH DECK", 20, 55);
    
    doc.setDrawColor(230, 230, 230);
    doc.line(20, 60, 190, 60);
    
    doc.setFontSize(11);
    doc.text("IDENTITAS REKANAN PARTNER:", 20, 72);
    doc.setFont("Helvetica", "normal");
    doc.text(`Nama Penanggung Jawab : ${item.studio_leads?.name || '—'}`, 20, 80);
    doc.text(`Instansi / Perusahaan   : ${item.studio_leads?.institution || '—'}`, 20, 86);
    doc.text(`Kontak WhatsApp        : ${item.studio_leads?.whatsapp || '—'}`, 20, 92);
    doc.text(`Email Korporat          : ${item.studio_leads?.email || '—'}`, 20, 98);
    
    doc.line(20, 106, 190, 106);
    
    doc.setFont("Helvetica", "bold");
    doc.text("RINCIAN KEBUTUHAN PROJEK & ANGGARAN:", 20, 118);
    
    let currentY = 128;
    
    doc.setFillColor(245, 245, 245);
    doc.rect(20, currentY, 170, 8, 'F');
    doc.setFontSize(9);
    doc.setTextColor(30, 30, 30);
    doc.text("Deskripsi Layanan & Cakupan Kerja", 24, currentY + 5.5);
    doc.text("Budget Klien", 115, currentY + 5.5);
    doc.text("Tawaran Sistem", 152, currentY + 5.5);
    
    currentY += 8;
    
    item.selected_services?.forEach((srv) => {
      currentY += 10;
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(30, 30, 30);
      doc.text(srv.serviceName, 24, currentY);
      
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(9);
      doc.text(formatCurrency(srv.userProposed), 115, currentY);
      
      doc.setFont("Helvetica", "bold");
      doc.text(formatCurrency(srv.systemOffered), 152, currentY);
      
      currentY += 5;
      doc.setFont("Helvetica", "oblique");
      doc.setFontSize(8);
      doc.setTextColor(110, 110, 110);
      
      const scopeString = `Include: ${getDynamicScope(srv.serviceId, srv.userProposed)}`;
      const splitScopeLines = doc.splitTextToSize(scopeString, 85);
      doc.text(splitScopeLines, 24, currentY);
      
      currentY += (splitScopeLines.length - 1) * 4.5;
    });
    
    let totalOffered = item.selected_services?.reduce((acc, curr) => acc + curr.systemOffered, 0) || 0;
    let bundleDiscount = 0;
    if (item.selected_services?.length > 1) {
      bundleDiscount = Math.round(totalOffered * 0.05);
    }
    
    doc.setTextColor(30, 30, 30);
    if (bundleDiscount > 0) {
      currentY += 12;
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(34, 197, 94);
      doc.text("Bundle Advantage Discount (5%)", 24, currentY);
      doc.text(`-${formatCurrency(bundleDiscount)}`, 152, currentY);
      doc.setTextColor(30, 30, 30);
    }
    
    currentY += 12;
    doc.setFillColor(30, 30, 30);
    doc.rect(20, currentY, 170, 12, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.text("TOTAL INVESTASI KESEPAKATAN FINAL:", 24, currentY + 7.5);
    doc.text(formatCurrency(item.system_final_offer), 150, currentY + 7.5);
    
    currentY += 28;
    doc.setTextColor(120, 120, 120);
    doc.setFontSize(9);
    doc.setFont("Helvetica", "normal");
    doc.text("Dokumen ini dihasilkan secara otomatis melalui sistem manajemen Dauphiné Creative.", 20, currentY);
    
    doc.save(`Dauphine_Proposal_${(item.studio_leads?.institution || 'Klien').replace(/\s+/g, '_')}.pdf`);
  };

  const handleDeleteProposal = async (id) => {
    if (!window.confirm("Hapus catatan proposal ini secara permanen dari database?")) return;
    try {
      const { data, error } = await supabase
        .from('studio_proposals')
        .delete()
        .eq('id', id)
        .select();

      if (error) throw error;

      if (!data || data.length === 0) {
        triggerToast('Gagal menghapus: Aksi ditolak RLS database Supabase.', 'error');
        return;
      }
      
      if (setProposals) {
        setProposals(prev => prev.filter(p => p.id !== id));
      }

      triggerToast('Berkas proposal berhasil dieliminasi dari server database.', 'success');
      if (fetchProposals) fetchProposals();
    } catch (err) {
      triggerToast('Gagal menghapus proposal: ' + err.message, 'error');
    }
  };

  const getDynamicScope = (id, budget) => {
    if (id === 'smm') {
      const posts = Math.floor(budget / 350000);
      return `${posts}x Konten Feeds/Stories Organik, Copywriting, Hashtag Research & Scheduling`;
    }
    if (id === 'cp') {
      const videos = Math.floor(budget / 850000);
      return `${videos}x Produksi Video Pendek (Editing & Raw Aset Kreatif Vertikal)`;
    }
    if (id === 'its') {
      if (budget < 10000000) return 'Standard Landing Page / Company Profile (Single-page UI Teroptimasi)';
      if (budget < 25000000) return 'Dynamic Website, Multi-page Layout, Standard Database Integration & Core CMS';
      return 'Custom Functional Platform Engine, Extended Database Architecture & Advanced Admin Panel';
    }
    if (id === 'pp') {
      const photos = Math.floor(budget / 150000);
      return `${photos}x Foto Produk Katalog Komersial Dengan Hasil Retouch Profesional`;
    }
    return '';
  };

  const totalCount = proposals.length;
  const pendingCount = proposals.filter(p => p.deal_status === 'Proposed').length;
  const totalDealCapital = proposals.filter(p => p.deal_status === 'Deal').reduce((acc, curr) => acc + (curr.system_final_offer || 0), 0);

  const filteredProposals = proposals.filter(p => {
    if (statusFilter === 'All') return true;
    return p.deal_status === statusFilter;
  });

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 relative">
      
      {/* Premium Toast Notification Modal Container */}
      <AnimatePresence>
        {toast.show && (
          <motion.div 
            initial={{ opacity: 0, y: -40, x: '-50%', scale: 0.95 }}
            animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
            exit={{ opacity: 0, y: -20, x: '-50%', scale: 0.95 }}
            className={`fixed top-8 left-1/2 z-50 px-5 py-3 rounded-xl border text-[10px] font-mono font-bold tracking-wider uppercase shadow-xl flex items-center gap-3 w-full max-w-md ${
              toast.type === 'error' 
                ? 'bg-red-950/90 text-red-200 border-red-800 backdrop-blur-md' 
                : 'bg-black/90 text-white border-white/10 backdrop-blur-md'
            }`}
          >
            <span className={toast.type === 'error' ? 'text-red-400' : 'text-green-400'}>
              {toast.type === 'error' ? '⚡ ERROR:' : '✨ SYSTEM:'}
            </span>
            <span className="flex-1 text-left opacity-90">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center border-b border-dark/10 pb-6">
        <div>
          <h2 className="text-3xl font-medium tracking-tight uppercase">Project Proposals</h2>
          <p className="text-xs text-dark/40 mt-1">Simulasi alokasi dana penawaran interaktif dan pipeline negosiasi klien eksternal.</p>
        </div>
        <button onClick={fetchProposals} className="border border-dark/10 hover:border-dark text-dark px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all">
          Refresh List
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#fafafa] p-5 rounded-2xl border border-dark/5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-dark/40">Total Inbound Proposal</p>
          <p className="text-4xl font-mono font-medium tracking-tight text-dark mt-1">{totalCount} Deals</p>
        </div>
        <div className="bg-[#fafafa] p-5 rounded-2xl border border-dark/5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-dark/40">Awaiting Response</p>
          <p className={`text-4xl font-mono font-medium tracking-tight mt-1 ${pendingCount > 0 ? 'text-amber-600' : 'text-dark/30'}`}>{pendingCount}</p>
        </div>
        <div className="bg-[#fafafa] p-5 rounded-2xl border border-dark/5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-dark/40">Secured Deal Pipelines</p>
          <p className="text-4xl font-mono font-medium tracking-tight text-green-700 mt-1">{formatCurrency(totalDealCapital)}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#fafafa] p-3 rounded-2xl border border-dark/5">
        <div className="flex gap-1.5 overflow-x-auto w-full pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'All', label: 'All Enquiries' },
            { id: 'Proposed', label: 'Proposed / New' },
            { id: 'Reviewed', label: 'Reviewed' },
            { id: 'Deal', label: 'Closed Deal' }
          ].map((tab) => (
            <button key={tab.id} onClick={() => setStatusFilter(tab.id)} className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${statusFilter === tab.id ? 'bg-dark text-white' : 'text-dark/40 hover:text-dark bg-dark/5'}`}>
              {tab.label}
            </button>
          ))}
        </div>
        <div className="text-[9px] font-bold tracking-widest uppercase text-dark/40 font-mono pr-2">
          Total Queue: {filteredProposals.length} Items
        </div>
      </div>

      {isLoading ? (
        <div className="text-xs font-bold uppercase tracking-widest text-dark/30 py-20 text-center">Synchronizing negotiation vault...</div>
      ) : filteredProposals.length === 0 ? (
        <div className="text-xs font-bold uppercase tracking-widest text-dark/30 py-20 text-center">No proposals inside this filter segment.</div>
      ) : (
        <div className="space-y-4">
          {filteredProposals.map((item) => {
            const isReviewing = reviewingId === item.id;
            
            return (
              <div key={item.id} className="bg-white rounded-2xl border border-dark/10 p-6 shadow-sm space-y-4 hover:border-dark/20 transition-all">
                
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-6">
                  <div className="space-y-3 flex-grow min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h4 className="text-sm font-bold text-dark uppercase tracking-wide">{item.studio_leads?.name || 'Anonymous Lead'}</h4>
                      <span className="text-[10px] font-mono font-bold text-dark/40">({item.studio_leads?.institution || 'No Company'})</span>
                      
                      <select
                        value={item.deal_status || 'Proposed'}
                        onChange={(e) => handleUpdateStatusInline(item.id, e.target.value)}
                        className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border cursor-pointer outline-none transition-all shadow-sm focus:ring-0 font-mono ${
                          item.deal_status === 'Deal' ? 'bg-green-50 text-green-700 border-green-200' :
                          item.deal_status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-200' : 
                          item.deal_status === 'Reviewed' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        <option value="Proposed">Proposed (New)</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Deal">Closed Deal</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>

                    <div className="bg-[#fafafa] border border-dark/5 rounded-xl p-3 space-y-2">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-dark/40 font-mono">Requested Items Customizer Breakdown:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {item.selected_services?.map((srv, idx) => (
                          <span key={idx} className="bg-white border border-dark/10 px-2.5 py-1 rounded text-[10px] font-medium uppercase text-dark/80">
                            {srv.serviceName}
                          </span>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 border-t border-dark/5 pt-2 mt-2 text-[11px]">
                        <div><span className="text-dark/40">Client Raw Budget:</span> <span className="font-mono font-bold text-dark">{formatCurrency(item.user_total_budget)}</span></div>
                        <div><span className="text-dark/40">System Offer Summary:</span> <span className="font-mono font-bold text-green-700">{formatCurrency(item.system_final_offer)}</span></div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-mono font-bold text-dark/40">
                      <div>📞 {item.studio_leads?.whatsapp || '—'}</div>
                      <div>✉️ {item.studio_leads?.email || '—'}</div>
                      <div>🗓️ {item.created_at ? new Date(item.created_at).toLocaleString('id-ID') : '—'}</div>
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0 items-center md:flex-col md:items-end select-none w-full md:w-auto">
                    <button onClick={() => handleOpenReview(item)} className="flex-1 md:flex-none text-[10px] font-bold uppercase tracking-widest border border-dark/10 hover:border-dark text-dark px-3 py-2 rounded-lg transition-all bg-[#fafafa]">
                      Review & Reply
                    </button>
                    <button onClick={() => handleDownloadPDF(item)} className="flex-1 md:flex-none text-[10px] font-bold uppercase tracking-widest bg-dark text-white px-3 py-2 rounded-lg transition-all">
                      📥 Download PDF
                    </button>
                    <button onClick={() => handleDeleteProposal(item.id)} className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700 px-2 py-1 transition-all md:mt-2">
                      Remove
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {isReviewing && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }} 
                      exit={{ opacity: 0, height: 0 }} 
                      className="pt-2 border-t border-dark/5 overflow-hidden"
                    >
                      <form onSubmit={(e) => handleSendEmailResponse(e, item)} className="bg-[#fafafa] border border-dark/10 rounded-2xl p-5 mt-2 space-y-4">
                        <div className="flex justify-between items-center border-b border-dark/5 pb-2.5">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-dark/40 block font-mono">✉️ Draft Official Email Statement</span>
                            <p className="text-[9px] text-dark/40">Pesan di bawah akan di-dispatch menggunakan arsitektur akun EmailJS Baru.</p>
                          </div>
                          <span className="text-[9px] font-mono font-bold text-dark/30 bg-white border border-dark/5 px-2.5 py-1 rounded-md">
                            To: {item.studio_leads?.email || '—'}
                          </span>
                        </div>
                        
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-widest text-dark/50 block ms-0.5 font-mono">Message Canvas Editor</label>
                          <textarea 
                            rows="6" 
                            value={emailMessage} 
                            onChange={(e) => setEmailMessage(e.target.value)} 
                            required 
                            className="w-full bg-white border border-dark/10 focus:border-dark outline-none p-4 text-xs font-mono rounded-xl transition-all leading-relaxed shadow-sm resize-y text-dark"
                            placeholder="Tulis pesan kesepakatan produksi kustom Anda disini..."
                          />
                        </div>
                        
                        <div className="flex justify-end gap-2 text-[10px] font-bold uppercase tracking-wider select-none pt-1">
                          <button type="button" onClick={() => setReviewingId(null)} className="border border-dark/10 text-dark px-4 py-2 rounded-xl bg-white hover:border-dark transition-all">
                            Cancel
                          </button>
                          <button type="submit" disabled={isSending} className="bg-dark text-white px-5 py-2 rounded-xl hover:bg-dark/90 disabled:opacity-50 transition-all">
                            {isSending ? 'Sending Dispatch...' : '🚀 Dispatch Official Email'}
                          </button>
                        </div>
                      </form>
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

export default ProposalsTab;