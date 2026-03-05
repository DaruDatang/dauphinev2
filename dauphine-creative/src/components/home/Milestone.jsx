import { motion } from 'framer-motion';

const Milestone = () => {
  const stats = [
    { 
      number: "10+", 
      label: "Projects", 
      desc: "Solusi digital kreatif yang telah kami luncurkan.",
      borderColor: "border-accent" 
    },
    { 
      number: "10+", 
      label: "Clients", 
      desc: "Kepercayaan dari berbagai mitra bisnis korporat.",
      borderColor: "border-primary" 
    },
    { 
      number: "95%", 
      label: "Satisfaction Rate", 
      desc: "Komitmen kami pada kualitas dan ketepatan waktu.",
      borderColor: "border-secondary" 
    },
    { 
      number: "24/5", 
      label: "Dedicated Support", 
      desc: "Layanan purna jual dan dukungan teknis siap sedia.",
      borderColor: "border-dark"
    }
  ];

  return (
    <section className="py-24 bg-light/50 border-b-4 border-dark m-0">
      <div className="container mx-auto px-6">
        {/* Judul Section */}
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-black text-secondary leading-tight">
            Pencapaian <span className="text-primary underline decoration-wavy">Kami</span>
          </h3>
        </div>

        {/* Grid Card Milestone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: idx * 0.15, duration: 0.5 }}
              className={`comic-box bg-white p-8 hover:-translate-y-2 transition-transform duration-300 h-full flex flex-col ${stat.borderColor}`}
            >
              {/* Angka Besar dengan Drop Shadow khas Neo-Brutalism */}
              <h3 className="text-6xl font-black text-accent mb-3 drop-shadow-[2px_2px_0px_#111111]">
                {stat.number}
              </h3>
              
              {/* Garis Pemisah */}
              <div className="h-1.5 w-16 bg-secondary mb-5 border border-dark"></div>
              
              {/* Label & Deskripsi */}
              <div className="flex-1 space-y-2">
                <p className="text-lg font-black text-secondary uppercase tracking-wider leading-tight">
                  {stat.label}
                </p>
                <p className="text-sm text-dark/70 font-medium leading-relaxed">
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