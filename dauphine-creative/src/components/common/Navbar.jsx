import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiChevronDown } from 'react-icons/fi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    setIsOpen(false);
    if (location.pathname !== '/') {
      window.location.href = `/#${sectionId}`;
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-light/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold tracking-tighter text-dark flex items-center gap-1" onClick={() => scrollToTop()}>
          <span className="text-primary font-black text-3xl">.</span>Dauphine
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 font-medium">
          <button onClick={() => scrollToSection('about')} className="hover:text-primary transition-colors">About Us</button>
          
          {/* Dropdown Services */}
          <div 
            className="relative"
            onMouseEnter={() => setShowServices(true)}
            onMouseLeave={() => setShowServices(false)}
          >
            <button className="flex items-center gap-1 hover:text-primary transition-colors">
              Services <FiChevronDown className={`transition-transform ${showServices ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {showServices && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 mt-2 w-56 bg-white border-2 border-dark rounded-xl shadow-[4px_4px_0px_0px_#111111] overflow-hidden"
                >
                  <Link to="/service/social-media" className="block px-4 py-3 hover:bg-light font-medium border-b-2 border-dark/10">Social Media Management</Link>
                  <Link to="/service/it-solution" className="block px-4 py-3 hover:bg-light font-medium">IT Solution</Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button onClick={() => scrollToSection('faq')} className="hover:text-primary transition-colors">FAQ</button>
          <button onClick={() => scrollToSection('portfolio')} className="hover:text-primary transition-colors">Portfolio</button>
        </div>

        {/* Contact Button (Desktop) - Menggunakan gaya comic-box */}
        <div className="hidden md:block">
          <button 
            onClick={() => scrollToSection('contact')} 
            className="comic-box px-6 py-2 bg-primary text-white font-bold border-dark"
          >
            Contact Us
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-2xl text-dark" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu (Sederhana) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-b-2 border-dark"
          >
            <div className="flex flex-col p-6 space-y-4">
              <button onClick={() => scrollToSection('about')} className="text-left font-bold">About Us</button>
              <Link to="/service/social-media" onClick={() => setIsOpen(false)} className="text-left font-bold text-primary">Service: Social Media</Link>
              <Link to="/service/it-solution" onClick={() => setIsOpen(false)} className="text-left font-bold text-secondary">Service: IT Solution</Link>
              <button onClick={() => scrollToSection('portfolio')} className="text-left font-bold">Portfolio</button>
              <button onClick={() => scrollToSection('contact')} className="comic-box mt-4 bg-primary text-white py-2 text-center w-full">Contact Us</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;