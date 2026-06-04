import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { supabase } from '../lib/supabaseClient'; 
import SEO from '../components/common/SEO';

const Contact = () => {
  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  useEffect(() => {
    if (statusMessage.text) {
      const timer = setTimeout(() => setStatusMessage({ type: '', text: '' }), 6000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setStatusMessage({ type: '', text: '' });

    try {
      const { error: supabaseError } = await supabase
        .from('inquiries')
        .insert([
          { name: formData.name, email: formData.email, message: formData.message }
        ]);

      if (supabaseError) {
        console.error("Database tracking failed:", supabaseError.message);
      }

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...formData,
          access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
          subject: `New Inquiry from ${formData.name}`,
        })
      });
      
      if (response.ok) {
        emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID, 
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID, 
          { 
            name: formData.name,
            time: new Date().toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' }),
            message: formData.message,
            to_email: formData.email, 
            reply_to: "dauphinecreative@gmail.com" 
          }, 
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        ).catch(err => console.error("Auto-reply background engine failed:", err));

        setStatusMessage({ type: 'success', text: 'Success! We will be in touch soon.' });
        setFormData({ name: '', email: '', message: '' });
      } else { 
        throw new Error(); 
      }
    } catch (error) {
      setStatusMessage({ type: 'error', text: 'Error sending message. Please try again.' });
    } finally { 
      setIsSending(false); 
    }
  };

  const inputClass = "w-full bg-transparent border-b border-dark/10 focus:border-dark outline-none py-3 text-dark transition-all text-base placeholder:text-dark/20";

  return (
    <div className="bg-white min-h-[90vh] flex items-center pt-32 pb-20">
      <SEO title="Contact - Dauphiné" description="Let's build something remarkable together." />
      
      <div className="max-w-[1400px] mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-10 w-full">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-medium tracking-tighter leading-none mb-6">
                Let's talk!<br /> <span className="text-dark/30 italic">Send your inquiries</span>
              </h1>
              <p className="text-dark/60 max-w-xs text-sm uppercase tracking-widest leading-relaxed">
                Ready to elevate your digital presence? Send us a brief message.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-8 pt-6 border-t border-dark/5">
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-dark/30">Email</p>
                <a href="mailto:dauphinecreative@gmail.com" className="text-sm font-medium hover:text-dark/50 transition-colors">dauphinecreative@gmail.com</a>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-dark/30">Social</p>
                <a href="#" className="text-sm font-medium hover:text-dark/50 transition-colors">Instagram</a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#fafafa] p-8 md:p-12 rounded-2xl w-full">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-dark/40">Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className={inputClass} placeholder="Insert your name..." />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-dark/40">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputClass} placeholder="Insert your email..." />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-dark/40">Your Project Details</label>
                <textarea name="message" value={formData.message} onChange={handleChange} rows="3" required className={`${inputClass} resize-none`} placeholder="Briefly describe your goals..." />
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-4">
                <AnimatePresence>
                  {statusMessage.text && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`text-[11px] font-bold uppercase tracking-widest ${statusMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                      {statusMessage.text}
                    </motion.p>
                  )}
                </AnimatePresence>

                <button 
                  type="submit" 
                  disabled={isSending}
                  className="w-full sm:w-auto bg-dark text-white px-10 py-4 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-dark/80 transition-all disabled:opacity-50"
                >
                  {isSending ? 'Sending...' : 'Send Inquiry'}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;