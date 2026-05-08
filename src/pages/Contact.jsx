import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
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

    const web3Object = {
      ...formData,
      access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
      subject: `New Inquiry from ${formData.name}`,
      from_name: "Dauphiné Creative Website"
    };

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(web3Object)
      });
      const result = await response.json();

      if (result.success) {
        emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID, 
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID, 
          {
            to_name: formData.name,
            to_email: formData.email,
            reply_to: "dauphinecreative@gmail.com",
          }, 
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        ).catch(err => console.error("Auto-reply failed:", err));

        setStatusMessage({ 
          type: 'success', 
          text: 'Pesan terhasil dikirim! Kami juga telah mengirimkan konfirmasi ke email Anda.' 
        });
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error();
      }
    } catch (error) {
      setStatusMessage({ type: 'error', text: 'Gagal mengirim pesan. Silakan coba lagi nanti.' });
    } finally {
      setIsSending(false);
    }
  };

  const inputClass = "w-full bg-transparent border-b border-dark/20 focus:border-dark outline-none py-4 text-dark transition-all autofill:bg-transparent [-webkit-text-fill-color:black] [box-shadow:0_0_0px_1000px_#ffffff_inset] [transition:background-color_5000s_ease-in-out_0s] text-lg placeholder:text-dark/20";

  return (
    <div className="bg-white min-h-screen pt-48 pb-32">
      <SEO title="Contact - Dauphiné Creative" description="Let's build something remarkable together. Reach out to us for digital creative solutions." />
      
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-8">
          
          <div className="space-y-12">
            <div>
              <span className="text-sm font-medium text-dark/40 uppercase tracking-tighter block mb-8">Get in Touch / 04</span>
              <div className="space-y-4">
                <p className="text-sm font-bold uppercase tracking-widest text-dark/40">Email Us</p>
                <a href="mailto:dauphinecreative@gmail.com" className="text-xl md:text-1xl font-medium text-dark hover:text-dark/60 transition-colors block">
                  dauphinecreative@gmail.com
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-bold uppercase tracking-widest text-dark/40">Office</p>
              <p className="text-xl font-medium text-dark leading-snug">
                Bandung, West Java<br />Indonesia
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-bold uppercase tracking-widest text-dark/40">Follow Us</p>
              <div className="flex flex-col space-y-2">
                {['Instagram'].map((social) => (
                  <a key={social} href="#" className="text-xl font-medium text-dark hover:translate-x-2 transition-transform duration-300">
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Sisi Kanan: Form */}
          <div className="md:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl md:text-8xl font-medium text-dark tracking-tighter leading-[0.9] mb-20">
                Let's create something <br />
                <span className="text-dark/40 italic">remarkable</span> together.
              </h2>

              <form onSubmit={handleSubmit} className="space-y-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div className="group">
                    <label className="block text-xs font-bold uppercase tracking-widest text-dark/40 mb-2 transition-colors group-focus-within:text-dark">Full name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      placeholder="What's your name?"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-xs font-bold uppercase tracking-widest text-dark/40 mb-2 transition-colors group-focus-within:text-dark">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      placeholder="Where can we reach you?"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-xs font-bold uppercase tracking-widest text-dark/40 mb-2 transition-colors group-focus-within:text-dark">Message</label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    required
                    className={`${inputClass} resize-none`}
                    placeholder="Tell us about your project or idea"
                  ></textarea>
                </div>

                <div className="pt-8">
                  <AnimatePresence>
                    {statusMessage.text && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`text-sm font-bold p-6 mb-8 border ${
                          statusMessage.type === 'success' ? 'border-green-500/20 bg-green-50 text-green-600' : 'border-red-500/20 bg-red-50 text-red-600'
                        }`}
                      >
                        {statusMessage.text}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
                    <p className="text-xs text-dark/30 max-w-xs leading-relaxed uppercase tracking-tighter">
                      By sending this message, you agree to our privacy policy regarding the storage of contact data.
                    </p>
                    
                    <button 
                      type="submit"
                      disabled={isSending}
                      className="group relative inline-flex items-center gap-6 text-2xl md:text-3xl font-medium tracking-tighter"
                    >
                      <span className={`transition-all duration-500 ${isSending ? 'opacity-30' : 'group-hover:pr-6'}`}>
                        {isSending ? 'Sending Inquiry...' : 'Send Message'}
                      </span>
                      {!isSending && (
                        <span className="absolute right-0 opacity-0 group-hover:opacity-100 group-hover:-right-4 transition-all duration-500">
                          →
                        </span>
                      )}
                      <div className="absolute -bottom-2 left-0 w-full h-[1px] bg-dark/20 scale-x-100"></div>
                      <div className="absolute -bottom-2 left-0 w-full h-[1px] bg-dark scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;