import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollTracking } from '../../hooks/useScrollTracking';
import { trackEvent } from '../../lib/analytics';

const Navbar = () => {
  useScrollTracking('Navbar');

  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  const mainLinks = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const capabilityLinks = [
    { name: 'IT Solution', path: '/services/it-solution' },
    { name: 'Social Media Management', path: '/services/social-media' }
  ];

  const toggleMenu = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    trackEvent('toggle_mobile_menu', 'Engagement', nextState ? 'Open' : 'Close');
  };

  const handleNavigationClick = (name, category) => {
    trackEvent('navigate_click', 'Engagement', `${category} - ${name}`);
    if (isOpen) setIsOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-black/5 px-6 py-5 select-none">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          <Link 
            to="/" 
            onClick={() => handleNavigationClick('Logo Home', 'Brand')}
            className="text-sm font-black tracking-widest uppercase text-black"
          >
            Dauphiné Creative
          </Link>

          <div className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-wider">
            {mainLinks.slice(0, 1).map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                onClick={() => handleNavigationClick(link.name, 'Desktop Menu')}
                className={`transition-colors hover:text-black ${location.pathname === link.path ? 'text-black' : 'text-black/40'}`}
              >
                {link.name}
              </Link>
            ))}

            <div 
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button className={`flex items-center gap-1 transition-colors hover:text-black focus:outline-none ${location.pathname.startsWith('/services') ? 'text-black' : 'text-black/40'}`}>
                CAPABILITIES
              </button>
              
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-52 bg-white border border-black/5 shadow-xl rounded-xl p-2 flex flex-col gap-1 text-[10px]"
                  >
                    {capabilityLinks.map((cap) => (
                      <Link
                        key={cap.path}
                        to={cap.path}
                        onClick={() => {
                          setIsDropdownOpen(false);
                          handleNavigationClick(cap.name, 'Desktop Capabilities Dropdown');
                        }} 
                        className={`px-3 py-2 rounded-lg transition-colors hover:bg-black/5 ${location.pathname === cap.path ? 'text-black bg-black/5 font-bold' : 'text-black/60'}`}
                      >
                        {cap.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {mainLinks.slice(1).map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                onClick={() => handleNavigationClick(link.name, 'Desktop Menu')}
                className={`transition-colors hover:text-black ${location.pathname === link.path ? 'text-black' : 'text-black/40'}`}
              >
                {link.name}
              </Link>
            ))}

            <Link 
              to="/calculator" 
              onClick={() => handleNavigationClick('Project Calculator', 'Desktop CTA')}
              className="bg-black text-white px-4 py-2 rounded-full hover:bg-black/90 transition-all text-[10px]"
            >
              Project Calculator
            </Link>
          </div>

          <button 
            onClick={toggleMenu} 
            className="md:hidden text-xs font-bold uppercase tracking-widest text-black focus:outline-none"
          >
            {isOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="fixed inset-0 bg-white z-50 flex flex-col pt-32 px-8 pb-12 overflow-y-auto md:hidden"
          >
            <div className="flex justify-between items-center border-b border-black/5 pb-6 mb-8">
              <span className="text-xs font-black tracking-widest uppercase text-black">
                Dauphiné Creative
              </span>
              <button 
                onClick={toggleMenu} 
                className="border border-black/10 text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-md text-black"
              >
                Close
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <span className="text-[9px] font-mono font-bold tracking-widest uppercase text-black/30 block mb-3">
                  Directory
                </span>
                <div className="flex flex-col gap-4">
                  {mainLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => handleNavigationClick(link.name, 'Mobile Menu')}
                      className="text-2xl font-black tracking-tight uppercase text-black"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[9px] font-mono font-bold tracking-widest uppercase text-black/30 block mb-3">
                  Capabilities Suite
                </span>
                <div className="flex flex-col gap-3">
                  {capabilityLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => handleNavigationClick(link.name, 'Mobile Capabilities Suite')}
                      className="text-sm font-bold tracking-wide uppercase text-black/60"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-black/5 flex flex-col">
                <Link
                  to="/calculator"
                  onClick={() => handleNavigationClick('Project Calculator', 'Mobile CTA')}
                  className="w-full text-center bg-black text-white text-xs font-bold uppercase tracking-widest py-4 rounded-xl shadow-sm"
                >
                  Project Calculator
                </Link>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;