import { motion } from 'framer-motion';
import { FiBox, FiCoffee, FiGlobe, FiLayout, FiTarget, FiZap, FiHexagon, FiTriangle } from 'react-icons/fi';

const ClientCarousel = () => {
  const clients = [
    { name: "Varnell Collection", icon: <FiBox /> },
    { name: "Motionpic Studio", icon: <FiGlobe /> },
    { name: "CNC Bandung", icon: <FiZap /> },
    { name: "Studio 8", icon: <FiLayout /> },
    { name: "BrewWorks", icon: <FiCoffee /> },
    { name: "Target Media", icon: <FiTarget /> },
    { name: "Hexagon", icon: <FiHexagon /> },
    { name: "Apex Ltd", icon: <FiTriangle /> },
  ];

  return (
    <section className="pt-12 pb-4 bg-white border-t-4 border-b-4 border-dark m-0 overflow-hidden">
      <div className="container mx-auto px-6 mb-10 text-center">
        <h3 className="text-2xl md:text-3xl font-black text-secondary">
          Trusted <span className="text-primary underline decoration-wavy">by</span>
        </h3>
      </div>

      {/* Container utama untuk animasi slider */}
      <div className="relative flex items-center overflow-hidden h-32">
        {/* Layer Gradasi untuk menyamarkan tepi kiri & kanan */}
        <div className="absolute inset-y-0 left-0 w-20 md:w-40 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-20 md:w-40 bg-gradient-to-l from-white to-transparent z-10" />

        <motion.div
          animate={{ x: [0, -1920] }}
          transition={{ 
            duration: 40, 
            ease: "linear", 
            repeat: Infinity 
          }}
          className="flex flex-nowrap shrink-0 gap-16 md:gap-24 items-center"
        >
          {/* Loop Data Klien (Dua kali agar tidak putus) */}
          {[...clients, ...clients, ...clients].map((client, idx) => (
            <div 
              key={idx} 
              className="flex flex-col items-center justify-center min-w-[120px] space-y-3 grayscale hover:grayscale-0 transition-all duration-300"
            >
              <div className="text-4xl md:text-5xl text-dark opacity-50 hover:opacity-100 transition-opacity">
                {client.icon}
              </div>
              <span className="font-bold text-dark/70 text-[10px] md:text-xs uppercase tracking-tighter whitespace-nowrap">
                {client.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ClientCarousel;