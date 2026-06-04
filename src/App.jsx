import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import PageLoader from './components/common/PageLoader';
import Home from './pages/Home';
import ProjectList from './pages/ProjectList';
import About from './pages/About'; 
import Contact from './pages/Contact';
import ServiceIT from './pages/ServiceIT';
import ServiceSocial from './pages/ServiceSocial';
import AdminDashboard from './pages/admin/Dashboard';
import AdminLogin from './pages/admin/Login';

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
      <AnimatePresence mode="wait">
        {loading && <PageLoader />}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/service/it-solution" element={<ServiceIT />} />
          <Route path="/service/social-media" element={<ServiceSocial />} />
          <Route path="/dauphine-admin" element={<AdminDashboard />} />
          <Route path="/dauphine-admin/login" element={<AdminLogin />} />
        </Routes>
      </AnimatePresence>
    </>
  );
};

const AppContent = () => {
  const location = useLocation();
  
  const isAdminPage = location.pathname.startsWith('/dauphine-admin');

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {!isAdminPage && <Navbar />}
      
      <main className="flex-grow">
        <AnimatedRoutes />
      </main>
      
      {!isAdminPage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;