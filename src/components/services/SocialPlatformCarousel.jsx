import { motion } from 'framer-motion';
import { FaInstagram, FaTiktok, FaFacebook, FaLinkedin, FaYoutube, FaTwitter } from 'react-icons/fa';

const SocialPlatformCarousel = () => {
  const platforms = [
    { name: "Instagram", icon: <FaInstagram /> },
    { name: "TikTok", icon: <FaTiktok /> },
    { name: "Facebook", icon: <FaFacebook /> },
    { name: "LinkedIn", icon: <FaLinkedin /> },
    { name: "YouTube", icon: <FaYoutube /> },
    { name: "Twitter / X", icon: <FaTwitter /> },
  ];

  const duplicatedPlatforms = [...platforms, ...platforms, ...platforms];

  return (
    <section className="py-24 bg-[#ffffff] border-t border-dark/10 overflow-hidden">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
          <div className="hidden md:block">
            <h3 className="text-sm font-medium text-dark/40 uppercase tracking-tighter leading-tight">
              What Can <br /> We Handle
            </h3>
          </div>

          <div className="md:col-span-3 relative">
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#ffffff] to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#ffffff] to-transparent z-10 pointer-events-none" />

            <div className="flex items-center overflow-hidden py-4">
              <motion.div
                animate={{ x: ["0%", "-33.33%"] }}
                transition={{ 
                  duration: 25, 
                  ease: "linear", 
                  repeat: Infinity 
                }}
                className="flex flex-nowrap shrink-0 gap-16 md:gap-24 items-center"
              >
                {duplicatedPlatforms.map((plat, idx) => (
                  <div 
                    key={idx} 
                    className="flex flex-col items-center justify-center gap-4 grayscale opacity-30 hover:opacity-100 hover:grayscale-0 transition-all duration-700 group cursor-pointer"
                  >
                    <div className="text-4xl md:text-5xl text-dark group-hover:-translate-y-1 transition-transform">
                      {plat.icon}
                    </div>
                    <span className="font-bold text-dark text-[10px] md:text-xs uppercase tracking-widest whitespace-nowrap">
                      {plat.name}
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

export default SocialPlatformCarousel;