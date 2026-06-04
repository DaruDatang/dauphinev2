import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { supabase } from '../../lib/supabaseClient'; 

const Contact = () => {
  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  useEffect(() => {
    if (statusMessage.text) {
      const timer = setTimeout(() => setStatusMessage({ type: '', text: '' }), 6000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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

      const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          ...formData,
          access_key: ACCESS_KEY,
          subject: `New Inquiry from ${formData.name}`,
          from_name: "Dauphine Creative Website"
        })
      });
      const result = await response.json();

      if (result.success) {
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

        setStatusMessage({ type: 'success', text: 'Pesan terkirim! Kami akan segera menghubungi Anda.' });
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error(result.message || "Submission failed");
      }
    } catch (error) {
      setStatusMessage({ type: 'error', text: 'Gagal mengirim pesan. Silakan coba lagi nanti.' });
    } finally {
      setIsSending(false);
    }
  };

  const inputClass = "w-full bg-transparent border-b border-dark/20 focus:border-dark outline-none py-4 text-dark transition-all autofill:bg-transparent [-webkit-text-fill-color:black] [box-shadow:0_0_0px_1000px_#ffffff_inset] [transition:background-color_5000s_ease-in-out_0s] text-lg placeholder:text-dark/20";

  return (
    <section id="contact" className="py-32 bg-white">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="hidden md:block">
            <span className="text-sm font-medium text-dark/40 uppercase tracking-tighter">Get in Touch</span>
          </div>

          <div className="md:col-start-2 md:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl md:text-7xl font-medium text-dark tracking-tight leading-tight mb-16">
                Let's create something <br />
                <span className="text-dark/40">remarkable together.</span>
              </h2>

              <form onSubmit={handleSubmit} className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-dark/40 mb-2">Full name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-dark/40 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-dark/40 mb-2">Message</label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    required
                    className={`${inputClass} resize-none`}
                    placeholder="Tell us about your project"
                  ></textarea>
                </div>

                <div className="flex flex-col gap-6">
                  <AnimatePresence>
                    {statusMessage.text && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`text-sm font-bold p-4 border ${
                          statusMessage.type === 'success' ? 'border-green-500 text-green-600' : 'border-red-500 text-red-600'
                        }`}
                      >
                        {statusMessage.text}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <p className="text-xs text-dark/40 max-w-sm leading-relaxed uppercase tracking-tighter">
                      By sending this message, you agree to our privacy policy regarding the storage of contact data.
                    </p>
                    
                    <button 
                      type="submit"
                      disabled={isSending}
                      className="group relative flex items-center gap-4 text-xl font-bold uppercase tracking-tighter transition-all"
                    >
                      <span className={`${isSending ? 'opacity-50' : 'group-hover:pr-4'} transition-all duration-300`}>
                        {isSending ? 'Sending...' : 'Send Message'}
                      </span>
                      {!isSending && <span className="text-3xl">→</span>}
                      <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-dark scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;