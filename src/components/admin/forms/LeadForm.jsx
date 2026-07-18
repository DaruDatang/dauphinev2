import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LeadForm = ({ lead, onSave, onClose, isSubmitting }) => {
  const isEdit = !!lead;
  
  const [name, setName] = useState('');
  const [institution, setInstitution] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [otherContact, setOtherContact] = useState('');

  useEffect(() => {
    if (lead) {
      setName(lead.name || '');
      setInstitution(lead.institution || '');
      setWhatsapp(lead.whatsapp || '');
      setEmail(lead.email || '');
      setOtherContact(lead.other_contact || '');
    } else {
      setName('');
      setInstitution('');
      setWhatsapp('');
      setEmail('');
      setOtherContact('');
    }
  }, [lead]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      name,
      institution,
      whatsapp: whatsapp || null,
      email: email || null,
      other_contact: otherContact || null
    };
    onSave(formData);
  };

  const inputClass = "w-full bg-white border border-dark/10 focus:border-dark outline-none p-3.5 text-dark text-sm rounded-xl transition-all placeholder:text-dark/20";
  const labelClass = "text-[10px] font-bold uppercase tracking-widest text-dark/40 block mb-1.5 ms-1";

  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: 10 }} 
      className="bg-[#fafafa] p-6 rounded-2xl border border-dark/5 shadow-inner"
    >
      <div className="flex justify-between items-center border-b border-dark/5 pb-4 mb-6">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-dark">
            {isEdit ? 'Modify Prospect Parameters' : 'Acquire New Potential Lead'}
          </h3>
          <p className="text-[11px] text-dark/40 mt-0.5">
            {isEdit ? 'Perbarui rekaman detail data saluran komunikasi prospek.' : 'Catat entitas korporat atau instansi potensial untuk perluasan pipeline CRM.'}
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
            <label className={labelClass}>Lead Name / PIC Name</label>
            <input type="text" placeholder="e.g. Bobby Pratama" value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Institution / Corporate Agency</label>
            <input type="text" placeholder="e.g. Universitas Melati" value={institution} onChange={(e) => setInstitution(e.target.value)} required className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>WhatsApp Number</label>
            <input type="text" placeholder="e.g. 08123456789" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Email Address</label>
            <input type="email" placeholder="name@domain.com" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Other Social Path / Info</label>
          <input type="text" placeholder="e.g. LinkedIn Profile URL or Instagram Handle" value={otherContact} onChange={(e) => setOtherContact(e.target.value)} className={inputClass} />
        </div>

        <div className="flex justify-end pt-2 border-t border-dark/5">
          <button type="submit" disabled={isSubmitting} className="bg-dark text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-dark/80 disabled:opacity-50 transition-all">
            {isSubmitting ? 'Securing CRM Record...' : isEdit ? 'Update CRM Record' : 'Save CRM Record'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default LeadForm;