import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/common/SEO';
import SocialPlatformCarousel from '../components/services/SocialPlatformCarousel';
import ServiceContact from '../components/services/ServiceContact';
import { useScrollTracking } from '../hooks/useScrollTracking';
import { trackEvent } from '../lib/analytics';

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
  useScrollTracking('Social Media Management');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleOfferClick = (title) => {
    trackEvent('click_social_offer', 'Engagement', title);
  };

  const offers = [
    { 
      id: "01",
      title: "Content Creation", 
      desc: "Creating engaging and relevant visual and written content (copywriting), tailored specifically for your target audience.", 
      tags: ["Visual", "Copywriting", "Branding"]
    },
    { 
      id: "02",
      title: "Strategies & Concept", 
      desc: "In-depth research and social media campaign planning to ensure every post has a measurable impact.", 
      tags: ["Research", "Campaign", "Planning"]
    },
    { 
      id: "03",
      title: "Product Photography", 
      desc: "Taking high-quality product photos with art direction that aligns with your brand's identity and aesthetic.", 
      tags: ["Art Direction", "High Quality", "Visual Identity"]
    },
    { 
      id: "04",
      title: "Social Media Specialist", 
      desc: "Comprehensive account management, audience engagement, and performance data analysis for sustainable growth.", 
      tags: ["Management", "Analytics", "Growth"]
    }
  ];

  const reasons = [
    { title: "Data-Driven Strategy", desc: "Content decisions are not made randomly, but based on audience research and analysis of current trends." },
    { title: "Visual Consistency", desc: "We maintain your brand's tone, colors, and character consistently across all platforms." },
    { title: "Original Content", desc: "Visuals, photos, and videos are designed exclusively for you, not just using templates." },
    { title: "Proactive Engagement", desc: "We actively build two-way conversations with your community, not just posting content." },
    { title: "Transparent Reporting", desc: "Receive regular analytics that are easy to understand to monitor your account's growth directly." },
    { title: "Dedicated Team", desc: "A specialized team from copywriters to designers who are fully focused on your brand's success." }
  ];

  return (
    <div className="bg-[#ffffff] min-h-screen">
      <SEO 
        title="Social Media Management & Strategy" 
        description="Building a thriving digital ecosystem and a loyal community through creative content." 
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
                Building a thriving digital ecosystem and a loyal community through creative content that resonates and data-driven strategies.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 border-dark/10">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            <div className="hidden md:block">
              <span className="text-sm font-medium text-dark/40 uppercase tracking-tighter">Services we offer</span>
            </div>
          </div>
          
          <div className="flex flex-col">
            {offers.map((offer, idx) => (
              <div 
                key={idx} 
                onClick={() => handleOfferClick(offer.title)}
                className="group grid grid-cols-1 md:grid-cols-4 gap-4 py-16 border-t border-dark/10 hover:bg-dark/[0.02] transition-all duration-500 cursor-pointer"
              >
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
                Maintaining Your Digital Presence, <br />
                <span className="text-dark/40">with a Personal Touch.</span>
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