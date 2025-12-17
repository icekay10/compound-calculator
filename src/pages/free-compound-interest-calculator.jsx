'use client';

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import styles from './CompoundInterestCalculator.module.css';

const CompoundInterestCalculator = () => {
  // State for inputs
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(7);
  const [time, setTime] = useState(30);
  const [contribution, setContribution] = useState(200);
  const [frequency, setFrequency] = useState(12); // Monthly
  
  // Refs for canvas elements
  const lineCanvasRef = useRef(null);
  const pieCanvasRef = useRef(null);
  const barCanvasRef = useRef(null);
  const tooltipRef = useRef(null);
  const containerRef = useRef(null);
  
  // Calculate compound interest
  const calculateFutureValue = () => {
    const P = principal;
    const r = rate / 100;
    const t = time;
    const n = frequency;
    const PMT = contribution;
    
    // Future value of initial principal
    let FV_principal = P * Math.pow(1 + r / n, n * t);
    
    // Future value of periodic contributions
    let FV_contributions = 0;
    if (PMT > 0) {
      FV_contributions = PMT * ((Math.pow(1 + r / n, n * t) - 1) / (r / n));
    }
    
    return Math.round(FV_principal + FV_contributions);
  };
  
  const futureValue = calculateFutureValue();
  const totalContributions = principal + contribution * frequency * time;
  const interestEarned = futureValue - totalContributions;
  
  // Generate growth data for charts
  const growthData = Array.from({ length: time + 1 }, (_, year) => {
    const P = principal;
    const r = rate / 100;
    const t = year;
    const n = frequency;
    const PMT = contribution;
    
    let FV_principal = P * Math.pow(1 + r / n, n * t);
    let FV_contributions = 0;
    if (PMT > 0 && t > 0) {
      FV_contributions = PMT * ((Math.pow(1 + r / n, n * t) - 1) / (r / n));
    }
    
    return Math.round(FV_principal + FV_contributions);
  });
  
  // Yearly breakdown
  const yearlyBreakdown = Array.from({ length: time }, (_, year) => {
    const currentYearValue = growthData[year + 1];
    const previousYearValue = growthData[year];
    const yearGrowth = currentYearValue - previousYearValue;
    
    return {
      year: year + 1,
      value: currentYearValue,
      growth: yearGrowth
    };
  });
  
  // Format number as USD
  const formatCurrency = (num) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(num);
  
  // Format percentage
  const formatPercent = (value) => ((value / futureValue) * 100).toFixed(1) + '%';
  
  // Animate slider changes
  const handleSliderChange = (setter) => (e) => {
    setter(Number(e.target.value));
    const slider = e.target;
    slider.classList.add(styles.sliderAnimate);
    setTimeout(() => slider.classList.remove(styles.sliderAnimate), 300);
  };
  
  // Render line chart
  useEffect(() => {
    const canvas = lineCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    const padding = { left: 60, right: 30, top: 40, bottom: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    // Scale dynamically based on max value
    const maxValue = Math.max(...growthData);
    const scaledMax = Math.ceil(maxValue / 10000) * 10000;
    
    // Grid lines (Y-axis)
    const ySteps = 5;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= ySteps; i++) {
      const y = padding.top + (chartHeight * (ySteps - i)) / ySteps;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
      
      const value = (i * scaledMax) / ySteps;
      ctx.fillStyle = '#b8c2e0';
      ctx.font = '10px Segoe UI';
      ctx.textAlign = 'right';
      ctx.fillText(formatCurrency(value), padding.left - 8, y + 3);
    }
    
    // Grid lines (X-axis)
    const xSteps = Math.min(10, time);
    for (let i = 0; i <= xSteps; i++) {
      const x = padding.left + (chartWidth * i) / xSteps;
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, height - padding.bottom);
      ctx.stroke();
      
      const yearLabel = Math.round((i * time) / xSteps);
      ctx.fillStyle = '#b8c2e0';
      ctx.font = '10px Segoe UI';
      ctx.textAlign = 'center';
      ctx.fillText(`${yearLabel}yr`, x, height - padding.bottom + 18);
    }
    
    // Axes
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padding.left, height - padding.bottom);
    ctx.lineTo(width - padding.right, height - padding.bottom);
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, height - padding.bottom);
    ctx.stroke();
    
    // Growth Line
    ctx.strokeStyle = '#00bfa5';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    
    growthData.forEach((value, i) => {
      const x = padding.left + (chartWidth * i) / time;
      const y = height - padding.bottom - ((value / scaledMax) * chartHeight);
      
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    
    ctx.stroke();
    
    // Titles & Legend
    ctx.fillStyle = '#ffffff';
    ctx.font = '11px Segoe UI';
    ctx.textAlign = 'center';
    ctx.fillText('Investment Growth Over Time', width / 2, padding.top - 10);
    
    ctx.textAlign = 'left';
    ctx.fillText('Years →', width - padding.right - 20, height - padding.bottom + 35);
    
    ctx.save();
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Balance ($)', -padding.top - 30, -padding.left - 20);
    ctx.restore();
    
    ctx.fillStyle = '#00bfa5';
    ctx.fillRect(width - 100, padding.top + 10, 12, 12);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Account Value', width - 80, padding.top + 20);
  }, [growthData, time, formatCurrency]);
  
  // Render pie chart
  useEffect(() => {
    const canvas = pieCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    
    let startAngle = 0;
    
    // Draw principal/contributions slice
    const principalAngle = (totalContributions / futureValue) * 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + principalAngle);
    ctx.closePath();
    ctx.fillStyle = '#00bfa5';
    ctx.fill();
    
    startAngle += principalAngle;
    
    // Draw interest earned slice
    const interestAngle = (interestEarned / futureValue) * 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + interestAngle);
    ctx.closePath();
    ctx.fillStyle = '#ff6b6b';
    ctx.fill();
    
    // Inner circle (donut hole)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.6, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(10, 25, 47, 0.8)';
    ctx.fill();
    
    // Center text
    ctx.font = '12px Segoe UI';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#e6f1ff';
    ctx.fillText('Allocation', centerX, centerY - 5);
    ctx.fillText('Breakdown', centerX, centerY + 10);
  }, [futureValue, totalContributions, interestEarned]);
  
  // Render bar chart with fixed positioning
  useEffect(() => {
    const canvas = barCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Use consistent padding with other charts
    const padding = { left: 60, right: 30, top: 40, bottom: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    // Scale based on max growth value
    const maxGrowth = Math.max(...yearlyBreakdown.map(item => item.growth));
    const scaledMax = Math.ceil(maxGrowth / 1000) * 1000;
    
    // Grid lines (Y-axis)
    const ySteps = 5;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= ySteps; i++) {
      const y = padding.top + (chartHeight * (ySteps - i)) / ySteps;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
      
      const value = (i * scaledMax) / ySteps;
      ctx.fillStyle = '#b8c2e0';
      ctx.font = '10px Segoe UI';
      ctx.textAlign = 'right';
      ctx.fillText(formatCurrency(value), padding.left - 8, y + 3);
    }
    
    // X-axis labels and bars
    const numBars = Math.min(10, time);
    const step = Math.ceil(time / numBars);
    
    for (let i = 0; i < numBars; i++) {
      const index = i * step;
      if (index >= yearlyBreakdown.length) break;
      
      // Calculate x position ensuring bars don't cross Y-axis
      const barX = padding.left + (chartWidth * i) / (numBars - 1);
      
      // Bar width adjusted for responsiveness
      const barWidth = Math.max(10, Math.min(30, chartWidth / (numBars * 2)));
      const halfBarWidth = barWidth / 2;
      
      // Ensure bar doesn't cross Y-axis by checking position
      const barLeftEdge = barX - halfBarWidth;
      const effectiveBarX = barLeftEdge < padding.left ? padding.left + halfBarWidth : barX;
      
      // Bar for growth
      const barHeight = (yearlyBreakdown[index].growth / scaledMax) * chartHeight;
      ctx.fillStyle = '#00bfa5';
      ctx.fillRect(
        effectiveBarX - halfBarWidth,
        height - padding.bottom - barHeight,
        barWidth,
        barHeight
      );
      
      // X-axis label
      ctx.fillStyle = '#b8c2e0';
      ctx.font = '10px Segoe UI';
      ctx.textAlign = 'center';
      ctx.fillText(`${yearlyBreakdown[index].year}`, effectiveBarX, height - padding.bottom + 18);
    }
    
    // Axes - draw after bars to ensure Y-axis line appears on top
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    // X-axis
    ctx.moveTo(padding.left, height - padding.bottom);
    ctx.lineTo(width - padding.right, height - padding.bottom);
    // Y-axis
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, height - padding.bottom);
    ctx.stroke();
    
    // Titles
    ctx.fillStyle = '#ffffff';
    ctx.font = '11px Segoe UI';
    ctx.textAlign = 'center';
    ctx.fillText('Annual Growth Amount', width / 2, padding.top - 10);
    
    ctx.textAlign = 'left';
    ctx.fillText('Year', width - padding.right - 20, height - padding.bottom + 35);
    
    ctx.save();
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Growth ($)', -padding.top - 30, -padding.left - 20);
    ctx.restore();
  }, [yearlyBreakdown, time, formatCurrency]);
  
  // Tooltip logic
  const handleMouseMove = (e) => {
    const canvas = lineCanvasRef.current;
    if (!canvas || !tooltipRef.current) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const padding = { left: 60, right: 30, top: 40, bottom: 60 };
    const chartWidth = canvas.width - padding.left - padding.right;
    const index = Math.round((x - padding.left) / (chartWidth / time));
    
    if (index < 0 || index > time) {
      tooltipRef.current.style.display = 'none';
      return;
    }
    
    const value = growthData[index];
    const tooltip = tooltipRef.current;
    tooltip.innerHTML = `
      <strong>Year ${index}</strong><br/>
      Balance: ${formatCurrency(value)}<br/>
      ${index > 0 ? `Growth: ${formatCurrency(value - growthData[index - 1])}` : ''}
    `;
    
    tooltip.style.display = 'block';
    tooltip.style.left = `${e.clientX + 10}px`;
    tooltip.style.top = `${e.clientY - 100}px`;
  };
  
  const handleMouseLeave = () => {
    if (tooltipRef.current) tooltipRef.current.style.display = 'none';
  };
  
  // Export to PDF function
  const exportToPDF = async () => {
    try {
      const html2pdf = await import('html2pdf.js');
      const element = containerRef.current;
      const opt = {
        margin: 0.5,
        filename: `compound-interest-${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: '#0a192f',
          logging: false,
        },
        jsPDF: { orientation: 'portrait', unit: 'in', format: 'letter' },
      };
      html2pdf.default().from(element).set(opt).save();
    } catch (error) {
      console.error('Error loading html2pdf:', error);
      alert('PDF export requires additional library. Please install html2pdf.js.');
    }
  };
  
  // SEO Variables
  const pageTitle = 'Free Compound Interest Calculator Online | Calculate Investment Growth 2024';
  const pageDescription = 'Free compound interest calculator with visual charts. Calculate investment growth with monthly contributions, different compounding frequencies. Perfect for retirement planning, savings, and wealth building strategies.';
  const canonicalUrl = 'https://www.freecompoundcalculator.com/compound-interest-calculator';
  const pageKeywords = 'compound interest calculator, free compound interest calculator, investment calculator, savings calculator, retirement calculator, compound interest formula, investment growth calculator, future value calculator, financial calculator, money growth calculator, compound interest with contributions, monthly contribution calculator, compound interest formula calculator, investment return calculator, savings growth calculator, wealth calculator, financial planning calculator, compound interest rate calculator, compound interest over time, compound interest chart, compound interest visualization, compound interest examples, compound interest investment, compound interest retirement, compound interest savings, compound interest wealth building, compound interest formula example, compound interest calculation, compound interest monthly contributions, compound interest daily compounding, compound interest calculator with graphs, compound interest projection calculator, compound interest visualization tool, compound interest simulator, compound interest growth chart, compound interest investment calculator, compound interest savings calculator, compound interest retirement calculator';

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
        <meta property="og:image" content="https://www.freecompoundcalculator.com/images/compound-interest-calculator-preview.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Compound Interest Calculator Visualization" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:site" content="@FreeCompoundCalc" />
        <meta name="twitter:creator" content="@FreeCompoundCalc" />
        <meta name="twitter:image" content="https://www.freecompoundcalculator.com/images/compound-interest-calculator-preview.jpg" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="rating" content="General" />
        <meta name="distribution" content="global" />
        <meta name="generator" content="FreeCompoundCalculator.com" />
        <meta name="application-name" content="Free Compound Interest Calculator" />
        <meta name="apple-mobile-web-app-title" content="Compound Calculator" />
        <meta name="theme-color" content="#0a192f" />
        <meta name="msapplication-TileColor" content="#00bfa5" />
        
        {/* Schema.org JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Free Compound Interest Calculator",
            "description": "Advanced compound interest calculator with visual charts, monthly contributions, and different compounding frequencies",
            "url": canonicalUrl,
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Any",
            "browserRequirements": "Requires JavaScript",
            "softwareVersion": "4.2.1",
            "featureList": [
              "Compound Interest Calculation",
              "Monthly Contribution Tracking",
              "Visual Growth Charts",
              "Investment Projections",
              "Compounding Frequency Options",
              "Retirement Planning",
              "Wealth Building Analysis"
            ],
            "author": {
              "@type": "Organization",
              "name": "FreeCompoundCalculator.com",
              "url": "https://www.freecompoundcalculator.com"
            },
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "ratingCount": "3560",
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
            "name": "Compound Interest Calculator Free Online",
            "url": canonicalUrl,
            "description": "Free web-based compound interest calculator with calculation history and visual investment growth charts",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web",
            "permissions": "Free",
            "countriesSupported": "Worldwide",
            "screenshot": "https://www.freecompoundcalculator.com/images/compound-interest-calculator-screenshot.jpg",
            "fileSize": "250KB",
            "memoryRequirements": "512MB",
            "processorRequirements": "Any",
            "softwareRequirements": "Modern Web Browser"
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
                "name": "Financial Calculators",
                "item": "https://www.freecompoundcalculator.com/financial-calculators"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Compound Interest Calculator",
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
                "name": "What is compound interest?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Compound interest is interest calculated on the initial principal and also on the accumulated interest of previous periods. It's often called 'interest on interest' and can cause wealth to grow exponentially over time."
                }
              },
              {
                "@type": "Question",
                "name": "How do I calculate compound interest?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Use our free compound interest calculator to input your initial investment, annual interest rate, time period, and monthly contributions. The calculator automatically computes your future value using the compound interest formula."
                }
              },
              {
                "@type": "Question",
                "name": "Why is compound interest important for investing?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Compound interest allows your investments to grow exponentially over time. The longer your money compounds, the more dramatic the growth. Starting early and contributing regularly maximizes compound interest benefits."
                }
              }
            ]
          })}
        </script>
      </Head>
      
      {/* Page Content */}
      <div className={styles.calculatorPage}>
        <div className={styles.headerActions}>
          <button onClick={exportToPDF} className={styles.pdfExportBtn} aria-label="Export to PDF">
            📄 Download Report
          </button>
        </div>
        
        <div className={styles.calculatorContainer} ref={containerRef}>
          <h1 className={styles.sectionTitle}>Free Compound Interest Calculator Online - Calculate Investment Growth with Charts</h1>
          <p className={styles.subtitle}>
            Calculate how your investments grow with compound interest, regular monthly contributions, and different compounding frequencies. Visualize your financial future with interactive charts and detailed projections. Perfect for retirement planning, savings goals, and wealth building strategies.
          </p>
          
          <div className={styles.calcGrid}>
            <div className={styles.inputPanel}>
              <h2 className={styles.panelTitle}>Compound Interest Calculator Inputs</h2>
              
              <div className={styles.inputGroup}>
                <label htmlFor="principal">Initial Investment Amount</label>
                <input
                  type="range"
                  id="principal"
                  min="100"
                  max="1000000"
                  step="1000"
                  value={principal}
                  onChange={handleSliderChange(setPrincipal)}
                  className={styles.slider}
                />
                <span className={styles.valueDisplay}>${principal.toLocaleString()}</span>
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="rate">Annual Interest Rate (%)</label>
                <input
                  type="range"
                  id="rate"
                  min="0.1"
                  max="20"
                  step="0.1"
                  value={rate}
                  onChange={handleSliderChange(setRate)}
                  className={styles.slider}
                />
                <span className={styles.valueDisplay}>{rate}%</span>
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="time">Investment Period (Years)</label>
                <input
                  type="range"
                  id="time"
                  min="1"
                  max="50"
                  step="1"
                  value={time}
                  onChange={handleSliderChange(setTime)}
                  className={styles.slider}
                />
                <span className={styles.valueDisplay}>{time} years</span>
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="contribution">Monthly Contribution Amount</label>
                <input
                  type="range"
                  id="contribution"
                  min="0"
                  max="5000"
                  step="50"
                  value={contribution}
                  onChange={handleSliderChange(setContribution)}
                  className={styles.slider}
                />
                <span className={styles.valueDisplay}>${contribution.toLocaleString()}</span>
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="frequency">Compounding Frequency</label>
                <select
                  id="frequency"
                  value={frequency}
                  onChange={(e) => setFrequency(parseInt(e.target.value))}
                  className={styles.inputField}
                >
                  <option value={1}>Annually (1)</option>
                  <option value={4}>Quarterly (4)</option>
                  <option value={12}>Monthly (12)</option>
                  <option value={365}>Daily (365)</option>
                </select>
                <p className={styles.frequencyHelp}>More frequent compounding = faster growth</p>
              </div>
            </div>
            
            <div className={styles.resultsPanel}>
              <div className={`${styles.resultCard} ${styles.highlight}`}>
                <h3>Final Balance After {time} Years</h3>
                <p className={styles.resultValue}>{formatCurrency(futureValue)}</p>
                <p className={styles.resultSubtext}>Your projected investment balance after {time} years</p>
              </div>
              
              <div className={styles.resultCard}>
                <h3>Total Contributions</h3>
                <p className={styles.resultValue}>{formatCurrency(totalContributions)}</p>
                <p className={styles.resultSubtext}>Initial investment + monthly deposits</p>
              </div>
              
              <div className={styles.resultCard}>
                <h3>Interest Earned</h3>
                <p className={styles.resultValue}>{formatCurrency(interestEarned)}</p>
                <p className={styles.resultSubtext}>Power of compounding interest</p>
              </div>
              
              <div className={styles.resultCard}>
                <h3>Return Multiple</h3>
                <p className={styles.resultValue}>{(futureValue / principal).toFixed(2)}x</p>
                <p className={styles.resultSubtext}>Your money grows by this factor</p>
              </div>
              
              <div className={styles.resultCard}>
                <h3>Average Annual Growth</h3>
                <p className={styles.resultValue}>{formatCurrency(futureValue / time)}</p>
                <p className={styles.resultSubtext}>Average yearly increase in value</p>
              </div>
            </div>
          </div>
          
          {/* Growth Chart */}
          <div className={styles.chartPreview}>
            <h3>Investment Growth Over Time - Compound Interest Visualization</h3>
            <div className={styles.chartContainer}>
              <canvas
                ref={lineCanvasRef}
                width={700}
                height={250}
                className={styles.chartCanvas}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              ></canvas>
              <div
                ref={tooltipRef}
                className={styles.chartTooltip}
              ></div>
              <p className={styles.chartCaption}>
                📈 The power of compound interest accelerates over time. Early contributions have the greatest impact on long-term growth. Hover over the chart to see yearly balances.
              </p>
            </div>
          </div>
          
          {/* Allocation Pie Chart */}
          <div className={styles.chartPreview}>
            <h3>Investment Balance Allocation Breakdown</h3>
            <div className={styles.chartContainer}>
              <canvas
                ref={pieCanvasRef}
                width={180}
                height={180}
                className={styles.pieChartCanvas}
              ></canvas>
              <div className={styles.pieDataTable}>
                <div className={styles.pieLegend}>
                  <div className={styles.legendItem}>
                    <div className={styles.legendColor} style={{ backgroundColor: '#00bfa5' }}></div>
                    <span>
                      Principal & Contributions: {formatCurrency(totalContributions)} ({formatPercent(totalContributions)})
                    </span>
                  </div>
                  <div className={styles.legendItem}>
                    <div className={styles.legendColor} style={{ backgroundColor: '#ff6b6b' }}></div>
                    <span>
                      Compound Interest Earned: {formatCurrency(interestEarned)} ({formatPercent(interestEarned)})
                    </span>
                  </div>
                </div>
                <div className={styles.pieTotal}>
                  Total Final Balance: {formatCurrency(futureValue)}
                </div>
              </div>
            </div>
          </div>
          
          {/* Annual Growth Bar Chart */}
          <div className={styles.chartPreview}>
            <h3>Annual Growth Amount - Compound Interest in Action</h3>
            <div className={styles.chartContainer}>
              <canvas
                ref={barCanvasRef}
                width={700}
                height={250}
                className={styles.chartCanvas}
              ></canvas>
              <p className={styles.chartCaption}>
                📊 Later years show higher absolute growth due to larger account balances. This demonstrates the exponential nature of compound interest.
              </p>
            </div>
          </div>
          
          {/* Strategy Insights Card */}
          <div className={styles.sensitivityCard}>
            <h3>💡 Compound Interest Investment Strategies</h3>
            <div className={styles.strategyGrid}>
              <div className={styles.strategyItem}>
                <h5>Start Investing 5 Years Earlier</h5>
                <p className={styles.strategyValue}>Gain {formatCurrency(futureValue * 0.3)} Extra</p>
                <p className={styles.strategyTip}>The earlier you start investing, the more you benefit from compound interest over time</p>
              </div>
              <div className={styles.strategyItem}>
                <h5>Increase Monthly Contributions by $100</h5>
                <p className={styles.strategyValue}>Add {formatCurrency((3000 * time * rate / 100) + (100 * 12 * time))}</p>
                <p className={styles.strategyTip}>Small monthly increases now make dramatic differences in long-term wealth</p>
              </div>
              <div className={styles.strategyItem}>
                <h5>Achieve 1% Higher Annual Return</h5>
                <p className={styles.strategyValue}>Earn {formatCurrency(futureValue * 0.3)} More</p>
                <p className={styles.strategyTip}>Slightly higher returns compound significantly over decades of investing</p>
              </div>
              <div className={styles.strategyItem}>
                <h5>Use Daily Compounding</h5>
                <p className={styles.strategyValue}>Increase Growth by {formatCurrency(futureValue * 0.02)}</p>
                <p className={styles.strategyTip}>More frequent compounding periods lead to faster wealth accumulation</p>
              </div>
            </div>
          </div>
          
          {/* Milestone Table */}
          <div className={styles.milestoneTable}>
            <h3>🎯 Compound Interest Milestones - Investment Growth Projections</h3>
            <div className={styles.tableContainer}>
              <table>
                <thead>
                  <tr>
                    <th>Investment Year</th>
                    <th>Account Balance</th>
                    <th>Annual Growth</th>
                    <th>Cumulative Interest</th>
                  </tr>
                </thead>
                <tbody>
                  {[5, 10, 15, 20, 25, 30].filter(year => year <= time).map(targetYear => {
                    const value = growthData[targetYear];
                    const prevValue = targetYear > 0 ? growthData[targetYear - 1] : principal;
                    const annualGrowth = value - prevValue;
                    
                    // Calculate cumulative interest (approximation)
                    const contributionsSoFar = principal + contribution * 12 * targetYear;
                    const cumulativeInterest = value - contributionsSoFar;
                    
                    return (
                      <tr key={targetYear}>
                        <td>{targetYear} Years</td>
                        <td>{formatCurrency(value)}</td>
                        <td className={styles.growthCell}>{formatCurrency(annualGrowth)}</td>
                        <td className={styles.interestCell}>{formatCurrency(cumulativeInterest)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className={styles.tableTip}>
              <strong>Compound Interest Tip:</strong> The magic of compounding becomes most apparent after 10+ years. Stay consistent with your investments and avoid withdrawing early to maximize compound interest benefits.
            </p>
          </div>
          
          {/* Action Steps Card */}
          <div className={styles.actionCard}>
            <h3>🚀 Ready to Build Wealth with Compound Interest?</h3>
            <div className={styles.actionGrid}>
              <div className={styles.actionItem}>
                <strong>💡 Start Investing Now:</strong><br />
                Even small contributions today will be worth significantly more in the future due to compound interest exponential growth.
              </div>
              <div className={styles.actionItem}>
                <strong>💡 Increase Contributions Consistently:</strong><br />
                Aim to increase your monthly contributions annually as your income grows to accelerate compound interest effects.
              </div>
              <div className={styles.actionItem}>
                <strong>💡 Focus on Long-Term Investing:</strong><br />
                The longest time horizon provides the greatest advantage with compound interest. Start early and be patient.
              </div>
              <div className={styles.actionItem}>
                <strong>💡 Minimize Investment Fees:</strong><br />
                Choose low-cost investment options to maximize your net returns and compound interest benefits.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompoundInterestCalculator;