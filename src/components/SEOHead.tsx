import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

interface SEOSettings {
  googleVerification?: string;
  bingVerification?: string;
  yandexVerification?: string;
  googleAnalyticsId?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = "AI Trader - AI-Powered Trading Signals",
  description = "Get intelligent trading recommendations powered by advanced AI analysis. Make smarter trading decisions with our cutting-edge signal generation platform.",
  keywords = "AI trading, trading signals, forex signals, cryptocurrency trading, stock analysis, technical analysis, trading bot, algorithmic trading",
  image = "/og-image.jpg",
  url = "https://aitrader.com",
  type = "website"
}) => {
  const [seoSettings, setSeoSettings] = useState<SEOSettings>({});

  useEffect(() => {
    loadSEOSettings();
  }, []);

  const loadSEOSettings = async () => {
    try {
      const seoDoc = await getDoc(doc(db, 'settings', 'seo'));
      if (seoDoc.exists()) {
        setSeoSettings(seoDoc.data() as SEOSettings);
      }
    } catch (error) {
      console.error('Error loading SEO settings:', error);
    }
  };

  const fullTitle = title.includes('AI Trader') ? title : `${title} | AI Trader`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="AI Trader" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="AI Trader" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@aitrader" />
      <meta name="twitter:creator" content="@aitrader" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Favicon */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      
      {/* Search Engine Verification Tags */}
      {seoSettings.googleVerification && (
        <meta name="google-site-verification" content={seoSettings.googleVerification} />
      )}
      {seoSettings.bingVerification && (
        <meta name="msvalidate.01" content={seoSettings.bingVerification} />
      )}
      {seoSettings.yandexVerification && (
        <meta name="yandex-verification" content={seoSettings.yandexVerification} />
      )}
      
      {/* Google Analytics */}
      {seoSettings.googleAnalyticsId && (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${seoSettings.googleAnalyticsId}`} />
          <script>
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${seoSettings.googleAnalyticsId}');
            `}
          </script>
        </>
      )}
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "AI Trader",
          "description": description,
          "url": url,
          "applicationCategory": "FinanceApplication",
          "operatingSystem": "Web",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "1250"
          }
        })}
      </script>
      
      {/* PayPal Policy Compliance */}
      <meta name="disclaimer" content="Trading involves substantial risk of loss. This platform is for educational purposes only and does not guarantee profits." />
      <meta name="risk-warning" content="Past performance is not indicative of future results. Please trade responsibly." />
    </Helmet>
  );
};

export default SEOHead;