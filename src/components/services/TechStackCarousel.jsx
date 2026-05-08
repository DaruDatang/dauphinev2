import { motion } from 'framer-motion';
import { SiReact, SiTailwindcss, SiVite, SiNodedotjs, SiPython, SiPhp, SiLaravel, SiMysql } from 'react-icons/si';

const TechStackCarousel = () => {
  const techs = [
    { icon: <SiReact />, name: "React" },
    { icon: <SiTailwindcss />, name: "Tailwind" },
    { icon: <SiVite />, name: "Vite" },
    { icon: <SiNodedotjs />, name: "Node.js" },
    { icon: <SiPython />, name: "Python" },
    { icon: <SiPhp />, name: "PHP" },
    { icon: <SiLaravel />, name: "Laravel" },
    { icon: <SiMysql />, name: "MySQL" },
  ];

  const duplicatedTechs = [...techs, ...techs, ...techs];

  return (
    <section className="py-24 bg-[#ffffff] border-dark/10 overflow-hidden">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
          
          <div className="hidden md:block">
            <h3 className="text-sm font-medium text-dark/40 uppercase tracking-tighter leading-tight">
              Our Tech <br /> Stack
            </h3>
          </div>

          <div className="md:col-span-3 relative">
            
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#ffffff] to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#ffffff] to-transparent z-10 pointer-events-none" />

            <div className="flex items-center overflow-hidden py-4">
              <motion.div 
                className="flex space-x-16 md:space-x-24 items-center shrink-0"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ 
                  ease: "linear", 
                  duration: 30, 
                  repeat: Infinity 
                }}
              >
                {duplicatedTechs.map((tech, index) => (
                  <div key={index} className="flex flex-col items-center justify-center w-24 shrink-0 group">
                    <div className="text-5xl md:text-6xl text-dark/30 group-hover:text-dark transition-all duration-500 mb-4 group-hover:-translate-y-1">
                      {tech.icon}
                    </div>
                    <span className="font-bold text-dark/20 group-hover:text-dark/80 text-[10px] md:text-xs uppercase tracking-widest transition-all duration-500">
                      {tech.name}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TechStackCarousel;