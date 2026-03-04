import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiMonitor, FiSmartphone } from 'react-icons/fi';

const ServicesList = () => {
  const services = [
    {
      title: "Social Media Management",
      desc: "Tingkatkan engagement dan visibilitas brand Anda dengan strategi konten yang kreatif dan organik.",
      icon: <FiSmartphone className="text-5xl mb-4 text-primary" />,
      link: "/service/social-media",
      bgColor: "bg-yellow-200"
    },
    {
      title: "IT Solution",
      desc: "Pengembangan sistem berbasis website & otomasi proses bisnis yang dirancang khusus untuk kebutuhan Anda.",
      icon: <FiMonitor className="text-5xl mb-4 text-accent" />,
      link: "/service/it-solution",
      bgColor: "bg-blue-100"
    }
  ];

  return (
    <section id="services" className="py-24 bg-light relative">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h4 className="text-primary font-bold mb-2 tracking-widest uppercase text-sm">Our Services</h4>
          <h2 className="text-4xl md:text-5xl font-black text-secondary">Solusi Tepat Untuk Bisnis Anda</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Link to={service.link} className={`block h-full comic-box p-10 ${service.bgColor} hover:bg-white`}>
                {service.icon}
                <h3 className="text-2xl font-black text-secondary mb-3">{service.title}</h3>
                <p className="text-dark/80 font-medium">
                  {service.desc}
                </p>
                <div className="mt-6 flex items-center text-primary font-bold">
                  Explore Service <span className="ml-2 text-xl leading-none">&rarr;</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesList;