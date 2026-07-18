import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/common/SEO';
import { useScrollTracking } from '../hooks/useScrollTracking';
import { trackEvent } from '../lib/analytics';

import imgProject1 from '../assets/project/project1.avif';
import imgProject2 from '../assets/project/project2.avif';

const ProjectList = () => {
  useScrollTracking('Project List');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleProjectClick = (projectTitle) => {
    trackEvent('view_project_detail', 'Engagement', projectTitle);
  };

  const projects = [
    {
      id: "01",
      title: "Booking System for Photo Studio",
      category: "IT Solution",
      year: "2025",
      desc: "Helping photo studio companies digitize their operations, transforming conventional booking processes into one integrated booking system.",
      results: [
        "Centralized system for Small Businesses",
        "Improved business performance",
        "Reduced operational inefficiencies"
      ],
      image: imgProject1
    },
    {
      id: "02",
      title: "Social Media Management",
      category: "Creative Strategy",
      year: "2026",
      desc: "Designing a new visual identity and content strategy for growing brands, enhancing awareness and organic engagement.",
      results: [
        "150% increase in engagement rate",
        "More consistent visual identity",
        "Organic follower growth"
      ],
      image: imgProject2
    }
  ];

  const containerVariants = {
    animate: {
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <div className="bg-[#ffffff] min-h-screen pt-48 pb-32">
      <SEO title="Projects - Dauphiné Creative" />

      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-24">
          <div className="hidden md:block">
            <span className="text-sm font-medium text-dark/40 uppercase tracking-tighter">Archive / Projects</span>
          </div>
          <div className="md:col-start-2 md:col-span-3">
            <h1 className="text-5xl md:text-8xl font-medium text-dark tracking-tighter leading-[0.9] mb-8">
              Our <span className="text-dark/40">Works.</span>
            </h1>
            <p className="text-lg text-dark/60 leading-relaxed max-w-2xl">
              Showcasing a selection of our featured projects, ranging from IT solutions to creative strategies. Each project represents a unique journey that reflects our commitment to quality and innovation.
            </p>
          </div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
        >
          <div className="md:col-start-2 md:col-span-3 space-y-32">
            {projects.map((project, index) => (
              <motion.div 
                key={index} 
                variants={itemVariants}
                className="group border-t border-dark/10 pt-16 cursor-pointer"
                onClick={() => handleProjectClick(project.title)}
              >
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-12">
                  <div className="w-full aspect-video overflow-hidden border border-dark/5 bg-white mb-12 flex items-center justify-center">
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-1000 ease-in-out group-hover:scale-102" 
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div>
                      <div className="flex gap-4 text-xs font-bold text-dark/40 uppercase tracking-widest mb-4">
                        <span>{project.category}</span>
                        <span>•</span>
                        <span>{project.year}</span>
                      </div>
                      <h3 className="text-3xl md:text-5xl font-medium text-dark tracking-tight mb-6">
                        {project.title}
                      </h3>
                      <p className="text-lg text-dark/60 leading-relaxed max-w-xl">
                        {project.desc}
                      </p>
                    </div>

                    <div className="pt-2">
                      <span className="text-xs font-bold uppercase tracking-widest text-dark/30 block mb-6">Impact & Results</span>
                      <ul className="space-y-4">
                        {project.results.map((result, rIdx) => (
                          <li key={rIdx} className="flex items-center text-dark font-medium border-b border-dark/10 pb-4 last:border-0">
                            <span className="w-6 text-dark/30 text-xs font-bold">{`0${rIdx + 1}`}</span>
                            {result}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectList;