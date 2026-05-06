import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    { question: "Bagaimana proses kerjanya?", answer: "Kami mulai dengan diskusi kebutuhan, perancangan konsep, pengembangan (development), hingga tahap peluncuran dan evaluasi." },
    { question: "Apakah tim yang mengerjakan cukup berpengalaman?", answer: "Tentu! Tim kami terdiri dari ahli di bidang IT Solution dan Social Media yang sudah terbiasa menangani berbagai skala project." },
    { question: "Apakah butuh banyak dokumen (paperwork)?", answer: "Kami mengutamakan efisiensi. Dokumen yang diperlukan hanyalah proposal persetujuan, kontrak kerja sederhana, dan brief project." },
    { question: "Berapa rate/harga layanannya?", answer: "Harga sangat fleksibel dan disesuaikan dengan skala serta kompleksitas project Anda. Mari diskusikan untuk penawaran terbaik." }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-32 bg-[#ffffff] border-t border-dark/10">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="hidden md:block">
            <span className="text-sm font-medium text-dark/40 uppercase tracking-tighter">
              Inquiry / FAQ
            </span>
          </div>

          <div className="md:col-start-2 md:col-span-3">
            <h2 className="text-4xl md:text-6xl font-medium text-dark tracking-tight mb-16">
              Bekerja sama dengan kami <br />
              <span className="text-dark/40">sangat mudah.</span>
            </h2>

            <div className="flex flex-col">
              {faqs.map((faq, index) => (
                <div key={index} className="border-t border-dark/10 group">
                  <button 
                    onClick={() => toggleFAQ(index)}
                    className="w-full text-left py-8 flex justify-between items-center group-hover:bg-dark/[0.02] transition-all duration-300 px-4"
                  >
                    <span className="text-xl md:text-2xl font-medium text-dark tracking-tight">
                      {faq.question}
                    </span>
                    <motion.span 
                      animate={{ rotate: openIndex === index ? 45 : 0 }}
                      className="text-3xl text-dark/30 group-hover:text-dark transition-colors"
                    >
                      +
                    </motion.span>
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {openIndex === index && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ 
                          height: "auto", 
                          opacity: 1,
                          transition: { height: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }, opacity: { duration: 0.3 } }
                        }}
                        exit={{ 
                          height: 0, 
                          opacity: 0,
                          transition: { height: { duration: 0.3 }, opacity: { duration: 0.2 } }
                        }}
                      >
                        <div className="px-4 pb-10 text-dark/60 text-lg max-w-2xl leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              {/* Garis Penutup Bawah */}
              <div className="border-t border-dark/10"></div>
            </div>

            {/* CTA Button Minimalis */}
            <div className="mt-16 px-4">
              <button 
                onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                className="text-sm font-bold uppercase tracking-widest border-b-2 border-dark pb-1 hover:text-primary hover:border-primary transition-all"
              >
                Still have questions? Contact Us →
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FAQ;