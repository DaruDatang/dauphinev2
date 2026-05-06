import { motion } from 'framer-motion';
import { FiBox, FiCoffee, FiGlobe, FiLayout, FiTarget, FiZap, FiHexagon, FiTriangle } from 'react-icons/fi';

const ClientCarousel = () => {
  const clients = [
    { name: "Varnell Collection", icon: <FiBox /> },
    { name: "Motionpic Photo Studio", icon: <FiGlobe /> },
    { name: "Hotel Malabar Pangandaran", icon: <FiZap /> },
    { name: "Arven Stride Collection", icon: <FiLayout /> },
    { name: "Cyrille Case", icon: <FiCoffee /> },
    { name: "More to come...", icon: <FiTarget /> },
    { name: "More to come...", icon: <FiHexagon /> },
    { name: "More to come...", icon: <FiTriangle /> },
  ];

  return (
    <section className="py-24 bg-[#ffffff] border-t border-dark/10 overflow-hidden">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
          
          <div className="hidden md:block">
            <h3 className="text-sm font-medium text-dark/40 uppercase tracking-tighter">
              Our <br /> Clients
            </h3>
          </div>

          <div className="md:col-span-3 relative">
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#ffffff] to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#ffffff] to-transparent z-10" />

            <div className="flex items-center overflow-hidden py-4">
              <motion.div
                animate={{ x: [0, -1920] }}
                transition={{ 
                  duration: 50, 
                  ease: "linear", 
                  repeat: Infinity 
                }}
                className="flex flex-nowrap shrink-0 gap-16 md:gap-24 items-center"
              >
                {[...clients, ...clients, ...clients].map((client, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-3 grayscale opacity-40 hover:opacity-100 hover:grayscale-0 transition-all duration-700 cursor-default"
                  >
                    <div className="text-3xl md:text-4xl text-dark">
                      {client.icon}
                    </div>
                    <span className="font-bold text-dark text-[10px] md:text-xs uppercase tracking-widest whitespace-nowrap">
                      {client.name}
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

export default ClientCarousel;