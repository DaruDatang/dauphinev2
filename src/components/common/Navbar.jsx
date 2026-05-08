import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link'; 
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [isOpen, setIsOpen] = useState(false); 

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeMenu();
  };

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 w-full z-[100] bg-[#ffffff] py-8 px-6 md:px-12 border-b border-dark/10"
    >
      <div className="max-w-[1800px] mx-auto grid grid-cols-2 md:grid-cols-4 items-start gap-4">
        
        <div className="flex flex-col relative z-[110]">
          <Link to="/" onClick={scrollToTop} className="text-4xl font-black tracking-tighter text-dark leading-none">
            Dauphiné<br />Creative
          </Link>
        </div>

        <div className="hidden md:flex flex-col space-y-1 text-sm font-medium text-dark/60 uppercase tracking-tighter">
          <Link to="/projects" className="hover:text-dark transition-colors">Projects</Link>
          <HashLink smooth to="/about" className="hover:text-dark transition-colors">About</HashLink>
          <HashLink smooth to="/contact" className="hover:text-dark transition-colors">Contact</HashLink>
        </div>

        <div className="hidden md:flex flex-col space-y-1 text-sm font-medium text-dark/60 uppercase tracking-tighter">
          <Link to="/service/it-solution" className="hover:text-dark transition-colors">IT Solution</Link>
          <Link to="/service/social-media" className="hover:text-dark transition-colors">Social Media</Link>
        </div>

        <div className="hidden md:flex flex-col items-end text-sm font-medium text-dark/60 uppercase tracking-tighter">
          <span>Kota Bandung, Indonesia</span>
          <span className="tabular-nums">{time}</span>
        </div>

        <div className="md:hidden flex justify-end relative z-[110]">
          <button 
            onClick={toggleMenu}
            className="text-sm font-bold uppercase tracking-widest text-dark"
          >
            {isOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 bg-[#F1FAEE] z-[105] flex flex-col justify-center px-6 pt-32 pb-12 overflow-y-auto"
          >
            <div className="flex flex-col space-y-8">
              <div className="flex flex-col space-y-4">
                <span className="text-[10px] font-bold text-dark/30 uppercase tracking-[0.3em]">Navigation</span>
                <Link to="/projects" onClick={closeMenu} className="text-5xl font-black tracking-tighter text-dark leading-none">Projects</Link>
                <HashLink smooth to="/about" onClick={closeMenu} className="text-5xl font-black tracking-tighter text-dark leading-none">About</HashLink>
                <HashLink smooth to="/#contact" onClick={closeMenu} className="text-5xl font-black tracking-tighter text-dark leading-none">Contact</HashLink>
              </div>

              <div className="flex flex-col space-y-4 pt-8">
                <span className="text-[10px] font-bold text-dark/30 uppercase tracking-[0.3em]">Services</span>
                <Link to="/service/it-solution" onClick={closeMenu} className="text-2xl font-black tracking-tighter text-dark/60">IT Solution</Link>
                <Link to="/service/social-media" onClick={closeMenu} className="text-2xl font-black tracking-tighter text-dark/60">Social Media</Link>
              </div>
            </div>

            <div className="mt-auto pt-12 flex justify-between items-end text-[10px] font-bold text-dark/40 uppercase tracking-widest">
              <span>Bandung, ID</span>
              <span>{time}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;