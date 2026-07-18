import { useEffect } from 'react';
import { trackEvent } from '../lib/analytics';

export const useScrollTracking = (pageName) => {
  useEffect(() => {
    const trackedDepths = new Set();

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (docHeight <= 0) return;
      
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);
      const thresholds = [25, 50, 75, 90];

      thresholds.forEach(depth => {
        if (scrollPercent >= depth && !trackedDepths.has(depth)) {
          trackedDepths.add(depth);
          trackEvent('scroll_depth', 'Engagement', `${pageName} - ${depth}%`, depth);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pageName]);
};