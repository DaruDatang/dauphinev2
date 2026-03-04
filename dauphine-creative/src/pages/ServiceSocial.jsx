import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiEdit3, FiTrendingUp, FiCamera, FiUsers } from 'react-icons/fi';
import SEO from '../components/common/SEO';
import SocialPlatformCarousel from '../components/services/SocialPlatformCarousel';
import ServiceContact from '../components/services/ServiceContact';

const ServiceSocial = () => {
  // Memastikan halaman otomatis scroll ke paling atas saat baru dibuka
  useEffect(() => window.scrollTo(0, 0), []);

  const offers = [
    { 
      title: "Content Creation", 
      desc: "Pembuatan konten visual dan tekstual (copywriting) yang menarik, relevan, dan dirancang khusus untuk target audiens.", 
      icon: <FiEdit3 /> 
    },
    { 
      title: "Strategies & Concept", 
      desc: "Riset mendalam dan perencanaan kampanye media sosial untuk memastikan setiap postingan memiliki dampak terukur.", 
      icon: <FiTrendingUp /> 
    },
    { 
      title: "Product Photography", 
      desc: "Pengambilan foto produk berkualitas tinggi dengan art direction yang sesuai dengan identitas dan estetika brand Anda.", 
      icon: <FiCamera /> 
    },
    { 
      title: "Social Media Specialist", 
      desc: "Manajemen akun secara menyeluruh, interaksi dengan audiens, dan analisis data performa untuk pertumbuhan yang berkelanjutan.", 
      icon: <FiUsers /> 
    },
  ];

  const reasons = [
    {
      title: "Strategi Berbasis Data",
      desc: "Keputusan konten tidak dibuat asal, melainkan berdasarkan riset audiens dan analisis tren terkini."
    },
    {
      title: "Konsistensi Visual",
      desc: "Kami menjaga nada, warna, dan karakter brand Anda tetap seragam dan profesional di semua platform."
    },
    {
      title: "Konten Orisinal",
      desc: "Visual, foto, dan video yang kami produksi dirancang secara eksklusif, bukan sekadar template."
    },
    {
      title: "Interaksi Proaktif",
      desc: "Kami tidak hanya memposting, tapi aktif membangun percakapan dua arah dengan komunitas Anda."
    },
    {
      title: "Laporan Transparan",
      desc: "Dapatkan analitik rutin yang mudah dipahami untuk memantau langsung pertumbuhan akun Anda."
    },
    {
      title: "Tim Dedikasi",
      desc: "Satu tim khusus dari copywriter hingga desainer yang fokus penuh pada kesuksesan brand Anda."
    }
  ];

  return (
    <div className="bg-light min-h-screen">
      <SEO 
        title="Social Media Management & Strategy" 
        description="Membangun ekosistem digital yang hidup dan komunitas yang setia melalui konten kreatif yang relevan serta strategi data yang presisi." 
      />

      {/* Hero Banner Section - Layout Identik dengan Homepage */}
      <section className="relative min-h-[80vh] flex items-center justify-center pt-20 overflow-hidden px-6 md:px-12 border-b-4 border-dark">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2074&auto=format&fit=crop"
            alt="Social Media Management Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#F1FAEE]/90 backdrop-blur-[2px]" />
        </div>

        {/* Content Layer */}
        <div className="container mx-auto relative z-10 text-center md:text-left">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h4 className="text-primary font-bold mb-2 tracking-widest uppercase text-sm">What We Do</h4>
            <h1 className="text-5xl md:text-7xl font-black text-secondary mb-8 leading-tight">
              Social Media <span className="text-accent underline decoration-wavy">Management</span>
            </h1>
            <p className="text-xl md:text-2xl text-dark/80 font-medium max-w-4xl leading-relaxed">
              Membangun ekosistem digital yang hidup dan komunitas yang setia melalui konten kreatif yang relevan serta strategi data yang presisi untuk memastikan brand Anda tetap unggul di tengah persaingan media sosial yang dinamis.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services We Offer Section */}
      <section className="container mx-auto px-6 md:px-12 py-16 mb-4">
        <h3 className="text-3xl font-black text-secondary mb-10">Services We Offer</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {offers.map((offer, idx) => (
            <div key={idx} className="comic-box p-8 bg-yellow-100 hover:-translate-y-2 transition-transform h-full">
              <div className="text-4xl text-primary mb-6 shrink-0">{offer.icon}</div>
              <h4 className="text-xl font-black text-dark mb-4 leading-tight">{offer.title}</h4>
              <p className="text-sm text-dark/80 font-medium leading-relaxed">{offer.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social Platform Carousel Section */}
      <SocialPlatformCarousel />

      {/* Why Dauphine Creative Section */}
      <section className="container mx-auto px-6 md:px-12 py-20">
        <div className="text-center mb-12">
          <h3 className="text-4xl md:text-5xl font-black text-secondary mb-4">
            Why <span className="text-primary">Dauphine Creative?</span>
          </h3>
          <p className="text-dark/70 font-medium max-w-2xl mx-auto text-lg">
            Kami tidak hanya mengelola media sosial, kami merawat dan membesarkan citra digital Anda melalui pendekatan yang personal dan profesional.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, idx) => (
            <div key={idx} className="comic-box p-8 bg-white hover:-translate-y-2 transition-transform h-full flex flex-col items-start text-left">
              <h4 className="text-2xl font-black text-dark mb-3 leading-tight">{reason.title}</h4>
              <p className="text-dark/80 font-medium leading-relaxed">
                {reason.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <ServiceContact serviceName="Social Media Management" />
    </div>
  );
};

export default ServiceSocial;