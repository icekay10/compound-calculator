import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import './globals.css';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-PL03JQ1G25';

  // Track page views on route change (for SPA navigation)
  useEffect(() => {
    const handleRouteChange = (url) => {
      // Check if gtag is available (it will be after initial load from _document)
      if (typeof window.gtag !== 'undefined') {
        window.gtag('config', GA_ID, {
          page_path: url,
        });
      }
    };

    // Subscribe to route change events
    router.events.on('routeChangeComplete', handleRouteChange);
    
    // Clean up event listener on unmount
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events, GA_ID]);

  return (
    <>
      <Navbar />
      <main className="app-wrapper">
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  );
}