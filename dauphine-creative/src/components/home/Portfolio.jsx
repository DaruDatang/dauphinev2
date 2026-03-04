import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Portfolio = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const projects = [
    {
      title: "Booking System for Photo Studio",
      category: "IT Solution",
      desc: "Membantu perusahaan foto studio mendigitalisasi operasional mereka, dari pemesanan konvensional menjadi satu sistem pemesanan yang terintegrasi.",
      results: [
        "Sistem terpusat untuk UMKM",
        "Peningkatan performance bisnis",
        "Mengurangi inefisiensi operasional"
      ],
      image: "https://placehold.co/600x400/1D3557/F1FAEE?text=Portfolio+1" 
    },
    {
      title: "Social Media Rebranding",
      category: "Social Media Management",
      desc: "Merancang ulang identitas visual dan strategi konten untuk brand F&B, meningkatkan awareness dan interaksi secara organik.",
      results: [
        "Peningkatan engagement rate 150%",
        "Identitas visual yang lebih konsisten",
        "Pertumbuhan followers organik"
      ],
      image: "https://placehold.co/600x400/E63946/F1FAEE?text=Portfolio+2" 
    }
  ];

  const nextProject = () => setCurrentIndex((prev) => (prev + 1) % projects.length);
  const prevProject = () => setCurrentIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));

  return (
    <section id="portfolio" className="py-24 bg-light border-b-4 border-dark">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-5xl md:text-6xl font-black text-secondary">Future is <span className="text-primary underline decoration-wavy">now</span></h2>
          <div className="flex space-x-4">
            <button onClick={prevProject} className="comic-box p-3 bg-white text-dark hover:bg-primary hover:text-white"><FiChevronLeft size={24} /></button>
            <button onClick={nextProject} className="comic-box p-3 bg-white text-dark hover:bg-primary hover:text-white"><FiChevronRight size={24} /></button>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
            >
              {/* Kiri: Gambar */}
              <div className="comic-box overflow-hidden p-0 bg-white">
                <img src={projects[currentIndex].image} alt={projects[currentIndex].title} className="w-full h-auto object-cover" />
              </div>

              {/* Kanan: Detail Project */}
              <div>
                <p className="text-dark/60 font-bold mb-2 uppercase tracking-widest">{projects[currentIndex].category}</p>
                <h3 className="text-3xl font-black text-secondary mb-4">{projects[currentIndex].title}</h3>
                <p className="text-lg text-dark/80 font-medium mb-6">{projects[currentIndex].desc}</p>
                
                <h4 className="text-primary font-bold mb-3">Results</h4>
                <ul className="space-y-2">
                  {projects[currentIndex].results.map((result, idx) => (
                    <li key={idx} className="flex items-start text-dark/80 font-medium">
                      <span className="text-primary mr-2 font-black">•</span> {result}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;