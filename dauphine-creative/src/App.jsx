import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import PageLoader from './components/common/PageLoader';
import Home from './pages/Home';
import ServiceIT from './pages/ServiceIT';
import ServiceSocial from './pages/ServiceSocial';

const AnimatedRoutes = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [location.pathname]); 

  return (
    <>
      <AnimatePresence>
        {loading && <PageLoader />}
      </AnimatePresence>

      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/service/it-solution" element={<ServiceIT />} />
        <Route path="/service/social-media" element={<ServiceSocial />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;