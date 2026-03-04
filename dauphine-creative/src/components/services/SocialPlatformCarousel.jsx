import { motion } from 'framer-motion';
import { FaInstagram, FaTiktok, FaFacebook, FaLinkedin, FaYoutube, FaTwitter } from 'react-icons/fa';

const SocialPlatformCarousel = () => {
  // Data platform sosial media yang kita handle
  const platforms = [
    { name: "Instagram", icon: <FaInstagram /> },
    { name: "TikTok", icon: <FaTiktok /> },
    { name: "Facebook", icon: <FaFacebook /> },
    { name: "LinkedIn", icon: <FaLinkedin /> },
    { name: "YouTube", icon: <FaYoutube /> },
    { name: "Twitter / X", icon: <FaTwitter /> },
  ];

  return (
    <section className="py-16 bg-white border-y-4 border-dark overflow-hidden">
      <div className="container mx-auto px-6 mb-12 text-center">
        {/* Judul dibuat polos/clean (text-secondary) tanpa garis bawah bergelombang */}
        <h3 className="text-3xl md:text-4xl font-black text-secondary uppercase tracking-tight">
          What Can We Handle
        </h3>
      </div>

      {/* Wrapper Carousel */}
      <div className="relative flex overflow-hidden group">
        
        {/* Efek Gradasi di Kiri & Kanan (Menyesuaikan warna background putih) */}
        <div className="absolute top-0 bottom-0 left-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* Baris Pertama Animasi */}
        <motion.div
          animate={{ x: ["0%", "-100%"] }}
          transition={{ duration: 25, ease: "linear", repeat: Infinity }}
          className="flex gap-16 md:gap-24 min-w-full shrink-0 items-center justify-around px-8"
        >
          {platforms.map((plat, idx) => (
            <div key={`plat-1-${idx}`} className="flex flex-col items-center justify-center space-y-4 grayscale hover:grayscale-0 transition-all duration-300">
              {/* Ikon menggunakan warna dark dengan opacity rendah (abu-abu) saat normal */}
              <div className="text-6xl text-dark opacity-40 hover:opacity-100 transition-all cursor-pointer hover:-translate-y-2">
                {plat.icon}
              </div>
              <span className="font-bold text-secondary text-sm md:text-base uppercase tracking-wider">
                {plat.name}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Baris Kedua Animasi (Duplikat untuk Looping Sempurna) */}
        <motion.div
          animate={{ x: ["0%", "-100%"] }}
          transition={{ duration: 25, ease: "linear", repeat: Infinity }}
          className="flex gap-16 md:gap-24 min-w-full shrink-0 items-center justify-around px-8"
        >
          {platforms.map((plat, idx) => (
            <div key={`plat-2-${idx}`} className="flex flex-col items-center justify-center space-y-4 grayscale hover:grayscale-0 transition-all duration-300">
              <div className="text-6xl text-dark opacity-40 hover:opacity-100 transition-all cursor-pointer hover:-translate-y-2">
                {plat.icon}
              </div>
              <span className="font-bold text-secondary text-sm md:text-base uppercase tracking-wider">
                {plat.name}
              </span>
            </div>
          ))}
        </motion.div>
        
      </div>
    </section>
  );
};

export default SocialPlatformCarousel;