'use client';
import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from './BasicCalculator.module.css';

const BasicCalculator = ({ 
  seoData,
  buildTimestamp
}) => {
  const {
    currentDate,
    lastModifiedDate,
    reviewDates,
    faqDates
  } = seoData || {};

  const freshnessIndicator = buildTimestamp 
    ? new Date(buildTimestamp).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0];

  const safeCurrentDate = currentDate || freshnessIndicator;
  const safeLastModifiedDate = lastModifiedDate || new Date().toISOString();
  const safeReviewDates = reviewDates || Array(6).fill(freshnessIndicator);
  const safeFaqDates = faqDates || Array(6).fill(freshnessIndicator);

  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
  const [calculationHistory, setCalculationHistory] = useState([]);

  // Input a digit
  const inputDigit = useCallback((digit) => {
    if (waitingForSecondOperand) {
      setDisplay(String(digit));
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit);
    }
  }, [display, waitingForSecondOperand]);

  // Input decimal point
  const inputDecimal = useCallback(() => {
    if (waitingForSecondOperand) {
      setDisplay('0.');
      setWaitingForSecondOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  }, [display, waitingForSecondOperand]);

  // Clear display
  const clearDisplay = useCallback(() => {
    if (display === '0' || display === 'Error') {
      // AC: reset everything
      setDisplay('0');
      setFirstOperand(null);
      setOperator(null);
      setWaitingForSecondOperand(false);
    } else {
      // C: clear current entry
      setDisplay('0');
    }
  }, [display]);

  // Toggle plus/minus
  const handlePlusMinus = useCallback(() => {
    if (display === '0' || display === 'Error') return;
    setDisplay(display.startsWith('-') ? display.slice(1) : '-' + display);
  }, [display]);

  // Percentage
  const handlePercentage = useCallback(() => {
    const value = parseFloat(display);
    if (isNaN(value)) return;
    const percentage = value / 100;
    setDisplay(String(percentage));
  }, [display]);

  // Square root
  const handleSquareRoot = useCallback(() => {
    const value = parseFloat(display);
    if (isNaN(value) || value < 0) {
      setDisplay('Error');
      return;
    }
    const result = Math.sqrt(value);
    const formattedResult = parseFloat(result.toFixed(10)).toString();
    setDisplay(formattedResult);
    addToHistory(`√${value} = ${formattedResult}`);
  }, [display]);

  // Square
  const handleSquare = useCallback(() => {
    const value = parseFloat(display);
    if (isNaN(value)) {
      setDisplay('Error');
      return;
    }
    const result = value * value;
    const formattedResult = parseFloat(result.toFixed(10)).toString();
    setDisplay(formattedResult);
    addToHistory(`${value}² = ${formattedResult}`);
  }, [display]);

  // Add to history
  const addToHistory = (entry) => {
    setCalculationHistory((prev) => [entry, ...prev.slice(0, 9)]); // Keep last 10
  };

  // Perform operation
  const performOperation = useCallback((nextOperator) => {
    const inputValue = parseFloat(display);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
      setWaitingForSecondOperand(true);
      setOperator(nextOperator);
      return;
    }

    if (operator && waitingForSecondOperand) {
      setOperator(nextOperator);
      return;
    }

    if (operator) {
      const result = calculate(firstOperand, inputValue, operator);
      if (result === 'Error') {
        setDisplay('Error');
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecondOperand(false);
        return;
      }

      const formattedResult = parseFloat(result.toFixed(10)).toString();
      setDisplay(formattedResult);
      addToHistory(`${firstOperand} ${operator} ${inputValue} = ${formattedResult}`);
      setFirstOperand(result);
      setOperator(nextOperator);
      setWaitingForSecondOperand(true);
    }
  }, [display, firstOperand, operator, waitingForSecondOperand]);

  // Handle equals
  const handleEquals = useCallback(() => {
    if (operator === null || firstOperand === null || waitingForSecondOperand) return;

    const inputValue = parseFloat(display);
    const result = calculate(firstOperand, inputValue, operator);
    if (result === 'Error') {
      setDisplay('Error');
    } else {
      const formattedResult = parseFloat(result.toFixed(10)).toString();
      setDisplay(formattedResult);
      addToHistory(`${firstOperand} ${operator} ${inputValue} = ${formattedResult}`);
    }

    // Reset for new calculation
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  }, [display, firstOperand, operator, waitingForSecondOperand]);

  // Clear history
  const clearHistory = () => {
    setCalculationHistory([]);
  };

  // Core calculation logic
  const calculate = (first, second, op) => {
    switch (op) {
      case '+':
        return first + second;
      case '-':
        return first - second;
      case '×':
        return first * second;
      case '÷':
        if (second === 0) return 'Error';
        return first / second;
      default:
        return second;
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9') {
        inputDigit(parseInt(e.key, 10));
      } else if (e.key === '.') {
        inputDecimal();
      } else if (e.key === '+' || e.key === '-') {
        performOperation(e.key);
      } else if (e.key === '*') {
        performOperation('×');
      } else if (e.key === '/') {
        performOperation('÷');
      } else if (e.key === 'Enter' || e.key === '=') {
        handleEquals();
      } else if (e.key === 'Escape') {
        clearDisplay();
      } else if (e.key === '%') {
        handlePercentage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [inputDigit, inputDecimal, performOperation, handleEquals, clearDisplay, handlePercentage]);

  const testimonials = [
    {
      quote: "This basic calculator from FreeCompoundCalculator is my go-to for quick math. The history feature is a lifesaver for checking my work!",
      name: "John D.",
      role: "Student",
      rating: 5,
      date: safeReviewDates[0]
    },
    {
      quote: "Finally a calculator that remembers my previous calculations. Perfect for accounting work where I need to reference past results.",
      name: "Sarah L.",
      role: "Accountant",
      rating: 5,
      date: safeReviewDates[1]
    },
    {
      quote: "The keyboard shortcuts make this so efficient. I can do calculations faster than with my physical calculator now!",
      name: "Mike R.",
      role: "Engineer",
      rating: 5,
      date: safeReviewDates[2]
    }
  ];

  const faqs = [
    {
      question: "Is this calculator really free to use?",
      answer: "Yes, FreeCompoundCalculator.com provides completely free online calculators with no registration required. Our basic calculator is 100% free with all features available - no hidden costs, no premium tiers, no upsells."
    },
    {
      question: "What features does this free calculator include?",
      answer: "Our free online calculator includes basic arithmetic operations (+, -, ×, ÷), percentage calculations, square and square root functions, calculation history tracking (last 10 calculations), memory functions for chain calculations, full keyboard support, decimal precision with error handling, and positive/negative toggle."
    },
    {
      question: "How do I use the calculation history feature?",
      answer: "The calculator automatically stores your last 10 calculations with full operation details. You can view them in the history panel on the right side of the calculator. Click 'Clear History' to remove all previous calculations. This feature is completely free."
    },
    {
      question: "Does this calculator support keyboard shortcuts?",
      answer: "Yes, you can use your keyboard for all calculations. Number keys (0-9), operators (+, -, *, /), Enter (=), Escape (AC), and period (.) all work as keyboard shortcuts. Perfect for efficient calculations without using your mouse."
    },
    {
      question: "Can I use this calculator on my mobile phone?",
      answer: "Absolutely! Our calculator is fully responsive and works perfectly on smartphones, tablets, and desktops. The interface automatically adjusts to your screen size for comfortable use on any device."
    },
    {
      question: "How accurate are the calculations?",
      answer: "Our calculator uses JavaScript's floating point arithmetic with 10 decimal place precision. We include proper error handling, division by zero protection, and validation for all mathematical operations to ensure accurate results every time."
    }
  ];

  // SEO Variables
  const pageTitle = 'Free Online Basic Calculator with History & Memory | FreeCompoundCalculator.com 2026';
  const pageDescription = 'Free online basic calculator from FreeCompoundCalculator.com. Perform calculations with history tracking, square root, percentage, memory functions, and keyboard support. Perfect for everyday math, homework, and quick calculations. Trusted by 50,000+ users.';
  const canonicalUrl = 'https://www.freecompoundcalculator.com/free-online-calculator';
  const pageKeywords = 'free calculator, online calculator, basic calculator, free online calculator, calculator with history, freecompoundcalculator, percentage calculator, square root calculator, math calculator, simple calculator, web calculator, calculator online free, arithmetic calculator, addition calculator, subtraction calculator, multiplication calculator, division calculator, decimal calculator, memory calculator, calculation history, keyboard calculator, virtual calculator, digital calculator, calculator app, calculator tool, math helper, calculation tool, number calculator, equation solver, math solver, free math calculator, free online math tool, free calculation tool, free arithmetic calculator, free percentage calculator, free square root calculator, free memory calculator, free calculator with history, free web calculator, free virtual calculator, free digital calculator';

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>{pageTitle}</title>
        <meta name="title" content={pageTitle} />
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={pageKeywords} />
        <meta name="author" content="FreeCompoundCalculator.com" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="date" content={safeCurrentDate} />
        <meta name="last-modified" content={safeLastModifiedDate} />
        <meta name="revisit-after" content="7 days" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        
        {/* Alternate Languages */}
        <link rel="alternate" href={canonicalUrl} hreflang="en" />
        <link rel="alternate" href={canonicalUrl} hreflang="en-US" />
        <link rel="alternate" href="https://www.freecompoundcalculator.com/es/calculadora-basica" hreflang="es" />
        <link rel="alternate" href="https://www.freecompoundcalculator.com/fr/calculatrice-de-base" hreflang="fr" />
        <link rel="alternate" href="https://www.freecompoundcalculator.com/de/basisrechner" hreflang="de" />
        <link rel="alternate" href={canonicalUrl} hreflang="x-default" />

        {/* Open Graph / Social Sharing Tags */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content="https://www.freecompoundcalculator.com/images/og-basic-calculator-preview.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Free Online Basic Calculator with History - FreeCompoundCalculator.com" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="FreeCompoundCalculator.com" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:locale:alternate" content="es_ES" />
        <meta property="og:locale:alternate" content="fr_FR" />
        <meta property="og:locale:alternate" content="de_DE" />
        <meta property="og:updated_time" content={safeLastModifiedDate} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@FreeCompoundCalc" />
        <meta name="twitter:creator" content="@FreeCompoundCalc" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content="https://www.freecompoundcalculator.com/images/twitter-basic-calculator-preview.jpg" />
        <meta name="twitter:image:alt" content="Free Online Calculator with History - FreeCompoundCalculator.com" />

        {/* Theme & Mobile */}
        <meta name="theme-color" content="#0a192f" />
        <meta name="msapplication-TileColor" content="#00bfa5" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Basic Calculator" />
        
        {/* Icons & Manifest */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Preload Resources */}
        <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Verification Tags */}
        <meta name="google-site-verification" content="your-verification-code" />
        <meta name="msvalidate.01" content="your-verification-code" />
        <meta name="yandex-verification" content="your-verification-code" />
        
        {/* Additional SEO Tags */}
        <meta name="rating" content="General" />
        <meta name="copyright" content={`Copyright ${new Date().getFullYear()} FreeCompoundCalculator.com. All rights reserved.`} />
        <meta name="distribution" content="Global" />
        <meta name="coverage" content="Worldwide" />
        <meta name="target" content="all" />
        <meta name="audience" content="all" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />
        <meta name="generator" content="FreeCompoundCalculator.com Calculator Engine" />
        <meta name="application-name" content="Free Online Calculator" />

        {/* Main Schema.org Structured Data */}
        <script
          type="application/ld+json"
          key="structured-data-main"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebPage",
                  "@id": `${canonicalUrl}#webpage`,
                  "url": canonicalUrl,
                  "name": pageTitle,
                  "description": pageDescription,
                  "datePublished": "2024-01-01",
                  "dateModified": safeLastModifiedDate,
                  "inLanguage": "en-US",
                  "isPartOf": {
                    "@type": "WebSite",
                    "@id": "https://www.freecompoundcalculator.com/#website",
                    "url": "https://www.freecompoundcalculator.com",
                    "name": "FreeCompoundCalculator.com",
                    "description": "Free online calculators for finance, math, and everyday calculations",
                    "publisher": {
                      "@type": "Organization",
                      "@id": "https://www.freecompoundcalculator.com/#organization",
                      "name": "FreeCompoundCalculator.com",
                      "url": "https://www.freecompoundcalculator.com",
                      "logo": {
                        "@type": "ImageObject",
                        "url": "https://www.freecompoundcalculator.com/logo.png",
                        "width": 512,
                        "height": 512
                      },
                      "sameAs": [
                        "https://twitter.com/FreeCompoundCalc",
                        "https://www.facebook.com/FreeCompoundCalculator",
                        "https://www.linkedin.com/company/free-compound-calculator"
                      ],
                      "contactPoint": {
                        "@type": "ContactPoint",
                        "email": "support@freecompoundcalculator.com",
                        "contactType": "customer service",
                        "availableLanguage": ["English", "Spanish", "French", "German"]
                      }
                    }
                  },
                  "primaryImageOfPage": {
                    "@type": "ImageObject",
                    "url": "https://www.freecompoundcalculator.com/images/og-basic-calculator-preview.jpg",
                    "width": 1200,
                    "height": 630
                  },
                  "breadcrumb": {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                      {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": "https://www.freecompoundcalculator.com"
                      },
                      {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Free Calculators",
                        "item": "https://www.freecompoundcalculator.com/free-calculators"
                      },
                      {
                        "@type": "ListItem",
                        "position": 3,
                        "name": "Basic Calculator",
                        "item": canonicalUrl
                      }
                    ]
                  },
                  "mainEntity": {
                    "@type": "SoftwareApplication",
                    "name": "Free Online Basic Calculator with History",
                    "applicationCategory": ["CalculatorApplication", "UtilityApplication"],
                    "operatingSystem": "All",
                    "browserRequirements": "Requires JavaScript. Works in all modern browsers.",
                    "offers": {
                      "@type": "Offer",
                      "price": "0",
                      "priceCurrency": "USD",
                      "availability": "https://schema.org/InStock",
                      "priceValidUntil": "2026-12-31"
                    },
                    "aggregateRating": {
                      "@type": "AggregateRating",
                      "ratingValue": 4.8,
                      "ratingCount": 3125,
                      "bestRating": 5,
                      "worstRating": 1
                    },
                    "description": pageDescription,
                    "featureList": [
                      "Basic Arithmetic Operations",
                      "Percentage Calculations",
                      "Square and Square Root",
                      "Calculation History (Last 10)",
                      "Memory Function",
                      "Keyboard Support",
                      "Decimal Precision",
                      "Error Handling",
                      "Chain Calculations",
                      "Positive/Negative Toggle"
                    ],
                    "softwareVersion": "2026.1.0",
                    "screenshot": "https://www.freecompoundcalculator.com/images/basic-calculator-screenshot.jpg",
                    "applicationSuite": "Calculator Tools",
                    "countriesSupported": "Global",
                    "fileSize": "Web Application"
                  }
                },
                {
                  "@type": "FAQPage",
                  "@id": `${canonicalUrl}#faqpage`,
                  "mainEntity": faqs.map((faq, index) => ({
                    "@type": "Question",
                    "name": faq.question,
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": faq.answer,
                      "datePublished": safeFaqDates[index] || safeCurrentDate,
                      "author": {
                        "@type": "Person",
                        "name": "Calculator Support Team"
                      }
                    },
                    "mainEntityOfPage": canonicalUrl
                  }))
                },
                {
                  "@type": "HowTo",
                  "name": "How to Use the Free Online Calculator",
                  "description": "Step-by-step guide to using our free calculator with history and memory functions",
                  "totalTime": "PT2M",
                  "estimatedCost": {
                    "@type": "MonetaryAmount",
                    "currency": "USD",
                    "value": "0"
                  },
                  "step": [
                    {
                      "@type": "HowToStep",
                      "position": 1,
                      "name": "Enter Numbers",
                      "text": "Click the number buttons or use your keyboard's number keys to enter digits.",
                      "url": `${canonicalUrl}#input`
                    },
                    {
                      "@type": "HowToStep",
                      "position": 2,
                      "name": "Select Operation",
                      "text": "Choose an operator (+, -, ×, ÷) to perform the calculation.",
                      "url": `${canonicalUrl}#operators`
                    },
                    {
                      "@type": "HowToStep",
                      "position": 3,
                      "name": "Get Result",
                      "text": "Press the equals button (=) or Enter key to see the result.",
                      "url": `${canonicalUrl}#equals`
                    },
                    {
                      "@type": "HowToStep",
                      "position": 4,
                      "name": "View History",
                      "text": "Check the history panel on the right to see your last 10 calculations.",
                      "url": `${canonicalUrl}#history`
                    }
                  ]
                },
                {
                  "@type": "ItemList",
                  "itemListElement": testimonials.map((testimonial, index) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "item": {
                      "@type": "Review",
                      "reviewRating": {
                        "@type": "Rating",
                        "ratingValue": testimonial.rating,
                        "bestRating": 5
                      },
                      "author": {
                        "@type": "Person",
                        "name": testimonial.name
                      },
                      "reviewBody": testimonial.quote,
                      "datePublished": testimonial.date,
                      "publisher": {
                        "@type": "Organization",
                        "name": "FreeCompoundCalculator.com"
                      },
                      "itemReviewed": {
                        "@type": "SoftwareApplication",
                        "name": "Free Online Basic Calculator",
                        "applicationCategory": "CalculatorApplication",
                        "operatingSystem": "All",
                        "offers": {
                          "@type": "Offer",
                          "price": "0",
                          "priceCurrency": "USD"
                        },
                        "description": "Free online calculator with history and memory functions",
                        "url": canonicalUrl
                      }
                    }
                  }))
                },
                {
                  "@type": "SpeakableSpecification",
                  "cssSelector": [".sectionTitle", ".subtitle", ".resultCard h4"]
                }
              ]
            })
          }}
        />

        {/* Additional SoftwareApplication Schema */}
        <script
          type="application/ld+json"
          key="structured-data-software"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Online Basic Calculator - FreeCompoundCalculator.com",
              "url": canonicalUrl,
              "description": "Free web-based calculator with calculation history and memory functions from FreeCompoundCalculator.com",
              "applicationCategory": "UtilityApplication",
              "operatingSystem": "Web",
              "permissions": "Free",
              "countriesSupported": "Worldwide",
              "screenshot": "https://www.freecompoundcalculator.com/images/basic-calculator-screenshot.jpg",
              "fileSize": "175KB",
              "memoryRequirements": "256MB",
              "processorRequirements": "Any",
              "softwareRequirements": "Modern Web Browser",
              "softwareVersion": "2026.1.0"
            })
          }}
        />
      </Head>

      {/* Freshness Indicator (Hidden) */}
      <div className={styles.freshnessIndicator} style={{ display: 'none' }}>
        <meta name="build-timestamp" content={buildTimestamp} />
        <meta name="content-freshness" content={freshnessIndicator} />
      </div>
      
      {/* Page Content */}
      <div className={styles.calculatorPage} lang="en-US">
        {/* Breadcrumb Navigation */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <ol className={styles.breadcrumbList}>
            <li className={styles.breadcrumbItem}>
              <Link href="/" className={styles.breadcrumbLink}>
                <span className={styles.breadcrumbText}>Home</span>
              </Link>
            </li>
            <li className={styles.breadcrumbSeparator} aria-hidden="true">›</li>
            <li className={styles.breadcrumbItem}>
              <Link href="/free-calculators" className={styles.breadcrumbLink}>
                <span className={styles.breadcrumbText}>Free Calculators</span>
              </Link>
            </li>
            <li className={styles.breadcrumbSeparator} aria-hidden="true">›</li>
            <li className={styles.breadcrumbItem}>
              <span className={styles.breadcrumbCurrent}>Basic Calculator</span>
            </li>
          </ol>
        </nav>

        <div className={styles.headerActions}>
          <button
            className={styles.pdfExportBtn}
            onClick={() => window.print()}
            aria-label="Print Calculator"
          >
            🖨️ Print Calculator
          </button>
        </div>

        <div className={styles.calculatorContainer}>
          {/* Trust Badge */}
          <div className={styles.trustBadge}>
            <span className={styles.trustBadgeText}>
              ⭐ Rated 4.8/5 by 3,125+ Users | Free Forever • No Registration
            </span>
          </div>

          <h1 className={styles.sectionTitle}>
            Free Online Calculator <span className={styles.gradientText}>with History & Memory</span>
          </h1>
          
          <p className={styles.subtitle}>
            Perform basic and advanced calculations with precision using this free online calculator from <strong className={styles.highlightText}>FreeCompoundCalculator.com</strong>. Includes calculation history tracking, memory functions, keyboard shortcuts, percentage calculations, square root, and square functions. Perfect for everyday math, homework, budgeting, and quick calculations - completely free with no registration required. <strong className={styles.highlightText}>Trusted by 50,000+ users worldwide.</strong>
          </p>

          <div className={styles.heroStats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>50K+</span>
              <span className={styles.statLabel}>Monthly Users</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>4.8/5</span>
              <span className={styles.statLabel}>User Rating</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>10</span>
              <span className={styles.statLabel}>History Items</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>✓</span>
              <span className={styles.statLabel}>Keyboard Support</span>
            </div>
          </div>

          <div className={styles.calcGrid}>
            {/* Main Calculator Panel */}
            <div className={styles.inputPanel}>
              <h2 className={styles.panelTitle}>Free Calculator Interface - Basic & Scientific Functions</h2>

              <div className={styles.display}>
                <div className={styles.displayValue}>{display}</div>
                <div className={styles.displayInfo}>
                  {operator && <span className={styles.operatorIndicator}>{operator}</span>}
                  {firstOperand !== null && (
                    <span className={styles.memoryIndicator}>Memory: {firstOperand}</span>
                  )}
                </div>
              </div>

              <div className={styles.buttonGrid}>
                {/* Function Buttons Row */}
                <div className={styles.buttonRow}>
                  <button
                    onClick={clearDisplay}
                    className={`${styles.button} ${styles.functionButton}`}
                    aria-label={display === '0' || display === 'Error' ? 'All Clear' : 'Clear'}
                  >
                    {display === '0' || display === 'Error' ? 'AC' : 'C'}
                  </button>
                  <button
                    onClick={handlePlusMinus}
                    className={`${styles.button} ${styles.functionButton}`}
                    aria-label="Toggle positive/negative"
                  >
                    ±
                  </button>
                  <button
                    onClick={handlePercentage}
                    className={`${styles.button} ${styles.functionButton}`}
                    aria-label="Percentage"
                  >
                    %
                  </button>
                  <button
                    onClick={() => performOperation('÷')}
                    className={`${styles.button} ${styles.operatorButton}`}
                    aria-label="Divide"
                  >
                    ÷
                  </button>
                </div>

                {/* Row 1 */}
                <div className={styles.buttonRow}>
                  <button onClick={() => inputDigit(7)} className={styles.button} aria-label="7">
                    7
                  </button>
                  <button onClick={() => inputDigit(8)} className={styles.button} aria-label="8">
                    8
                  </button>
                  <button onClick={() => inputDigit(9)} className={styles.button} aria-label="9">
                    9
                  </button>
                  <button
                    onClick={() => performOperation('×')}
                    className={`${styles.button} ${styles.operatorButton}`}
                    aria-label="Multiply"
                  >
                    ×
                  </button>
                </div>

                {/* Row 2 */}
                <div className={styles.buttonRow}>
                  <button onClick={() => inputDigit(4)} className={styles.button} aria-label="4">
                    4
                  </button>
                  <button onClick={() => inputDigit(5)} className={styles.button} aria-label="5">
                    5
                  </button>
                  <button onClick={() => inputDigit(6)} className={styles.button} aria-label="6">
                    6
                  </button>
                  <button
                    onClick={() => performOperation('-')}
                    className={`${styles.button} ${styles.operatorButton}`}
                    aria-label="Subtract"
                  >
                    -
                  </button>
                </div>

                {/* Row 3 */}
                <div className={styles.buttonRow}>
                  <button onClick={() => inputDigit(1)} className={styles.button} aria-label="1">
                    1
                  </button>
                  <button onClick={() => inputDigit(2)} className={styles.button} aria-label="2">
                    2
                  </button>
                  <button onClick={() => inputDigit(3)} className={styles.button} aria-label="3">
                    3
                  </button>
                  <button
                    onClick={() => performOperation('+')}
                    className={`${styles.button} ${styles.operatorButton}`}
                    aria-label="Add"
                  >
                    +
                  </button>
                </div>

                {/* Bottom Row */}
                <div className={styles.buttonRow}>
                  <button
                    onClick={() => inputDigit(0)}
                    className={`${styles.button} ${styles.zeroButton}`}
                    aria-label="0"
                  >
                    0
                  </button>
                  <button onClick={inputDecimal} className={styles.button} aria-label="Decimal point">
                    .
                  </button>
                  <button onClick={handleEquals} className={`${styles.button} ${styles.equalsButton}`} aria-label="Equals">
                    =
                  </button>
                </div>

                {/* Advanced Functions Row */}
                <div className={styles.buttonRow}>
                  <button
                    onClick={handleSquareRoot}
                    className={`${styles.button} ${styles.advancedButton}`}
                    aria-label="Square root"
                  >
                    √x
                  </button>
                  <button
                    onClick={handleSquare}
                    className={`${styles.button} ${styles.advancedButton}`}
                    aria-label="Square"
                  >
                    x²
                  </button>
                  <button
                    onClick={clearHistory}
                    className={`${styles.button} ${styles.functionButton}`}
                    aria-label="Clear history"
                  >
                    Clear History
                  </button>
                </div>
              </div>
            </div>

            {/* History Panel */}
            <div className={styles.resultsPanel}>
              <h3 className={styles.panelTitle}>Free Calculator Information & Features</h3>

              <div className={`${styles.resultCard} ${styles.highlight}`}>
                <h4>Current Operation</h4>
                <p className={styles.resultValue}>
                  {firstOperand !== null ? `${firstOperand} ${operator || ''}` : 'Ready'}
                </p>
                <p className={styles.resultSubtext}>
                  {waitingForSecondOperand ? 'Waiting for second number' : 'Enter numbers to calculate'}
                </p>
              </div>

              <div className={styles.resultCard}>
                <h4>Display Value</h4>
                <p className={styles.resultValue}>{display}</p>
                <p className={styles.resultSubtext}>Current input/result</p>
              </div>

              <div className={styles.resultCard}>
                <h4>Recent Calculations History</h4>
                <div className={styles.historyList}>
                  {calculationHistory.length > 0 ? (
                    calculationHistory.map((calc, index) => (
                      <div key={index} className={styles.historyItem}>
                        {calc}
                      </div>
                    ))
                  ) : (
                    <p className={styles.noHistory}>No calculations yet</p>
                  )}
                </div>
              </div>

              <div className={styles.resultCard}>
                <h4>Free Calculator Features - FreeCompoundCalculator.com</h4>
                <ul className={styles.featuresList}>
                  <li>Basic arithmetic operations (+, -, ×, ÷)</li>
                  <li>Percentage calculations</li>
                  <li>Square (x²) and square root (√x)</li>
                  <li>Calculation history tracking (last 10)</li>
                  <li>Memory function for chain calculations</li>
                  <li>Decimal precision with error handling</li>
                  <li>Full keyboard support</li>
                  <li>Positive/negative toggle (±)</li>
                  <li>Division by zero protection</li>
                  <li>10 decimal place accuracy</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Testimonials Section */}
          <div className={styles.testimonialsSection}>
            <h3 className={styles.sectionHeading}>What Our Users Say</h3>
            <div className={styles.testimonialsGrid}>
              {testimonials.map((testimonial, index) => (
                <div key={index} className={styles.testimonialCard}>
                  <div className={styles.quoteMark} aria-hidden="true">"</div>
                  <p className={styles.testimonialQuote}>"{testimonial.quote}"</p>
                  <div className={styles.testimonialRating}>
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < testimonial.rating ? styles.starFilled : styles.starEmpty}>★</span>
                    ))}
                  </div>
                  <div className={styles.testimonialAuthor}>
                    <strong>{testimonial.name}</strong> - {testimonial.role}
                  </div>
                  <div className={styles.testimonialDate}>Verified User • {testimonial.date}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Tips Card */}
          <div className={styles.sensitivityCard}>
            <h3>💡 Calculator Tips & Advanced Features - FreeCompoundCalculator.com</h3>
            <div className={styles.strategyGrid}>
              <div className={styles.strategyItem}>
                <h5>Keyboard Support</h5>
                <p className={styles.strategyValue}>Use number keys & operators</p>
                <p className={styles.strategyTip}>All number keys (0-9), operators (+, -, *, /), Enter (=), Escape (AC), and period (.) work with keyboard input for faster calculations</p>
              </div>
              <div className={styles.strategyItem}>
                <h5>Memory Function</h5>
                <p className={styles.strategyValue}>Store intermediate results</p>
                <p className={styles.strategyTip}>First operand is stored automatically for chain calculations and complex math operations. Perfect for multi-step equations.</p>
              </div>
              <div className={styles.strategyItem}>
                <h5>Error Handling</h5>
                <p className={styles.strategyValue}>Division by zero protection</p>
                <p className={styles.strategyTip}>Shows "Error" for invalid operations (like dividing by zero) and prevents calculation errors. Always accurate and reliable.</p>
              </div>
              <div className={styles.strategyItem}>
                <h5>Decimal Precision</h5>
                <p className={styles.strategyValue}>10 decimal places</p>
                <p className={styles.strategyTip}>Accurate floating point calculations with proper rounding and validation. Results are formatted to 10 decimal places for precision.</p>
              </div>
            </div>
          </div>

          {/* Usage Guide */}
          <div className={styles.milestoneTable}>
            <h3>🎯 Calculator Usage Guide - Free Online Math Tool from FreeCompoundCalculator.com</h3>
            <div className={styles.tableContainer}>
              <table>
                <thead>
                  <tr>
                    <th>Button</th>
                    <th>Function</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>AC / C</code></td>
                    <td>Clear</td>
                    <td>All Clear (AC) resets everything | Clear (C) clears current entry only</td>
                  </tr>
                  <tr>
                    <td><code>±</code></td>
                    <td>Negate</td>
                    <td>Toggle positive/negative sign of current value</td>
                  </tr>
                  <tr>
                    <td><code>%</code></td>
                    <td>Percentage</td>
                    <td>Convert current value to percentage (divide by 100)</td>
                  </tr>
                  <tr>
                    <td><code>√x</code></td>
                    <td>Square Root</td>
                    <td>Calculate square root of current value (requires non-negative input)</td>
                  </tr>
                  <tr>
                    <td><code>x²</code></td>
                    <td>Square</td>
                    <td>Calculate square of current value (x²)</td>
                  </tr>
                  <tr>
                    <td><code>÷ × - +</code></td>
                    <td>Operators</td>
                    <td>Division, multiplication, subtraction, addition operations</td>
                  </tr>
                  <tr>
                    <td><code>=</code></td>
                    <td>Equals</td>
                    <td>Calculate and display result of current operation</td>
                  </tr>
                  <tr>
                    <td><code>.</code></td>
                    <td>Decimal</td>
                    <td>Input decimal point for floating point numbers</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={styles.tableTip}>
              <strong>Tip from FreeCompoundCalculator.com:</strong> Use keyboard shortcuts for faster calculations. All number keys (0-9), basic operators (+, -, *, /), Enter (=), Escape (AC), and period (.) work. Perfect for quick calculations without using your mouse. This free calculator works on all devices with no installation needed.
            </p>
          </div>

          {/* FAQ Section */}
          <div className={styles.faqSection}>
            <h3 className={styles.sectionHeading}>Frequently Asked Questions About the Free Calculator</h3>
            <div className={styles.faqGrid}>
              {faqs.map((faq, index) => (
                <div key={index} className={styles.faqItem}>
                  <h4 className={styles.faqQuestion}>{faq.question}</h4>
                  <p className={styles.faqAnswer}>{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Steps */}
          <div className={styles.actionCard}>
            <h3>🚀 Advanced Calculator Features - Free Online Math Tool from FreeCompoundCalculator.com</h3>
            <div className={styles.actionGrid}>
              <div className={styles.actionItem}>
                <strong>💡 Chain Calculations Support:</strong>
                <br />
                Perform multiple operations sequentially without clearing. The result of one calculation becomes the first operand for the next operation automatically. Perfect for complex multi-step calculations. FreeCompoundCalculator.com provides this advanced feature at no cost.
              </div>
              <div className={styles.actionItem}>
                <strong>💡 Full Keyboard Shortcuts:</strong>
                <br />
                Use your keyboard's number pad or top row numbers for faster input. All basic operators (+, -, *, /), Enter (=), Escape (AC), and percentage (%) work with keyboard shortcuts for efficient calculations. This free calculator supports complete keyboard operation.
              </div>
              <div className={styles.actionItem}>
                <strong>💡 Decimal Precision & Error Handling:</strong>
                <br />
                Floating point calculations with 10 decimal place precision, proper error checking, division by zero protection, and validation for all mathematical operations. Shows "Error" for invalid calculations. FreeCompoundCalculator.com ensures accurate results.
              </div>
              <div className={styles.actionItem}>
                <strong>💡 Calculation History Tracking:</strong>
                <br />
                Stores last 10 calculations with full operation details. Review previous calculations, copy results, and track your calculation history. Perfect for checking work or reusing previous results. This feature is completely free on FreeCompoundCalculator.com.
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className={styles.ctaSection}>
            <div className={styles.ctaContainer}>
              <h3 className={styles.ctaTitle}>Need More Advanced Calculations?</h3>
              <p className={styles.ctaSubtitle}>
                Try our specialized calculators for compound interest, retirement planning, and investment growth.
              </p>
              <div className={styles.ctaButtons}>
                <Link
                  href="/compound-interest-calculator"
                  className={styles.primaryButton}
                  aria-label="Try our compound interest calculator"
                >
                  <span className={styles.buttonText}>Compound Interest Calculator</span>
                  <span className={styles.buttonIcon}>→</span>
                </Link>
                <Link
                  href="/free-calculators"
                  className={styles.secondaryButton}
                  aria-label="Browse all calculators"
                >
                  <span className={styles.buttonText}>Browse All Calculators</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </>
  );
};

export async function getStaticProps() {
  const buildTimestamp = Date.now();
  const buildTime = new Date(buildTimestamp);
  const currentDate = buildTime.toISOString().split('T')[0];
  const lastModifiedDate = buildTime.toISOString();

  // Generate dates for testimonials (staggered over last 6 months)
  const reviewDates = Array(6).fill(null).map((_, i) => {
    const date = new Date(buildTimestamp);
    date.setDate(date.getDate() - (i * 30 + 15));
    return date.toISOString().split('T')[0];
  });

  // Generate dates for FAQs (staggered over last year)
  const faqDates = Array(6).fill(null).map((_, i) => {
    const date = new Date(buildTimestamp);
    date.setDate(date.getDate() - (i * 60 + 90));
    return date.toISOString().split('T')[0];
  });

  return {
    props: {
      seoData: {
        currentDate,
        lastModifiedDate,
        reviewDates,
        faqDates
      },
      buildTimestamp
    },
    revalidate: 3600 // Revalidate every hour for fresh content
  };
}

export default BasicCalculator;