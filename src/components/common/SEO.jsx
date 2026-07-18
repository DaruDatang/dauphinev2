import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, path, image, keywords, type = 'website', schema }) => {
  const siteName = "Dauphiné Creative";
  const defaultDescription = "Dauphiné Creative membantu mengubah ide menjadi produk digital yang andal dan berdampak nyata.";
  const defaultImage = "/og-image.jpg"; 
  const baseUrl = "https://dauphinecreative.id"; 

  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} — Digital Agency & IT Solutions`;
  const metaDescription = description || defaultDescription;
  const metaImage = image ? `${baseUrl}${image}` : `${baseUrl}${defaultImage}`;
  const canonicalUrl = path ? `${baseUrl}${path}` : baseUrl;

  return (
    <Helmet>
      <html lang="id" />
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <link rel="canonical" href={canonicalUrl} />
      <link rel="icon" type="image/svg+xml" href="/logo-tab-dp.svg" />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />

      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;