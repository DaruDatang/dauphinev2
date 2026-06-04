import React, { Component, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-dark font-sans">
          <div className="max-w-xl w-full border border-red-200 bg-red-50/50 p-6 rounded-xl space-y-4">
            <h1 className="text-lg font-bold uppercase tracking-wider text-red-600">Application Runtime Error</h1>
            <p className="text-sm text-dark/70 leading-relaxed">
              The application crashed due to a runtime exception. Below is the debug information:
            </p>
            <pre className="bg-white border border-red-100 p-4 rounded-lg text-xs font-mono text-red-700 overflow-x-auto whitespace-pre-wrap">
              {this.state.error?.toString()}
            </pre>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-dark text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all hover:bg-dark/85"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

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
    <ErrorBoundary>
      <Router>
        <AppContent />
      </Router>
    </ErrorBoundary>
  );
}

export default App;