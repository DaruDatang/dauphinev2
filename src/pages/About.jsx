import { motion } from 'framer-motion';
import SEO from '../components/common/SEO';

import imgDaru from '../assets/about/daru.svg'; 
import imgIsmail from '../assets/about/ismail.svg';
import imgLazuardi from '../assets/about/lazuardi.svg';
import imgMatthew from '../assets/about/matthew.svg';

const About = () => {
  const missions = [
    { title: "Becoming a trusted creative & IT partner in building a strong and sustainable digital presence.", desc: "Developing websites and digital strategies that align with your brand identity by combining creativity and technology for maximum results." },
    { title: "Optimizing every business decision through measurable and meaningful data.", desc: "Analyzing and processing data into actionable insights to enhance business effectiveness and real-world outcomes." },
    { title: "Building transparent, structured, and efficient work systems.", desc: "Providing clear workflows with dashboards and regular reports to ensure every process is monitored and aligned with targets." },
    { title: "Delivering fast, responsive, and professional digital service experiences.", desc: "Offering accessible services with responsive communication and quick solutions without compromising quality." },
  ];

  const team = [
    { name: "Mohammad Rasyad Ammarizqandaru", role: "Chief Executive Officer", image: imgDaru },
    { name: "Ismail Anugrah Pratama Abay", role: "Chief Finance Officer", image: imgIsmail },
    { name: "Lazuardi Bayu Firkins", role: "Chief Design Officer", image: imgLazuardi },
    { name: "Matthew Edbert Anthony", role: "Chief Marketing Officer", image: imgMatthew },
  ];

  const sectionVariants = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
    viewport: { once: true }
  };

  return (
    <div className="bg-[#ffffff] min-h-screen pt-48 pb-32">
      <SEO title="About Us - Dauphiné Creative" description="Mengenal lebih jauh visi, misi, dan tim di balik Dauphiné Creative." />

      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        <motion.section {...sectionVariants} className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-48">
          <div className="hidden md:block">
            <span className="text-sm font-medium text-dark/40 uppercase tracking-tighter">About Us / 01</span>
          </div>
          <div className="md:col-start-2 md:col-span-3">
            <h1 className="text-5xl md:text-8xl font-medium text-dark tracking-tighter leading-[0.9] mb-12">
              Building Your <br /> <span className="text-dark/40">Digital Presence</span>
            </h1>
            <p className="text-xl md:text-2xl text-dark/60 leading-relaxed max-w-2xl text-justify">
              "We aim to empower businesses by transforming their ideas into impactful digital products and creative solutions. With a focus on structured solutions, data-driven strategies, and transparent processes, we are committed to driving real growth for our clients in the digital landscape"
            </p>
          </div>
        </motion.section>

        <motion.section {...sectionVariants} className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-48">
          <div className="hidden md:block">
            <span className="text-sm font-medium text-dark/40 uppercase tracking-tighter">Values / 02</span>
          </div>
          <div className="md:col-start-2 md:col-span-3">
            <h2 className="text-4xl md:text-6xl font-medium text-dark tracking-tighter mb-16">
              Our Vision <br /> and Mission.
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-16">
              {missions.map((item, index) => (
                <div key={index} className="border-t border-dark/10 pt-6">
                  <h3 className="text-xl font-bold text-dark mb-4 uppercase tracking-tight">{item.title}</h3>
                  <p className="text-dark/60 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section {...sectionVariants} className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="hidden md:block">
            <span className="text-sm font-medium text-dark/40 uppercase tracking-tighter">Meet The Team / 03</span>
          </div>
          <div className="md:col-start-2 md:col-span-3">
            <h2 className="text-4xl md:text-6xl font-medium text-dark tracking-tighter mb-16">
              Meet The Team <br /> <span className="text-dark/40">Who Make It Happen</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div key={index} className="group">
                  <div className="aspect-[3/4] overflow-hidden bg-white mb-6 border border-dark/5">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 ease-in-out scale-100 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-2xl font-medium text-dark tracking-tight">{member.name}</h3>
                  <p className="text-sm font-medium text-dark/40 uppercase tracking-tighter">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default About;