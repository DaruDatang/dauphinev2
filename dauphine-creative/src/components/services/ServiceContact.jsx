import { useState } from 'react';
import { motion } from 'framer-motion';

const ServiceContact = ({ serviceName }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailTo = 'dauphinecreative@gmail.com'; 
    const subject = `Inquiry Layanan ${serviceName} dari: ${formData.name}`;
    const body = `Halo Tim Dauphine Creative,\n\nSaya tertarik dengan layanan ${serviceName} dan ingin berdiskusi lebih lanjut.\n\nDari: ${formData.name}\nEmail: ${formData.email}\n\nDetail Kebutuhan:\n${formData.message}\n\nTerima kasih.`;

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${emailTo}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.open(gmailUrl, '_blank');
  };

  const inputClass = "w-full bg-transparent border-b border-dark/20 focus:border-dark outline-none py-4 text-dark transition-all text-lg placeholder:text-dark/20";

  return (
    <section className="py-32 bg-[#ffffff] border-t border-dark/10">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="hidden md:block">
            <span className="text-sm font-medium text-dark/40 uppercase tracking-tighter">
              Service Inquiry
            </span>
          </div>

          <div className="md:col-start-2 md:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-6xl font-medium text-dark tracking-tight leading-tight mb-16">
                Tertarik dengan layanan <br />
                <span className="text-dark/40">{serviceName} kami?</span>
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
                  <label className="block text-xs font-bold uppercase tracking-widest text-dark/40 mb-2">Tell us about your project</label>
                  <textarea 
                    name="message" 
                    value={formData.message}
                    onChange={handleChange}
                    rows="4" 
                    className={`${inputClass} resize-none`}
                    placeholder="Briefly describe what you need"
                  ></textarea>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pt-4">
                  <p className="text-xs text-dark/40 max-w-sm uppercase tracking-tighter">
                    Klik tombol kirim untuk melanjutkan diskusi melalui Gmail.
                  </p>
                  
                  <button 
                    type="submit" 
                    className="group relative flex items-center gap-4 text-xl font-bold uppercase tracking-tighter transition-all"
                  >
                    <span className="group-hover:pr-4 transition-all duration-300">
                      Send Inquiry
                    </span>
                    <span className="text-3xl">→</span>
                    <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-dark scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ServiceContact;