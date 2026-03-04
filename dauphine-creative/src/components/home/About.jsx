import { motion } from 'framer-motion';

const About = () => {
  return (
    <section id="about" className="py-24 bg-white text-dark border-y-4 border-dark">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h4 className="text-primary font-bold mb-4 tracking-widest uppercase text-sm">About Us</h4>
            <h2 className="text-4xl md:text-5xl font-black leading-tight text-secondary">
              We don't just build software — we <span className="text-accent underline decoration-4">shape experiences</span>.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:border-l-4 border-dark md:pl-8"
          >
            <p className="text-lg text-dark/80 font-medium leading-relaxed">
              Kami membantu mengubah ide menjadi produk perangkat lunak yang andal dan dapat diskalakan. Dari MVP hingga platform skala penuh, tim kami berfokus pada kecepatan, kejelasan, dan dampak bisnis yang nyata.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default About;