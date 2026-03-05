import { motion } from 'framer-motion';

const Hero = () => {
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden px-6">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop"
          alt="Hero Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#F1FAEE]/65 backdrop-blur-[2px]" />
      </div>

      <div className="container mx-auto text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block py-1 px-3 mb-6 bg-yellow-300 text-dark font-bold border-2 border-dark shadow-[2px_2px_0px_0px_#111111] transform -rotate-2">
            Hello, we are Dauphine Creative!
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-secondary mb-6 leading-tight">
            SHAPING <span className="text-primary underline decoration-wavy">CREATIVE</span> <br /> 
            EXPERIENCES
          </h1>
          <p className="text-lg md:text-xl text-dark/80 mb-10 max-w-2xl mx-auto font-medium">
            Dari ide menjadi produk digital yang scalable. Kami membangun identitas, platform, dan strategi yang relevan untuk bisnis Anda.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;