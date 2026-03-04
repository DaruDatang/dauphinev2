import { motion } from 'framer-motion';
import { FiBox, FiCoffee, FiGlobe, FiLayout, FiTarget, FiZap, FiHexagon, FiTriangle } from 'react-icons/fi';

const ClientCarousel = () => {
  const clients = [
    { name: "Varnell Collection", icon: <FiBox /> },
    { name: "Motionpic Studio Bandung", icon: <FiGlobe /> },
    { name: "CNC Bandung", icon: <FiZap /> },
    { name: "Studio 8", icon: <FiLayout /> },
    { name: "BrewWorks", icon: <FiCoffee /> },
    { name: "Target Media", icon: <FiTarget /> },
    { name: "Hexagon", icon: <FiHexagon /> },
    { name: "Apex Ltd", icon: <FiTriangle /> },
  ];

  return (
    <section className="py-12 bg-white border-b-4 border-dark">
      <div className="container mx-auto px-6 mb-8 text-center">
        <h3 className="text-2xl md:text-3xl font-black text-secondary">
          Trusted <span className="text-primary underline decoration-wavy">by</span>
        </h3>
      </div>

      <div className="relative flex overflow-hidden group">
        
        <div className="absolute top-0 bottom-0 left-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <motion.div
          animate={{ x: ["0%", "-100%"] }}
          transition={{ duration: 30, ease: "linear", repeat: Infinity }}
          className="flex gap-16 md:gap-24 min-w-full shrink-0 items-center justify-around px-8"
        >
          {clients.map((client, idx) => (
            <div key={`client-1-${idx}`} className="flex flex-col items-center justify-center space-y-3 grayscale hover:grayscale-0 transition-all duration-300">
              <div className="text-5xl md:text-6xl text-dark opacity-60 hover:opacity-100 hover:text-primary transition-all cursor-pointer hover:-translate-y-2">
                {client.icon}
              </div>
              <span className="font-bold text-dark/80 text-sm md:text-base">{client.name}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          animate={{ x: ["0%", "-100%"] }}
          transition={{ duration: 30, ease: "linear", repeat: Infinity }}
          className="flex gap-16 md:gap-24 min-w-full shrink-0 items-center justify-around px-8"
        >
          {clients.map((client, idx) => (
            <div key={`client-2-${idx}`} className="flex flex-col items-center justify-center space-y-3 grayscale hover:grayscale-0 transition-all duration-300">
              <div className="text-5xl md:text-6xl text-dark opacity-60 hover:opacity-100 hover:text-primary transition-all cursor-pointer hover:-translate-y-2">
                {client.icon}
              </div>
              <span className="font-bold text-dark/80 text-sm md:text-base">{client.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ClientCarousel;