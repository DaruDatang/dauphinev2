import { useEffect } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/common/SEO';
import SocialPlatformCarousel from '../components/services/SocialPlatformCarousel';
import ServiceContact from '../components/services/ServiceContact';
import { AnimatePresence } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1], 
      staggerChildren: 0.2,    
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.5,
    },
  },
};

const PageWrapper = ({ children }) => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
};

const ServiceSocial = () => {
  useEffect(() => window.scrollTo(0, 0), []);

  const offers = [
    { 
      id: "01",
      title: "Content Creation", 
      desc: "Pembuatan konten visual dan tekstual (copywriting) yang menarik, relevan, dan dirancang khusus untuk target audiens Anda.", 
      tags: ["Visual", "Copywriting", "Branding"]
    },
    { 
      id: "02",
      title: "Strategies & Concept", 
      desc: "Riset mendalam dan perencanaan kampanye media sosial untuk memastikan setiap postingan memiliki dampak terukur.", 
      tags: ["Research", "Campaign", "Planning"]
    },
    { 
      id: "03",
      title: "Product Photography", 
      desc: "Pengambilan foto produk berkualitas tinggi dengan art direction yang sesuai dengan identitas dan estetika brand Anda.", 
      tags: ["Art Direction", "High Quality", "Visual Identity"]
    },
    { 
      id: "04",
      title: "Social Media Specialist", 
      desc: "Manajemen akun secara menyeluruh, interaksi audiens, dan analisis data performa untuk pertumbuhan yang berkelanjutan.", 
      tags: ["Management", "Analytics", "Growth"]
    }
  ];

  const reasons = [
    { title: "Strategi Berbasis Data", desc: "Keputusan konten tidak dibuat asal, melainkan berdasarkan riset audiens dan analisis tren terkini." },
    { title: "Konsistensi Visual", desc: "Kami menjaga nada, warna, dan karakter brand Anda tetap seragam di semua platform." },
    { title: "Konten Orisinal", desc: "Visual, foto, dan video dirancang secara eksklusif, bukan sekadar menggunakan template." },
    { title: "Interaksi Proaktif", desc: "Kami aktif membangun percakapan dua arah dengan komunitas Anda, bukan sekadar memposting." },
    { title: "Laporan Transparan", desc: "Dapatkan analitik rutin yang mudah dipahami untuk memantau langsung pertumbuhan akun Anda." },
    { title: "Tim Dedikasi", desc: "Satu tim khusus dari copywriter hingga desainer yang fokus penuh pada kesuksesan brand Anda." }
  ];

  return (
    <div className="bg-[#ffffff] min-h-screen">
      <SEO 
        title="Social Media Management & Strategy" 
        description="Membangun ekosistem digital yang hidup dan komunitas yang setia melalui konten kreatif." 
      />

      <section className="pt-48 pb-24 px-6 md:px-12">
        <div className="max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="hidden md:block">
            <span className="text-sm font-medium text-dark/40 uppercase tracking-tighter">Capabilities / 02</span>
          </div>
          
          <div className="md:col-start-2 md:col-span-3">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="text-5xl md:text-8xl font-medium text-dark tracking-tighter leading-[0.9] mb-12">
                Social Media <span className="text-dark/40">Management.</span>
              </h1>
              <p className="text-xl md:text-3xl text-dark/70 font-medium max-w-4xl leading-tight">
                Membangun ekosistem digital yang hidup dan komunitas yang setia melalui konten kreatif yang relevan serta strategi data yang presisi.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 border-t border-dark/10">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            <div className="hidden md:block">
              <span className="text-sm font-medium text-dark/40 uppercase tracking-tighter">Services we offer</span>
            </div>
          </div>
          
          <div className="flex flex-col">
            {offers.map((offer, idx) => (
              <div key={idx} className="group grid grid-cols-1 md:grid-cols-4 gap-4 py-16 border-t border-dark/10 hover:bg-dark/[0.02] transition-all duration-500">
                <div className="hidden md:block text-sm font-bold text-dark/30">({offer.id})</div>
                <div className="md:col-span-2">
                  <h3 className="text-3xl md:text-5xl font-medium tracking-tight mb-4 group-hover:translate-x-2 transition-transform duration-500">
                    {offer.title}
                  </h3>
                  <p className="text-dark/60 text-lg max-w-md">{offer.desc}</p>
                </div>
                <div className="flex flex-wrap gap-2 items-start justify-end">
                  {offer.tags.map(tag => (
                    <span key={tag} className="text-[10px] uppercase font-bold tracking-widest border border-dark/20 px-2 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
            <div className="border-t border-dark/10"></div>
          </div>
        </div>
      </section>

      <div className="py-12 border-b border-dark/10">
        <SocialPlatformCarousel />
      </div>

      <section className="py-32">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-24">
            <div className="hidden md:block">
              <span className="text-sm font-medium text-dark/40 uppercase tracking-tighter">Our Approach</span>
            </div>
            <div className="md:col-start-2 md:col-span-3">
              <h2 className="text-4xl md:text-6xl font-medium text-dark tracking-tight leading-tight">
                Merawat citra digital Anda, <br />
                <span className="text-dark/40">dengan sentuhan personal.</span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20 md:col-start-2 md:ml-[25%]">
            {reasons.map((reason, idx) => (
              <div key={idx} className="flex flex-col gap-4">
                <span className="text-xs font-bold text-dark/20">0{idx + 1}</span>
                <h4 className="text-xl font-bold text-dark tracking-tight uppercase">{reason.title}</h4>
                <p className="text-dark/60 leading-relaxed text-sm">{reason.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ServiceContact serviceName="Social Media Management" />
    </div>
  );
};

export default ServiceSocial;