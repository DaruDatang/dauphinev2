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

  // Menduplikasi array agar animasi infinite loop terlihat mulus
  const duplicatedTechs = [...techs, ...techs, ...techs];

  return (
    <section className="py-20 bg-white border-y-4 border-dark overflow-hidden">
      <div className="container mx-auto px-6 text-center mb-10">
        <h3 className="text-3xl font-black text-secondary">Teknologi yang Kami Gunakan</h3>
      </div>
      
      <div className="relative flex w-full">
        {/* Efek gradient di kanan-kiri agar transisi halus */}
        <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-white to-transparent z-10"></div>
        <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-white to-transparent z-10"></div>

        <motion.div 
          className="flex space-x-12 items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 20, repeat: Infinity }}
        >
          {duplicatedTechs.map((tech, index) => (
            <div key={index} className="flex flex-col items-center justify-center w-32 shrink-0">
              <div className="text-6xl text-dark/70 hover:text-primary transition-colors mb-4">
                {tech.icon}
              </div>
              <span className="font-bold text-dark/80">{tech.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TechStackCarousel;