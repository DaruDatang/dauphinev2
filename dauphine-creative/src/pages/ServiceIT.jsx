import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMonitor, FiCpu } from 'react-icons/fi';
import SEO from '../components/common/SEO';
import TechStackCarousel from '../components/services/TechStackCarousel';
import ServiceContact from '../components/services/ServiceContact';

const ServiceIT = () => {
  useEffect(() => window.scrollTo(0, 0), []);

  const offers = [
    { 
      title: "Sistem Berbasis Website", 
      desc: "Pembuatan website company profile, e-commerce, hingga web-app kompleks yang responsif, cepat, dan SEO-friendly.", 
      icon: <FiMonitor /> 
    },
    { 
      title: "Otomasi Proses Bisnis", 
      desc: "Mengubah proses manual menjadi otomatis dengan sistem ERP, CRM, atau custom software untuk efisiensi biaya.", 
      icon: <FiCpu /> 
    }
  ];

  // Data khusus untuk Section "Why Dauphine Creative"
  const reasons = [
    {
      title: "Kecepatan Tanpa Pintasan",
      desc: "Sprint pengerjaan agile yang memberikan progress nyata dengan cepat, tanpa mengorbankan kualitas kode."
    },
    {
      title: "Arsitektur Skalabel",
      desc: "Dibangun dengan fondasi kode yang bersih dan kuat agar mudah dikembangkan seiring pertumbuhan bisnis Anda."
    },
    {
      title: "Desain x Engineering",
      desc: "UI/UX bukan sekadar tempelan. Kami memastikan antarmuka yang indah berjalan mulus dengan logika sistem."
    },
    {
      title: "Keamanan Terjamin",
      desc: "Prioritas pada perlindungan data. Sistem diuji dan diamankan dari celah kerentanan sebelum diluncurkan."
    },
    {
      title: "Garansi Dukungan",
      desc: "Tanggung jawab kami tidak berhenti setelah rilis. Kami memastikan sistem terawat dan didukung penuh."
    },
    {
      title: "Kepemilikan Jelas",
      desc: "Transparansi penuh atas repositori kode dan hak cipta. Anda memiliki kontrol penuh atas produk digital Anda."
    }
  ];

  return (
    <div className="bg-light min-h-screen">
      <SEO 
        title="IT Solution & Software Development" 
        description="Layanan IT Solution dari Dauphine Creative. Kami merancang website modern dan sistem otomasi proses bisnis." 
      />

      {/* Hero Banner Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden px-6 md:px-12 border-b-4 border-dark">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop"
            alt="IT Solution Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#F1FAEE]/90 backdrop-blur-[2px]" />
        </div>
        <div className="container mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h4 className="text-accent font-bold mb-2 tracking-widest uppercase text-sm">What We Do</h4>
            <h1 className="text-5xl md:text-7xl font-black text-secondary mb-8 leading-tight">
              IT <span className="text-primary underline decoration-wavy">Solution</span>
            </h1>
            <p className="text-xl text-dark/80 font-medium max-w-3xl leading-relaxed">
              Membangun fondasi infrastruktur digital yang tangguh dan future-proof untuk mengakselerasi efisiensi operasional serta memastikan bisnis Anda siap menghadapi skala pertumbuhan yang lebih besar..
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services We Offer Section */}
      <section className="container mx-auto px-6 md:px-12 py-16">
        <h3 className="text-3xl font-black text-secondary mb-10">Services We Offer</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {offers.map((offer, idx) => (
            <div key={idx} className="comic-box p-8 md:p-10 bg-white hover:-translate-y-2 transition-transform flex flex-col md:flex-row items-start gap-8">
              <div className="text-6xl text-accent shrink-0">{offer.icon}</div>
              <div className="flex flex-col">
                <h4 className="text-2xl font-black text-dark mb-4 leading-tight">{offer.title}</h4>
                <p className="text-dark/80 font-medium leading-relaxed">{offer.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack Carousel Section */}
      <TechStackCarousel />
      
      {/* NEW SECTION: Why Dauphine Creative */}
      <section className="container mx-auto px-6 md:px-12 py-20">
        <div className="text-center mb-12">
          <h3 className="text-4xl md:text-5xl font-black text-secondary mb-4">
            Why <span className="text-accent">Dauphine Creative?</span>
          </h3>
          <p className="text-dark/70 font-medium max-w-2xl mx-auto">
            Dibangun untuk performa, dirancang untuk masa depan. Kami lebih dari sekadar vendor *coding*.
          </p>
        </div>
        
        {/* Grid 3 Kolom seperti desain Techbar */}
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

      {/* Contact Section */}
      <ServiceContact serviceName="IT Solution" />
    </div>
  );
};

export default ServiceIT;