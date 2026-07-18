import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';
import LeadForm from './forms/LeadForm';

const LeadsTab = () => {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('studio_leads')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setLeads(data || []);
    } catch (err) {
      console.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveLead = async (formData) => {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('studio_leads')
        .insert([formData])
        .select();

      if (error) throw error;
      setLeads([data[0], ...leads]);
      alert('Data leads prospect baru berhasil disimpan ke database pipeline.');
      setIsFormOpen(false);
    } catch (err) {
      alert('Gagal merekam data prospek: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const exportToCSV = () => {
    if (leads.length === 0) return alert('Tidak ada data leads untuk diexport.');
    
    const headers = ['Nama', 'Instansi', 'WhatsApp', 'Email', 'Kontak Lain', 'Tanggal Terdaftar'];
    const rows = leads.map(l => [
      `"${l.name}"`, 
      `"${l.institution}"`, 
      `"${l.whatsapp || '-'}"`, 
      `"${l.email || '-'}"`, 
      `"${l.other_contact || '-'}"`, 
      `"${new Date(l.created_at).toLocaleDateString('id-ID')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Dauphine_Leads_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLeads = leads.filter(l => 
    l.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.institution?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }} className="space-y-8">
      
      {/* HEADER CONTROLS SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-dark/10 pb-6 gap-4">
        <div>
          <h2 className="text-3xl font-medium tracking-tight uppercase">
            {isFormOpen ? 'Leads Acquisition' : 'Database Prospect Pipeline'}
          </h2>
          <p className="text-xs text-dark/40 mt-1">
            {isFormOpen 
              ? 'Konfigurasi parameter akuisisi kemitraan eksternal korporat.' 
              : 'Analisis segmentasi pasar potensial dan manajemen konversi target klien.'}
          </p>
        </div>
        <div className="flex gap-2 ms-auto sm:ms-0">
          <button 
            onClick={() => setIsFormOpen(!isFormOpen)} 
            className="bg-dark text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all hover:bg-dark/80 whitespace-nowrap"
          >
            {isFormOpen ? '← Back to Pipeline' : 'Add Potential Lead'}
          </button>
          {!isFormOpen && (
            <button 
              onClick={exportToCSV} 
              className="border border-dark/10 hover:border-dark text-dark px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap"
            >
              Export (.CSV)
            </button>
          )}
        </div>
      </div>

      {/* DETACHED SCREEN DISPLACEMENT VIEW */}
      <AnimatePresence mode="wait">
        {isFormOpen ? (
          <motion.div 
            key="leads-form-dedicated"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            <LeadForm 
              isSubmitting={isSubmitting}
              onSave={handleSaveLead}
              onClose={() => setIsFormOpen(false)}
            />
          </motion.div>
        ) : (
          <motion.div 
            key="leads-list-dedicated"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* SEARCH PIPE BAR */}
            <div className="flex bg-[#fafafa] p-3 rounded-2xl border border-dark/5 justify-end">
              <input 
                type="text" 
                placeholder="SEARCH LEADS BY NAME OR AGENCY..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-80 bg-white border border-dark/10 focus:border-dark outline-none py-2 px-4 text-[10px] font-bold tracking-widest text-dark rounded-xl uppercase transition-all placeholder:text-dark/20"
              />
            </div>

            {/* PIPELINE CARDS GRID CONTAINER */}
            {isLoading ? (
              <div className="text-xs font-bold uppercase tracking-widest text-dark/30 py-20 text-center">Assembling analytical records...</div>
            ) : filteredLeads.length === 0 ? (
              <div className="text-xs font-bold uppercase tracking-widest text-dark/30 py-20 text-center">No matching target acquisition logs found.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredLeads.map((lead) => (
                  <div key={lead.id} className="bg-white rounded-2xl border border-dark/10 p-6 shadow-sm flex flex-col justify-between hover:border-dark/20 transition-all space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[9px] font-mono font-bold bg-dark text-white px-2.5 py-1 rounded uppercase tracking-widest truncate max-w-[180px]">
                          {lead.institution}
                        </span>
                        <span className="text-[9px] font-mono text-dark/30 font-bold">
                          {new Date(lead.created_at).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-dark uppercase tracking-wide pt-1">{lead.name}</h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border-t border-dark/5 pt-4 text-[11px] font-mono text-dark/60">
                      <div className="space-y-0.5">
                        <p className="text-[9px] font-bold text-dark/30 uppercase tracking-widest font-sans">WhatsApp Contact</p>
                        <p className="text-dark font-bold">{lead.whatsapp || '—'}</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[9px] font-bold text-dark/30 uppercase tracking-widest font-sans">Corporate Email</p>
                        <p className="text-dark truncate">{lead.email || '—'}</p>
                      </div>
                      {lead.other_contact && (
                        <div className="col-span-1 sm:col-span-2 space-y-0.5 mt-1">
                          <p className="text-[9px] font-bold text-dark/30 uppercase tracking-widest font-sans">Network Path Access</p>
                          <p className="text-dark/50 truncate italic">"{lead.other_contact}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LeadsTab;