import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 md:px-12 pt-32 md:pt-40 pb-16 overflow-hidden bg-transparent">
      
      <div className="absolute inset-0 bg-black/20 pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.55)_0%,_transparent_75%)] pointer-events-none z-0" />

      <div className="max-w-5xl mx-auto w-full relative z-10 text-center flex flex-col items-center justify-center">
        <motion.div 
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="flex flex-col items-center space-y-10"
        >
          <div className="space-y-6 flex flex-col items-center">
            
            <motion.h1 
              variants={itemVariants}
              className="text-6xl sm:text-7xl md:text-8xl lg:text-[7.5rem] font-black tracking-tighter leading-[0.9] text-white uppercase selection:bg-white selection:text-black drop-shadow-2xl"
            >
              BUILDING YOUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-300 to-zinc-500 drop-shadow-sm">
                DIGITAL PRESENCE
              </span>
            </motion.h1>
            
            <motion.div variants={itemVariants}>
              <p className="text-sm md:text-base text-zinc-300 font-light max-w-2xl leading-relaxed mx-auto selection:bg-white selection:text-black drop-shadow-md px-4">
                Dauphiné Creative is a digital agency that specializes in creating impactful digital products and solutions. We focus on structured solutions, data-driven strategies, and transparent processes to help businesses grow in the digital landscape.
              </p>
            </motion.div>

          </div>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto pt-6"
          >
            <Link 
              to="/calculator"
              className="bg-white text-black text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] px-8 py-4 rounded-full hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] text-center flex items-center justify-center"
            >
              Launch Project Calculator
            </Link>
            <Link 
              to="/projects"
              className="border border-white/20 bg-black/20 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] px-8 py-4 rounded-full hover:bg-white/10 hover:border-white/40 transition-all text-center flex items-center justify-center"
            >
              Explore Selected Works
            </Link>
          </motion.div>
        </motion.div>
      </div>

    </section>
  );
};

export default Hero;