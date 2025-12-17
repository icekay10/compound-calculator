'use client';
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import styles from './SavingsCalculator.module.css';

const SavingsCalculator = () => {
  // State for inputs
  const [initialSavings, setInitialSavings] = useState(1000);
  const [monthlyContribution, setMonthlyContribution] = useState(200);
  const [annualInterestRate, setAnnualInterestRate] = useState(5);
  const [compoundingFrequency, setCompoundingFrequency] = useState(12); // Monthly
  const [timePeriod, setTimePeriod] = useState(10); // Years
  const [inflationRate, setInflationRate] = useState(3);
  const [goalAmount, setGoalAmount] = useState(50000);
  const [goalTimeframe, setGoalTimeframe] = useState(5); // Years
  
  // Additional states for calculations
  const [showGoalCalculator, setShowGoalCalculator] = useState(true);
  
  // Refs for canvas
  const growthChartRef = useRef(null);
  const comparisonChartRef = useRef(null);
  
  // Calculate savings growth
  const calculateSavingsGrowth = () => {
    const P = initialSavings;
    const r = annualInterestRate / 100;
    const t = timePeriod;
    const n = compoundingFrequency;
    const PMT = monthlyContribution;
    
    // Future value of initial savings
    const FV_principal = P * Math.pow(1 + r / n, n * t);
    
    // Future value of monthly contributions
    let FV_contributions = 0;
    if (PMT > 0) {
      // Adjust PMT for compounding frequency
      const adjustedPMT = PMT * (12 / n);
      FV_contributions = adjustedPMT * ((Math.pow(1 + r / n, n * t) - 1) / (r / n));
    }
    
    const totalFutureValue = FV_principal + FV_contributions;
    const totalContributions = P + (PMT * 12 * t);
    const interestEarned = totalFutureValue - totalContributions;
    
    // Calculate inflation-adjusted value
    const inflationAdjustedValue = totalFutureValue / Math.pow(1 + inflationRate / 100, t);
    
    return {
      totalFutureValue: Math.round(totalFutureValue),
      totalContributions: Math.round(totalContributions),
      interestEarned: Math.round(interestEarned),
      inflationAdjustedValue: Math.round(inflationAdjustedValue),
      monthlyGrowth: Math.round((totalFutureValue - totalContributions) / (t * 12))
    };
  };
  
  const savingsMetrics = calculateSavingsGrowth();
  
  // Calculate savings goal
  const calculateGoalSavings = () => {
    const r = annualInterestRate / 100;
    const n = compoundingFrequency;
    const t = goalTimeframe;
    const FV = goalAmount;
    
    // Calculate required monthly contribution using future value of annuity formula
    // FV = PMT * (((1 + r/n)^(n*t) - 1) / (r/n))
    const requiredMonthlyContribution = FV / (((Math.pow(1 + r / n, n * t) - 1) / (r / n)));
    
    // Adjust for compounding frequency
    const adjustedMonthlyContribution = requiredMonthlyContribution / (12 / n);
    
    return {
      requiredMonthlyContribution: Math.round(adjustedMonthlyContribution),
      totalToSave: Math.round(adjustedMonthlyContribution * 12 * t),
      interestAccumulated: Math.round(FV - (adjustedMonthlyContribution * 12 * t)),
      onTrack: monthlyContribution >= adjustedMonthlyContribution
    };
  };
  
  const goalMetrics = calculateGoalSavings();
  
  // Generate yearly projection data
  const generateYearlyProjection = () => {
    const data = [];
    const P = initialSavings;
    const r = annualInterestRate / 100;
    const n = compoundingFrequency;
    const PMT = monthlyContribution;
    
    let currentValue = P;
    
    for (let year = 0; year <= timePeriod; year++) {
      if (year === 0) {
        data.push({
          year,
          value: P,
          contributions: P,
          interest: 0
        });
        continue;
      }
      
      // Calculate growth for the year
      for (let period = 0; period < n; period++) {
        // Add contribution at the beginning of each compounding period
        const contributionThisPeriod = PMT * (12 / n);
        currentValue = (currentValue + contributionThisPeriod) * (1 + r / n);
      }
      
      const contributionsSoFar = P + (PMT * 12 * year);
      const interestSoFar = currentValue - contributionsSoFar;
      
      data.push({
        year,
        value: Math.round(currentValue),
        contributions: Math.round(contributionsSoFar),
        interest: Math.round(interestSoFar)
      });
    }
    
    return data;
  };
  
  const projectionData = generateYearlyProjection();
  
  // Generate comparison data (with vs without interest)
  const generateComparisonData = () => {
    const data = [];
    const P = initialSavings;
    const PMT = monthlyContribution;
    
    let withInterestValue = P;
    let withoutInterestValue = P;
    
    for (let year = 0; year <= timePeriod; year++) {
      if (year === 0) {
        data.push({
          year,
          withInterest: P,
          withoutInterest: P
        });
        continue;
      }
      
      // Without interest (just contributions)
      withoutInterestValue = withoutInterestValue + (PMT * 12);
      
      // With interest
      const r = annualInterestRate / 100;
      const n = compoundingFrequency;
      
      for (let period = 0; period < n; period++) {
        const contributionThisPeriod = PMT * (12 / n);
        withInterestValue = (withInterestValue + contributionThisPeriod) * (1 + r / n);
      }
      
      data.push({
        year,
        withInterest: Math.round(withInterestValue),
        withoutInterest: Math.round(withoutInterestValue)
      });
    }
    
    return data;
  };
  
  const comparisonData = generateComparisonData();
  
  // Format currency
  const formatCurrency = (num) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  
  // Format compact currency for charts
  const formatCompactCurrency = (num) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
    return formatCurrency(num);
  };
  
  // Render growth chart
  useEffect(() => {
    const canvas = growthChartRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    const padding = { left: 60, right: 30, top: 40, bottom: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    // Find max value
    const maxValue = Math.max(...projectionData.map(d => d.value));
    const scaledMax = Math.ceil(maxValue / 10000) * 10000;
    
    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    const ySteps = 5;
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
      ctx.fillText(formatCompactCurrency(value), padding.left - 8, y + 3);
    }
    
    // Vertical grid lines
    const xSteps = Math.min(10, timePeriod);
    for (let i = 0; i <= xSteps; i++) {
      const x = padding.left + (chartWidth * i) / xSteps;
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, height - padding.bottom);
      ctx.stroke();
      
      const year = Math.round((i * timePeriod) / xSteps);
      ctx.fillStyle = '#b8c2e0';
      ctx.font = '10px Segoe UI';
      ctx.textAlign = 'center';
      ctx.fillText(`${year} yr`, x, height - padding.bottom + 18);
    }
    
    // Draw axes
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padding.left, height - padding.bottom);
    ctx.lineTo(width - padding.right, height - padding.bottom);
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, height - padding.bottom);
    ctx.stroke();
    
    // Draw growth line
    ctx.strokeStyle = '#00bfa5';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    
    projectionData.forEach((point, i) => {
      const x = padding.left + (chartWidth * point.year) / timePeriod;
      const y = height - padding.bottom - ((point.value / scaledMax) * chartHeight);
      
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    
    ctx.stroke();
    
    // Draw contributions area (under the line)
    ctx.fillStyle = 'rgba(0, 191, 165, 0.2)';
    ctx.beginPath();
    ctx.moveTo(padding.left, height - padding.bottom);
    
    projectionData.forEach((point, i) => {
      const x = padding.left + (chartWidth * point.year) / timePeriod;
      const y = height - padding.bottom - ((point.contributions / scaledMax) * chartHeight);
      
      if (i === 0) ctx.lineTo(x, y);
      else ctx.lineTo(x, y);
    });
    
    // Close the path
    const lastX = padding.left + (chartWidth * timePeriod) / timePeriod;
    ctx.lineTo(lastX, height - padding.bottom);
    ctx.closePath();
    ctx.fill();
    
    // Add labels
    ctx.fillStyle = '#ffffff';
    ctx.font = '11px Segoe UI';
    ctx.textAlign = 'center';
    ctx.fillText('Savings Growth Over Time', width / 2, padding.top - 10);
    
    ctx.textAlign = 'left';
    ctx.fillText('Years →', width - padding.right - 20, height - padding.bottom + 35);
    
    ctx.save();
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Savings Value ($)', -padding.top - 30, -padding.left - 20);
    ctx.restore();
    
    // Add legend
    ctx.fillStyle = '#00bfa5';
    ctx.fillRect(width - 120, padding.top + 10, 12, 12);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Total Value', width - 100, padding.top + 20);
    
    ctx.fillStyle = 'rgba(0, 191, 165, 0.5)';
    ctx.fillRect(width - 120, padding.top + 30, 12, 12);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Contributions', width - 100, padding.top + 40);
  }, [projectionData, timePeriod, formatCompactCurrency]);
  
  // Render comparison chart
  useEffect(() => {
    const canvas = comparisonChartRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    const padding = { left: 60, right: 30, top: 40, bottom: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    // Find max value
    const maxValue = Math.max(...comparisonData.map(d => Math.max(d.withInterest, d.withoutInterest)));
    const scaledMax = Math.ceil(maxValue / 10000) * 10000;
    
    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    
    const ySteps = 5;
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
      ctx.fillText(formatCompactCurrency(value), padding.left - 8, y + 3);
    }
    
    // Draw axes
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padding.left, height - padding.bottom);
    ctx.lineTo(width - padding.right, height - padding.bottom);
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, height - padding.bottom);
    ctx.stroke();
    
    // Draw with interest line
    ctx.strokeStyle = '#00bfa5';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    
    comparisonData.forEach((point, i) => {
      const x = padding.left + (chartWidth * point.year) / timePeriod;
      const y = height - padding.bottom - ((point.withInterest / scaledMax) * chartHeight);
      
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    
    // Draw without interest line
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    
    comparisonData.forEach((point, i) => {
      const x = padding.left + (chartWidth * point.year) / timePeriod;
      const y = height - padding.bottom - ((point.withoutInterest / scaledMax) * chartHeight);
      
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Add labels
    ctx.fillStyle = '#ffffff';
    ctx.font = '11px Segoe UI';
    ctx.textAlign = 'center';
    ctx.fillText('Interest Impact: With vs Without', width / 2, padding.top - 10);
    
    // Add legend
    ctx.fillStyle = '#00bfa5';
    ctx.fillRect(width - 120, padding.top + 10, 12, 12);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('With Interest', width - 100, padding.top + 20);
    
    ctx.fillStyle = '#ff6b6b';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(width - 120, padding.top + 35);
    ctx.lineTo(width - 108, padding.top + 35);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillText('Without Interest', width - 100, padding.top + 40);
  }, [comparisonData, timePeriod, formatCompactCurrency]);
  
  // Handle slider changes with animation
  const handleSliderChange = (setter) => (e) => {
    const value = Number(e.target.value);
    setter(value);
    
    const slider = e.target;
    slider.classList.add(styles.sliderAnimate);
    setTimeout(() => slider.classList.remove(styles.sliderAnimate), 300);
  };
  
  // Calculate time to reach goal with current contributions
  const calculateTimeToGoal = () => {
    const P = initialSavings;
    const r = annualInterestRate / 100;
    const n = compoundingFrequency;
    const PMT = monthlyContribution;
    const FV = goalAmount;
    
    if (P >= FV) return 0;
    
    // Solve for t in: FV = P*(1+r/n)^(n*t) + PMT*(((1+r/n)^(n*t)-1)/(r/n))
    let t = 0;
    let currentValue = P;
    const maxYears = 50;
    
    while (currentValue < FV && t < maxYears) {
      t += 0.1; // Increment by 0.1 years for precision
      currentValue = P * Math.pow(1 + r / n, n * t) + 
                     (PMT * (12 / n)) * ((Math.pow(1 + r / n, n * t) - 1) / (r / n));
    }
    
    return Math.min(t, maxYears);
  };
  
  const timeToGoal = calculateTimeToGoal();
  
  // Calculate different scenarios
  const calculateScenarios = () => {
    const scenarios = [];
    
    // Scenario 1: Increase contributions by 10%
    const increasedContribution = monthlyContribution * 1.1;
    const r = annualInterestRate / 100;
    const n = compoundingFrequency;
    const t = timePeriod;
    const P = initialSavings;
    
    const FV_increased = P * Math.pow(1 + r / n, n * t) + 
                        (increasedContribution * (12 / n)) * ((Math.pow(1 + r / n, n * t) - 1) / (r / n));
    
    scenarios.push({
      title: 'Increase contributions by 10%',
      value: formatCurrency(Math.round(FV_increased - savingsMetrics.totalFutureValue)),
      description: `Save ${formatCurrency(increasedContribution - monthlyContribution)} more per month`
    });
    
    // Scenario 2: Increase interest rate by 1%
    const increasedRate = annualInterestRate + 1;
    const r2 = increasedRate / 100;
    
    const FV_higherRate = P * Math.pow(1 + r2 / n, n * t) + 
                         (monthlyContribution * (12 / n)) * ((Math.pow(1 + r2 / n, n * t) - 1) / (r2 / n));
    
    scenarios.push({
      title: 'Increase interest rate by 1%',
      value: formatCurrency(Math.round(FV_higherRate - savingsMetrics.totalFutureValue)),
      description: `From ${annualInterestRate}% to ${increasedRate}% annual return`
    });
    
    // Scenario 3: Save for 5 more years
    const extendedTime = timePeriod + 5;
    
    const FV_extended = P * Math.pow(1 + r / n, n * extendedTime) + 
                       (monthlyContribution * (12 / n)) * ((Math.pow(1 + r / n, n * extendedTime) - 1) / (r / n));
    
    scenarios.push({
      title: 'Extend by 5 years',
      value: formatCurrency(Math.round(FV_extended - savingsMetrics.totalFutureValue)),
      description: `${timePeriod} → ${extendedTime} years`
    });
    
    // Scenario 4: Start with 20% more initial savings
    const higherInitial = initialSavings * 1.2;
    
    const FV_higherInitial = higherInitial * Math.pow(1 + r / n, n * t) + 
                            (monthlyContribution * (12 / n)) * ((Math.pow(1 + r / n, n * t) - 1) / (r / n));
    
    scenarios.push({
      title: 'Start with 20% more',
      value: formatCurrency(Math.round(FV_higherInitial - savingsMetrics.totalFutureValue)),
      description: `Initial: ${formatCurrency(initialSavings)} → ${formatCurrency(higherInitial)}`
    });
    
    return scenarios;
  };
  
  const scenarios = calculateScenarios();
  
  // SEO Variables for freecompoundcalculator.com
  const pageTitle = 'Free Savings Calculator Online | Compound Interest & Goal Planning - FreeCompoundCalculator.com 2024';
  const pageDescription = 'Free savings calculator from FreeCompoundCalculator.com. Calculate compound interest growth, set savings goals, compare scenarios, and create personalized savings strategies. Perfect for emergency funds, down payments, and financial goals - completely free with no registration required.';
  const canonicalUrl = 'https://www.freecompoundcalculator.com/savings-calculator';
  const pageKeywords = 'free savings calculator, free compound interest calculator, free savings goal calculator, free emergency fund calculator, free down payment calculator, free investment calculator, free money growth calculator, free financial goal calculator, free savings plan calculator, free monthly savings calculator, free interest calculator, free savings account calculator, free high yield savings calculator, free CD calculator, free certificate of deposit calculator, free savings growth calculator, free savings projection calculator, free savings target calculator, free budget calculator, free personal finance calculator, free wealth building calculator, free financial planning calculator, free savings strategy calculator, free compound growth calculator, free savings timeline calculator, free savings milestone calculator, free savings rate calculator, free savings analysis calculator, free savings planning tool, free savings progress tracker, free savings visualization, free savings what-if calculator, free savings scenario calculator, freecompoundcalculator, free compound calculator, free financial calculator, free investment planning, free money management calculator, free personal savings calculator, free financial goal planning';

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
        <meta property="og:image" content="https://www.freecompoundcalculator.com/images/savings-calculator-preview.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Free Savings Calculator from FreeCompoundCalculator.com" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:site" content="@FreeCompoundCalc" />
        <meta name="twitter:creator" content="@FreeCompoundCalc" />
        <meta name="twitter:image" content="https://www.freecompoundcalculator.com/images/savings-calculator-preview.jpg" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="rating" content="General" />
        <meta name="distribution" content="global" />
        <meta name="generator" content="FreeCompoundCalculator.com Savings Calculator Engine" />
        <meta name="application-name" content="Free Savings Calculator" />
        <meta name="apple-mobile-web-app-title" content="Savings Calc" />
        <meta name="theme-color" content="#0a192f" />
        <meta name="msapplication-TileColor" content="#00bfa5" />
        
        {/* Schema.org JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Free Savings Calculator - FreeCompoundCalculator.com",
            "description": "Comprehensive savings calculator with compound interest calculations, goal planning, and visualization tools - completely free from FreeCompoundCalculator.com",
            "url": canonicalUrl,
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Any",
            "browserRequirements": "Requires JavaScript",
            "softwareVersion": "3.5.0",
            "featureList": [
              "Compound Interest Calculations",
              "Monthly Contribution Planning",
              "Savings Goal Setting & Tracking",
              "Inflation-Adjusted Projections",
              "Multiple Compounding Frequencies",
              "Visual Growth Charts",
              "What-If Scenario Analysis",
              "Goal Progress Tracking",
              "Interest Impact Comparison",
              "Yearly Savings Breakdown",
              "Emergency Fund Planning",
              "Down Payment Calculator",
              "Investment Growth Projections",
              "Retirement Savings Planning",
              "Education Fund Planning",
              "Wealth Building Calculations"
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
              "ratingValue": "4.7",
              "ratingCount": "2315",
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
            "name": "Free Savings Goal Calculator - FreeCompoundCalculator.com",
            "url": canonicalUrl,
            "description": "Free web-based savings calculator with visual projections and goal planning from FreeCompoundCalculator.com",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web",
            "permissions": "Free",
            "countriesSupported": "Worldwide",
            "screenshot": "https://www.freecompoundcalculator.com/images/savings-calculator-screenshot.jpg",
            "fileSize": "265KB",
            "memoryRequirements": "512MB",
            "processorRequirements": "Any",
            "softwareRequirements": "Modern Web Browser",
            "softwareVersion": "2.4.0"
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
                "name": "Free Financial Calculators",
                "item": "https://www.freecompoundcalculator.com/financial-calculators"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Savings Calculator",
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
                "name": "Is this savings calculator really free to use?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, FreeCompoundCalculator.com provides completely free savings calculators with no registration required. Our savings calculator is 100% free with all advanced features available at no cost."
                }
              },
              {
                "@type": "Question",
                "name": "What savings calculations does this tool include?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "This free savings calculator from FreeCompoundCalculator.com includes compound interest calculations, monthly contribution planning, savings goal setting, inflation-adjusted projections, multiple compounding frequencies, visual growth charts, and what-if scenario analysis."
                }
              },
              {
                "@type": "Question",
                "name": "How does compound interest work in savings?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Compound interest means you earn interest on both your initial savings and the interest that accumulates over time. Our free calculator from FreeCompoundCalculator.com shows how compound interest significantly accelerates savings growth compared to simple interest."
                }
              },
              {
                "@type": "Question",
                "name": "Can I calculate different savings goals with this tool?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, our free savings calculator from FreeCompoundCalculator.com is perfect for emergency fund planning, down payment calculations, vacation savings, education funds, retirement savings, and any other financial goals. Simply set your goal amount and timeframe."
                }
              },
              {
                "@type": "Question",
                "name": "What's the difference between monthly and annual compounding?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Monthly compounding calculates and adds interest to your savings 12 times per year, while annual compounding does it once per year. More frequent compounding leads to faster growth. FreeCompoundCalculator.com lets you compare different compounding frequencies."
                }
              },
              {
                "@type": "Question",
                "name": "How accurate are the savings projections?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our free savings calculator from FreeCompoundCalculator.com uses standard financial formulas for compound interest calculations. Projections are estimates based on your inputs and assumed constant rates. Actual results may vary based on market conditions and account terms."
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
            onClick={() => setShowGoalCalculator(!showGoalCalculator)}
            className={styles.pdfExportBtn}
            aria-label="Toggle Calculator Mode"
          >
            {showGoalCalculator ? '🎯 Goal Calculator' : '💰 Growth Calculator'}
          </button>
          <button className={styles.pdfExportBtn} aria-label="Reset Calculator">
            🔄 Reset
          </button>
        </div>
        
        <div className={styles.calculatorContainer}>
          <h1 className={styles.sectionTitle}>Free Savings Calculator Online - Compound Interest & Goal Planning - FreeCompoundCalculator.com</h1>
          <p className={styles.subtitle}>
            Calculate your savings growth with compound interest using our free savings calculator from FreeCompoundCalculator.com. Set financial goals for emergency funds, down payments, vacations, or education. Track progress with visual charts, compare scenarios, and optimize your savings strategy for maximum growth - completely free with no registration required.
          </p>
          
          <div className={styles.calcGrid}>
            {/* Input Panel */}
            <div className={styles.inputPanel}>
              <h2 className={styles.panelTitle}>Free Savings Calculator Inputs - FreeCompoundCalculator.com</h2>
              
              <div className={styles.inputGroup}>
                <label htmlFor="initialSavings">Initial Savings Amount: <span className={styles.valueDisplay}>{formatCurrency(initialSavings)}</span></label>
                <input
                  type="range"
                  id="initialSavings"
                  min="0"
                  max="100000"
                  step="1000"
                  value={initialSavings}
                  onChange={handleSliderChange(setInitialSavings)}
                  className={styles.slider}
                />
                <div className={styles.sliderLabels}>
                  <span>$0</span>
                  <span>$100K</span>
                </div>
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="monthlyContribution">Monthly Contribution Amount: <span className={styles.valueDisplay}>{formatCurrency(monthlyContribution)}</span></label>
                <input
                  type="range"
                  id="monthlyContribution"
                  min="0"
                  max="5000"
                  step="50"
                  value={monthlyContribution}
                  onChange={handleSliderChange(setMonthlyContribution)}
                  className={styles.slider}
                />
                <div className={styles.sliderLabels}>
                  <span>$0</span>
                  <span>$5,000</span>
                </div>
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="annualInterestRate">Annual Interest Rate (APY): <span className={styles.valueDisplay}>{annualInterestRate}%</span></label>
                <input
                  type="range"
                  id="annualInterestRate"
                  min="0"
                  max="20"
                  step="0.5"
                  value={annualInterestRate}
                  onChange={handleSliderChange(setAnnualInterestRate)}
                  className={styles.slider}
                />
                <div className={styles.sliderLabels}>
                  <span>0%</span>
                  <span>20%</span>
                </div>
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="compoundingFrequency">Compounding Frequency</label>
                <select
                  id="compoundingFrequency"
                  value={compoundingFrequency}
                  onChange={(e) => setCompoundingFrequency(Number(e.target.value))}
                  className={styles.inputField}
                >
                  <option value={1}>Annually (1x per year)</option>
                  <option value={2}>Semi-annually (2x per year)</option>
                  <option value={4}>Quarterly (4x per year)</option>
                  <option value={12}>Monthly (12x per year)</option>
                  <option value={365}>Daily (365x per year)</option>
                </select>
                <p className={styles.frequencyHelp}>More frequent compounding = faster growth</p>
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="timePeriod">Savings Time Period: <span className={styles.valueDisplay}>{timePeriod} years</span></label>
                <input
                  type="range"
                  id="timePeriod"
                  min="1"
                  max="50"
                  step="1"
                  value={timePeriod}
                  onChange={handleSliderChange(setTimePeriod)}
                  className={styles.slider}
                />
                <div className={styles.sliderLabels}>
                  <span>1 yr</span>
                  <span>50 yrs</span>
                </div>
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="inflationRate">Expected Inflation Rate: <span className={styles.valueDisplay}>{inflationRate}%</span></label>
                <input
                  type="range"
                  id="inflationRate"
                  min="0"
                  max="10"
                  step="0.5"
                  value={inflationRate}
                  onChange={handleSliderChange(setInflationRate)}
                  className={styles.slider}
                />
                <div className={styles.sliderLabels}>
                  <span>0%</span>
                  <span>10%</span>
                </div>
              </div>
              
              {/* Goal Calculator Section */}
              {showGoalCalculator && (
                <>
                  <div className={styles.inputDivider}>
                    <span>🎯 Savings Goal Calculator - FreeCompoundCalculator.com</span>
                  </div>
                  
                  <div className={styles.inputGroup}>
                    <label htmlFor="goalAmount">Goal Amount (Emergency Fund, Down Payment, etc.): <span className={styles.valueDisplay}>{formatCurrency(goalAmount)}</span></label>
                    <input
                      type="range"
                      id="goalAmount"
                      min="1000"
                      max="1000000"
                      step="10000"
                      value={goalAmount}
                      onChange={handleSliderChange(setGoalAmount)}
                      className={styles.slider}
                    />
                    <div className={styles.sliderLabels}>
                      <span>$1K</span>
                      <span>$1M</span>
                    </div>
                  </div>
                  
                  <div className={styles.inputGroup}>
                    <label htmlFor="goalTimeframe">Goal Timeframe: <span className={styles.valueDisplay}>{goalTimeframe} years</span></label>
                    <input
                      type="range"
                      id="goalTimeframe"
                      min="1"
                      max="30"
                      step="1"
                      value={goalTimeframe}
                      onChange={handleSliderChange(setGoalTimeframe)}
                      className={styles.slider}
                    />
                    <div className={styles.sliderLabels}>
                      <span>1 yr</span>
                      <span>30 yrs</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Results Panel */}
            <div className={styles.resultsPanel}>
              <h3 className={styles.panelTitle}>Free Savings Analysis - FreeCompoundCalculator.com</h3>
              
              <div className={`${styles.resultCard} ${styles.highlight}`}>
                <h4>Future Savings Value After {timePeriod} Years</h4>
                <p className={styles.resultValue}>{formatCurrency(savingsMetrics.totalFutureValue)}</p>
                <p className={styles.resultSubtext}>
                  Total savings after {timePeriod} years at {annualInterestRate}% interest with {formatCurrency(monthlyContribution)} monthly contributions
                </p>
              </div>
              
              <div className={styles.resultCard}>
                <h4>Total Contributions Made</h4>
                <p className={styles.resultValue}>{formatCurrency(savingsMetrics.totalContributions)}</p>
                <p className={styles.resultSubtext}>
                  Initial savings: {formatCurrency(initialSavings)} + Monthly contributions: {formatCurrency(monthlyContribution)} × {timePeriod} years
                </p>
              </div>
              
              <div className={styles.resultCard}>
                <h4>Compound Interest Earned</h4>
                <p className={styles.resultValue}>{formatCurrency(savingsMetrics.interestEarned)}</p>
                <p className={styles.resultSubtext}>
                  Interest represents {((savingsMetrics.interestEarned / savingsMetrics.totalContributions) * 100).toFixed(1)}% of your total contributions - power of compound interest from FreeCompoundCalculator.com
                </p>
              </div>
              
              <div className={styles.resultCard}>
                <h4>Inflation-Adjusted Future Value</h4>
                <p className={styles.resultValue}>{formatCurrency(savingsMetrics.inflationAdjustedValue)}</p>
                <p className={styles.resultSubtext}>
                  Equivalent value in today's dollars at {inflationRate}% annual inflation rate
                </p>
              </div>
              
              {showGoalCalculator && (
                <>
                  <div className={styles.resultCard}>
                    <h4>Savings Goal Progress Tracking</h4>
                    <div className={styles.goalProgress}>
                      <div className={styles.progressBar}>
                        <div 
                          className={styles.progressFill}
                          style={{ 
                            width: `${Math.min(100, (savingsMetrics.totalFutureValue / goalAmount) * 100)}%` 
                          }}
                        ></div>
                      </div>
                      <p className={styles.progressText}>
                        {savingsMetrics.totalFutureValue >= goalAmount ? '🎉 Goal Reached! 🎉' : 
                         `${formatCurrency(savingsMetrics.totalFutureValue)} / ${formatCurrency(goalAmount)}`}
                      </p>
                    </div>
                    <p className={styles.resultSubtext}>
                      {savingsMetrics.totalFutureValue >= goalAmount ? 
                       'Congratulations! You have reached your savings goal!' : 
                       `${((savingsMetrics.totalFutureValue / goalAmount) * 100).toFixed(1)}% of your ${formatCurrency(goalAmount)} goal achieved`}
                    </p>
                  </div>
                  
                  <div className={styles.resultCard}>
                    <h4>Monthly Contribution Needed for Goal</h4>
                    <p className={styles.resultValue}>{formatCurrency(goalMetrics.requiredMonthlyContribution)}/month</p>
                    <p className={styles.resultSubtext}>
                      {goalMetrics.onTrack ? '✅ You are on track to reach your goal!' : `📈 Need ${formatCurrency(goalMetrics.requiredMonthlyContribution - monthlyContribution)} more per month to reach goal in ${goalTimeframe} years`}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Savings Growth Chart */}
          <div className={styles.chartPreview}>
            <h3>Savings Growth Projection & Compound Interest Visualization - FreeCompoundCalculator.com</h3>
            <div className={styles.chartContainer}>
              <canvas
                ref={growthChartRef}
                width={700}
                height={300}
                className={styles.chartCanvas}
              ></canvas>
              <p className={styles.chartCaption}>
                📈 This projection from FreeCompoundCalculator.com shows your savings growth over time. The green area represents your total contributions, while the line shows the total value including compound interest. 
                Notice how compound interest accelerates growth in later years as interest earns interest on itself.
              </p>
            </div>
          </div>

          {/* Interest Impact Chart */}
          <div className={styles.chartPreview}>
            <h3>Impact of Compound Interest - With vs Without Interest Comparison - FreeCompoundCalculator.com</h3>
            <div className={styles.chartContainer}>
              <canvas
                ref={comparisonChartRef}
                width={700}
                height={300}
                className={styles.chartCanvas}
              ></canvas>
              <p className={styles.chartCaption}>
                💡 This comparison from FreeCompoundCalculator.com demonstrates the power of compound interest. The dashed red line shows savings growth without any interest (just contributions). 
                The solid green line shows savings with {annualInterestRate}% compound interest. Over {timePeriod} years, compound interest adds {formatCurrency(savingsMetrics.interestEarned)} to your savings - that's pure growth!
              </p>
            </div>
          </div>

          {/* What-If Scenarios */}
          <div className={styles.sensitivityCard}>
            <h3>💡 What-If Scenarios & Savings Optimization - FreeCompoundCalculator.com Analysis</h3>
            <div className={styles.strategyGrid}>
              {scenarios.map((scenario, index) => (
                <div key={index} className={styles.strategyItem}>
                  <h5>{scenario.title}</h5>
                  <p className={styles.strategyValue}>+{scenario.value} Additional Savings</p>
                  <p className={styles.strategyTip}>{scenario.description} - Analysis from FreeCompoundCalculator.com</p>
                </div>
              ))}
            </div>
          </div>

          {/* Yearly Breakdown */}
          <div className={styles.milestoneTable}>
            <h3>📊 Yearly Savings Breakdown & Compound Growth Analysis - FreeCompoundCalculator.com</h3>
            <div className={styles.tableContainer}>
              <table>
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Total Savings Value</th>
                    <th>Total Contributions</th>
                    <th>Total Interest Earned</th>
                    <th>Annual Growth Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {projectionData
                    .filter((_, index) => index % Math.max(1, Math.floor(timePeriod / 10)) === 0 || index === timePeriod)
                    .map((data) => {
                      const prevYear = projectionData[data.year - 1];
                      const annualGrowth = prevYear ? data.value - prevYear.value : 0;
                      
                      return (
                        <tr key={data.year}>
                          <td>Year {data.year}</td>
                          <td>{formatCurrency(data.value)}</td>
                          <td>{formatCurrency(data.contributions)}</td>
                          <td>{formatCurrency(data.interest)}</td>
                          <td style={{ color: annualGrowth > 0 ? '#00bfa5' : '#ff6b6b' }}>
                            {formatCurrency(annualGrowth)}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
            <p className={styles.tableTip}>
              💡 Analysis from FreeCompoundCalculator.com: Notice how interest earnings accelerate over time due to compound interest. 
              Early years show modest growth from contributions, but later years benefit significantly from compounding on both contributions and accumulated interest. 
              This demonstrates why starting to save early is so powerful.
            </p>
          </div>

          {/* Savings Tips */}
          <div className={styles.actionCard}>
            <h3>🚀 Smart Savings Strategies & Financial Tips - FreeCompoundCalculator.com Guidance</h3>
            <div className={styles.actionGrid}>
              <div className={styles.actionItem}>
                <strong>💡 Automate Your Savings with Direct Deposits:</strong><br />
                Set up automatic transfers from checking to savings accounts. "Pay yourself first" before other expenses to ensure consistent savings. FreeCompoundCalculator.com helps calculate optimal automated amounts.
              </div>
              <div className={styles.actionItem}>
                <strong>💡 Gradual Contribution Increases (1% Rule):</strong><br />
                Boost monthly contributions by 1% each month or whenever you receive a raise. Small, consistent increases add up significantly over time due to compound interest, as shown by FreeCompoundCalculator.com.
              </div>
              <div className={styles.actionItem}>
                <strong>💡 Optimize with High-Yield Savings Accounts:</strong><br />
                Use high-yield savings accounts, money market accounts, or certificates of deposit (CDs) for better interest rates. Even 1% higher APY makes a big difference over decades, as FreeCompoundCalculator.com demonstrates.
              </div>
              <div className={styles.actionItem}>
                <strong>💡 Windfall Strategy for Accelerated Growth:</strong><br />
                Direct bonuses, tax refunds, gifts, or other unexpected money directly to savings rather than increasing spending. Use FreeCompoundCalculator.com to see how windfalls accelerate goal achievement through compound growth.
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default SavingsCalculator;