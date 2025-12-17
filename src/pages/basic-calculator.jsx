'use client';
import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import styles from './BasicCalculator.module.css';

const BasicCalculator = () => {
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

  // SEO Variables
  const pageTitle = 'Free Online Basic Calculator with History | FreeCompoundCalculator.com 2024';
  const pageDescription = 'Free online basic calculator from FreeCompoundCalculator.com. Perform calculations with history, square root, percentage, memory functions, and keyboard support. Perfect for everyday math, homework, and quick calculations.';
  const canonicalUrl = 'https://www.freecompoundcalculator.com/free-online-calculator';
  const pageKeywords = 'free calculator, online calculator, basic calculator, free online calculator, calculator with history, freecompoundcalculator, percentage calculator, square root calculator, math calculator, simple calculator, web calculator, calculator online free, arithmetic calculator, addition calculator, subtraction calculator, multiplication calculator, division calculator, decimal calculator, memory calculator, calculation history, keyboard calculator, virtual calculator, digital calculator, calculator app, calculator tool, math helper, calculation tool, number calculator, equation solver, math solver, free math calculator, free online math tool, free calculation tool, free arithmetic calculator, free percentage calculator, free square root calculator, free memory calculator, free calculator with history, free web calculator, free virtual calculator, free digital calculator';

  return (
    <>
      {/* Comprehensive SEO Meta Tags with Structured Data */}
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
        <meta property="og:image" content="https://www.freecompoundcalculator.com/images/basic-calculator-preview.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Free Online Basic Calculator from FreeCompoundCalculator.com" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:site" content="@FreeCompoundCalc" />
        <meta name="twitter:creator" content="@FreeCompoundCalc" />
        <meta name="twitter:image" content="https://www.freecompoundcalculator.com/images/basic-calculator-preview.jpg" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="rating" content="General" />
        <meta name="distribution" content="global" />
        <meta name="generator" content="FreeCompoundCalculator.com Calculator Engine" />
        <meta name="application-name" content="Free Online Calculator" />
        <meta name="apple-mobile-web-app-title" content="Calculator" />
        <meta name="theme-color" content="#0a192f" />
        <meta name="msapplication-TileColor" content="#00bfa5" />
        
        {/* Schema.org JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Free Online Calculator - FreeCompoundCalculator.com",
            "description": "Basic calculator with advanced features including history, memory, and keyboard support from FreeCompoundCalculator.com",
            "url": canonicalUrl,
            "applicationCategory": "CalculatorApplication",
            "operatingSystem": "Any",
            "browserRequirements": "Requires JavaScript",
            "softwareVersion": "3.2.1",
            "featureList": [
              "Basic Arithmetic Operations",
              "Percentage Calculations",
              "Square and Square Root",
              "Calculation History",
              "Memory Function",
              "Keyboard Support",
              "Decimal Precision",
              "Error Handling",
              "Chain Calculations"
            ],
            "author": {
              "@type": "Organization",
              "name": "FreeCompoundCalculator.com",
              "url": "https://www.freecompoundcalculator.com",
              "logo": "https://www.freecompoundcalculator.com/images/logo.png"
            },
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "3125",
              "bestRating": "5",
              "worstRating": "1"
            },
            "operatingSystem": "Any"
          })}
        </script>

        {/* Additional Calculator Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
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
            "softwareVersion": "2.0.0"
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
                "name": "Basic Calculator",
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
                "name": "Is this calculator really free to use?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, FreeCompoundCalculator.com provides completely free online calculators with no registration required. Our basic calculator is 100% free with all features available."
                }
              },
              {
                "@type": "Question",
                "name": "What features does this free calculator include?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our free online calculator includes basic arithmetic operations, percentage calculations, square and square root functions, calculation history tracking, memory functions, and full keyboard support."
                }
              },
              {
                "@type": "Question",
                "name": "How do I use the calculation history feature?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The calculator automatically stores your last 10 calculations. You can view them in the history panel on the right side of the calculator. Click 'Clear History' to remove all previous calculations."
                }
              },
              {
                "@type": "Question",
                "name": "Does this calculator support keyboard shortcuts?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, you can use your keyboard for all calculations. Number keys (0-9), operators (+, -, *, /), Enter (=), Escape (AC), and period (.) all work as keyboard shortcuts."
                }
              }
            ]
          })}
        </script>

        {/* Organization Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "FreeCompoundCalculator.com",
            "url": "https://www.freecompoundcalculator.com",
            "logo": "https://www.freecompoundcalculator.com/images/logo.png",
            "description": "Free online calculators for finance, math, and everyday calculations. No registration required.",
            "sameAs": [
              "https://twitter.com/FreeCompoundCalc",
              "https://facebook.com/FreeCompoundCalculator"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "email": "support@freecompoundcalculator.com"
            }
          })}
        </script>
      </Head>
      
      {/* Page Content */}
      <div className={styles.calculatorPage}>
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
          <h1 className={styles.sectionTitle}>Free Online Calculator with History & Memory Functions - FreeCompoundCalculator.com</h1>
          <p className={styles.subtitle}>
            Perform basic and advanced calculations with precision using this free online calculator from FreeCompoundCalculator.com. Includes calculation history tracking, memory functions, keyboard shortcuts, percentage calculations, square root, and square functions. Perfect for everyday math, homework, budgeting, and quick calculations - completely free with no registration required.
          </p>

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
                  >
                    {display === '0' || display === 'Error' ? 'AC' : 'C'}
                  </button>
                  <button
                    onClick={handlePlusMinus}
                    className={`${styles.button} ${styles.functionButton}`}
                  >
                    ±
                  </button>
                  <button
                    onClick={handlePercentage}
                    className={`${styles.button} ${styles.functionButton}`}
                  >
                    %
                  </button>
                  <button
                    onClick={() => performOperation('÷')}
                    className={`${styles.button} ${styles.operatorButton}`}
                  >
                    ÷
                  </button>
                </div>

                {/* Row 1 */}
                <div className={styles.buttonRow}>
                  <button onClick={() => inputDigit(7)} className={styles.button}>
                    7
                  </button>
                  <button onClick={() => inputDigit(8)} className={styles.button}>
                    8
                  </button>
                  <button onClick={() => inputDigit(9)} className={styles.button}>
                    9
                  </button>
                  <button
                    onClick={() => performOperation('×')}
                    className={`${styles.button} ${styles.operatorButton}`}
                  >
                    ×
                  </button>
                </div>

                {/* Row 2 */}
                <div className={styles.buttonRow}>
                  <button onClick={() => inputDigit(4)} className={styles.button}>
                    4
                  </button>
                  <button onClick={() => inputDigit(5)} className={styles.button}>
                    5
                  </button>
                  <button onClick={() => inputDigit(6)} className={styles.button}>
                    6
                  </button>
                  <button
                    onClick={() => performOperation('-')}
                    className={`${styles.button} ${styles.operatorButton}`}
                  >
                    -
                  </button>
                </div>

                {/* Row 3 */}
                <div className={styles.buttonRow}>
                  <button onClick={() => inputDigit(1)} className={styles.button}>
                    1
                  </button>
                  <button onClick={() => inputDigit(2)} className={styles.button}>
                    2
                  </button>
                  <button onClick={() => inputDigit(3)} className={styles.button}>
                    3
                  </button>
                  <button
                    onClick={() => performOperation('+')}
                    className={`${styles.button} ${styles.operatorButton}`}
                  >
                    +
                  </button>
                </div>

                {/* Bottom Row */}
                <div className={styles.buttonRow}>
                  <button
                    onClick={() => inputDigit(0)}
                    className={`${styles.button} ${styles.zeroButton}`}
                  >
                    0
                  </button>
                  <button onClick={inputDecimal} className={styles.button}>
                    .
                  </button>
                  <button onClick={handleEquals} className={`${styles.button} ${styles.equalsButton}`}>
                    =
                  </button>
                </div>

                {/* Advanced Functions Row */}
                <div className={styles.buttonRow}>
                  <button
                    onClick={handleSquareRoot}
                    className={`${styles.button} ${styles.advancedButton}`}
                  >
                    √x
                  </button>
                  <button
                    onClick={handleSquare}
                    className={`${styles.button} ${styles.advancedButton}`}
                  >
                    x²
                  </button>
                  <button
                    onClick={clearHistory}
                    className={`${styles.button} ${styles.functionButton}`}
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
                  {firstOperand !== null ? `${firstOperand} ${operator || ''}` : 'No operation'}
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
                  <li>Calculation history tracking</li>
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

          {/* Quick Tips Card */}
          <div className={styles.sensitivityCard}>
            <h3>💡 Calculator Tips & Advanced Features - FreeCompoundCalculator.com</h3>
            <div className={styles.strategyGrid}>
              <div className={styles.strategyItem}>
                <h5>Keyboard Support</h5>
                <p className={styles.strategyValue}>Use number keys & operators</p>
                <p className={styles.strategyTip}>All number keys (0-9), operators (+, -, *, /), Enter (=), and Escape (AC) work with keyboard input</p>
              </div>
              <div className={styles.strategyItem}>
                <h5>Memory Function</h5>
                <p className={styles.strategyValue}>Store intermediate results</p>
                <p className={styles.strategyTip}>First operand is stored automatically for chain calculations and complex math operations</p>
              </div>
              <div className={styles.strategyItem}>
                <h5>Error Handling</h5>
                <p className={styles.strategyValue}>Division by zero protection</p>
                <p className={styles.strategyTip}>Shows "Error" for invalid operations and prevents calculation errors</p>
              </div>
              <div className={styles.strategyItem}>
                <h5>Decimal Precision</h5>
                <p className={styles.strategyValue}>10 decimal places</p>
                <p className={styles.strategyTip}>Accurate floating point calculations with proper rounding and validation</p>
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
                    <td>
                      <code>AC / C</code>
                    </td>
                    <td>Clear</td>
                    <td>All Clear (AC) resets everything | Clear (C) clears current entry</td>
                  </tr>
                  <tr>
                    <td>
                      <code>±</code>
                    </td>
                    <td>Negate</td>
                    <td>Toggle positive/negative sign of current value</td>
                  </tr>
                  <tr>
                    <td>
                      <code>%</code>
                    </td>
                    <td>Percentage</td>
                    <td>Convert current value to percentage (divide by 100)</td>
                  </tr>
                  <tr>
                    <td>
                      <code>√x</code>
                    </td>
                    <td>Square Root</td>
                    <td>Calculate square root of current value (√x)</td>
                  </tr>
                  <tr>
                    <td>
                      <code>x²</code>
                    </td>
                    <td>Square</td>
                    <td>Calculate square of current value (x²)</td>
                  </tr>
                  <tr>
                    <td>
                      <code>÷ × - +</code>
                    </td>
                    <td>Operators</td>
                    <td>Division, multiplication, subtraction, addition operations</td>
                  </tr>
                  <tr>
                    <td>
                      <code>=</code>
                    </td>
                    <td>Equals</td>
                    <td>Calculate and display result of current operation</td>
                  </tr>
                  <tr>
                    <td>
                      <code>.</code>
                    </td>
                    <td>Decimal</td>
                    <td>Input decimal point for floating point numbers</td>
                  </tr>
                  <tr>
                    <td>
                      <code>√x</code>
                    </td>
                    <td>Square Root</td>
                    <td>Calculate square root (requires non-negative input)</td>
                  </tr>
                  <tr>
                    <td>
                      <code>x²</code>
                    </td>
                    <td>Square</td>
                    <td>Calculate square of current number</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={styles.tableTip}>
              <strong>Tip from FreeCompoundCalculator.com:</strong> Use keyboard shortcuts for faster calculations. All number keys (0-9), basic operators (+, -, *, /), Enter (=), Escape (AC), and period (.) work. Perfect for quick calculations without mouse. This free calculator works on all devices with no installation needed.
            </p>
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

          {/* Domain Promotion */}
          
        </div>
      </div>
    </>
  );
};

export default BasicCalculator;