import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="pt-48 pb-20 px-6 md:px-12 bg-[#ffffff]">
      <div className="max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-start-2 md:col-span-3">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-3xl md:text-5xl font-medium text-dark leading-[1.1] md:max-w-4xl tracking-tight"
          >
            Dauphiné Creative is a <span className="text-dark/40">Bandung-based digital creative agency</span> exploring how design and technology shape the way we interact and create. Our work blends clarity, function, and emotion.
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 1 }}
            className="flex gap-12 mt-12 text-sm font-bold uppercase tracking-tighter"
          >
            <a href="/projects" className="flex items-center gap-2 hover:text-primary transition-colors">
              Check all projects <span>→</span>
            </a>
            <a href="#contact" className="flex items-center gap-2 hover:text-primary transition-colors">
              Contact Us <span>→</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;