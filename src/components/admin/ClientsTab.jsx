import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';
import ClientForm from './forms/ClientForm';

const ClientsTab = ({ clients, isLoading, fetchClients, setClients }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Menangani operasi simpan (Insert Baru & Update Data Eksis)
  const handleSaveClient = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingClient) {
        // Jalur Operasi UPDATE data di Supabase
        const { error } = await supabase
          .from('studio_clients')
          .update(formData)
          .eq('id', editingClient.id);

        if (error) throw error;

        setClients(prev => prev.map(c => c.id === editingClient.id ? { ...c, ...formData } : c));
        alert('Data kredensial rekanan partner berhasil diperbarui.');
        setEditingClient(null);
      } else {
        // Jalur Operasi INSERT data baru di Supabase
        const { data, error } = await supabase
          .from('studio_clients')
          .insert([formData])
          .select();

        if (error) throw error;
        setClients([data[0], ...clients]);
        alert('Data rekanan partner baru berhasil diregistrasikan ke dalam sistem.');
      }
      setIsFormOpen(false);
    } catch (err) {
      alert('Gagal memproses operasi: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClient = async (id) => {
    if (!window.confirm("Hapus data rekanan klien ini secara permanen? Seluruh proyek penunjang yang terikat akan kehilangan referensi nama korporat.")) return;
    try {
      const { error } = await supabase.from('studio_clients').delete().eq('id', id);
      if (error) throw error;
      setClients(clients.filter(c => c.id !== id));
    } catch (err) {
      alert('Gagal menghapus klien: ' + err.message);
    }
  };

  const startEditing = (client) => {
    setEditingClient(client);
    setIsFormOpen(false); // Bersihkan toggle view agar transisi form page fokus
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredClients = clients.filter(c =>
    c.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.pic?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* HEADER OPERATIONS CONTROLS */}
      <div className="flex justify-between items-center border-b border-dark/10 pb-6">
        <div>
          <h2 className="text-3xl font-medium tracking-tight uppercase">
            {isFormOpen || editingClient ? 'Client Editor' : 'Client Directory'}
          </h2>
          <p className="text-xs text-dark/40 mt-1">
            {isFormOpen || editingClient 
              ? 'Konfigurasi berkas identitas korespondensi legalitas korporat.' 
              : 'Kelola direktori partner studio eksternal dan rincian kontak korporat.'}
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => {
              if (isFormOpen || editingClient) {
                setIsFormOpen(false);
                setEditingClient(null);
              } else {
                setIsFormOpen(true);
              }
            }} 
            className="bg-dark text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all hover:bg-dark/80"
          >
            {isFormOpen || editingClient ? '← Back to Directory' : 'Add Client'}
          </button>
          {!(isFormOpen || editingClient) && (
            <button onClick={fetchClients} className="border border-dark/10 hover:border-dark text-dark px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all">
              Refresh
            </button>
          )}
        </div>
      </div>

      {/* DISPLACEMENT LAYOUT ANCHOR */}
      <AnimatePresence mode="wait">
        {isFormOpen || editingClient ? (
          <motion.div 
            key="client-form-dedicated-view"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            <ClientForm 
              client={editingClient}
              isSubmitting={isSubmitting}
              onSave={handleSaveClient}
              onClose={() => {
                setIsFormOpen(false);
                setEditingClient(null);
              }}
            />
          </motion.div>
        ) : (
          <motion.div 
            key="client-table-dedicated-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* SEARCH CONTROL HOOD */}
            <div className="flex bg-[#fafafa] p-3 rounded-2xl border border-dark/5 justify-end">
              <input 
                type="text" 
                placeholder="SEARCH CLIENT COMPANY OR PIC..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-80 bg-white border border-dark/10 focus:border-dark outline-none py-2 px-4 text-[10px] font-bold tracking-widest text-dark rounded-xl uppercase transition-all placeholder:text-dark/20"
              />
            </div>

            {/* TABULAR LOG DATA CONTAINER */}
            {isLoading ? (
              <div className="text-xs font-bold uppercase tracking-widest text-dark/30 py-20 text-center">Synchronizing clients workspace...</div>
            ) : filteredClients.length === 0 ? (
              <div className="text-xs font-bold uppercase tracking-widest text-dark/30 py-20 text-center">No registered client records found.</div>
            ) : (
              <div className="overflow-x-auto border border-dark/5 rounded-2xl shadow-sm bg-white">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-dark/10 bg-[#fafafa] text-dark/40 uppercase tracking-wider">
                      <th className="p-4 font-bold">Company Name</th>
                      <th className="p-4 font-bold">PIC</th>
                      <th className="p-4 font-bold">Contact Channel</th>
                      <th className="p-4 font-bold">Address</th>
                      <th className="p-4 font-bold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark/5 font-medium">
                    {filteredClients.map((client) => (
                      <tr key={client.id} className="text-dark/80 hover:bg-dark/[0.01] transition-all">
                        <td className="p-4 font-bold text-dark uppercase tracking-wide">{client.company_name}</td>
                        <td className="p-4 font-mono text-dark/70">{client.pic}</td>
                        <td className="p-4 space-y-0.5">
                          <p className="text-dark font-medium">{client.email || '—'}</p>
                          <p className="text-dark/40 font-mono text-[11px]">{client.phone || '—'}</p>
                        </td>
                        <td className="p-4 max-w-xs truncate text-dark/60 leading-relaxed">{client.address || '—'}</td>
                        <td className="p-4">
                          <div className="flex gap-3 justify-center items-center">
                            <button 
                              onClick={() => startEditing(client)} 
                              className="text-dark/60 hover:text-dark font-bold uppercase tracking-wider text-[10px] transition-colors"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteClient(client.id)} 
                              className="text-red-500/60 hover:text-red-600 font-bold uppercase tracking-wider text-[10px] transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClientsTab;