import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ServicesList = () => {
  const services = [
    {
      id: "01",
      title: "Social Media Management",
      desc: "Boost your brand engagement and visibility with creative and organic content strategies.",
      link: "/service/social-media",
      tags: ["Creative", "Strategy"]
    },
    {
      id: "02",
      title: "IT Solution",
      desc: "Development of web-based systems and business process automation designed specifically for your needs.",
      link: "/service/it-solution",
      tags: ["Web Design", "Development"]
    },
  ];

  return (
    <section id="services" className="py-32 bg-[#ffffff]">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-24">
          <div className="hidden md:block">
            <span className="text-sm font-medium text-dark/40 uppercase tracking-tighter">
              Capabilities
            </span>
          </div>
          <div className="md:col-start-2 md:col-span-3">
            <h2 className="text-4xl md:text-6xl font-medium text-dark tracking-tight">
              The right solution <br /> 
              <span className="text-dark/40">for your business.</span>
            </h2>
          </div>
        </div>

        <div className="flex flex-col">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <Link 
                to={service.link} 
                className="group grid grid-cols-1 md:grid-cols-4 gap-4 py-12 border-t border-dark/10 hover:bg-dark/[0.02] transition-all duration-500"
              >
                <div className="hidden md:block">
                  <span className="text-sm font-bold text-dark/30 group-hover:text-dark transition-colors">
                    ({service.id})
                  </span>
                </div>

                <div className="md:col-span-2 flex flex-col gap-4">
                  <h3 className="text-3xl md:text-5xl font-medium tracking-tight group-hover:translate-x-2 transition-transform duration-500">
                    {service.title}
                  </h3>
                  <p className="text-dark/60 text-lg md:max-w-md">
                    {service.desc}
                  </p>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <div className="flex gap-2">
                    {service.tags.map((tag) => (
                      <span key={tag} className="text-[10px] uppercase font-bold tracking-widest border border-dark/20 px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
          <div className="border-t border-dark/10"></div>
        </div>

      </div>
    </section>
  );
};

export default ServicesList;