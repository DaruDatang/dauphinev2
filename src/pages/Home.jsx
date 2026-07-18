import React from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/common/SEO';
import Hero from '../components/home/Hero';
import ServicesList from '../components/home/ServicesList';
import FAQ from '../components/home/FAQ';
import Contact from '../components/home/Contact';
import Feedback from '../components/home/Feedback';
import DigitalPetalsShader from '../components/ui/digital-petals-shader';
import { useScrollTracking } from '../hooks/useScrollTracking';

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
      staggerChildren: 0.15,    
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

const Home = () => {
  useScrollTracking('Home');

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="overflow-hidden bg-[#ffffff]"
    >
      <SEO 
        title="Welcome to Dauphiné Creative!" 
        description="Dauphine Creative membantu mengubah ide menjadi produk digital yang andal dan berdampak nyata." 
      />
      
      <div className="relative w-full min-h-screen bg-transparent">
        <DigitalPetalsShader />
        <div className="relative z-10 pointer-events-auto">
          <Hero />
        </div>
      </div>

      <ServicesList />
      <FAQ />
      <Contact />
      <Feedback />
    </motion.div>
  );
};

export default Home;