import { useEffect } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/common/SEO';
import TechStackCarousel from '../components/services/TechStackCarousel';
import ServiceContact from '../components/services/ServiceContact';

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

const ServiceIT = () => {
  useEffect(() => window.scrollTo(0, 0), []);

  const offers = [
    { 
      id: "01",
      title: "Web-based system development", 
      desc: "Development of company profile websites, e-commerce platforms, and complex web applications that are responsive, fast, and SEO-friendly.", 
      tags: ["Web App", "E-Commerce", "Responsive"]
    },
    { 
      id: "02",
      title: "Business Process Automation", 
      desc: "Transforming manual processes into automated workflows with ERP, CRM, or custom software to enhance operational efficiency and reduce costs.", 
      tags: ["ERP/CRM", "Custom Software", "Efficiency"]
    }
  ];

  const reasons = [
    { title: "Speed Without Compromises", desc: "Agile development sprints that deliver real progress without sacrificing code quality." },
    { title: "Scalable Architecture", desc: "Built on a clean code foundation for easy development as your business grows." },
    { title: "Design x Engineering", desc: "We ensure beautiful interfaces run smoothly with robust system logic." },
    { title: "Guaranteed Security", desc: "Data protection is a priority. Systems are rigorously tested before launch." },
    { title: "Support Guarantee", desc: "We ensure your systems are well-maintained and fully supported after launch." },
    { title: "Clear Ownership", desc: "Full transparency over the code repository. You have complete control over your digital product." }
  ];

  return (
    <div className="bg-[#ffffff] min-h-screen">
      <SEO 
        title="IT Solution & Software Development" 
        description="Building a strong and future-proof digital infrastructure foundation." 
      />

      <section className="pt-48 pb-24 px-6 md:px-12">
        <div className="max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="hidden md:block">
            <span className="text-sm font-medium text-dark/40 uppercase tracking-tighter">Capabilities / 01</span>
          </div>
          <div className="md:col-start-2 md:col-span-3">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="text-5xl md:text-8xl font-medium text-dark tracking-tighter leading-[0.9] mb-12">
                IT <span className="text-dark/40">Solution.</span>
              </h1>
              <p className="text-xl md:text-3xl text-dark/70 font-medium max-w-4xl leading-tight">
                Building a strong and future-proof digital infrastructure foundation to accelerate your business operations.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 ">
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

      <div className="py-12 border-dark/10">
        <TechStackCarousel />
      </div>

      <section className="py-32">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-24">
            <div className="hidden md:block">
              <span className="text-sm font-medium text-dark/40 uppercase tracking-tighter">Why partner with us</span>
            </div>
            <div className="md:col-start-2 md:col-span-3">
              <h2 className="text-4xl md:text-6xl font-medium text-dark tracking-tight leading-tight">
                Built for performance, <br />
                <span className="text-dark/40">designed for the future.</span>
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

      <ServiceContact serviceName="IT Solution" />
    </div>
  );
};

export default ServiceIT;