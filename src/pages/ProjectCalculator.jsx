import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/common/SEO';
import { supabase } from '../lib/supabaseClient';
import { jsPDF } from 'jspdf';
import emailjs from '@emailjs/browser';
import { useScrollTracking } from '../hooks/useScrollTracking';
import { trackEvent } from '../lib/analytics';
import { ShaderAnimation } from '../components/ui/shader-animation';

const PROPOSALS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const PROPOSALS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const CLIENT_NOTIF_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

const BASE_SERVICES = {
  'Social Media Management': { 
    id: 'smm', 
    name: 'Social Media Management', 
    basePrice: 3500000, 
    minPrice: 2000000,
    maxPrice: 7000000,
    desc: 'Optimasi konten grid, reels, copy, dan scheduling berkala.' 
  },
  'Content Production': { 
    id: 'cp', 
    name: 'Content Production', 
    basePrice: 5000000, 
    minPrice: 3000000,
    maxPrice: 10000000,
    desc: 'Produksi video pendek kreatif, TikTok/Reels, dan kebutuhan aset visual.' 
  },
  'IT Solution': { 
    id: 'its', 
    name: 'IT Solution', 
    basePrice: 15000000, 
    minPrice: 5000000,
    maxPrice: 100000000,
    desc: 'Pengembangan website enterprise, sistem kustom, dan integrasi API cloud.' 
  },
  'Product Photography': { 
    id: 'pp', 
    name: 'Product Photography', 
    basePrice: 2500000, 
    minPrice: 1500000,
    maxPrice: 5000000,
    desc: 'Sesi foto katalog studio profesional dengan penataan art direction.' 
  }
};

const ProjectCalculator = () => {
  useScrollTracking('Project Calculator');

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState('');
  const [institution, setInstitution] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [otherContact, setOtherContact] = useState('');
  const [aiConsultantText, setAiConsultantText] = useState('');
  const [aiRecommendedServices, setAiRecommendedServices] = useState([]);
  const [createdLeadId, setCreatedLeadId] = useState(null);

  const [selectedKeys, setSelectedKeys] = useState([]);
  const [userBudgets, setUserBudgets] = useState({}); 
  const [negotiationResult, setNegotiationResult] = useState(null);

  const handleToggleService = (key) => {
    trackEvent('toggle_service_selection', 'Engagement', key);
    if (selectedKeys.includes(key)) {
      setSelectedKeys(selectedKeys.filter(k => k !== key));
      const updatedBudgets = { ...userBudgets };
      delete updatedBudgets[key];
      setUserBudgets(updatedBudgets);
    } else {
      setSelectedKeys([...selectedKeys, key]);
      setUserBudgets({ ...userBudgets, [key]: BASE_SERVICES[key].basePrice });
    }
  };

  const handleBudgetChange = (key, value) => {
    setUserBudgets({ ...userBudgets, [key]: parseFloat(value) || 0 });
  };

  const handleNextToStep2 = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('studio_leads')
        .insert([{ name, institution, whatsapp, email, other_contact: otherContact }])
        .select();

      if (error) throw error;
      setCreatedLeadId(data[0].id);

      if (aiConsultantText.trim()) {
        const lowerText = aiConsultantText.toLowerCase();
        const detectedKeys = [];
        const initialBudgets = {};

        if (lowerText.includes('web') || lowerText.includes('sistem') || lowerText.includes('website') || lowerText.includes('apps') || lowerText.includes('erp') || lowerText.includes('crm') || lowerText.includes('it') || lowerText.includes('landing') || lowerText.includes('page')) {
          detectedKeys.push('IT Solution');
          initialBudgets['its'] = BASE_SERVICES['IT Solution'].basePrice;
        }
        if (lowerText.includes('instagram') || lowerText.includes('feeds') || lowerText.includes('sosmed') || lowerText.includes('social') || lowerText.includes('media') || lowerText.includes('scheduling') || lowerText.includes('branding')) {
          detectedKeys.push('Social Media Management');
          initialBudgets['smm'] = BASE_SERVICES['Social Media Management'].basePrice;
        }
        if (lowerText.includes('tiktok') || lowerText.includes('reels') || lowerText.includes('video') || lowerText.includes('konten') || lowerText.includes('editing')) {
          detectedKeys.push('Content Production');
          initialBudgets['cp'] = BASE_SERVICES['Content Production'].basePrice;
        }
        if (lowerText.includes('foto') || lowerText.includes('katalog') || lowerText.includes('produk') || lowerText.includes('photography') || lowerText.includes('studio')) {
          detectedKeys.push('Product Photography');
          initialBudgets['pp'] = BASE_SERVICES['Product Photography'].basePrice;
        }

        if (detectedKeys.length > 0) {
          setSelectedKeys(detectedKeys);
          setUserBudgets(initialBudgets);
          setAiRecommendedServices(detectedKeys);
          trackEvent('ai_consultant_auto_detect', 'Engagement', detectedKeys.join(', '));
        }
      }

      trackEvent('lead_registration_success', 'Engagement', institution);
      setStep(2);
    } catch (err) {
      trackEvent('lead_registration_failed', 'System', err.message);
      alert('Gagal memvalidasi data diri: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCalculateFinalOffer = () => {
    let totalBasePrice = 0;
    let totalUserBudget = 0;
    const itemizedCalculation = [];

    selectedKeys.forEach(key => {
      const service = BASE_SERVICES[key];
      const userTarget = userBudgets[service.id] || service.basePrice;
      totalBasePrice += service.basePrice;
      totalUserBudget += userTarget;

      let finalItemPrice = userTarget;

      itemizedCalculation.push({
        serviceId: service.id,
        serviceName: service.name,
        basePrice: service.basePrice,
        userProposed: userTarget,
        systemOffered: Math.round(finalItemPrice)
      });
    });

    let systemFinalSum = itemizedCalculation.reduce((acc, curr) => acc + curr.systemOffered, 0);
    
    let serviceCount = selectedKeys.length;
    let baseDiscountRate = 0;
    if (serviceCount === 2) baseDiscountRate = 0.05;
    else if (serviceCount === 3) baseDiscountRate = 0.08;
    else if (serviceCount === 4) baseDiscountRate = 0.12;

    let priceBonusRate = 0;
    if (systemFinalSum >= 35000000) priceBonusRate = 0.06;
    else if (systemFinalSum >= 15000000) priceBonusRate = 0.04;
    else if (systemFinalSum >= 5000000) priceBonusRate = 0.02;

    let totalDiscountRate = baseDiscountRate + priceBonusRate;
    if (totalDiscountRate > 0.20) totalDiscountRate = 0.20;

    let bundleDiscountApplied = 0;
    if (serviceCount > 1) {
      bundleDiscountApplied = Math.round(systemFinalSum * totalDiscountRate);
      systemFinalSum -= bundleDiscountApplied;
    }

    trackEvent('calculate_proposal_offer', 'Engagement', `Services: ${serviceCount} | Final Offer: ${systemFinalSum}`);

    setNegotiationResult({
      items: itemizedCalculation,
      totalUserBudget,
      systemFinalOffer: systemFinalSum,
      bundleDiscount: bundleDiscountApplied,
      discountPercentage: Math.round(totalDiscountRate * 100)
    });
    setStep(4);
  };

  const handleSubmitProposal = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('studio_proposals')
        .insert([{
          lead_id: createdLeadId,
          selected_services: negotiationResult.items,
          user_total_budget: negotiationResult.totalUserBudget,
          system_final_offer: negotiationResult.systemFinalOffer
        }]);

      if (error) throw error;

      const itemsSummaryText = negotiationResult.items.map(item => 
        `• ${item.serviceName}\n  Alokasi Dana: ${formatCurrency(item.systemOffered)}\n  Spesifikasi: ${getDynamicScope(item.serviceId, item.userProposed)}`
      ).join('\n\n');

      const templateParams = {
        to_name: name,
        to_email: email,
        institution: institution,
        total_investment: formatCurrency(negotiationResult.systemFinalOffer),
        project_details: itemsSummaryText
      };

      await emailjs.send(
        PROPOSALS_SERVICE_ID,
        CLIENT_NOTIF_TEMPLATE_ID,
        templateParams,
        PROPOSALS_PUBLIC_KEY
      );

      trackEvent('submit_proposal_success', 'Engagement', institution);
      alert('Proposal penawaran berhasil dikirim ke Admin! Email konfirmasi rincian projek telah diteruskan ke alamat email Anda.');
      setStep(1); setName(''); setInstitution(''); setWhatsapp(''); setEmail(''); setOtherContact(''); setAiConsultantText(''); setAiRecommendedServices([]); setSelectedKeys([]); setUserBudgets({}); setNegotiationResult(null);
    } catch (err) {
      const friendlyErrorMessage = err?.text || err?.message || 'Terjadi gangguan internal';
      trackEvent('submit_proposal_failed', 'System', friendlyErrorMessage);
      alert('Gagal mengirim proposal: ' + friendlyErrorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!negotiationResult) return;

    trackEvent('download_proposal_pdf', 'Engagement', institution);

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
    doc.text(`Tanggal Dokumen: ${new Date().toLocaleDateString('id-ID')}`, 140, 55);
    
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.text("OFFICIAL PROJECT PROPOSAL PITCH DECK", 20, 55);
    
    doc.setDrawColor(230, 230, 230);
    doc.line(20, 60, 190, 60);
    
    doc.setFontSize(11);
    doc.text("IDENTITAS REKANAN PARTNER:", 20, 72);
    doc.setFont("Helvetica", "normal");
    doc.text(`Nama Penanggung Jawab : ${name}`, 20, 80);
    doc.text(`Instansi / Perusahaan   : ${institution}`, 20, 86);
    doc.text(`Kontak WhatsApp        : ${whatsapp}`, 20, 92);
    doc.text(`Email Korporat          : ${email}`, 20, 98);
    
    doc.line(20, 106, 190, 106);
    
    doc.setFont("Helvetica", "bold");
    doc.text("RINCIAN KEBUTUHAN PROJEK & ANGGARAN:", 20, 118);
    
    let currentY = 128;
    
    doc.setFillColor(245, 245, 245);
    doc.rect(20, currentY, 170, 8, 'F');
    doc.setFontSize(9);
    doc.setTextColor(30, 30, 30);
    doc.text("Deskripsi Layanan & Cakupan Kerja", 24, currentY + 5.5);
    doc.text("Budget Anda", 115, currentY + 5.5);
    doc.text("Tawaran Sistem", 152, currentY + 5.5);
    
    currentY += 8;
    
    negotiationResult.items.forEach((item) => {
      currentY += 10;
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(30, 30, 30);
      doc.text(item.serviceName, 24, currentY);
      
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(9);
      doc.text(formatCurrency(item.userProposed), 115, currentY);
      
      doc.setFont("Helvetica", "bold");
      doc.text(formatCurrency(item.systemOffered), 152, currentY);
      
      currentY += 5;
      doc.setFont("Helvetica", "oblique");
      doc.setFontSize(8);
      doc.setTextColor(110, 110, 110);
      
      const scopeString = `Include: ${getDynamicScope(item.serviceId, item.userProposed)}`;
      const splitScopeLines = doc.splitTextToSize(scopeString, 85);
      doc.text(splitScopeLines, 24, currentY);
      
      currentY += (splitScopeLines.length - 1) * 4.5;
    });
    
    doc.setTextColor(30, 30, 30);
    if (negotiationResult.bundleDiscount > 0) {
      currentY += 12;
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(34, 197, 94);
      doc.text(`Dynamic Volume Discount (${negotiationResult.discountPercentage}%)`, 24, currentY);
      doc.text(`-${formatCurrency(negotiationResult.bundleDiscount)}`, 152, currentY);
      doc.setTextColor(30, 30, 30);
    }
    
    currentY += 12;
    doc.setFillColor(30, 30, 30);
    doc.rect(20, currentY, 170, 12, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.text("TOTAL INVESTASI KESEPAKATAN FINAL:", 24, currentY + 7.5);
    doc.text(formatCurrency(negotiationResult.systemFinalOffer), 150, currentY + 7.5);
    
    currentY += 28;
    doc.setTextColor(120, 120, 120);
    doc.setFontSize(9);
    doc.setFont("Helvetica", "normal");
    doc.text("Dokumen ini dihasilkan secara otomatis melalui sistem kalkulator interaktif Dauphiné Creative.", 20, currentY);
    doc.text("Seluruh nominal di atas bersifat mengikat dan menjadi acuan dasar pembuatan Kontrak Kerja (SOW).", 20, currentY + 5);
    
    doc.save(`Dauphine_Proposal_${institution.replace(/\s+/g, '_')}.pdf`);
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
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

  const getDynamicROI = (id, budget) => {
    if (id === 'smm') {
      const lift = (4 + (budget / 500000)).toFixed(0);
      return `Est. +${lift}% Peningkatan Konsistensi & Interaksi Akun Secara Organik`;
    }
    if (id === 'cp') {
      const lift = (3 + (budget / 750000)).toFixed(0);
      return `Est. +${lift}% Optimalisasi Rasio Retensi Penonton Pada Media Sosial`;
    }
    if (id === 'its') {
      const lift = (5 + (budget / 6000000)).toFixed(0);
      return `Est. +${lift}% Efisiensi Aksesibilitas Informasi & Kehadiran Digital`;
    }
    if (id === 'pp') {
      const lift = (3 + (budget / 600000)).toFixed(0);
      return `Est. +${lift}% Konversi Rasio Visual Trust Pada Katalog Etalase`;
    }
    return '';
  };

  const inputClass = "w-full bg-white/5 border border-white/10 focus:border-white outline-none p-3 text-white text-xs rounded-xl transition-all font-medium placeholder:text-zinc-600";
  const labelClass = "text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-400 block mb-1 ms-1";

  return (
    <div className="w-full min-h-screen pt-36 pb-16 px-4 md:px-12 bg-black flex items-center justify-center relative overflow-hidden">
      
      <div className="absolute inset-0 w-full h-full z-0 opacity-40">
        <ShaderAnimation />
      </div>
      
      <SEO title="Project Calculator - Dauphiné Creative" description="Hitung estimasi biaya dan manfaat proyek digital Anda dengan alat kalkulator proyek kami." />

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative z-10">
        
        <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-36 select-none">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono font-bold bg-white text-black px-2 py-0.5 rounded uppercase tracking-wider">Step {step} of 4</span>
            <span className="text-[10px] font-mono font-bold text-zinc-400">{Math.round((step / 4) * 100)}% Completed</span>
          </div>
          <div>
            <h1 className="text-xl md:text-3xl font-black tracking-tight uppercase text-white leading-tight">
              {step === 1 && 'Masukkan Data Profil Anda'}
              {step === 2 && 'Ceritakan Kebutuhan Anda'}
              {step === 3 && 'Sesuaikan Anggaran & Spesifikasi'}
              {step === 4 && 'Rincian Penawaran Projek'}
            </h1>
            <p className="text-xs text-zinc-400 leading-relaxed mt-2">
              {step === 1 && 'Silakan lengkapi data profil korporat atau instansi Anda untuk menyinkronkan alur pipeline integrasi aset studio kami.'}
              {step === 2 && 'Pilih satu atau several opsi klaster produk yang ingin diintegrasikan ke dalam ekosistem bisnis digital Anda.'}
              {step === 3 && 'Sesuaikan parameter investasi secara fleksibel menggunakan track slider. Angka spesifikasi kerja akan bermutasi otomatis.'}
              {step === 4 && 'Dokumen penawaran anggaran final berhasil diformulasikan secara ekonomis. Anda dapat mengunduh berkas proposal resmi di bawah.'}
            </p>
          </div>
        </div>

        <div className="lg:col-span-8 bg-black/40 border border-white/10 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-2xl w-full">
          <AnimatePresence mode="wait">
            
            {step === 1 && (
              <motion.form key="step1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} onSubmit={handleNextToStep2} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className={labelClass}>Nama Lengkap</label>
                    <input type="text" placeholder="e.g. Bobby Pratama" value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Nama Instansi / Perusahaan</label>
                    <input type="text" placeholder="e.g. PT Sinar Kreatif" value={institution} onChange={(e) => setInstitution(e.target.value)} required className={inputClass} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className={labelClass}>Nomor WhatsApp aktif</label>
                    <input type="text" placeholder="08..." value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} required className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Email Korporat</label>
                    <input type="email" placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Info Kontak Lain / Catatan (Opsional)</label>
                  <input type="text" placeholder="e.g. LinkedIn Profile atau Akun Instagram Perusahaan" value={otherContact} className={inputClass} onChange={(e) => setOtherContact(e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Ceritakan Goals atau Masalah Bisnis Anda</label>
                  <textarea 
                    rows="3" 
                    placeholder="e.g. Saya mau membuat website e-commerce baru untuk bisnis fashion dan butuh pengelolaan instagram bulanan..." 
                    value={aiConsultantText} 
                    onChange={(e) => setAiConsultantText(e.target.value)} 
                    className={`${inputClass} resize-none`}
                  />
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full bg-white text-black text-xs font-bold uppercase tracking-widest py-3.5 rounded-xl hover:bg-zinc-200 transition-all mt-2">
                  {isSubmitting ? 'Menyinkronkan Pipeline CRM...' : 'Lanjutkan Pemilihan Project'}
                </button>
              </motion.form>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                {aiRecommendedServices.length > 0 && (
                  <span className="text-[9px] text-green-400 font-bold uppercase tracking-wider bg-green-950/30 border border-green-800/40 px-3 py-2 rounded-xl block font-mono">
                    ✨ AI Consultant Recommendation Applied: Opsi yang sesuai dengan deskripsi Anda telah otomatis tercentang.
                  </span>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.keys(BASE_SERVICES).map((key) => {
                    const item = BASE_SERVICES[key];
                    const isChecked = selectedKeys.includes(key);
                    return (
                      <div 
                        key={key} 
                        onClick={() => handleToggleService(key)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between space-y-2.5 min-h-[110px] ${isChecked ? 'bg-white text-black border-white' : 'bg-white/5 text-white border-white/10 hover:border-white/30'}`}
                      >
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="text-xs font-bold uppercase tracking-wide">{item.name}</h4>
                            <input type="checkbox" checked={isChecked} readOnly className="rounded border-white/20 text-white focus:ring-0 accent-black w-3.5 h-3.5" />
                          </div>
                          <p className={`text-[10px] mt-1 leading-relaxed ${isChecked ? 'text-black/60' : 'text-zinc-400'}`}>{item.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setStep(1)} className="bg-transparent border border-white/10 text-white font-bold text-xs uppercase tracking-wider px-5 py-3.5 rounded-xl hover:border-white transition-all">
                    Kembali
                  </button>
                  <button 
                    onClick={() => selectedKeys.length > 0 ? setStep(3) : alert('Mohon pilih minimal 1 pilar kebutuhan!')}
                    className="flex-1 bg-white text-black text-xs font-bold uppercase tracking-widest py-3.5 rounded-xl hover:bg-zinc-200 transition-all"
                  >
                    Lanjutkan ke Kalkulator Budget
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 scrollbar-none">
                <div className="space-y-4">
                  {selectedKeys.map(key => {
                    const service = BASE_SERVICES[key];
                    const currentVal = userBudgets[service.id] || service.basePrice;

                    return (
                      <div key={key} className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col gap-3 shadow-sm">
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-bold text-white uppercase tracking-wide">{service.name}</h4>
                          <span className="text-xs font-mono font-bold text-white bg-white/10 px-2.5 py-0.5 rounded">
                            {formatCurrency(currentVal)}
                          </span>
                        </div>

                        <div className="px-0.5">
                          <input 
                            type="range"
                            min={service.minPrice}
                            max={service.maxPrice}
                            step={service.id === 'its' ? '500000' : '100000'}
                            value={currentVal}
                            onChange={(e) => handleBudgetChange(service.id, e.target.value)}
                            className="w-full accent-white h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-[8px] text-zinc-500 font-bold font-mono mt-1">
                            <span>MIN: {formatCurrency(service.minPrice)}</span>
                            <span>MAX: {service.id === 'its' ? 'Flexible Ceiling' : formatCurrency(service.maxPrice)}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-white/5 text-[10px] leading-relaxed">
                          <div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
                            <span className="text-[7px] font-mono font-bold tracking-widest uppercase text-zinc-500 block mb-0.5">Dynamic Production Scope:</span>
                            <span className="text-zinc-300 font-medium">{getDynamicScope(service.id, currentVal)}</span>
                          </div>
                          <div className="bg-green-950/20 p-2.5 rounded-lg border border-green-500/10">
                            <span className="text-[7px] font-mono font-bold tracking-widest uppercase text-green-400 block mb-0.5">Projected Impact (ROI):</span>
                            <span className="text-green-300 font-bold">{getDynamicROI(service.id, currentVal)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => setStep(2)} className="bg-transparent border border-white/10 text-white font-bold text-xs uppercase tracking-wider px-5 py-3.5 rounded-xl hover:border-white transition-all">
                    Kembali
                  </button>
                  <button 
                    onClick={handleCalculateFinalOffer}
                    className="flex-1 bg-white text-black text-xs font-bold uppercase tracking-widest py-3.5 rounded-xl hover:bg-zinc-200 transition-all"
                  >
                    Hitung Rekomendasi Penawaran
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && negotiationResult && (
              <motion.div key="step4" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                      <tr className="bg-white/5 text-zinc-300 font-bold uppercase tracking-wider text-[9px] border-b border-white/10">
                        <th className="p-2.5">Rincian Layanan</th>
                        <th className="p-2.5 text-right">Budget Anda</th>
                        <th className="p-2.5 text-right">Tawaran Sistem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-medium text-zinc-300">
                      {negotiationResult.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="p-3 font-bold uppercase text-zinc-400">{item.serviceName}</td>
                          <td className="p-3 text-right font-mono text-zinc-600">{formatCurrency(item.userProposed)}</td>
                          <td className="p-3 text-right font-mono font-bold text-white">{formatCurrency(item.systemOffered)}</td>
                        </tr>
                      ))}
                      
                      {negotiationResult.bundleDiscount > 0 && (
                        <tr className="bg-green-950/20 text-green-400">
                          <td className="p-3 font-bold uppercase">Dynamic Volume Discount ({negotiationResult.discountPercentage}%)</td>
                          <td className="p-3 text-right">—</td>
                          <td className="p-3 text-right font-mono font-bold">-{formatCurrency(negotiationResult.bundleDiscount)}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <div className="bg-white text-black p-4 flex justify-between items-center border-t border-white/10">
                    <div className="space-y-0.5">
                      <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-black/50 block">Final Proposal Agreement Price</span>
                      <p className="text-[9px] text-black/70">Ajukan nominal ekonomis ini ke panel admin studio.</p>
                    </div>
                    <span className="text-lg font-mono font-bold">{formatCurrency(negotiationResult.systemFinalOffer)}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  <button 
                    type="button"
                    onClick={handleDownloadPDF}
                    className="w-full bg-transparent border border-white border-dashed text-white text-[11px] font-bold uppercase tracking-widest py-3 rounded-xl hover:bg-white/5 transition-all flex justify-center items-center gap-2"
                  >
                    <span>📥</span> Download Official Proposal (.PDF Pitch Deck)
                  </button>
                  
                  <div className="flex gap-3 w-full">
                    <button onClick={() => setStep(3)} className="bg-transparent border border-white/10 text-white font-bold text-xs uppercase tracking-wider px-5 py-3.5 rounded-xl hover:border-white transition-all">
                      Kembali
                    </button>
                    <button 
                      onClick={handleSubmitProposal}
                      disabled={isSubmitting}
                      className="flex-1 bg-white text-black text-xs font-bold uppercase tracking-widest py-3.5 rounded-xl hover:bg-zinc-200 transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? 'Mengirim Berkas Proposal...' : 'Kirim Pengajuan Negosiasi ke Admin'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
        
      </div>
    </div>
  );
};

export default ProjectCalculator;