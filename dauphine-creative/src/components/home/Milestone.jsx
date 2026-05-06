import { motion } from 'framer-motion';

const Milestone = () => {
  const stats = [
    { 
      number: "10+", 
      label: "Projects", 
      desc: "Solusi digital kreatif yang telah kami luncurkan." 
    },
    { 
      number: "10+", 
      label: "Clients", 
      desc: "Kepercayaan dari berbagai mitra bisnis korporat." 
    },
    { 
      number: "95%", 
      label: "Satisfaction Rate", 
      desc: "Komitmen kami pada kualitas dan ketepatan waktu." 
    },
    { 
      number: "24/5", 
      label: "Dedicated Support", 
      desc: "Layanan purna jual dan dukungan teknis siap sedia."
    }
  ];

  return (
    <section id="milestone" className="py-32 bg-[#ffffff] border-t border-dark/10">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-24">
          <div className="hidden md:block">
            <span className="text-sm font-medium text-dark/40 uppercase tracking-tighter">
              Acheivements
            </span>
          </div>
          <div className="md:col-start-2 md:col-span-3">
            <h2 className="text-4xl md:text-6xl font-medium text-dark tracking-tight leading-tight">
              Pencapaian <br /> 
              <span className="text-dark/40">Kami Sejauh Ini.</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: idx * 0.1, duration: 0.8, ease: "easeOut" }}
              className="py-12 border-t border-dark/10 h-full flex flex-col group hover:bg-dark/[0.02] transition-colors duration-500 rounded-sm px-4"
            >
              <h3 className="text-7xl font-medium text-dark tracking-tighter mb-4 group-hover:scale-105 transition-transform duration-500 tabular-nums">
                {stat.number}
              </h3>
              
              <div className="h-px w-20 bg-dark/20 mb-6 group-hover:w-full transition-all duration-700"></div>
              
              <div className="flex-1 space-y-3">
                <p className="text-lg font-bold text-dark uppercase tracking-tight leading-tight">
                  {stat.label}
                </p>
                <p className="text-dark/60 text-sm font-medium leading-relaxed">
                  {stat.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Milestone;