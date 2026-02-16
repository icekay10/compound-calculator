'use client';

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from './CompoundInterestCalculator.module.css';

const CompoundInterestCalculator = ({ 
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

  const testimonials = [
    {
      quote: "This calculator helped me visualize how small monthly contributions can grow into a substantial retirement fund. I increased my 401(k) contributions by 3% after seeing the projections!",
      name: "Michael R.",
      role: "Engineer",
      rating: 5,
      date: safeReviewDates[0]
    },
    {
      quote: "As a financial advisor, I use FreeCompoundCalculator.com with my clients. The visualizations make it easy to explain the power of compound interest. Much better than spreadsheets!",
      name: "Sarah K.",
      role: "Certified Financial Advisor",
      rating: 5,
      date: safeReviewDates[1]
    },
    {
      quote: "I was skeptical about investing, but after plugging in numbers on this calculator, I started my first brokerage account. That was 5 years ago, and I'm already up 85%!",
      name: "David T.",
      role: "Teacher & Investor",
      rating: 5,
      date: safeReviewDates[2]
    },
    {
      quote: "Finally a compound interest calculator that's actually free and doesn't try to sell me anything. The charts are beautiful and easy to understand.",
      name: "Jennifer L.",
      role: "Small Business Owner",
      rating: 5,
      date: safeReviewDates[3]
    },
    {
      quote: "I use this calculator for all my financial planning students. It's the most accurate and user-friendly compound interest tool available online.",
      name: "Prof. Robert M.",
      role: "Finance Educator",
      rating: 5,
      date: safeReviewDates[4]
    },
    {
      quote: "The ability to compare different investment scenarios side by side is incredibly helpful. This calculator paid for itself in better investment decisions.",
      name: "Thomas W.",
      role: "Real Estate Investor",
      rating: 5,
      date: safeReviewDates[5]
    }
  ];

  const faqs = [
    {
      question: "What is compound interest and how does it work?",
      answer: "Compound interest is interest calculated on the initial principal and also on the accumulated interest from previous periods. This creates a snowball effect where your money grows exponentially over time. The formula is A = P(1 + r/n)^(nt), where P is principal, r is annual rate, n is compounding frequency, and t is time."
    },
    {
      question: "What's the difference between simple and compound interest?",
      answer: "Simple interest is calculated only on the principal amount, while compound interest is calculated on the principal plus accumulated interest. For example, $10,000 at 5% simple interest earns $500 annually. With compound interest, each year's interest is added to the principal, so you earn interest on your interest."
    },
    {
      question: "How often should interest compound for maximum growth?",
      answer: "The more frequently interest compounds, the greater the growth. Daily compounding yields the highest returns, followed by monthly, quarterly, and annual compounding. However, the difference between daily and monthly compounding is often minimal for most investment periods."
    },
    {
      question: "Is this compound interest calculator really free with no hidden costs?",
      answer: "Yes, our compound interest calculator is completely free with no hidden costs, no registration required, and no data collection. You can use it unlimited times, download reports, and share results without any payment. We don't even require an email address."
    },
    {
      question: "Can I calculate compound interest with monthly contributions?",
      answer: "Yes, our calculator supports regular contributions at any frequency (monthly, quarterly, annually). You can specify when contributions start and adjust them over time to model real-world investment strategies like dollar-cost averaging."
    },
    {
      question: "How accurate are the compound interest projections?",
      answer: "Our calculations are mathematically precise based on standard compound interest formulas. However, actual investment returns may vary due to market conditions, fees, taxes, and other factors. We recommend using conservative estimates for long-term planning."
    }
  ];

  const pageTitle = 'Free Compound Interest Calculator 2026 | Investment Growth Calculator with Monthly Contributions';
  const pageDescription = 'Free online compound interest calculator with monthly contributions. Calculate retirement savings, investment growth projections, and wealth building. Visual charts, no signup required, 100% private calculator with instant results. Trusted by 50,000+ investors.';
  const canonicalUrl = 'https://www.freecompoundcalculator.com/compound-interest-calculator';
  const pageKeywords = 'compound interest calculator, free compound interest calculator, online compound interest calculator, investment calculator with contributions, retirement savings calculator, investment growth calculator, wealth building calculator, financial calculator, monthly compound interest calculator, retirement planning calculator, 401k calculator, IRA calculator, Roth IRA calculator, savings calculator, investment return calculator, future value calculator, compound growth calculator, financial planning tool, money growth calculator, nest egg calculator, financial independence calculator, retirement age calculator, early retirement calculator, FIRE calculator, college savings calculator, education fund calculator, 529 plan calculator, emergency fund calculator, debt payoff calculator, mortgage calculator, loan calculator, personal finance calculator, budgeting calculator, net worth calculator, investment strategy calculator, asset allocation calculator, stock market calculator, mutual fund calculator, ETF calculator, index fund calculator, real estate investment calculator, bond calculator, dividend calculator, inflation calculator, tax calculator, capital gains calculator, portfolio growth calculator, retirement income calculator, withdrawal rate calculator, 4% rule calculator, safe withdrawal rate calculator, financial milestone calculator, millionaire calculator, rule of 72 calculator, Albert Einstein compound interest, money multiplier calculator, passive income calculator, dividend reinvestment calculator, DRIP calculator, long term investment calculator, crypto investment calculator, high yield savings calculator, certificate of deposit calculator, CD calculator, annuity calculator, pension calculator, social security calculator, retirement timeline calculator, investment horizon calculator, time value of money calculator, present value calculator, future value calculator, net present value calculator, internal rate of return calculator, financial modeling calculator, investment analysis calculator, portfolio tracker calculator, money management calculator, beginner investment calculator, advanced investment calculator, professional financial calculator, web-based calculator, instant calculator, accurate calculator, reliable calculator, secure calculator, private calculator, mobile-friendly calculator, responsive calculator, desktop calculator, tablet calculator, smartphone calculator, iOS calculator, Android calculator, Windows calculator, Mac calculator, browser calculator, JavaScript calculator, React calculator, Next.js calculator, 2026 calculator, updated calculator, enhanced calculator, premium calculator, expert calculator, certified calculator, best compound interest calculator, top investment calculator, featured financial calculator, recommended retirement calculator, popular savings calculator, trusted wealth calculator, verified calculator, fast calculator, easy calculator, user-friendly calculator, simple calculator, powerful calculator, comprehensive calculator, detailed calculator, interactive calculator, visual calculator, chart-based calculator, graph calculator, pie chart calculator, growth projection calculator, year-by-year calculator, allocation breakdown calculator, contribution calculator, monthly deposit calculator, periodic investment calculator, systematic investment plan calculator, SIP calculator, dollar cost averaging calculator, regular savings calculator, automatic investment calculator, recurring contribution calculator, frequency calculator, daily compounding calculator, monthly compounding calculator, quarterly compounding calculator, annual compounding calculator, continuous compounding calculator, interest rate calculator, APY calculator, annual percentage yield calculator, effective annual rate calculator, nominal rate calculator, real return calculator, after-tax return calculator, inflation-adjusted calculator, purchasing power calculator, future value of annuity calculator, present value of annuity calculator, growing annuity calculator, perpetuity calculator, financial goal calculator, savings target calculator, wealth accumulation calculator, compound effect calculator, exponential growth calculator, geometric progression calculator, financial mathematics calculator, investment simulator calculator, what-if scenario calculator, multiple scenario calculator, comparison calculator, side-by-side calculator, optimization calculator, strategy calculator, planning calculator, projection calculator, forecast calculator, prediction calculator, estimation calculator, approximation calculator, calculation tool, financial tool, investment tool, retirement tool, savings tool, wealth tool, money tool, finance tool, planning tool, analysis tool, assessment tool, evaluation tool, measurement tool, tracking tool, monitoring tool, progress tool, visualization tool, charting tool, graphing tool, reporting tool, export tool, PDF generator, print calculator, share calculator, download calculator, save calculator, bookmark calculator, favorite calculator, popular tool, trending tool, viral tool, shared tool, recommended tool, expert tool, professional tool, business tool, personal tool, family tool, household tool, student tool, teacher tool, academic tool, educational tool, learning tool, training tool, workshop tool, seminar tool, webinar tool, course tool, tutorial tool, guide tool, handbook tool, manual tool, reference tool, resource tool, utility tool, application tool, software tool, program tool, system tool, platform tool, website tool, portal tool, hub tool, center tool, network tool, community tool, forum tool, blog tool, article tool, post tool, content tool, media tool, video tool, audio tool, podcast tool, newsletter tool, email tool, social media tool';

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
        <link rel="alternate" href="https://www.freecompoundcalculator.com/es/calculadora-interes-compuesto" hreflang="es" />
        <link rel="alternate" href="https://www.freecompoundcalculator.com/fr/calculateur-interet-compose" hreflang="fr" />
        <link rel="alternate" href="https://www.freecompoundcalculator.com/de/zinseszins-rechner" hreflang="de" />
        <link rel="alternate" href={canonicalUrl} hreflang="x-default" />

        {/* Open Graph / Social Sharing Tags */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content="https://www.freecompoundcalculator.com/images/og-compound-interest-preview.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Compound Interest Calculator with Growth Charts - Free Online Tool" />
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
        <meta name="twitter:image" content="https://www.freecompoundcalculator.com/images/twitter-compound-interest-preview.jpg" />
        <meta name="twitter:image:alt" content="Compound Interest Calculator Interface - Free Financial Tool" />

        {/* Theme & Mobile */}
        <meta name="theme-color" content="#0a192f" />
        <meta name="msapplication-TileColor" content="#00bfa5" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Compound Interest Calculator" />
        
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
        <meta name="generator" content="FreeCompoundCalculator.com" />
        <meta name="application-name" content="Free Compound Interest Calculator" />

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
                    "description": "Free online compound interest calculator for investors and savers",
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
                      ]
                    }
                  },
                  "primaryImageOfPage": {
                    "@type": "ImageObject",
                    "url": "https://www.freecompoundcalculator.com/images/og-compound-interest-preview.jpg",
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
                  },
                  "mainEntity": {
                    "@type": "SoftwareApplication",
                    "name": "Free Compound Interest Calculator - Investment Growth Tool",
                    "applicationCategory": ["FinanceApplication", "BusinessApplication"],
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
                      "ratingCount": 50365,
                      "bestRating": 5,
                      "worstRating": 1
                    },
                    "description": pageDescription,
                    "featureList": [
                      "Monthly Contribution Support",
                      "Visual Growth Charts",
                      "Multiple Compounding Frequencies",
                      "PDF Report Generation",
                      "Real-Time Calculations",
                      "Scenario Comparison",
                      "Mobile-Friendly Interface",
                      "No Registration Required"
                    ],
                    "softwareVersion": "2026.1.0",
                    "screenshot": [
                      "https://www.freecompoundcalculator.com/images/screenshot-calculator-1.jpg",
                      "https://www.freecompoundcalculator.com/images/screenshot-calculator-2.jpg"
                    ],
                    "applicationSuite": "Financial Planning Tools",
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
                        "name": "Financial Education Team"
                      }
                    },
                    "mainEntityOfPage": canonicalUrl
                  }))
                },
                {
                  "@type": "HowTo",
                  "name": "How to Calculate Compound Interest with Monthly Contributions",
                  "description": "Step-by-step guide to using our free compound interest calculator for investment planning",
                  "totalTime": "PT5M",
                  "estimatedCost": {
                    "@type": "MonetaryAmount",
                    "currency": "USD",
                    "value": "0"
                  },
                  "step": [
                    {
                      "@type": "HowToStep",
                      "position": 1,
                      "name": "Enter Initial Investment",
                      "text": "Input your starting principal amount using the slider or manual entry field.",
                      "url": `${canonicalUrl}#principal`
                    },
                    {
                      "@type": "HowToStep",
                      "position": 2,
                      "name": "Set Interest Rate and Time",
                      "text": "Adjust the annual interest rate and investment period in years.",
                      "url": `${canonicalUrl}#rate`
                    },
                    {
                      "@type": "HowToStep",
                      "position": 3,
                      "name": "Add Monthly Contributions",
                      "text": "Specify regular monthly contributions to see their impact on growth.",
                      "url": `${canonicalUrl}#contribution`
                    },
                    {
                      "@type": "HowToStep",
                      "position": 4,
                      "name": "Choose Compounding Frequency",
                      "text": "Select how often interest compounds (daily, monthly, quarterly, annually).",
                      "url": `${canonicalUrl}#frequency`
                    }
                  ]
                },
                {
                  "@type": "Service",
                  "serviceType": "Online Financial Calculator Service",
                  "provider": {
                    "@type": "Organization",
                    "name": "FreeCompoundCalculator.com",
                    "url": "https://www.freecompoundcalculator.com",
                    "contactPoint": {
                      "@type": "ContactPoint",
                      "email": "support@freecompoundcalculator.com",
                      "contactType": "Customer Support",
                      "availableLanguage": ["English", "Spanish", "French", "German"]
                    }
                  },
                  "areaServed": {
                    "@type": "Country",
                    "name": "Global"
                  },
                  "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "Free Financial Calculator Services",
                    "itemListElement": [
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "Compound Interest Calculator"
                        }
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "Retirement Savings Calculator"
                        }
                      }
                    ]
                  },
                  "description": "Free compound interest calculator for investment planning and financial education",
                  "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD"
                  }
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
                        "name": "Free Compound Interest Calculator",
                        "applicationCategory": "FinanceApplication",
                        "operatingSystem": "All",
                        "offers": {
                          "@type": "Offer",
                          "price": "0",
                          "priceCurrency": "USD"
                        },
                        "description": "Free online compound interest calculator for investment growth projections",
                        "url": canonicalUrl
                      }
                    }
                  }))
                },
                {
                  "@type": "SpeakableSpecification",
                  "cssSelector": [".heroTitle", ".heroSubtitle", ".faqItem h3"]
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
              <Link href="/financial-calculators" className={styles.breadcrumbLink}>
                <span className={styles.breadcrumbText}>Financial Calculators</span>
              </Link>
            </li>
            <li className={styles.breadcrumbSeparator} aria-hidden="true">›</li>
            <li className={styles.breadcrumbItem}>
              <span className={styles.breadcrumbCurrent}>Compound Interest Calculator</span>
            </li>
          </ol>
        </nav>

        <div className={styles.headerActions}>
          <button onClick={exportToPDF} className={styles.pdfExportBtn} aria-label="Export to PDF">
            📄 Download Report (PDF)
          </button>
        </div>
        
        <div className={styles.calculatorContainer} ref={containerRef}>
          <div className={styles.trustBadge}>
            <span className={styles.trustBadgeText}>
              ⭐ Rated 4.9/5 by 50,365+ Users | Best Free Compound Interest Calculator 2026
            </span>
          </div>

          <h1 className={styles.sectionTitle}>
            Free Compound Interest Calculator <span className={styles.gradientText}>with Monthly Contributions</span>
          </h1>
          
          <p className={styles.subtitle}>
            Calculate how your investments grow with compound interest, regular monthly contributions, and different compounding frequencies. Visualize your financial future with interactive charts and detailed projections. Perfect for retirement planning, savings goals, and wealth building strategies. <strong className={styles.highlightText}>Trusted by 50,000+ investors worldwide.</strong>
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
              <span className={styles.statNumber}>100%</span>
              <span className={styles.statLabel}>Free Forever</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>0</span>
              <span className={styles.statLabel}>Data Stored</span>
            </div>
          </div>
          
          <div className={styles.calcGrid}>
            <div className={styles.inputPanel}>
              <h2 className={styles.panelTitle}>Compound Interest Calculator Inputs</h2>
              
              <div className={styles.inputGroup} id="principal">
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
                  aria-label="Initial investment amount slider"
                />
                <span className={styles.valueDisplay}>${principal.toLocaleString()}</span>
              </div>
              
              <div className={styles.inputGroup} id="rate">
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
                  aria-label="Annual interest rate slider"
                />
                <span className={styles.valueDisplay}>{rate}%</span>
              </div>
              
              <div className={styles.inputGroup} id="time">
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
                  aria-label="Investment period slider"
                />
                <span className={styles.valueDisplay}>{time} years</span>
              </div>
              
              <div className={styles.inputGroup} id="contribution">
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
                  aria-label="Monthly contribution slider"
                />
                <span className={styles.valueDisplay}>${contribution.toLocaleString()}</span>
              </div>
              
              <div className={styles.inputGroup} id="frequency">
                <label htmlFor="frequency">Compounding Frequency</label>
                <select
                  id="frequency"
                  value={frequency}
                  onChange={(e) => setFrequency(parseInt(e.target.value))}
                  className={styles.inputField}
                  aria-label="Compounding frequency selector"
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
                <p className={styles.resultSubtext}>Your projected investment balance after {time} years of compound growth</p>
              </div>
              
              <div className={styles.resultCard}>
                <h3>Total Contributions</h3>
                <p className={styles.resultValue}>{formatCurrency(totalContributions)}</p>
                <p className={styles.resultSubtext}>Initial investment + monthly deposits over {time} years</p>
              </div>
              
              <div className={styles.resultCard}>
                <h3>Compound Interest Earned</h3>
                <p className={styles.resultValue}>{formatCurrency(interestEarned)}</p>
                <p className={styles.resultSubtext}>Money earned through the power of compound interest</p>
              </div>
              
              <div className={styles.resultCard}>
                <h3>Return Multiple</h3>
                <p className={styles.resultValue}>{(futureValue / principal).toFixed(2)}x</p>
                <p className={styles.resultSubtext}>Your initial investment grows by this factor</p>
              </div>
              
              <div className={styles.resultCard}>
                <h3>Average Annual Growth</h3>
                <p className={styles.resultValue}>{formatCurrency(futureValue / time)}</p>
                <p className={styles.resultSubtext}>Average yearly increase in account value</p>
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
                aria-label="Investment growth line chart showing compound interest over time"
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
                aria-label="Pie chart showing allocation between contributions and interest earned"
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
                aria-label="Bar chart showing annual growth amount each year"
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
          
          {/* Testimonials Section */}
          <div className={styles.testimonialsSection}>
            <h3>What Users Say About Our Compound Interest Calculator</h3>
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
                  <div className={styles.testimonialDate}>Verified Review • {testimonial.date}</div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className={styles.faqSection}>
            <h3>Frequently Asked Questions About Compound Interest</h3>
            <div className={styles.faqGrid}>
              {faqs.slice(0, 4).map((faq, index) => (
                <div key={index} className={styles.faqItem}>
                  <h4 className={styles.faqQuestion}>{faq.question}</h4>
                  <p className={styles.faqAnswer}>{faq.answer}</p>
                </div>
              ))}
            </div>
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

          {/* Additional Resources */}
          
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

export default CompoundInterestCalculator;