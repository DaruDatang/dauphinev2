import { motion } from 'framer-motion';
import SEO from '../components/common/SEO';
import Hero from '../components/home/Hero';
import ServicesList from '../components/home/ServicesList';
import FAQ from '../components/home/FAQ';
import Contact from '../components/home/Contact';

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
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="overflow-hidden bg-[#ffffff]"
    >

      <SEO 
        title="Dauphiné Creative — Digital Agency" 
        description="Dauphine Creative membantu mengubah ide menjadi produk digital yang andal dan berdampak nyata." 
      />
      
      <Hero />
      <ServicesList />
      <FAQ />
      <Contact />
    </motion.div>
  );
};

export default Home;