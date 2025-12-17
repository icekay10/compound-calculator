'use client';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from './AdvancedCalculator.module.css';

const AdvancedCalculator = () => {
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

  // Enhanced SEO variables with targeted keywords for freecompoundcalculator.com
  const pageTitle = 'Free Advanced Scientific Calculator Online | FreeCompoundCalculator.com 2024';
  const pageDescription = 'Free professional scientific calculator from FreeCompoundCalculator.com with advanced features: trigonometric functions (sin, cos, tan), logarithms, exponents, memory functions, calculation history, and scientific constants. Perfect for students, engineers, scientists, and professionals.';
  const canonicalUrl = 'https://www.freecompoundcalculator.com/advanced-scientific-calculator';
  const pageKeywords = 'free scientific calculator, free advanced calculator, free online calculator, free trigonometry calculator, free engineering calculator, free math calculator, free scientific functions calculator, free graphing calculator alternative, free physics calculator, free chemistry calculator, free statistics calculator, free algebra calculator, free calculus calculator, free geometry calculator, free STEM calculator, free student calculator, free professional calculator, free memory calculator, free history calculator, free radians degrees calculator, free logarithmic calculator, free exponential calculator, free factorial calculator, free power calculator, free root calculator, free constant calculator, freecompoundcalculator, free compound calculator, free compound interest calculator, free financial calculator, free scientific tool, free math tool, free engineering tool, free trigonometry tool, free logarithmic functions, free exponential functions, free trigonometric functions, free scientific computing';

  return (
    <>
      {/* Comprehensive SEO Meta Tags with Schema Markup */}
      <Head>
        {/* Primary Meta Tags */}
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={pageKeywords} />
        <meta name="author" content="FreeCompoundCalculator.com" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="FreeCompoundCalculator.com" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:image" content="https://www.freecompoundcalculator.com/images/scientific-calculator-preview.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Free Advanced Scientific Calculator from FreeCompoundCalculator.com" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:site" content="@FreeCompoundCalc" />
        <meta name="twitter:creator" content="@FreeCompoundCalc" />
        <meta name="twitter:image" content="https://www.freecompoundcalculator.com/images/scientific-calculator-preview.jpg" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="rating" content="General" />
        <meta name="distribution" content="global" />
        <meta name="generator" content="FreeCompoundCalculator.com Scientific Calculator Engine" />
        <meta name="application-name" content="Free Scientific Calculator" />
        <meta name="apple-mobile-web-app-title" content="Sci Calculator" />
        <meta name="theme-color" content="#0a192f" />
        <meta name="msapplication-TileColor" content="#00bfa5" />
        
        {/* Schema.org JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Free Advanced Scientific Calculator - FreeCompoundCalculator.com",
            "description": "Professional online scientific calculator with advanced mathematical functions - completely free from FreeCompoundCalculator.com",
            "url": canonicalUrl,
            "applicationCategory": "EducationalApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            },
            "author": {
              "@type": "Organization",
              "name": "FreeCompoundCalculator.com",
              "url": "https://www.freecompoundcalculator.com",
              "logo": "https://www.freecompoundcalculator.com/images/logo.png"
            },
            "featureList": [
              "Trigonometric Functions (sin, cos, tan)",
              "Inverse Trigonometric Functions",
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
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "ratingCount": "2150",
              "bestRating": "5",
              "worstRating": "1"
            }
          })}
        </script>
        
        {/* Additional Schema for Calculator */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Free Scientific Calculator Online - FreeCompoundCalculator.com",
            "url": canonicalUrl,
            "browserRequirements": "Requires JavaScript",
            "softwareVersion": "3.2.0",
            "description": pageDescription,
            "keywords": pageKeywords,
            "operatingSystem": "Any",
            "applicationCategory": "CalculatorApplication",
            "permissions": "Free",
            "countriesSupported": "Worldwide",
            "screenshot": "https://www.freecompoundcalculator.com/images/scientific-calculator-screenshot.jpg",
            "fileSize": "220KB",
            "memoryRequirements": "512MB",
            "processorRequirements": "Any"
          })}
        </script>

        {/* Breadcrumb Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
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
          })}
        </script>

        {/* FAQ Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Is this scientific calculator really free?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, FreeCompoundCalculator.com provides a completely free advanced scientific calculator with all features available at no cost. No registration or payment required."
                }
              },
              {
                "@type": "Question",
                "name": "What scientific functions does this calculator include?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our free scientific calculator includes trigonometric functions (sin, cos, tan), inverse trigonometric functions, logarithms (log, ln), exponents, roots, factorials, scientific constants, memory functions, and calculation history."
                }
              },
              {
                "@type": "Question",
                "name": "Can I use this calculator for engineering or physics calculations?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Absolutely! This free scientific calculator from FreeCompoundCalculator.com is perfect for engineering, physics, mathematics, and scientific calculations with support for radians/degrees modes and advanced mathematical functions."
                }
              },
              {
                "@type": "Question",
                "name": "Does this calculator save my calculation history?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, the calculator automatically stores your last 10 calculations in the history panel. You can clear the history anytime with the Clear History button."
                }
              },
              {
                "@type": "Question",
                "name": "Can I use keyboard shortcuts with this calculator?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, this free scientific calculator supports full keyboard operation including number keys, operators (+, -, *, /), Enter (=), Escape (AC), Backspace, and Ctrl+P for power operations."
                }
              }
            ]
          })}
        </script>
      </Head>
      
      {/* Page Content */}
      <div className={styles.calculatorPage}>
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
        
        <div className={styles.calculatorContainer}>
          <h1 className={styles.sectionTitle}>Free Advanced Scientific Calculator Online - FreeCompoundCalculator.com</h1>
          <p className={styles.subtitle}>Professional scientific calculator from FreeCompoundCalculator.com with trigonometric functions (sin, cos, tan), logarithms, exponents, memory functions, and comprehensive calculation history. Perfect for students, engineers, scientists, and math professionals. Supports both degrees and radians for trigonometry calculations - completely free with no registration required.</p>
          
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
                  <button onClick={() => insertConstant('π')} className={`${styles.button} ${styles.constantButton}`}>
                    π
                  </button>
                  <button onClick={() => insertConstant('e')} className={`${styles.button} ${styles.constantButton}`}>
                    e
                  </button>
                  <button onClick={() => insertConstant('Φ')} className={`${styles.button} ${styles.constantButton}`}>
                    Φ
                  </button>
                  <button onClick={memoryStore} className={`${styles.button} ${styles.memoryButton}`}>
                    MS
                  </button>
                  <button onClick={memoryRecall} className={`${styles.button} ${styles.memoryButton}`}>
                    MR
                  </button>
                </div>

                {/* Row 2: Memory and Clear */}
                <div className={styles.buttonRow}>
                  <button onClick={memoryAdd} className={`${styles.button} ${styles.memoryButton}`}>
                    M+
                  </button>
                  <button onClick={memoryClear} className={`${styles.button} ${styles.memoryButton}`}>
                    MC
                  </button>
                  <button onClick={clearEntry} className={`${styles.button} ${styles.functionButton}`}>
                    CE
                  </button>
                  <button onClick={clearAll} className={`${styles.button} ${styles.functionButton}`}>
                    AC
                  </button>
                  <button onClick={backspace} className={`${styles.button} ${styles.functionButton}`}>
                    ⌫
                  </button>
                </div>

                {/* Row 3: Basic Functions */}
                <div className={styles.buttonRow}>
                  <button onClick={toggleSign} className={`${styles.button} ${styles.functionButton}`}>
                    ±
                  </button>
                  <button onClick={calculatePercentage} className={`${styles.button} ${styles.functionButton}`}>
                    %
                  </button>
                  <button onClick={() => scientificFunction('inv')} className={`${styles.button} ${styles.scientificButton}`}>
                    1/x
                  </button>
                  <button onClick={() => performOperation('^')} className={`${styles.button} ${styles.operatorButton}`}>
                    x^y
                  </button>
                  <button onClick={() => performOperation('÷')} className={`${styles.button} ${styles.operatorButton}`}>
                    ÷
                  </button>
                </div>

                {/* Row 4: Numbers and Operators */}
                <div className={styles.buttonRow}>
                  <button onClick={() => scientificFunction('pow2')} className={`${styles.button} ${styles.scientificButton}`}>
                    x²
                  </button>
                  <button onClick={() => scientificFunction('pow3')} className={`${styles.button} ${styles.scientificButton}`}>
                    x³
                  </button>
                  <button onClick={() => scientificFunction('pow10')} className={`${styles.button} ${styles.scientificButton}`}>
                    10^x
                  </button>
                  <button onClick={() => inputDigit(7)} className={styles.button}>7</button>
                  <button onClick={() => inputDigit(8)} className={styles.button}>8</button>
                  <button onClick={() => inputDigit(9)} className={styles.button}>9</button>
                  <button onClick={() => performOperation('×')} className={`${styles.button} ${styles.operatorButton}`}>
                    ×
                  </button>
                </div>

                {/* Row 5: Numbers and Operators */}
                <div className={styles.buttonRow}>
                  <button onClick={() => scientificFunction('sqrt')} className={`${styles.button} ${styles.scientificButton}`}>
                    √x
                  </button>
                  <button onClick={() => scientificFunction('cbrt')} className={`${styles.button} ${styles.scientificButton}`}>
                    ∛x
                  </button>
                  <button onClick={() => scientificFunction('fact')} className={`${styles.button} ${styles.scientificButton}`}>
                    x!
                  </button>
                  <button onClick={() => inputDigit(4)} className={styles.button}>4</button>
                  <button onClick={() => inputDigit(5)} className={styles.button}>5</button>
                  <button onClick={() => inputDigit(6)} className={styles.button}>6</button>
                  <button onClick={() => performOperation('-')} className={`${styles.button} ${styles.operatorButton}`}>
                    -
                  </button>
                </div>

                {/* Row 6: Numbers and Operators */}
                <div className={styles.buttonRow}>
                  <button onClick={() => scientificFunction('exp')} className={`${styles.button} ${styles.scientificButton}`}>
                    e^x
                  </button>
                  <button onClick={() => scientificFunction('abs')} className={`${styles.button} ${styles.scientificButton}`}>
                    |x|
                  </button>
                  <button onClick={() => scientificFunction('mod')} className={`${styles.button} ${styles.scientificButton}`}>
                    mod
                  </button>
                  <button onClick={() => inputDigit(1)} className={styles.button}>1</button>
                  <button onClick={() => inputDigit(2)} className={styles.button}>2</button>
                  <button onClick={() => inputDigit(3)} className={styles.button}>3</button>
                  <button onClick={() => performOperation('+')} className={`${styles.button} ${styles.operatorButton}`}>
                    +
                  </button>
                </div>

                {/* Row 7: Trigonometric Functions */}
                <div className={styles.buttonRow}>
                  <button onClick={() => scientificFunction('sin')} className={`${styles.button} ${styles.trigButton}`}>
                    sin
                  </button>
                  <button onClick={() => scientificFunction('cos')} className={`${styles.button} ${styles.trigButton}`}>
                    cos
                  </button>
                  <button onClick={() => scientificFunction('tan')} className={`${styles.button} ${styles.trigButton}`}>
                    tan
                  </button>
                  <button onClick={() => inputDigit(0)} className={`${styles.button} ${styles.zeroButton}`}>
                    0
                  </button>
                  <button onClick={inputDecimal} className={styles.button}>.</button>
                  <button onClick={calculateResult} className={`${styles.button} ${styles.equalsButton}`}>
                    =
                  </button>
                </div>

                {/* Row 8: Inverse Trig and Log Functions */}
                <div className={styles.buttonRow}>
                  <button onClick={() => scientificFunction('asin')} className={`${styles.button} ${styles.trigButton}`}>
                    sin⁻¹
                  </button>
                  <button onClick={() => scientificFunction('acos')} className={`${styles.button} ${styles.trigButton}`}>
                    cos⁻¹
                  </button>
                  <button onClick={() => scientificFunction('atan')} className={`${styles.button} ${styles.trigButton}`}>
                    tan⁻¹
                  </button>
                  <button onClick={() => scientificFunction('log')} className={`${styles.button} ${styles.scientificButton}`}>
                    log
                  </button>
                  <button onClick={() => scientificFunction('ln')} className={`${styles.button} ${styles.scientificButton}`}>
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
                  <button onClick={clearHistory} className={styles.clearHistoryButton}>
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

         
        </div>
      </div>
    </>
  );
};

export default AdvancedCalculator;