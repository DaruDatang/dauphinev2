const GA_TRACKING_ID = "540357412";

export const initGA = () => {
  if (typeof window === 'undefined' || window.gtag) return;

  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  document.head.appendChild(script1);

  const script2 = document.createElement('script');
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', '${GA_TRACKING_ID}', { send_page_view: false });
  `;
  document.head.appendChild(script2);
};

export const trackPageView = (path) => {
  if (window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: path
    });
  }
};

export const trackEvent = (action, category, label, value = null) => {
  if (window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }
};