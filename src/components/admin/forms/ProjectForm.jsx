import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ProjectForm = ({ project, clients = [], onSave, onClose, isSubmitting }) => {
  const isEdit = !!project;
  
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [category, setCategory] = useState('IT Solution');
  const [status, setStatus] = useState('Briefing');
  const [startDate, setStartDate] = useState('');
  const [deadline, setDeadline] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [links, setLinks] = useState([{ category: 'Figma', url: '' }]);

  const linkCategories = ['Figma', 'Google Drive', 'GitHub', 'Live Website', 'Other'];
  const kanbanColumns = ['Briefing', 'In Progress', 'Revision', 'Completed'];

  // Sinkronisasi data jika masuk dalam mode Edit
  useEffect(() => {
    if (project) {
      setTitle(project.title || '');
      setClientName(project.client_name || '');
      setCategory(project.category || 'IT Solution');
      setStatus(project.status || 'Briefing');
      setStartDate(project.start_date || '');
      setDeadline(project.deadline || '');
      setEndDate(project.end_date || '');
      setNotes(project.notes || '');
      setLinks(project.links && project.links.length > 0 ? project.links : [{ category: 'Figma', url: '' }]);
    } else {
      // Reset form jika mode Add New
      setTitle('');
      setClientName(clients[0]?.company_name || 'Internal Studio');
      setCategory('IT Solution');
      setStatus('Briefing');
      setStartDate('');
      setDeadline('');
      setEndDate('');
      setNotes('');
      setLinks([{ category: 'Figma', url: '' }]);
    }
  }, [project, clients]);

  const handleLinkChange = (index, field, value) => {
    const updated = [...links];
    updated[index][field] = value;
    setLinks(updated);
  };

  const handleAddLinkField = () => {
    setLinks([...links, { category: 'Figma', url: '' }]);
  };

  const handleRemoveLinkField = (index) => {
    const updated = [...links];
    updated.splice(index, 1);
    setLinks(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validLinks = links.filter(link => link.url.trim() !== '');
    const finalClient = clientName || (clients[0]?.company_name || 'Internal Studio');

    const formData = {
      title,
      client_name: finalClient,
      category,
      status,
      start_date: startDate || null,
      deadline: deadline || null,
      end_date: endDate || null,
      notes,
      links: validLinks
    };

    onSave(formData);
  };

  const inputClass = "w-full bg-white border border-dark/10 focus:border-dark outline-none p-3.5 text-dark text-sm rounded-xl transition-all placeholder:text-dark/20";
  const labelClass = "text-[10px] font-bold uppercase tracking-widest text-dark/40 block mb-1.5 ms-1";

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }} 
      animate={{ opacity: 1, height: 'auto' }} 
      exit={{ opacity: 0, height: 0 }} 
      className="bg-[#fafafa] p-6 rounded-2xl border border-dark/5 overflow-hidden shadow-inner mb-6"
    >
      <div className="flex justify-between items-center border-b border-dark/5 pb-4 mb-5">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-dark">
            {isEdit ? 'Reconfigure Project Workspace' : 'Launch New Project'}
          </h3>
          <p className="text-[11px] text-dark/40 mt-0.5">
            {isEdit ? 'Ubah parameter dan tautan aset produksi aktif.' : 'Isi form di bawah untuk mendaftarkan timeline produksi baru.'}
          </p>
        </div>
        <button 
          type="button" 
          onClick={onClose} 
          className="text-xs font-bold uppercase tracking-wider text-dark/40 hover:text-dark border border-dark/10 hover:border-dark px-3 py-1.5 rounded-lg transition-all bg-white"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Project Name</label>
            <input type="text" placeholder="e.g. Sosmed Management IG" value={title} onChange={(e) => setTitle(e.target.value)} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Client Name Reference</label>
            <select value={clientName} onChange={(e) => setClientName(e.target.value)} className={inputClass}>
              {clients.map(c => (
                <option key={c.id} value={c.company_name}>{c.company_name} (PIC: {c.pic})</option>
              ))}
              {clients.length === 0 && <option value="Internal Studio">Internal Studio</option>}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className={labelClass}>Division Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
              <option value="IT Solution">IT Solution</option>
              <option value="Social Media">Social Media</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Target Deadline</label>
            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Completion Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputClass} />
          </div>
        </div>

        <div className="space-y-2">
          <label className={labelClass}>Production Asset Links (Multi-Category)</label>
          {links.map((link, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <select value={link.category} onChange={(e) => handleLinkChange(idx, 'category', e.target.value)} className="bg-white border border-dark/10 p-3.5 text-sm rounded-xl max-w-[160px] outline-none focus:border-dark">
                {linkCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <input type="url" placeholder="https://example.com/asset-path" value={link.url} onChange={(e) => handleLinkChange(idx, 'url', e.target.value)} className={inputClass} />
              {links.length > 1 && (
                <button type="button" onClick={() => handleRemoveLinkField(idx)} className="text-red-500 font-mono text-xs p-2 hover:text-red-700 transition-colors">✕</button>
              )}
            </div>
          ))}
          <button type="button" onClick={handleAddLinkField} className="text-[11px] font-bold uppercase tracking-wider text-dark/60 hover:text-dark mt-1 block">
            + Add Another Production Link
          </button>
        </div>

        <div>
          <label className={labelClass}>Internal Production Scope Notes</label>
          <textarea placeholder="Catatan internal scope kerja tim..." value={notes} onChange={(e) => setNotes(e.target.value)} rows="3" className={`${inputClass} resize-none`} />
        </div>
        
        <div className="flex justify-end pt-2 border-t border-dark/5">
          <button type="submit" disabled={isSubmitting} className="bg-dark text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-dark/80 disabled:opacity-50 transition-all">
            {isSubmitting ? 'Processing Operations...' : isEdit ? 'Update Project' : 'Deploy Project'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ProjectForm;