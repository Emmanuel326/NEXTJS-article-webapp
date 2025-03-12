import '../styles/global.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../pages/Footer'; // Fixed incorrect import path
import SEO from '../components/Seo'; 
import Head from 'next/head';
import '../styles/navbar.module.css';

function MyApp({ Component, pageProps }) {
  // Create a QueryClient instance
  const [queryClient] = useState(() => new QueryClient());

  // Structured data (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Finance Insights",
    "url": "https://yourdomain.com",
    "logo": "https://yourdomain.com/logo.png",
    "sameAs": [
      "https://www.facebook.com/yourpage",
      "https://twitter.com/yourhandle",
      "https://www.linkedin.com/company/yourcompany"
    ]
  };

  return (
    <QueryClientProvider client={queryClient}>
      <SEO 
        title="Finance Insights - Your Trusted Finance Hub"
        description="Get the latest financial insights, investment strategies, and economic trends to make informed financial decisions."
        url="https://yourdomain.com"
        keywords="finance, investing, cryptocurrency, stock market, economic analysis"
        canonical="https://yourdomain.com"
      />
      <Head>
        {/* Viewport meta tag moved from _document.js to _app.js */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>
      <NavBar />
      <Component {...pageProps} />
      <Footer />
    </QueryClientProvider>
  );
}

export default MyApp;
