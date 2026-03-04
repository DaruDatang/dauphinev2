import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiMinus } from 'react-icons/fi';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    { question: "Bagaimana proses kerjanya?", answer: "Kami mulai dengan diskusi kebutuhan, perancangan konsep, pengembangan (development), hingga tahap peluncuran dan evaluasi." },
    { question: "Apakah tim yang mengerjakan cukup berpengalaman?", answer: "Tentu! Tim kami terdiri dari ahli di bidang IT Solution dan Social Media yang sudah terbiasa menangani berbagai skala project." },
    { question: "Apakah butuh banyak dokumen (paperwork)?", answer: "Kami mengutamakan efisiensi. Dokumen yang diperlukan hanyalah proposal persetujuan, kontrak kerja sederhana, dan brief project." },
    { question: "Berapa rate/harga layanannya?", answer: "Harga sangat fleksibel dan disesuaikan dengan skala serta kompleksitas project Anda. Mari diskusikan kebutuhan Anda untuk mendapatkan penawaran terbaik." }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-white border-b-4 border-dark">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-5xl md:text-6xl font-black text-secondary leading-tight mb-6">
              Bekerja sama dengan kami <span className="text-primary">sangat mudah.</span>
            </h2>
            <p className="text-dark/70 font-medium mb-8">
              Tidak menemukan apa yang Anda cari? Mari kita diskusikan.
            </p>
            <button 
              onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
              style={{ color: '#111111', backgroundColor: '#457B9D' }}
              className="comic-box py-3 px-8 font-bold text-lg"
            >
              Contact Us
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            {faqs.map((faq, index) => (
              <div key={index} className="comic-box overflow-hidden bg-light !text-dark">
                <button 
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left px-6 py-5 flex justify-between items-center font-bold text-lg text-secondary hover:text-primary transition-colors focus:outline-none"
                >
                  <span className="pr-4">{faq.question}</span>
                  <motion.span 
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="text-2xl text-dark shrink-0"
                  >
                    {openIndex === index ? <FiMinus /> : <FiPlus />}
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
                        transition: {
                          height: {
                            type: "spring",
                            stiffness: 100,
                            damping: 15
                          },
                          opacity: { duration: 0.2 }
                        }
                      }}
                      exit={{ 
                        height: 0, 
                        opacity: 0,
                        transition: {
                          height: { duration: 0.3 },
                          opacity: { duration: 0.2 }
                        }
                      }}
                    >
                      <div className="px-6 pb-5 text-dark/80 font-medium border-t-2 border-dark/10 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;