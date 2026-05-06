import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description }) => {
  const siteName = "Dauphine Creative";
  const fullTitle = title ? `${title} | ${siteName}` : siteName;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || ""} />

      <link rel="icon" type="image/svg+xml" href="/logo-tab-dp.svg" />
      
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || ""} />
      <meta property="og:site_name" content={siteName} />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || ""} />
    </Helmet>
  );
};

export default SEO;