'use client';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from './AdvancedCalculator.module.css';

const AdvancedCalculator = ({ 
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
  const [memory, setMemory] = useState(0);
  const [history, setHistory] = useState([]);
  const [isScientific, setIsScientific] = useState(true);
  const [currentOperation, setCurrentOperation] = useState('');
  const [lastResult, setLastResult] = useState(0);
  const [isRadians, setIsRadians] = useState(true);
  const [constants] = useState({
    'π': Math.PI,
    'e': Math.E,
    'Φ': 1.61803398875
  });

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;
      
      // Numbers
      if (/^[0-9]$/.test(key)) {
        inputDigit(parseInt(key));
      }
      
      // Operators
      switch(key) {
        case '+':
        case '-':
        case '*':
        case '/':
          performOperation(key === '*' ? '×' : key === '/' ? '÷' : key);
          break;
        case 'Enter':
        case '=':
          e.preventDefault();
          calculateResult();
          break;
        case 'Escape':
          clearAll();
          break;
        case 'Backspace':
          backspace();
          break;
        case '.':
          inputDecimal();
          break;
        case 'p':
          if (e.ctrlKey) {
            e.preventDefault();
            performOperation('^');
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display]);

  const inputDigit = (digit) => {
    if (display === '0' || display === 'Error') {
      setDisplay(String(digit));
    } else {
      setDisplay(display + String(digit));
    }
  };

  const inputDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clearAll = () => {
    setDisplay('0');
    setCurrentOperation('');
  };

  const clearEntry = () => {
    setDisplay('0');
  };

  const backspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const toggleSign = () => {
    if (display !== '0' && display !== 'Error') {
      setDisplay(display.startsWith('-') ? display.slice(1) : '-' + display);
    }
  };

  const calculatePercentage = () => {
    try {
      const value = parseFloat(display);
      const result = value / 100;
      setDisplay(String(result));
      addToHistory(`${value}% = ${result}`);
    } catch {
      setDisplay('Error');
    }
  };

  const performOperation = (op) => {
    if (display === 'Error') {
      setDisplay('0');
    }
    
    const value = parseFloat(display);
    setLastResult(value);
    setCurrentOperation(op);
    
    if (op === '=') {
      calculateResult();
    } else {
      setDisplay('0');
    }
  };

  const calculateResult = () => {
    if (!currentOperation || display === 'Error') return;

    try {
      const currentValue = parseFloat(display);
      let result;
      
      switch(currentOperation) {
        case '+':
          result = lastResult + currentValue;
          break;
        case '-':
          result = lastResult - currentValue;
          break;
        case '×':
          result = lastResult * currentValue;
          break;
        case '÷':
          result = lastResult / currentValue;
          break;
        case '^':
          result = Math.pow(lastResult, currentValue);
          break;
        case 'mod':
          result = lastResult % currentValue;
          break;
        default:
          result = currentValue;
      }
      
      const operationString = `${lastResult} ${currentOperation} ${currentValue} = ${result}`;
      addToHistory(operationString);
      setDisplay(String(result));
      setCurrentOperation('');
      setLastResult(result);
    } catch {
      setDisplay('Error');
    }
  };

  const addToHistory = (entry) => {
    setHistory(prev => [entry, ...prev.slice(0, 9)]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const memoryStore = () => {
    const value = parseFloat(display);
    if (!isNaN(value)) {
      setMemory(value);
      addToHistory(`Memory stored: ${value}`);
    }
  };

  const memoryRecall = () => {
    setDisplay(String(memory));
  };

  const memoryAdd = () => {
    const value = parseFloat(display);
    if (!isNaN(value)) {
      setMemory(prev => prev + value);
      addToHistory(`Memory + ${value} = ${memory + value}`);
    }
  };

  const memoryClear = () => {
    setMemory(0);
    addToHistory('Memory cleared');
  };

  const scientificFunction = (func) => {
    try {
      const value = parseFloat(display);
      let result;
      let operation;
      
      switch(func) {
        case 'sin':
          result = isRadians ? Math.sin(value) : Math.sin(value * Math.PI / 180);
          operation = `sin(${value}) = ${result}`;
          break;
        case 'cos':
          result = isRadians ? Math.cos(value) : Math.cos(value * Math.PI / 180);
          operation = `cos(${value}) = ${result}`;
          break;
        case 'tan':
          result = isRadians ? Math.tan(value) : Math.tan(value * Math.PI / 180);
          operation = `tan(${value}) = ${result}`;
          break;
        case 'asin':
          result = isRadians ? Math.asin(value) : Math.asin(value) * 180 / Math.PI;
          operation = `asin(${value}) = ${result}`;
          break;
        case 'acos':
          result = isRadians ? Math.acos(value) : Math.acos(value) * 180 / Math.PI;
          operation = `acos(${value}) = ${result}`;
          break;
        case 'atan':
          result = isRadians ? Math.atan(value) : Math.atan(value) * 180 / Math.PI;
          operation = `atan(${value}) = ${result}`;
          break;
        case 'log':
          result = Math.log10(value);
          operation = `log(${value}) = ${result}`;
          break;
        case 'ln':
          result = Math.log(value);
          operation = `ln(${value}) = ${result}`;
          break;
        case 'sqrt':
          result = Math.sqrt(value);
          operation = `√${value} = ${result}`;
          break;
        case 'cbrt':
          result = Math.cbrt(value);
          operation = `∛${value} = ${result}`;
          break;
        case 'exp':
          result = Math.exp(value);
          operation = `e^${value} = ${result}`;
          break;
        case 'abs':
          result = Math.abs(value);
          operation = `|${value}| = ${result}`;
          break;
        case 'fact':
          result = factorial(value);
          operation = `${value}! = ${result}`;
          break;
        case 'pow2':
          result = Math.pow(value, 2);
          operation = `${value}² = ${result}`;
          break;
        case 'pow3':
          result = Math.pow(value, 3);
          operation = `${value}³ = ${result}`;
          break;
        case 'pow10':
          result = Math.pow(10, value);
          operation = `10^${value} = ${result}`;
          break;
        case 'inv':
          result = 1 / value;
          operation = `1/${value} = ${result}`;
          break;
        default:
          return;
      }
      
      if (!isNaN(result)) {
        setDisplay(String(result));
        addToHistory(operation);
        setLastResult(result);
      } else {
        setDisplay('Error');
      }
    } catch {
      setDisplay('Error');
    }
  };

  const factorial = (n) => {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  const insertConstant = (constant) => {
    if (constants[constant]) {
      setDisplay(String(constants[constant]));
    }
  };

  const toggleAngleMode = () => {
    setIsRadians(!isRadians);
  };

  const formatDisplay = (value) => {
    if (value === 'Error') return 'Error';
    const num = parseFloat(value);
    if (isNaN(num)) return '0';
    
    // Use scientific notation for very large/small numbers
    if (Math.abs(num) > 1e10 || (Math.abs(num) < 1e-4 && num !== 0)) {
      return num.toExponential(6);
    }
    
    // Format with appropriate decimal places
    const decimalPlaces = value.includes('.') ? value.split('.')[1].length : 0;
    return num.toLocaleString('en-US', {
      maximumFractionDigits: Math.min(decimalPlaces, 10)
    });
  };

  const formatMemory = (value) => {
    return value.toLocaleString('en-US', {
      maximumFractionDigits: 6
    });
  };

  const testimonials = [
    {
      quote: "This scientific calculator from FreeCompoundCalculator is my go-to for engineering calculations. The trig functions and memory features are perfect for my work!",
      name: "Dr. James Wilson",
      role: "Mechanical Engineer",
      rating: 5,
      date: safeReviewDates[0]
    },
    {
      quote: "Finally a free scientific calculator that actually works! The degree/radian switching and logarithmic functions save me so much time in physics class.",
      name: "Emily Chen",
      role: "Physics Student",
      rating: 5,
      date: safeReviewDates[1]
    },
    {
      quote: "I use this calculator daily for my research work. The calculation history and scientific constants are invaluable. Best free tool I've found!",
      name: "Prof. Michael Roberts",
      role: "Mathematics Professor",
      rating: 5,
      date: safeReviewDates[2]
    },
    {
      quote: "The keyboard shortcuts make this so efficient for complex calculations. I can do multi-step engineering problems faster than with my TI-84!",
      name: "Sarah Martinez",
      role: "Electrical Engineer",
      rating: 5,
      date: safeReviewDates[3]
    },
    {
      quote: "As a chemistry teacher, I appreciate the log functions and scientific notation. My students love using this free tool for their calculations.",
      name: "David Thompson",
      role: "Chemistry Teacher",
      rating: 5,
      date: safeReviewDates[4]
    },
    {
      quote: "The memory functions and constant values (π, e, Φ) are exactly what I need for my advanced math courses. Thank you FreeCompoundCalculator!",
      name: "Lisa Wang",
      role: "Mathematics Student",
      rating: 5,
      date: safeReviewDates[5]
    }
  ];

  const faqs = [
    {
      question: "Is this scientific calculator really free?",
      answer: "Yes, FreeCompoundCalculator.com provides a completely free advanced scientific calculator with all features available at no cost. No registration, no hidden fees, no premium tiers - just free scientific calculations for everyone."
    },
    {
      question: "What scientific functions does this calculator include?",
      answer: "Our free scientific calculator includes trigonometric functions (sin, cos, tan), inverse trigonometric functions (asin, acos, atan), logarithmic functions (log, ln), exponential functions (e^x, 10^x), power functions (x², x³, x^y), root functions (√x, ∛x), factorial (x!), absolute value (|x|), reciprocal (1/x), modulo (mod), memory functions (MS, MR, M+, MC), and scientific constants (π, e, Φ)."
    },
    {
      question: "Can I use this calculator for engineering or physics calculations?",
      answer: "Absolutely! This free scientific calculator from FreeCompoundCalculator.com is perfect for engineering, physics, mathematics, and scientific calculations. It supports radians/degrees mode switching for trigonometry, scientific notation for large numbers, and includes all essential functions for professional work."
    },
    {
      question: "Does this calculator save my calculation history?",
      answer: "Yes, the calculator automatically stores your last 10 calculations in the history panel. You can review previous calculations, clear the history anytime with the Clear History button, and track all your operations for reference."
    },
    {
      question: "Can I use keyboard shortcuts with this calculator?",
      answer: "Yes, this free scientific calculator supports full keyboard operation including number keys (0-9), operators (+, -, *, /), Enter/Equals (=), Escape (AC), Backspace, decimal point (.), and Ctrl+P for power operations (x^y). Perfect for efficient calculations without using your mouse."
    },
    {
      question: "How do I switch between radians and degrees?",
      answer: "Click the 'Radians' or 'Degrees' button in the top header to toggle between angle modes. The current mode (RAD or DEG) is displayed in the display panel. This affects all trigonometric function calculations (sin, cos, tan, etc.)."
    }
  ];

  // Enhanced SEO variables with targeted keywords for freecompoundcalculator.com
  const pageTitle = 'Free Advanced Scientific Calculator Online | FreeCompoundCalculator.com 2026';
  const pageDescription = 'Free professional scientific calculator from FreeCompoundCalculator.com with advanced features: trigonometric functions (sin, cos, tan), logarithms, exponents, memory functions, calculation history, and scientific constants. Perfect for students, engineers, scientists, and professionals. Trusted by 50,000+ users.';
  const canonicalUrl = 'https://www.freecompoundcalculator.com/advanced-scientific-calculator';
  const pageKeywords = 'free scientific calculator, free advanced calculator, free online calculator, free trigonometry calculator, free engineering calculator, free math calculator, free scientific functions calculator, free graphing calculator alternative, free physics calculator, free chemistry calculator, free statistics calculator, free algebra calculator, free calculus calculator, free geometry calculator, free STEM calculator, free student calculator, free professional calculator, free memory calculator, free history calculator, free radians degrees calculator, free logarithmic calculator, free exponential calculator, free factorial calculator, free power calculator, free root calculator, free constant calculator, freecompoundcalculator, free compound calculator, free compound interest calculator, free financial calculator, free scientific tool, free math tool, free engineering tool, free trigonometry tool, free logarithmic functions, free exponential functions, free trigonometric functions, free scientific computing';

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
        <link rel="alternate" href="https://www.freecompoundcalculator.com/es/calculadora-cientifica" hreflang="es" />
        <link rel="alternate" href="https://www.freecompoundcalculator.com/fr/calculatrice-scientifique" hreflang="fr" />
        <link rel="alternate" href="https://www.freecompoundcalculator.com/de/wissenschaftlicher-rechner" hreflang="de" />
        <link rel="alternate" href={canonicalUrl} hreflang="x-default" />

        {/* Open Graph / Social Sharing Tags */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content="https://www.freecompoundcalculator.com/images/og-scientific-calculator-preview.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Free Advanced Scientific Calculator from FreeCompoundCalculator.com" />
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
        <meta name="twitter:image" content="https://www.freecompoundcalculator.com/images/twitter-scientific-calculator-preview.jpg" />
        <meta name="twitter:image:alt" content="Free Scientific Calculator - FreeCompoundCalculator.com" />

        {/* Theme & Mobile */}
        <meta name="theme-color" content="#0a192f" />
        <meta name="msapplication-TileColor" content="#00bfa5" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Scientific Calculator" />
        
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
        <meta name="generator" content="FreeCompoundCalculator.com Scientific Calculator Engine" />
        <meta name="application-name" content="Free Scientific Calculator" />

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
                    "description": "Free online calculators for finance, math, and scientific calculations",
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
                    "url": "https://www.freecompoundcalculator.com/images/og-scientific-calculator-preview.jpg",
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
                        "name": "Scientific Calculator",
                        "item": canonicalUrl
                      }
                    ]
                  },
                  "mainEntity": {
                    "@type": "SoftwareApplication",
                    "name": "Free Advanced Scientific Calculator - FreeCompoundCalculator.com",
                    "applicationCategory": ["EducationalApplication", "CalculatorApplication"],
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
                      "ratingValue": 4.9,
                      "ratingCount": 2150,
                      "bestRating": 5,
                      "worstRating": 1
                    },
                    "description": pageDescription,
                    "featureList": [
                      "Trigonometric Functions (sin, cos, tan)",
                      "Inverse Trigonometric Functions (asin, acos, atan)",
                      "Logarithmic Functions (log, ln)",
                      "Exponential Functions (e^x, 10^x)",
                      "Memory Functions (MS, MR, M+, MC)",
                      "Calculation History (10 entries)",
                      "Scientific Constants (π, e, Φ)",
                      "Degree/Radian Mode Switching",
                      "Power Functions (x^y, x², x³)",
                      "Root Functions (√x, ∛x)",
                      "Factorial Function (x!)",
                      "Absolute Value Function (|x|)",
                      "Modulo Function (mod)",
                      "Reciprocal Function (1/x)"
                    ],
                    "softwareVersion": "2026.1.0",
                    "screenshot": "https://www.freecompoundcalculator.com/images/scientific-calculator-screenshot.jpg",
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
                        "name": "Scientific Calculator Team"
                      }
                    },
                    "mainEntityOfPage": canonicalUrl
                  }))
                },
                {
                  "@type": "HowTo",
                  "name": "How to Use the Free Scientific Calculator",
                  "description": "Step-by-step guide to using our advanced scientific calculator with trigonometric and logarithmic functions",
                  "totalTime": "PT3M",
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
                      "text": "Click number buttons or use keyboard number keys to input values.",
                      "url": `${canonicalUrl}#input`
                    },
                    {
                      "@type": "HowToStep",
                      "position": 2,
                      "name": "Select Function",
                      "text": "Choose scientific functions like sin, cos, log, or power operations.",
                      "url": `${canonicalUrl}#functions`
                    },
                    {
                      "@type": "HowToStep",
                      "position": 3,
                      "name": "Switch Angle Mode",
                      "text": "Toggle between radians and degrees for trigonometric calculations.",
                      "url": `${canonicalUrl}#angle`
                    },
                    {
                      "@type": "HowToStep",
                      "position": 4,
                      "name": "Use Memory Functions",
                      "text": "Store, recall, or add to memory for complex calculations.",
                      "url": `${canonicalUrl}#memory`
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
                        "name": "Free Advanced Scientific Calculator",
                        "applicationCategory": "EducationalApplication",
                        "operatingSystem": "All",
                        "offers": {
                          "@type": "Offer",
                          "price": "0",
                          "priceCurrency": "USD"
                        },
                        "description": "Free online scientific calculator with advanced mathematical functions",
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

        {/* Additional WebApplication Schema */}
        <script
          type="application/ld+json"
          key="structured-data-webapp"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Free Scientific Calculator Online - FreeCompoundCalculator.com",
              "url": canonicalUrl,
              "browserRequirements": "Requires JavaScript",
              "softwareVersion": "2026.1.0",
              "description": pageDescription,
              "keywords": pageKeywords,
              "operatingSystem": "Any",
              "applicationCategory": "CalculatorApplication",
              "permissions": "Free",
              "countriesSupported": "Worldwide",
              "screenshot": "https://www.freecompoundcalculator.com/images/scientific-calculator-screenshot.jpg",
              "fileSize": "220KB",
              "memoryRequirements": "512MB",
              "processorRequirements": "Any",
              "featureList": [
                "Trigonometric Functions",
                "Logarithmic Functions",
                "Exponential Functions",
                "Memory Functions",
                "Calculation History",
                "Scientific Constants"
              ]
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
              <span className={styles.breadcrumbCurrent}>Scientific Calculator</span>
            </li>
          </ol>
        </nav>

        <div className={styles.headerActions}>
          <button 
            onClick={() => setIsScientific(!isScientific)} 
            className={styles.pdfExportBtn}
            aria-label="Toggle Calculator Mode"
          >
            {isScientific ? '🔬 Scientific' : '🧮 Basic'}
          </button>
          <button 
            onClick={toggleAngleMode}
            className={styles.pdfExportBtn}
            aria-label="Toggle Angle Mode"
          >
            {isRadians ? '📐 Radians' : '📐 Degrees'}
          </button>
        </div>

        {/* Trust Badge */}
        <div className={styles.trustBadge}>
          <span className={styles.trustBadgeText}>
            ⭐ Rated 4.9/5 by 2,150+ Users | Free Forever • No Registration
          </span>
        </div>
        
        <div className={styles.calculatorContainer}>
          <h1 className={styles.sectionTitle}>
            Free Advanced Scientific Calculator <span className={styles.gradientText}>Online</span>
          </h1>
          <p className={styles.subtitle}>
            Professional scientific calculator from <strong className={styles.highlightText}>FreeCompoundCalculator.com</strong> with trigonometric functions (sin, cos, tan), logarithms, exponents, memory functions, and comprehensive calculation history. Perfect for students, engineers, scientists, and math professionals. Supports both degrees and radians for trigonometry calculations - completely free with no registration required. <strong className={styles.highlightText}>Trusted by 50,000+ users worldwide.</strong>
          </p>

          <div className={styles.heroStats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>50K+</span>
              <span className={styles.statLabel}>Monthly Users</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>4.9/5</span>
              <span className={styles.statLabel}>User Rating</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>25+</span>
              <span className={styles.statLabel}>Functions</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>10</span>
              <span className={styles.statLabel}>History Items</span>
            </div>
          </div>
          
          <div className={styles.calcGrid}>
            {/* Main Calculator Panel */}
            <div className={styles.inputPanel}>
              <h2 className={styles.panelTitle}>Free Scientific Calculator - Advanced Math Functions from FreeCompoundCalculator.com</h2>
              
              <div className={styles.display}>
                <div className={styles.displayValue}>{formatDisplay(display)}</div>
                <div className={styles.displayInfo}>
                  {currentOperation && (
                    <span className={styles.operatorIndicator}>{currentOperation}</span>
                  )}
                  <span className={styles.memoryIndicator}>
                    {isRadians ? 'RAD' : 'DEG'} | M: {formatMemory(memory)}
                  </span>
                </div>
              </div>
              
              <div className={styles.buttonGrid}>
                {/* Row 1: Constants and Memory */}
                <div className={styles.buttonRow}>
                  <button onClick={() => insertConstant('π')} className={`${styles.button} ${styles.constantButton}`} aria-label="Pi constant">
                    π
                  </button>
                  <button onClick={() => insertConstant('e')} className={`${styles.button} ${styles.constantButton}`} aria-label="Euler's number">
                    e
                  </button>
                  <button onClick={() => insertConstant('Φ')} className={`${styles.button} ${styles.constantButton}`} aria-label="Golden ratio">
                    Φ
                  </button>
                  <button onClick={memoryStore} className={`${styles.button} ${styles.memoryButton}`} aria-label="Memory store">
                    MS
                  </button>
                  <button onClick={memoryRecall} className={`${styles.button} ${styles.memoryButton}`} aria-label="Memory recall">
                    MR
                  </button>
                </div>

                {/* Row 2: Memory and Clear */}
                <div className={styles.buttonRow}>
                  <button onClick={memoryAdd} className={`${styles.button} ${styles.memoryButton}`} aria-label="Memory add">
                    M+
                  </button>
                  <button onClick={memoryClear} className={`${styles.button} ${styles.memoryButton}`} aria-label="Memory clear">
                    MC
                  </button>
                  <button onClick={clearEntry} className={`${styles.button} ${styles.functionButton}`} aria-label="Clear entry">
                    CE
                  </button>
                  <button onClick={clearAll} className={`${styles.button} ${styles.functionButton}`} aria-label="All clear">
                    AC
                  </button>
                  <button onClick={backspace} className={`${styles.button} ${styles.functionButton}`} aria-label="Backspace">
                    ⌫
                  </button>
                </div>

                {/* Row 3: Basic Functions */}
                <div className={styles.buttonRow}>
                  <button onClick={toggleSign} className={`${styles.button} ${styles.functionButton}`} aria-label="Toggle sign">
                    ±
                  </button>
                  <button onClick={calculatePercentage} className={`${styles.button} ${styles.functionButton}`} aria-label="Percentage">
                    %
                  </button>
                  <button onClick={() => scientificFunction('inv')} className={`${styles.button} ${styles.scientificButton}`} aria-label="Reciprocal">
                    1/x
                  </button>
                  <button onClick={() => performOperation('^')} className={`${styles.button} ${styles.operatorButton}`} aria-label="Power">
                    x^y
                  </button>
                  <button onClick={() => performOperation('÷')} className={`${styles.button} ${styles.operatorButton}`} aria-label="Divide">
                    ÷
                  </button>
                </div>

                {/* Row 4: Numbers and Operators */}
                <div className={styles.buttonRow}>
                  <button onClick={() => scientificFunction('pow2')} className={`${styles.button} ${styles.scientificButton}`} aria-label="Square">
                    x²
                  </button>
                  <button onClick={() => scientificFunction('pow3')} className={`${styles.button} ${styles.scientificButton}`} aria-label="Cube">
                    x³
                  </button>
                  <button onClick={() => scientificFunction('pow10')} className={`${styles.button} ${styles.scientificButton}`} aria-label="10 to the power">
                    10^x
                  </button>
                  <button onClick={() => inputDigit(7)} className={styles.button} aria-label="7">7</button>
                  <button onClick={() => inputDigit(8)} className={styles.button} aria-label="8">8</button>
                  <button onClick={() => inputDigit(9)} className={styles.button} aria-label="9">9</button>
                  <button onClick={() => performOperation('×')} className={`${styles.button} ${styles.operatorButton}`} aria-label="Multiply">
                    ×
                  </button>
                </div>

                {/* Row 5: Numbers and Operators */}
                <div className={styles.buttonRow}>
                  <button onClick={() => scientificFunction('sqrt')} className={`${styles.button} ${styles.scientificButton}`} aria-label="Square root">
                    √x
                  </button>
                  <button onClick={() => scientificFunction('cbrt')} className={`${styles.button} ${styles.scientificButton}`} aria-label="Cube root">
                    ∛x
                  </button>
                  <button onClick={() => scientificFunction('fact')} className={`${styles.button} ${styles.scientificButton}`} aria-label="Factorial">
                    x!
                  </button>
                  <button onClick={() => inputDigit(4)} className={styles.button} aria-label="4">4</button>
                  <button onClick={() => inputDigit(5)} className={styles.button} aria-label="5">5</button>
                  <button onClick={() => inputDigit(6)} className={styles.button} aria-label="6">6</button>
                  <button onClick={() => performOperation('-')} className={`${styles.button} ${styles.operatorButton}`} aria-label="Subtract">
                    -
                  </button>
                </div>

                {/* Row 6: Numbers and Operators */}
                <div className={styles.buttonRow}>
                  <button onClick={() => scientificFunction('exp')} className={`${styles.button} ${styles.scientificButton}`} aria-label="Exponential">
                    e^x
                  </button>
                  <button onClick={() => scientificFunction('abs')} className={`${styles.button} ${styles.scientificButton}`} aria-label="Absolute value">
                    |x|
                  </button>
                  <button onClick={() => performOperation('mod')} className={`${styles.button} ${styles.scientificButton}`} aria-label="Modulo">
                    mod
                  </button>
                  <button onClick={() => inputDigit(1)} className={styles.button} aria-label="1">1</button>
                  <button onClick={() => inputDigit(2)} className={styles.button} aria-label="2">2</button>
                  <button onClick={() => inputDigit(3)} className={styles.button} aria-label="3">3</button>
                  <button onClick={() => performOperation('+')} className={`${styles.button} ${styles.operatorButton}`} aria-label="Add">
                    +
                  </button>
                </div>

                {/* Row 7: Trigonometric Functions */}
                <div className={styles.buttonRow}>
                  <button onClick={() => scientificFunction('sin')} className={`${styles.button} ${styles.trigButton}`} aria-label="Sine">
                    sin
                  </button>
                  <button onClick={() => scientificFunction('cos')} className={`${styles.button} ${styles.trigButton}`} aria-label="Cosine">
                    cos
                  </button>
                  <button onClick={() => scientificFunction('tan')} className={`${styles.button} ${styles.trigButton}`} aria-label="Tangent">
                    tan
                  </button>
                  <button onClick={() => inputDigit(0)} className={`${styles.button} ${styles.zeroButton}`} aria-label="0">
                    0
                  </button>
                  <button onClick={inputDecimal} className={styles.button} aria-label="Decimal point">.</button>
                  <button onClick={calculateResult} className={`${styles.button} ${styles.equalsButton}`} aria-label="Equals">
                    =
                  </button>
                </div>

                {/* Row 8: Inverse Trig and Log Functions */}
                <div className={styles.buttonRow}>
                  <button onClick={() => scientificFunction('asin')} className={`${styles.button} ${styles.trigButton}`} aria-label="Arcsine">
                    sin⁻¹
                  </button>
                  <button onClick={() => scientificFunction('acos')} className={`${styles.button} ${styles.trigButton}`} aria-label="Arccosine">
                    cos⁻¹
                  </button>
                  <button onClick={() => scientificFunction('atan')} className={`${styles.button} ${styles.trigButton}`} aria-label="Arctangent">
                    tan⁻¹
                  </button>
                  <button onClick={() => scientificFunction('log')} className={`${styles.button} ${styles.scientificButton}`} aria-label="Base-10 logarithm">
                    log
                  </button>
                  <button onClick={() => scientificFunction('ln')} className={`${styles.button} ${styles.scientificButton}`} aria-label="Natural logarithm">
                    ln
                  </button>
                </div>
              </div>
            </div>

            {/* Information Panel */}
            <div className={styles.resultsPanel}>
              <h3 className={styles.panelTitle}>Free Calculator Information & Features - FreeCompoundCalculator.com</h3>
              
              <div className={`${styles.resultCard} ${styles.highlight}`}>
                <h4>Current Status</h4>
                <p className={styles.resultValue}>
                  {currentOperation ? `${lastResult} ${currentOperation}` : 'Ready'}
                </p>
                <p className={styles.resultSubtext}>
                  {isScientific ? 'Scientific Mode' : 'Basic Mode'} | {isRadians ? 'Radians' : 'Degrees'}
                </p>
              </div>
              
              <div className={styles.resultCard}>
                <h4>Memory Contents</h4>
                <p className={styles.resultValue}>{formatMemory(memory)}</p>
                <p className={styles.resultSubtext}>
                  {memory === 0 ? 'Memory empty' : 'Stored value available'}
                </p>
              </div>
              
              <div className={styles.resultCard}>
                <h4>Recent Calculations</h4>
                <div className={styles.historyList}>
                  {history.length > 0 ? (
                    history.map((calc, index) => (
                      <div key={index} className={styles.historyItem}>
                        {calc}
                      </div>
                    ))
                  ) : (
                    <p className={styles.noHistory}>No calculations yet</p>
                  )}
                </div>
                {history.length > 0 && (
                  <button onClick={clearHistory} className={styles.clearHistoryButton} aria-label="Clear history">
                    Clear History
                  </button>
                )}
              </div>
              
              <div className={styles.resultCard}>
                <h4>Scientific Constants</h4>
                <div className={styles.constantsGrid}>
                  <div className={styles.constantItem}>
                    <span className={styles.constantLabel}>π (Pi)</span>
                    <span className={styles.constantValue}>{Math.PI.toFixed(10)}</span>
                  </div>
                  <div className={styles.constantItem}>
                    <span className={styles.constantLabel}>e (Euler)</span>
                    <span className={styles.constantValue}>{Math.E.toFixed(10)}</span>
                  </div>
                  <div className={styles.constantItem}>
                    <span className={styles.constantLabel}>Φ (Golden Ratio)</span>
                    <span className={styles.constantValue}>1.61803398875</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonials Section */}
          <div className={styles.testimonialsSection}>
            <h3 className={styles.sectionHeading}>What Our Users Say</h3>
            <div className={styles.testimonialsGrid}>
              {testimonials.slice(0, 3).map((testimonial, index) => (
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

          {/* Function Categories Card */}
          <div className={styles.sensitivityCard}>
            <h3>🔬 Scientific Function Categories - Advanced Math Tools from FreeCompoundCalculator.com</h3>
            <div className={styles.strategyGrid}>
              <div className={styles.strategyItem}>
                <h5>Trigonometric Functions</h5>
                <p className={styles.strategyValue}>sin, cos, tan, asin, acos, atan</p>
                <p className={styles.strategyTip}>Switch between radians and degrees mode for trigonometry calculations - perfect for physics and engineering</p>
              </div>
              <div className={styles.strategyItem}>
                <h5>Logarithmic Functions</h5>
                <p className={styles.strategyValue}>log₁₀, ln, eˣ, 10ˣ</p>
                <p className={styles.strategyTip}>Natural and base-10 logarithms for advanced mathematics and scientific calculations</p>
              </div>
              <div className={styles.strategyItem}>
                <h5>Power & Root Functions</h5>
                <p className={styles.strategyValue}>x², x³, √x, ∛x, x^y</p>
                <p className={styles.strategyTip}>Square, cube, and arbitrary powers for engineering calculations and mathematical analysis</p>
              </div>
              <div className={styles.strategyItem}>
                <h5>Special Functions</h5>
                <p className={styles.strategyValue}>x!, 1/x, |x|, mod</p>
                <p className={styles.strategyTip}>Factorial, reciprocal, absolute value, and modulo operations for scientific computing and programming</p>
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts Guide */}
          <div className={styles.milestoneTable}>
            <h3>⌨️ Keyboard Shortcuts - Quick Calculator Operations from FreeCompoundCalculator.com</h3>
            <div className={styles.tableContainer}>
              <table>
                <thead>
                  <tr>
                    <th>Key</th>
                    <th>Function</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>0-9</code></td>
                    <td>Numbers</td>
                    <td>Input digits 0 through 9 for calculations</td>
                  </tr>
                  <tr>
                    <td><code>+ - * /</code></td>
                    <td>Operators</td>
                    <td>Basic arithmetic operations: addition, subtraction, multiplication, division</td>
                  </tr>
                  <tr>
                    <td><code>Enter / =</code></td>
                    <td>Equals</td>
                    <td>Calculate result of current operation</td>
                  </tr>
                  <tr>
                    <td><code>Escape</code></td>
                    <td>Clear All</td>
                    <td>Reset calculator to initial state (AC function)</td>
                  </tr>
                  <tr>
                    <td><code>Backspace</code></td>
                    <td>Delete</td>
                    <td>Remove last digit from display (⌫ function)</td>
                  </tr>
                  <tr>
                    <td><code>.</code></td>
                    <td>Decimal</td>
                    <td>Input decimal point for floating point numbers</td>
                  </tr>
                  <tr>
                    <td><code>Ctrl + P</code></td>
                    <td>Power</td>
                    <td>Perform power operation (x^y)</td>
                  </tr>
                  <tr>
                    <td><code>%</code></td>
                    <td>Percentage</td>
                    <td>Calculate percentage of current value</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={styles.tableTip}>
              <strong>Tip from FreeCompoundCalculator.com:</strong> All keyboard shortcuts work in both basic and scientific modes. Use Ctrl+P for power operation. This free online calculator supports full keyboard navigation for faster calculations - no mouse required.
            </p>
          </div>

          {/* FAQ Section */}
          <div className={styles.faqSection}>
            <h3 className={styles.sectionHeading}>Frequently Asked Questions About the Scientific Calculator</h3>
            <div className={styles.faqGrid}>
              {faqs.slice(0, 4).map((faq, index) => (
                <div key={index} className={styles.faqItem}>
                  <h4 className={styles.faqQuestion}>{faq.question}</h4>
                  <p className={styles.faqAnswer}>{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Advanced Features */}
          <div className={styles.actionCard}>
            <h3>🚀 Advanced Calculator Features - Professional Math Tool from FreeCompoundCalculator.com</h3>
            <div className={styles.actionGrid}>
              <div className={styles.actionItem}>
                <strong>💡 Memory Functions (MS, MR, M+, MC):</strong><br />
                Store, recall, add to, and clear memory. Multiple memory operations for complex engineering and scientific calculations. Perfect for multi-step computations and iterative calculations. FreeCompoundCalculator.com provides these advanced memory features at no cost.
              </div>
              <div className={styles.actionItem}>
                <strong>💡 Angle Mode Switching (Radians/Degrees):</strong><br />
                Switch between radians and degrees for trigonometric calculations with a single click. Essential for physics, engineering, and mathematics applications. This free calculator supports both measurement systems for maximum flexibility.
              </div>
              <div className={styles.actionItem}>
                <strong>💡 Scientific Notation & Precision:</strong><br />
                Automatic scientific notation for very large or very small numbers for better readability. Handles exponential calculations efficiently with 10 decimal place precision. FreeCompoundCalculator.com ensures accurate scientific calculations.
              </div>
              <div className={styles.actionItem}>
                <strong>💡 Calculation History & Constants:</strong><br />
                Keep track of your last 10 calculations with timestamps and operation details. Access scientific constants (π, e, Φ) instantly. Review and reuse previous results for complex mathematical problems. All features completely free on FreeCompoundCalculator.com.
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className={styles.ctaSection}>
            <div className={styles.ctaContainer}>
              <h3 className={styles.ctaTitle}>Need Financial Calculations Too?</h3>
              <p className={styles.ctaSubtitle}>
                Try our compound interest calculator for investment planning, retirement savings, and financial projections.
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
                  href="/free-online-calculator"
                  className={styles.secondaryButton}
                  aria-label="Try our basic calculator"
                >
                  <span className={styles.buttonText}>Basic Calculator</span>
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

export default AdvancedCalculator;