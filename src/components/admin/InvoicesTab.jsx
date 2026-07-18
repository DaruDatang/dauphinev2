import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';

const InvoicesTab = ({ projects = [] }) => {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState('list'); 
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Form States
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('Unpaid');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Dynamic Items Table State
  const [items, setItems] = useState([
    { description: '', qty: 1, price: 0 }
  ]);

  useEffect(() => {
    if (projects && projects.length > 0) {
      setSelectedProjectId(projects[0].id);
    }
    fetchInvoices();
  }, [projects]);

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('studio_invoices')
        .select(`
          *,
          studio_projects (
            title,
            client_name,
            category
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (err) {
      console.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    if (field === 'qty') {
      updatedItems[index][field] = parseInt(value) || 0;
    } else if (field === 'price') {
      updatedItems[index][field] = parseFloat(value) || 0;
    } else {
      updatedItems[index][field] = value;
    }
    setItems(updatedItems);
  };

  const handleAddItemRow = () => {
    setItems([...items, { description: '', qty: 1, price: 0 }]);
  };

  const handleRemoveItemRow = (index) => {
    if (items.length === 1) return;
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const calculateTotalAmount = () => {
    return items.reduce((acc, curr) => acc + (curr.qty * curr.price), 0);
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const totalAmount = calculateTotalAmount();

    try {
      const { error } = await supabase
        .from('studio_invoices')
        .insert([{
          project_id: selectedProjectId,
          invoice_number: invoiceNumber,
          amount: totalAmount,
          due_date: dueDate || null,
          status: status,
          items: items
        }]);

      if (error) throw error;
      alert('Invoice berhasil dideploy dengan rincian tabel variabel.');
      
      setInvoiceNumber('');
      setDueDate('');
      setItems([{ description: '', qty: 1, price: 0 }]);
      setCurrentView('list');
      fetchInvoices();
    } catch (err) {
      alert('Gagal membuat invoice: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Unpaid' ? 'Paid' : 'Unpaid';
    try {
      const { error } = await supabase
        .from('studio_invoices')
        .update({ status: nextStatus })
        .eq('id', id);

      if (error) throw error;
      setInvoices(invoices.map(i => i.id === id ? { ...i, status: nextStatus } : i));
    } catch (err) {
      alert('Gagal mengubah status keuangan: ' + err.message);
    }
  };

  const handleDeleteInvoice = async (id) => {
    if (!window.confirm("Hapus rekaman data invoice ini secara permanen dari neraca finansial?")) return;
    try {
      const { error } = await supabase.from('studio_invoices').delete().eq('id', id);
      if (error) throw error;
      setInvoices(invoices.filter(i => i.id !== id));
    } catch (err) {
      alert('Gagal menghapus invoice: ' + err.message);
    }
  };

  const handleTriggerPrint = (inv) => {
    setSelectedInvoice(inv);
    setCurrentView('print');
  };

  const totalInvoiced = invoices.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const totalPaid = invoices.filter(i => i.status === 'Paid').reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const totalUnpaid = totalInvoiced - totalPaid;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  };

  const inputClass = "w-full bg-white border border-dark/10 focus:border-dark outline-none p-3.5 text-dark text-sm rounded-xl transition-all placeholder:text-dark/20";
  const labelClass = "text-[10px] font-bold uppercase tracking-widest text-dark/40 block mb-1.5 ms-1";

  return (
    <div className="space-y-8">
      {/* INJEKSI CSS EDITAN: RESET TATA LETAK KHUSUS PREVIEW CETAK */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page {
            size: A4 portrait;
            margin: 0mm !important;
          }
          html, body {
            background: #fff !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Sembunyikan pembungkus sidebar kiri dasbor secara paksa */
          .w-64, .md\\:w-80, border-r, fixed, left-0, top-0, .print\\:hidden, button, nav {
            display: none !important;
          }
          /* Paksa konten geser mentok ke kiri dan hilangkan padding bawaan Admin Dashboard */
          div[class*="pl-64"], div[class*="md:pl-80"], .flex-grow, div[class*="max-w-"], div[class*="p-8"] {
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          /* Bentangkan layout lembar invoice utama */
          .print-isolated-container {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
          }
        }
      `}} />

      {/* =======================================================
          1. DEDICATED PRINT PREVIEW VIEW
          ======================================================= */}
      {currentView === 'print' && selectedInvoice && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="bg-white rounded-2xl max-w-[850px] mx-auto overflow-hidden border border-dark/10 shadow-sm print-isolated-container"
        >
          {/* BAR KONTROL CETAK (OTOMATIS HILANG SAAT DI-PRINT PHYSICAL) */}
          <div className="flex justify-between items-center bg-[#fafafa] p-4 border-b border-dark/5 print:hidden">
            <span className="text-[10px] font-bold uppercase tracking-widest text-dark/40 font-mono">Invoice Template Render Pipeline</span>
            <div className="flex gap-2">
              <button onClick={() => setCurrentView('list')} className="bg-white border border-dark/10 text-dark font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-lg hover:border-dark transition-all">
                ← Back
              </button>
              <button onClick={() => window.print()} className="bg-dark text-white font-bold text-xs uppercase tracking-wider px-5 py-2 rounded-lg hover:bg-dark/80 transition-all">
                Print Document
              </button>
            </div>
          </div>

          {/* LEMBAR INVOICE UTAMA */}
          <div className="bg-white p-0 space-y-12 pb-16 min-h-[1000px] flex flex-col justify-between print:py-8">
            <div className="space-y-12">
              
              {/* STATIC BANNER ATAS */}
              <div className="bg-gradient-to-r from-[#0d1527] via-[#161f38] to-[#cc3b3b] p-6 flex justify-between items-center text-white min-h-[90px] print:px-12">
                <div>
                  <span className="text-xl font-medium font-sans tracking-tight">dauphiné</span>
                  <span className="text-xs text-white/50 block tracking-widest -mt-1 uppercase">creative.</span>
                </div>
                <div className="text-right text-sm font-light tracking-wide text-white/90">
                  Build Your Digital Presence
                </div>
              </div>

              {/* CORE METADATA BLOCK */}
              <div className="px-12 space-y-8">
                <h1 className="text-5xl font-bold tracking-tight text-dark uppercase font-sans">INVOICE</h1>
                
                <div className="space-y-1 text-sm font-medium text-dark/80">
                  <div className="flex"><span className="w-28 text-dark/50">Invoice to</span><span>: {selectedInvoice.studio_projects?.client_name || '—'}</span></div>
                  <div className="flex"><span className="w-28 text-dark/50">No. Invoice</span><span className="font-mono">: {selectedInvoice.invoice_number}</span></div>
                  <div className="flex"><span className="w-28 text-dark/50">Date</span><span>: {new Date(selectedInvoice.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div>
                </div>
              </div>

              {/* VARIABLE ITEMIZED BREAKDOWN TABLE */}
              <div className="px-12">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#04043b] text-white uppercase tracking-wider text-[10px] font-bold">
                      <th className="p-3 w-16 text-center border border-dark/10 text-white">NO.</th>
                      <th className="p-3 border border-dark/10 text-white">DESCRIPTIONS</th>
                      <th className="p-3 w-20 text-center border border-dark/10 text-white">QTY</th>
                      <th className="p-3 w-32 text-right border border-dark/10 text-white">PRICE</th>
                      <th className="p-3 w-36 text-right border border-dark/10 text-white">AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody className="font-medium text-dark/90 divide-y divide-dark/5">
                    {selectedInvoice.items && selectedInvoice.items.length > 0 ? (
                      selectedInvoice.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-dark/[0.01]">
                          <td className="p-3.5 text-center font-mono text-dark/40">{idx + 1}</td>
                          <td className="p-3.5 font-bold uppercase tracking-wide text-dark/80">{item.description || 'Custom Scope Task'}</td>
                          <td className="p-3.5 text-center font-mono">{item.qty}</td>
                          <td className="p-3.5 text-right font-mono">{formatCurrency(item.price)}</td>
                          <td className="p-3.5 text-right font-mono font-bold text-dark">{formatCurrency(item.qty * item.price)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="p-3.5 text-center font-mono text-dark/40">1</td>
                        <td className="p-3.5 font-bold uppercase tracking-wide text-dark/80">{selectedInvoice.studio_projects?.title || 'Production Fee Package'}</td>
                        <td className="p-3.5 text-center font-mono">1</td>
                        <td className="p-3.5 text-right font-mono">{formatCurrency(selectedInvoice.amount)}</td>
                        <td className="p-3.5 text-right font-mono font-bold text-dark">{formatCurrency(selectedInvoice.amount)}</td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* TOTAL SUMMARY DEEP BOX */}
                <div className="flex justify-end mt-6">
                  <div className="w-64 bg-[#04043b] text-white p-3 flex justify-between items-center font-bold">
                    <span className="italic uppercase text-[11px] tracking-widest pl-2 text-white">Total</span>
                    <span className="font-mono text-sm pr-1 text-white">{formatCurrency(selectedInvoice.amount)}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* STATIC FOOTER CONTACT INFO */}
            <div className="px-12 mt-auto">
              <div className="border-t border-dark/10 pt-8 space-y-4">
                <p className="font-bold text-dark uppercase tracking-wider text-xs">Dauphiné Creative</p>
                
                <div className="grid grid-cols-2 gap-y-2 gap-x-6 text-[11px] font-medium text-dark/60 font-mono">
                  <div className="flex items-center gap-2"><span>📞</span> 08112128038</div>
                  <div className="flex items-center gap-2"><span>📍</span> Jl. Buana Indah Regency No. 2</div>
                  <div className="flex items-center gap-2"><span>✉️</span> dauphinecreative@gmail.com</div>
                  <div className="flex items-center gap-2"><span>🌐</span> www.dauphinecreative.com</div>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      )}

      {/* =======================================================
          2. MAIN LEDGER TRANSACTION BOARD VIEW
          ======================================================= */}
      {currentView === 'list' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          <div className="flex justify-between items-center border-b border-dark/10 pb-6">
            <div>
              <h2 className="text-3xl font-medium tracking-tight uppercase">Financial Invoices</h2>
              <p className="text-xs text-dark/40 mt-1">Kelola penagihan termin korporasi terintegrasi tabel rincian variabel.</p>
            </div>
            <button onClick={() => setCurrentView('form')} className="bg-dark text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all hover:bg-dark/80">
              Issue Invoice
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Accumulated Billings', value: formatCurrency(totalInvoiced), desc: 'Total nominal seluruh tagihan.', color: 'text-dark' },
              { label: 'Settled Capital', value: formatCurrency(totalPaid), desc: 'Dana likuid yang aman terkumpul.', color: 'text-green-700' },
              { label: 'Outstanding Balance', value: formatCurrency(totalUnpaid), desc: 'Sisa piutang klien berjalan.', color: 'text-red-600' }
            ].map((card, idx) => (
              <div key={idx} className="bg-[#fafafa] p-6 rounded-2xl border border-dark/5 flex flex-col justify-between hover:border-dark/20 transition-all shadow-sm">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-dark/40">{card.label}</p>
                  <p className={`text-2xl font-semibold font-mono tracking-tight ${card.color}`}>{card.value}</p>
                </div>
                <p className="text-[11px] text-dark/50 mt-3 pt-3 border-t border-dark/5 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold tracking-widest text-dark/40 uppercase font-mono border-b border-dark/5 pb-2">Billing Accounts Records</h3>
            {isLoading ? (
              <div className="text-xs font-bold uppercase tracking-widest text-dark/30 py-20 text-center">Assembling accounts logs...</div>
            ) : invoices.length === 0 ? (
              <div className="text-xs font-bold uppercase tracking-widest text-dark/30 py-20 text-center">Clean account statements.</div>
            ) : (
              <div className="overflow-x-auto border border-dark/5 rounded-2xl shadow-sm bg-white">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-dark/10 bg-[#fafafa] text-dark/40 uppercase tracking-wider font-bold">
                      <th className="p-4">Invoice ID</th>
                      <th className="p-4">Project Scope Reference</th>
                      <th className="p-4">Client</th>
                      <th className="p-4 text-right">Amount Value</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 text-center">Operations Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark/5 font-medium">
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="text-dark/80 hover:bg-dark/[0.01] transition-all">
                        <td className="p-4 font-mono font-bold text-dark">{inv.invoice_number}</td>
                        <td className="p-4 font-bold text-dark uppercase tracking-wide truncate max-w-[180px]">{inv.studio_projects?.title || 'Unknown Project'}</td>
                        <td className="p-4 uppercase tracking-wide text-dark/60 font-semibold">{inv.studio_projects?.client_name || '—'}</td>
                        <td className="p-4 text-right font-mono font-bold text-dark">{formatCurrency(inv.amount)}</td>
                        <td className="p-4 text-center">
                          <button onClick={() => handleToggleStatus(inv.id, inv.status)} className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border ${inv.status === 'Paid' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                            {inv.status}
                          </button>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-4 justify-center items-center text-[10px] font-bold uppercase tracking-wider">
                            <button onClick={() => handleTriggerPrint(inv)} className="text-blue-600 hover:underline">
                              Print View
                            </button>
                            <button onClick={() => handleDeleteInvoice(inv.id)} className="text-red-500/50 hover:text-red-600">
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
          </div>
        </motion.div>
      )}

      {/* =======================================================
          3. DEDICATED EXTENDED VARIABLE INPUT FORM VIEW
          ======================================================= */}
      {currentView === 'form' && (
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-[#fafafa] p-6 rounded-2xl border border-dark/5 shadow-inner space-y-6">
          <div className="flex justify-between items-center border-b border-dark/5 pb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-dark">Issue Variable Corporate Invoice</h3>
              <p className="text-[11px] text-dark/40 mt-0.5">Tautkan regulasi pembayaran multi-item berdasarkan parameter termin rincian.</p>
            </div>
            <button onClick={() => setCurrentView('list')} className="text-xs font-bold uppercase tracking-wider text-dark/40 hover:text-dark border border-dark/10 hover:border-dark px-3 py-1.5 rounded-lg transition-all bg-white">
              Cancel
            </button>
          </div>

          {projects.length === 0 ? (
            <div className="text-xs font-medium text-dark/40 italic py-6 text-center">Belum ada rincian project tracker aktif untuk ditautkan tagihan.</div>
          ) : (
            <form onSubmit={handleCreateInvoice} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Select Project Reference</label>
                  <select value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)} className={inputClass}>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.title} [{p.client_name || 'Internal'}]</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Invoice Identifier Code</label>
                  <input type="text" placeholder="e.g. INV/2026/001" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} required className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Due Date Limitation</label>
                  <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Initial Status Token</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputClass}>
                    <option value="Unpaid">Unpaid</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center border-b border-dark/5 pb-1">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-dark/60 font-mono">Invoice Items Customizer</h4>
                  <button type="button" onClick={handleAddItemRow} className="text-[10px] font-bold text-blue-600 hover:underline uppercase tracking-wider">
                    + Add New Item Row
                  </button>
                </div>

                {items.map((item, idx) => (
                  <div key={idx} className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-xl border border-dark/10 items-end shadow-sm">
                    <div className="flex-1 w-full">
                      <label className={labelClass}>Descriptions Task / Scope</label>
                      <input type="text" placeholder="e.g. Product Photo" value={item.description} onChange={(e) => handleItemChange(idx, 'description', e.target.value)} required className="w-full bg-[#fafafa] border border-dark/5 p-2.5 text-xs rounded-lg outline-none focus:border-dark" />
                    </div>
                    <div className="w-full md:w-24">
                      <label className={labelClass}>QTY</label>
                      <input type="number" min="1" value={item.qty} onChange={(e) => handleItemChange(idx, 'qty', e.target.value)} required className="w-full bg-[#fafafa] border border-dark/5 p-2.5 text-xs rounded-lg outline-none text-center focus:border-dark font-mono" />
                    </div>
                    <div className="w-full md:w-44">
                      <label className={labelClass}>Unit Price (IDR)</label>
                      <input type="number" placeholder="Angka saja..." value={item.price} onChange={(e) => handleItemChange(idx, 'price', e.target.value)} required className="w-full bg-[#fafafa] border border-dark/5 p-2.5 text-xs rounded-lg outline-none text-right focus:border-dark font-mono" />
                    </div>
                    {items.length > 1 && (
                      <button type="button" onClick={() => handleRemoveItemRow(idx)} className="text-red-500 font-mono text-xs p-2.5 hover:text-red-700">
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-2 border-t border-dark/5">
                <div className="text-right space-y-1.5 bg-dark/5 px-6 py-3 rounded-xl min-w-[220px]">
                  <span className="text-[9px] font-bold tracking-widest uppercase text-dark/40 block">Calculated Grand Total:</span>
                  <span className="text-xl font-mono font-bold text-dark">{formatCurrency(calculateTotalAmount())}</span>
                </div>
              </div>

              <div className="flex justify-end">
                <button type="submit" disabled={isSubmitting} className="bg-dark text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-dark/80 disabled:opacity-50 transition-all">
                  {isSubmitting ? 'Deploying Invoice Ledger...' : 'Deploy Invoice Ledger'}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default InvoicesTab;