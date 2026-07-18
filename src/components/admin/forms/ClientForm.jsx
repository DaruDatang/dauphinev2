import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ClientForm = ({ client, onSave, onClose, isSubmitting }) => {
  const isEdit = !!client;
  
  const [companyName, setCompanyName] = useState('');
  const [pic, setPic] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (client) {
      setCompanyName(client.company_name || '');
      setPic(client.pic || '');
      setEmail(client.email || '');
      setPhone(client.phone || '');
      setAddress(client.address || '');
    } else {
      setCompanyName('');
      setPic('');
      setEmail('');
      setPhone('');
      setAddress('');
    }
  }, [client]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      company_name: companyName,
      pic,
      email: email || null,
      phone: phone || null,
      address: address || null
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
            {isEdit ? 'Reconfigure Client Credentials' : 'Register External Corporate Partner'}
          </h3>
          <p className="text-[11px] text-dark/40 mt-0.5">
            {isEdit ? 'Perbarui informasi legalitas kontak partner studio.' : 'Daftarkan entitas bisnis baru ke dalam ekosistem integrasi project tracker.'}
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
            <label className={labelClass}>Company Name / Brand Entity</label>
            <input type="text" placeholder="e.g. PT Marga Tirta Kencana" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Person In Charge (PIC)</label>
            <input type="text" placeholder="e.g. Ifa & Noey" value={pic} onChange={(e) => setPic(e.target.value)} required className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Corporate Email Address</label>
            <input type="email" placeholder="marketing@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Phone / Operational Hotline</label>
            <input type="text" placeholder="e.g. 08122027177" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Headquarters / Office Address</label>
          <textarea placeholder="Alamat lengkap operasional korespondensi perusahaan..." value={address} onChange={(e) => setAddress(e.target.value)} rows="3" className={`${inputClass} resize-none`} />
        </div>

        <div className="flex justify-end pt-2 border-t border-dark/5">
          <button type="submit" disabled={isSubmitting} className="bg-dark text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-dark/80 disabled:opacity-50 transition-all">
            {isSubmitting ? 'Registering Partnership...' : isEdit ? 'Update Client Directory' : 'Deploy Client Directory'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ClientForm;