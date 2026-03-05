import SEO from '../components/common/SEO';
import Hero from '../components/home/Hero';
import About from '../components/home/About';
import ServicesList from '../components/home/ServicesList';
import ClientCarousel from '../components/home/ClientCarousel';
import FAQ from '../components/home/FAQ';
import Portfolio from '../components/home/Portfolio';
import Contact from '../components/home/Contact';
import Milestone from '../components/home/Milestone';

const Home = () => {
  return (
    <div className="overflow-hidden">
      <SEO 
        title="Software Product Development & Creative Agency" 
        description="Dauphine Creative membantu mengubah ide menjadi produk digital yang andal." 
      />
      <Hero />
      <About />
      <ServicesList />
      <ClientCarousel /> 
      <Milestone />
      <FAQ />
      <Portfolio />
      <Contact />
    </div>
  );
};

export default Home;