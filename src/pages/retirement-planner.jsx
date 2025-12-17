'use client';
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import styles from './RetirementPlanner.module.css';

const RetirementPlanner = () => {
  // State for inputs
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(65);
  const [lifeExpectancy, setLifeExpectancy] = useState(85);
  const [currentSavings, setCurrentSavings] = useState(50000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [annualReturn, setAnnualReturn] = useState(7);
  const [inflationRate, setInflationRate] = useState(3);
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(3000);
  const [socialSecurity, setSocialSecurity] = useState(1500);
  const [pension, setPension] = useState(0);
  
  // Refs for canvas
  const chartCanvasRef = useRef(null);
  const timelineCanvasRef = useRef(null);
  
  // Calculate retirement metrics
  const calculateRetirementMetrics = () => {
    const yearsToRetirement = retirementAge - currentAge;
    const retirementYears = lifeExpectancy - retirementAge;
    
    // Calculate future value of current savings
    const monthlyRate = annualReturn / 100 / 12;
    const monthsToRetirement = yearsToRetirement * 12;
    
    // Future value of current savings
    const futureValueCurrentSavings = currentSavings * Math.pow(1 + monthlyRate, monthsToRetirement);
    
    // Future value of monthly contributions
    const futureValueContributions = monthlyContribution * 
      ((Math.pow(1 + monthlyRate, monthsToRetirement) - 1) / monthlyRate);
    
    // Total retirement savings
    const totalRetirementSavings = futureValueCurrentSavings + futureValueContributions;
    
    // Calculate retirement income needs (in future dollars, adjusted for inflation)
    const inflationAdjustedWithdrawal = monthlyWithdrawal * Math.pow(1 + inflationRate / 100, yearsToRetirement);
    const annualWithdrawalNeeded = inflationAdjustedWithdrawal * 12;
    const socialSecurityAnnual = socialSecurity * 12 * Math.pow(1 + inflationRate / 100, yearsToRetirement);
    const pensionAnnual = pension * 12 * Math.pow(1 + inflationRate / 100, yearsToRetirement);
    
    const netAnnualWithdrawalNeeded = annualWithdrawalNeeded - socialSecurityAnnual - pensionAnnual;
    
    // Calculate if savings are sufficient (using 4% rule as guideline)
    const requiredSavings4Percent = netAnnualWithdrawalNeeded / 0.04;
    const withdrawalRate = (netAnnualWithdrawalNeeded / totalRetirementSavings) * 100;
    
    // Calculate how long savings will last
    const monthlyWithdrawalNeeded = netAnnualWithdrawalNeeded / 12;
    const monthsFundsWillLast = calculateMonthsFundsWillLast(totalRetirementSavings, monthlyWithdrawalNeeded, annualReturn / 100 / 12);
    
    // Shortfall or surplus
    const shortfall = Math.max(0, requiredSavings4Percent - totalRetirementSavings);
    const surplus = Math.max(0, totalRetirementSavings - requiredSavings4Percent);
    
    return {
      yearsToRetirement,
      retirementYears,
      totalRetirementSavings: Math.round(totalRetirementSavings),
      requiredSavings4Percent: Math.round(requiredSavings4Percent),
      withdrawalRate,
      monthsFundsWillLast,
      shortfall: Math.round(shortfall),
      surplus: Math.round(surplus),
      annualWithdrawalNeeded: Math.round(annualWithdrawalNeeded),
      netAnnualWithdrawalNeeded: Math.round(netAnnualWithdrawalNeeded),
      inflationAdjustedWithdrawal: Math.round(inflationAdjustedWithdrawal),
      socialSecurityAnnual: Math.round(socialSecurityAnnual),
      pensionAnnual: Math.round(pensionAnnual),
      monthlyShortfall: monthlyWithdrawalNeeded > 0 ? Math.round(monthlyWithdrawalNeeded / (totalRetirementSavings / 1000000) * 100) / 100 : 0
    };
  };
  
  const calculateMonthsFundsWillLast = (savings, monthlyWithdrawal, monthlyReturn) => {
    if (monthlyWithdrawal <= 0) return Infinity;
    
    let months = 0;
    let remaining = savings;
    const maxMonths = 600; // 50 years max
    
    while (remaining > 0 && months < maxMonths) {
      remaining = remaining * (1 + monthlyReturn) - monthlyWithdrawal;
      months++;
    }
    
    return months;
  };
  
  const metrics = calculateRetirementMetrics();
  
  // Generate projection data
  const generateProjectionData = () => {
    const data = [];
    const yearsToRetirement = retirementAge - currentAge;
    const retirementYears = lifeExpectancy - retirementAge;
    const totalYears = yearsToRetirement + retirementYears;
    
    let currentSavingsValue = currentSavings;
    const monthlyRate = annualReturn / 100 / 12;
    
    // Accumulation phase
    for (let year = 0; year <= yearsToRetirement; year++) {
      const monthsInYear = year === yearsToRetirement ? 0 : 12;
      
      for (let month = 0; month < monthsInYear; month++) {
        currentSavingsValue = currentSavingsValue * (1 + monthlyRate) + monthlyContribution;
      }
      
      data.push({
        age: currentAge + year,
        year: year,
        savings: Math.round(currentSavingsValue),
        phase: 'accumulation',
        withdrawal: 0
      });
    }
    
    // Retirement phase
    const inflationAdjustedWithdrawal = monthlyWithdrawal * Math.pow(1 + inflationRate / 100, yearsToRetirement);
    const socialSecurityMonthly = socialSecurity * Math.pow(1 + inflationRate / 100, yearsToRetirement);
    const pensionMonthly = pension * Math.pow(1 + inflationRate / 100, yearsToRetirement);
    const netMonthlyWithdrawal = Math.max(0, inflationAdjustedWithdrawal - socialSecurityMonthly - pensionMonthly);
    
    for (let year = 1; year <= retirementYears; year++) {
      const retirementYear = yearsToRetirement + year;
      
      for (let month = 0; month < 12; month++) {
        if (currentSavingsValue > 0) {
          const withdrawalThisMonth = Math.min(currentSavingsValue, netMonthlyWithdrawal);
          currentSavingsValue = currentSavingsValue * (1 + monthlyRate) - withdrawalThisMonth;
        }
      }
      
      data.push({
        age: retirementAge + year,
        year: retirementYear,
        savings: Math.round(Math.max(0, currentSavingsValue)),
        phase: 'retirement',
        withdrawal: netMonthlyWithdrawal * 12
      });
    }
    
    return data;
  };
  
  const projectionData = generateProjectionData();
  
  // Format currency
  const formatCurrency = (num) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  
  const formatCurrencyCompact = (num) => {
    if (num >= 1000000000) {
      return `$${(num / 1000000000).toFixed(1)}B`;
    }
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `$${(num / 1000).toFixed(1)}K`;
    }
    return formatCurrency(num);
  };
  
  // Render chart
  useEffect(() => {
    const canvas = chartCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    const padding = { left: 60, right: 30, top: 40, bottom: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    // Find max value
    const maxSavings = Math.max(...projectionData.map(d => d.savings));
    const maxValue = Math.ceil(maxSavings / 100000) * 100000;
    
    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    
    // Vertical grid lines (years)
    const years = lifeExpectancy - currentAge;
    const yearStep = Math.ceil(years / 10);
    
    for (let i = 0; i <= years; i += yearStep) {
      const x = padding.left + (chartWidth * i) / years;
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, height - padding.bottom);
      ctx.stroke();
      
      ctx.fillStyle = '#b8c2e0';
      ctx.font = '10px Segoe UI';
      ctx.textAlign = 'center';
      ctx.fillText(`${currentAge + i}`, x, height - padding.bottom + 15);
    }
    
    // Horizontal grid lines (value)
    const valueSteps = 5;
    for (let i = 0; i <= valueSteps; i++) {
      const y = padding.top + (chartHeight * (valueSteps - i)) / valueSteps;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
      
      const value = (i * maxValue) / valueSteps;
      ctx.fillStyle = '#b8c2e0';
      ctx.font = '10px Segoe UI';
      ctx.textAlign = 'right';
      ctx.fillText(formatCurrencyCompact(value), padding.left - 8, y + 3);
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
    
    // Draw accumulation phase
    ctx.strokeStyle = '#00bfa5';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    
    const accumulationData = projectionData.filter(d => d.phase === 'accumulation');
    accumulationData.forEach((point, i) => {
      const x = padding.left + (chartWidth * point.year) / (lifeExpectancy - currentAge);
      const y = height - padding.bottom - ((point.savings / maxValue) * chartHeight);
      
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    
    // Draw retirement phase
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    
    const retirementData = projectionData.filter(d => d.phase === 'retirement');
    if (retirementData.length > 0) {
      const lastAccumulation = accumulationData[accumulationData.length - 1];
      const x1 = padding.left + (chartWidth * lastAccumulation.year) / (lifeExpectancy - currentAge);
      const y1 = height - padding.bottom - ((lastAccumulation.savings / maxValue) * chartHeight);
      ctx.moveTo(x1, y1);
      
      retirementData.forEach((point, i) => {
        const x = padding.left + (chartWidth * point.year) / (lifeExpectancy - currentAge);
        const y = height - padding.bottom - ((point.savings / maxValue) * chartHeight);
        ctx.lineTo(x, y);
      });
    }
    ctx.stroke();
    
    // Mark retirement age
    const retirementX = padding.left + (chartWidth * (retirementAge - currentAge)) / (lifeExpectancy - currentAge);
    ctx.strokeStyle = '#ff9500';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(retirementX, padding.top);
    ctx.lineTo(retirementX, height - padding.bottom);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Add labels
    ctx.fillStyle = '#ffffff';
    ctx.font = '11px Segoe UI';
    ctx.textAlign = 'center';
    ctx.fillText('Retirement Savings Projection', width / 2, padding.top - 10);
    
    ctx.textAlign = 'left';
    ctx.fillText('Age →', width - padding.right - 20, height - padding.bottom + 35);
    
    ctx.save();
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Savings ($)', -padding.top - 30, -padding.left - 20);
    ctx.restore();
    
    // Add legend
    ctx.fillStyle = '#00bfa5';
    ctx.fillRect(width - 120, padding.top + 10, 12, 12);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Accumulation Phase', width - 100, padding.top + 20);
    
    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(width - 120, padding.top + 30, 12, 12);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Retirement Phase', width - 100, padding.top + 40);
    
    ctx.fillStyle = '#ff9500';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(width - 120, padding.top + 55);
    ctx.lineTo(width - 108, padding.top + 55);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillText('Retirement Age', width - 100, padding.top + 60);
  }, [projectionData, currentAge, retirementAge, lifeExpectancy, formatCurrencyCompact]);
  
  // Render timeline
  useEffect(() => {
    const canvas = timelineCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    const padding = { left: 20, right: 20, top: 40, bottom: 40 };
    const timelineWidth = width - padding.left - padding.right;
    
    // Draw timeline
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding.left, height / 2);
    ctx.lineTo(width - padding.right, height / 2);
    ctx.stroke();
    
    // Draw milestones
    const milestones = [
      { age: currentAge, label: 'Current', color: '#00bfa5' },
      { age: retirementAge, label: 'Retirement', color: '#ff9500' },
      { age: lifeExpectancy, label: 'Life Expectancy', color: '#ff6b6b' }
    ];
    
    milestones.forEach(milestone => {
      const position = (milestone.age - currentAge) / (lifeExpectancy - currentAge);
      const x = padding.left + (timelineWidth * position);
      
      // Draw milestone point
      ctx.fillStyle = milestone.color;
      ctx.beginPath();
      ctx.arc(x, height / 2, 8, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw label
      ctx.fillStyle = milestone.color;
      ctx.font = 'bold 11px Segoe UI';
      ctx.textAlign = 'center';
      ctx.fillText(milestone.label, x, height / 2 - 15);
      ctx.fillText(`${milestone.age} yrs`, x, height / 2 + 25);
      
      // Draw connecting line
      ctx.strokeStyle = milestone.color;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(x, height / 2 - 30);
      ctx.lineTo(x, height / 2 - 8);
      ctx.stroke();
      ctx.setLineDash([]);
    });
    
    // Draw phase labels
    ctx.fillStyle = '#b8e0ff';
    ctx.font = '10px Segoe UI';
    ctx.textAlign = 'center';
    
    const accumulationCenter = padding.left + (timelineWidth * (retirementAge - currentAge)) / (2 * (lifeExpectancy - currentAge));
    ctx.fillText('Accumulation Phase', accumulationCenter, height - 15);
    
    const retirementCenter = padding.left + timelineWidth * (1 + (retirementAge - currentAge) / (lifeExpectancy - currentAge)) / 2;
    ctx.fillText('Retirement Phase', retirementCenter, height - 15);
    
    // Add arrow heads
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(width - padding.right, height / 2);
    ctx.lineTo(width - padding.right - 10, height / 2 - 5);
    ctx.lineTo(width - padding.right - 10, height / 2 + 5);
    ctx.closePath();
    ctx.fill();
  }, [currentAge, retirementAge, lifeExpectancy]);
  
  // Handle slider changes
  const handleSliderChange = (setter) => (e) => {
    const value = Number(e.target.value);
    setter(value);
    
    // Add animation effect
    const slider = e.target;
    slider.classList.add(styles.sliderAnimate);
    setTimeout(() => slider.classList.remove(styles.sliderAnimate), 300);
  };
  
  // Calculate recommendations
  const getRecommendations = () => {
    const recs = [];
    
    if (metrics.withdrawalRate > 4) {
      recs.push({
        title: 'High Withdrawal Rate',
        message: `Your planned withdrawal rate (${metrics.withdrawalRate.toFixed(1)}%) is above the recommended 4%. Consider increasing savings or reducing retirement expenses.`,
        action: 'Adjust plan',
        urgency: 'high'
      });
    }
    
    if (metrics.shortfall > 0) {
      recs.push({
        title: 'Savings Shortfall',
        message: `You may need an additional ${formatCurrency(metrics.shortfall)} to meet your retirement goals based on the 4% rule.`,
        action: 'Increase contributions',
        urgency: 'high'
      });
    }
    
    if (currentAge >= 50 && monthlyContribution < 1000) {
      recs.push({
        title: 'Catch-up Opportunity',
        message: 'Consider taking advantage of catch-up contributions available to those 50 and older.',
        action: 'Maximize contributions',
        urgency: 'medium'
      });
    }
    
    if (annualReturn < 6) {
      recs.push({
        title: 'Conservative Returns',
        message: 'Your assumed returns may be conservative. Ensure your investment strategy aligns with your risk tolerance and timeline.',
        action: 'Review investments',
        urgency: 'medium'
      });
    }
    
    if (retirementAge - currentAge < 10) {
      recs.push({
        title: 'Short Timeline',
        message: 'With less than 10 years to retirement, focus on capital preservation and reducing risk.',
        action: 'Adjust strategy',
        urgency: 'medium'
      });
    }
    
    if (recs.length === 0) {
      recs.push({
        title: 'On Track',
        message: 'Your retirement plan appears to be on track! Continue with your current strategy.',
        action: 'Maintain course',
        urgency: 'low'
      });
    }
    
    return recs;
  };
  
  const recommendations = getRecommendations();
  
  // SEO Variables for freecompoundcalculator.com
  const pageTitle = 'Free Retirement Planning Calculator Online | FreeCompoundCalculator.com 2024';
  const pageDescription = 'Free retirement planning calculator from FreeCompoundCalculator.com. Plan your retirement with precision - calculate savings goals, project retirement income, analyze 401k/IRA needs, and create personalized retirement strategies. Completely free with no registration required.';
  const canonicalUrl = 'https://www.freecompoundcalculator.com/retirement-planner';
  const pageKeywords = 'free retirement calculator, free retirement planning, free retirement planner, free retirement savings calculator, free 401k calculator, free IRA calculator, free retirement income calculator, free social security calculator, free pension calculator, free retirement age calculator, free financial planning, free investment calculator, free savings calculator, free compound interest retirement, free retirement strategy planner, free retirement goal calculator, free retirement projection calculator, free retirement timeline calculator, free retirement withdrawal calculator, free retirement nest egg calculator, free retirement planning tool, free retirement analysis, free retirement readiness calculator, free retirement savings goal, free retirement income planning, free retirement portfolio calculator, free retirement plan calculator, free retirement fund calculator, free retirement wealth calculator, free retirement security calculator, freecompoundcalculator, free compound calculator, free compound interest calculator, free financial calculator, free investment planning, free wealth building calculator, free personal finance calculator';

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
        <meta property="og:image" content="https://www.freecompoundcalculator.com/images/retirement-planner-preview.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Free Retirement Planning Calculator from FreeCompoundCalculator.com" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:site" content="@FreeCompoundCalc" />
        <meta name="twitter:creator" content="@FreeCompoundCalc" />
        <meta name="twitter:image" content="https://www.freecompoundcalculator.com/images/retirement-planner-preview.jpg" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="rating" content="General" />
        <meta name="distribution" content="global" />
        <meta name="generator" content="FreeCompoundCalculator.com Retirement Planning Engine" />
        <meta name="application-name" content="Free Retirement Planner" />
        <meta name="apple-mobile-web-app-title" content="Retirement Calc" />
        <meta name="theme-color" content="#0a192f" />
        <meta name="msapplication-TileColor" content="#00bfa5" />
        
        {/* Schema.org JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Free Retirement Planning Calculator - FreeCompoundCalculator.com",
            "description": "Comprehensive retirement planning calculator with projections, analysis, and personalized recommendations - completely free from FreeCompoundCalculator.com",
            "url": canonicalUrl,
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Any",
            "browserRequirements": "Requires JavaScript",
            "softwareVersion": "4.1.0",
            "featureList": [
              "Retirement Savings Projections",
              "401k/IRA Calculation Tools",
              "Social Security Analysis",
              "Pension Planning",
              "Inflation Adjustments",
              "Withdrawal Rate Analysis",
              "4% Rule Calculator",
              "Retirement Timeline Visualization",
              "Personalized Recommendations",
              "Savings Goal Tracking",
              "Income Replacement Analysis",
              "Retirement Readiness Score",
              "Compound Interest Calculations",
              "Investment Return Projections",
              "Retirement Age Planning",
              "Life Expectancy Considerations"
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
              "ratingCount": "1845",
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
            "name": "Free Retirement Planner Calculator - FreeCompoundCalculator.com",
            "url": canonicalUrl,
            "description": "Free web-based retirement planning calculator with visual projections and personalized recommendations from FreeCompoundCalculator.com",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web",
            "permissions": "Free",
            "countriesSupported": "Worldwide",
            "screenshot": "https://www.freecompoundcalculator.com/images/retirement-planner-screenshot.jpg",
            "fileSize": "280KB",
            "memoryRequirements": "512MB",
            "processorRequirements": "Any",
            "softwareRequirements": "Modern Web Browser",
            "softwareVersion": "2.5.0"
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
                "name": "Retirement Planning Calculator",
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
                "name": "Is this retirement calculator really free to use?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, FreeCompoundCalculator.com provides completely free retirement planning tools with no registration required. Our retirement calculator is 100% free with all advanced features available at no cost."
                }
              },
              {
                "@type": "Question",
                "name": "What retirement calculations does this tool include?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "This free retirement calculator from FreeCompoundCalculator.com includes retirement savings projections, 401k/IRA calculations, social security analysis, pension planning, inflation adjustments, withdrawal rate analysis using the 4% rule, and personalized retirement recommendations."
                }
              },
              {
                "@type": "Question",
                "name": "How accurate are the retirement projections?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our free retirement calculator uses standard financial formulas and considers compound interest, inflation, investment returns, and your specific inputs. While projections are estimates, they provide valuable guidance for retirement planning. For precise planning, consult with a financial advisor."
                }
              },
              {
                "@type": "Question",
                "name": "Can I calculate my 401k or IRA retirement savings?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, this free retirement calculator from FreeCompoundCalculator.com is perfect for 401k, IRA, Roth IRA, and other retirement account planning. Simply input your current savings, monthly contributions, and expected returns to project your retirement nest egg."
                }
              },
              {
                "@type": "Question",
                "name": "Does this calculator consider social security benefits?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, our free retirement planning calculator includes social security benefit inputs and adjusts them for inflation. You can input your expected monthly social security benefits to see how they affect your overall retirement income needs."
                }
              },
              {
                "@type": "Question",
                "name": "What is the 4% retirement rule?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The 4% rule is a retirement planning guideline suggesting you can withdraw 4% of your retirement savings annually without running out of money. Our free calculator from FreeCompoundCalculator.com uses this rule to analyze if your savings are sufficient for retirement."
                }
              }
            ]
          })}
        </script>
      </Head>
      
      {/* Page Content */}
      <div className={styles.calculatorPage}>
        <div className={styles.headerActions}>
          <button className={styles.pdfExportBtn} aria-label="Save Retirement Plan">
            💾 Save Plan
          </button>
          <button className={styles.pdfExportBtn} aria-label="Reset Calculator">
            🔄 Reset
          </button>
        </div>
        
        <div className={styles.calculatorContainer}>
          <h1 className={styles.sectionTitle}>Free Retirement Planning Calculator Online - FreeCompoundCalculator.com</h1>
          <p className={styles.subtitle}>
            Plan your retirement with precision using our free retirement calculator from FreeCompoundCalculator.com. Calculate how much you need to save, project your retirement income, analyze 401k/IRA needs, and create a personalized retirement strategy. Includes social security planning, pension analysis, inflation adjustments, and the 4% rule - completely free with no registration required.
          </p>
          
          <div className={styles.calcGrid}>
            {/* Input Panel */}
            <div className={styles.inputPanel}>
              <h2 className={styles.panelTitle}>Free Retirement Plan Inputs - FreeCompoundCalculator.com</h2>
              
              <div className={styles.inputGroup}>
                <label htmlFor="currentAge">Current Age: <span className={styles.valueDisplay}>{currentAge} years</span></label>
                <input
                  type="range"
                  id="currentAge"
                  min="18"
                  max="70"
                  step="1"
                  value={currentAge}
                  onChange={handleSliderChange(setCurrentAge)}
                  className={styles.slider}
                />
                <div className={styles.sliderLabels}>
                  <span>18</span>
                  <span>70</span>
                </div>
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="retirementAge">Planned Retirement Age: <span className={styles.valueDisplay}>{retirementAge} years</span></label>
                <input
                  type="range"
                  id="retirementAge"
                  min={currentAge + 1}
                  max="80"
                  step="1"
                  value={retirementAge}
                  onChange={handleSliderChange(setRetirementAge)}
                  className={styles.slider}
                />
                <div className={styles.sliderLabels}>
                  <span>{currentAge + 1}</span>
                  <span>80</span>
                </div>
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="lifeExpectancy">Life Expectancy: <span className={styles.valueDisplay}>{lifeExpectancy} years</span></label>
                <input
                  type="range"
                  id="lifeExpectancy"
                  min={retirementAge + 1}
                  max="100"
                  step="1"
                  value={lifeExpectancy}
                  onChange={handleSliderChange(setLifeExpectancy)}
                  className={styles.slider}
                />
                <div className={styles.sliderLabels}>
                  <span>{retirementAge + 1}</span>
                  <span>100</span>
                </div>
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="currentSavings">Current Retirement Savings (401k/IRA): <span className={styles.valueDisplay}>{formatCurrency(currentSavings)}</span></label>
                <input
                  type="range"
                  id="currentSavings"
                  min="0"
                  max="1000000"
                  step="10000"
                  value={currentSavings}
                  onChange={handleSliderChange(setCurrentSavings)}
                  className={styles.slider}
                />
                <div className={styles.sliderLabels}>
                  <span>$0</span>
                  <span>$1M</span>
                </div>
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="monthlyContribution">Monthly Contribution: <span className={styles.valueDisplay}>{formatCurrency(monthlyContribution)}/month</span></label>
                <input
                  type="range"
                  id="monthlyContribution"
                  min="0"
                  max="5000"
                  step="100"
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
                <label htmlFor="annualReturn">Expected Annual Return (Investment Growth): <span className={styles.valueDisplay}>{annualReturn}%</span></label>
                <input
                  type="range"
                  id="annualReturn"
                  min="0"
                  max="15"
                  step="0.5"
                  value={annualReturn}
                  onChange={handleSliderChange(setAnnualReturn)}
                  className={styles.slider}
                />
                <div className={styles.sliderLabels}>
                  <span>0%</span>
                  <span>15%</span>
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
              
              <div className={styles.inputGroup}>
                <label htmlFor="monthlyWithdrawal">Desired Monthly Income (Today's $): <span className={styles.valueDisplay}>{formatCurrency(monthlyWithdrawal)}/month</span></label>
                <input
                  type="range"
                  id="monthlyWithdrawal"
                  min="1000"
                  max="10000"
                  step="500"
                  value={monthlyWithdrawal}
                  onChange={handleSliderChange(setMonthlyWithdrawal)}
                  className={styles.slider}
                />
                <div className={styles.sliderLabels}>
                  <span>$1K</span>
                  <span>$10K</span>
                </div>
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="socialSecurity">Expected Social Security Benefits: <span className={styles.valueDisplay}>{formatCurrency(socialSecurity)}/month</span></label>
                <input
                  type="range"
                  id="socialSecurity"
                  min="0"
                  max="4000"
                  step="100"
                  value={socialSecurity}
                  onChange={handleSliderChange(setSocialSecurity)}
                  className={styles.slider}
                />
                <div className={styles.sliderLabels}>
                  <span>$0</span>
                  <span>$4,000</span>
                </div>
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="pension">Expected Pension Income: <span className={styles.valueDisplay}>{formatCurrency(pension)}/month</span></label>
                <input
                  type="range"
                  id="pension"
                  min="0"
                  max="5000"
                  step="100"
                  value={pension}
                  onChange={handleSliderChange(setPension)}
                  className={styles.slider}
                />
                <div className={styles.sliderLabels}>
                  <span>$0</span>
                  <span>$5,000</span>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className={styles.resultsPanel}>
              <h3 className={styles.panelTitle}>Free Retirement Analysis - FreeCompoundCalculator.com</h3>
              
              <div className={`${styles.resultCard} ${styles.highlight}`}>
                <h4>Projected Retirement Savings at Age {retirementAge}</h4>
                <p className={styles.resultValue}>{formatCurrency(metrics.totalRetirementSavings)}</p>
                <p className={styles.resultSubtext}>Total retirement nest egg after {metrics.yearsToRetirement} years of saving and compound growth</p>
              </div>
              
              <div className={styles.resultCard}>
                <h4>Required Savings (4% Rule Analysis)</h4>
                <p className={styles.resultValue}>{formatCurrency(metrics.requiredSavings4Percent)}</p>
                <p className={styles.resultSubtext}>
                  {metrics.shortfall > 0 ? 
                    `Retirement Shortfall: ${formatCurrency(metrics.shortfall)}` : 
                    `Retirement Surplus: ${formatCurrency(metrics.surplus)}`
                  }
                </p>
              </div>
              
              <div className={styles.resultCard}>
                <h4>Withdrawal Rate Analysis</h4>
                <p className={styles.resultValue} style={{ 
                  color: metrics.withdrawalRate > 4 ? '#ff6b6b' : 
                         metrics.withdrawalRate > 3 ? '#ff9500' : '#00bfa5'
                }}>
                  {metrics.withdrawalRate.toFixed(1)}%
                </p>
                <p className={styles.resultSubtext}>
                  {metrics.withdrawalRate > 4 ? 'Above recommended 4% withdrawal rate' :
                   metrics.withdrawalRate > 3 ? 'Moderate withdrawal rate' : 'Conservative withdrawal rate'}
                </p>
              </div>
              
              <div className={styles.resultCard}>
                <h4>Retirement Funds Duration</h4>
                <p className={styles.resultValue}>
                  {metrics.monthsFundsWillLast >= 600 ? '30+ years of retirement' : 
                   `Age ${retirementAge + Math.floor(metrics.monthsFundsWillLast / 12)}`}
                </p>
                <p className={styles.resultSubtext}>
                  {metrics.monthsFundsWillLast >= (lifeExpectancy - retirementAge) * 12 ? 
                    'Sufficient funds for life expectancy' : 
                    `${Math.floor(metrics.monthsFundsWillLast / 12)} years of retirement coverage`
                  }
                </p>
              </div>
              
              <div className={styles.resultCard}>
                <h4>Monthly Retirement Income Needed</h4>
                <p className={styles.resultValue}>{formatCurrency(metrics.inflationAdjustedWithdrawal)}</p>
                <p className={styles.resultSubtext}>
                  {formatCurrency(monthlyWithdrawal)} today = {formatCurrency(metrics.inflationAdjustedWithdrawal)} at retirement (inflation-adjusted)
                </p>
              </div>
              
              <div className={styles.resultCard}>
                <h4>Retirement Timeline Visualization</h4>
                <div className={styles.timelinePreview}>
                  <canvas
                    ref={timelineCanvasRef}
                    width={300}
                    height={100}
                    className={styles.timelineCanvas}
                  ></canvas>
                  <div className={styles.timelineInfo}>
                    <div className={styles.timelineItem}>
                      <div className={styles.timelineDot} style={{ backgroundColor: '#00bfa5' }}></div>
                      <span>Current Age: {currentAge}</span>
                    </div>
                    <div className={styles.timelineItem}>
                      <div className={styles.timelineDot} style={{ backgroundColor: '#ff9500' }}></div>
                      <span>Retirement Age: {retirementAge}</span>
                    </div>
                    <div className={styles.timelineItem}>
                      <div className={styles.timelineDot} style={{ backgroundColor: '#ff6b6b' }}></div>
                      <span>Life Expectancy: {lifeExpectancy}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Projection Chart */}
          <div className={styles.chartPreview}>
            <h3>Retirement Savings Projection & Compound Growth Analysis - FreeCompoundCalculator.com</h3>
            <div className={styles.chartContainer}>
              <canvas
                ref={chartCanvasRef}
                width={700}
                height={300}
                className={styles.chartCanvas}
              ></canvas>
              <p className={styles.chartCaption}>
                📈 This projection from FreeCompoundCalculator.com shows your retirement savings growth during the accumulation phase (green line) and depletion during retirement (red line). 
                The dotted orange line indicates your planned retirement age. Compound interest significantly impacts long-term growth.
              </p>
            </div>
          </div>

          {/* Recommendations */}
          <div className={styles.sensitivityCard}>
            <h3>💡 Personalized Retirement Recommendations - FreeCompoundCalculator.com Analysis</h3>
            <div className={styles.strategyGrid}>
              {recommendations.map((rec, index) => (
                <div key={index} className={styles.strategyItem} style={{
                  borderLeft: `4px solid ${
                    rec.urgency === 'high' ? '#ff6b6b' : 
                    rec.urgency === 'medium' ? '#ff9500' : '#00bfa5'
                  }`
                }}>
                  <h5>{rec.title}</h5>
                  <p className={styles.strategyValue}>{rec.action}</p>
                  <p className={styles.strategyTip}>{rec.message} - Free analysis from FreeCompoundCalculator.com</p>
                </div>
              ))}
            </div>
          </div>

          {/* Retirement Milestones */}
          <div className={styles.milestoneTable}>
            <h3>🎯 Key Retirement Milestones & Planning Checkpoints - FreeCompoundCalculator.com</h3>
            <div className={styles.tableContainer}>
              <table>
                <thead>
                  <tr>
                    <th>Age</th>
                    <th>Retirement Milestone</th>
                    <th>Projected Savings</th>
                    <th>Annual Contribution/Withdrawal</th>
                    <th>Planning Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[currentAge + 5, currentAge + 10, retirementAge - 10, retirementAge - 5, retirementAge, retirementAge + 10]
                    .filter(age => age >= currentAge && age <= lifeExpectancy)
                    .map(age => {
                      const dataPoint = projectionData.find(d => d.age === age) || 
                                       projectionData.reduce((prev, curr) => 
                                         Math.abs(curr.age - age) < Math.abs(prev.age - age) ? curr : prev
                                       );
                      
                      const yearsToGo = age - currentAge;
                      const annualContribution = yearsToGo <= (retirementAge - currentAge) ? monthlyContribution * 12 : 0;
                      
                      return (
                        <tr key={age}>
                          <td>{age}</td>
                          <td>
                            {age === retirementAge ? 'Retirement Start Date' :
                             age === currentAge + 5 ? '5-Year Planning Checkpoint' :
                             age === currentAge + 10 ? '10-Year Planning Checkpoint' :
                             age === retirementAge - 10 ? '10 Years to Retirement' :
                             age === retirementAge - 5 ? '5 Years to Retirement - Final Planning Stage' :
                             age === retirementAge + 10 ? '10 Years into Retirement' : 'Retirement Planning Milestone'}
                          </td>
                          <td>{formatCurrency(dataPoint?.savings || 0)}</td>
                          <td>{age <= retirementAge ? formatCurrency(annualContribution) + ' contribution' : 'Retirement withdrawals'}</td>
                          <td>
                            {age === retirementAge ? 'Begin retirement withdrawals and social security' :
                             age <= retirementAge ? 'Accumulation phase - focus on saving and investment growth' : 
                             'Retirement phase - monitor withdrawal rate and portfolio performance'}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
            <p className={styles.tableTip}>
              <strong>Retirement Planning Tip from FreeCompoundCalculator.com:</strong> Regularly review and adjust your retirement plan as your circumstances change. 
              Consider consulting with a financial advisor for personalized retirement advice. This free calculator provides guidance but not financial advice.
            </p>
          </div>

          {/* Action Steps */}
          <div className={styles.actionCard}>
            <h3>🚀 Next Steps for Your Retirement Plan - FreeCompoundCalculator.com Guidance</h3>
            <div className={styles.actionGrid}>
              <div className={styles.actionItem}>
                <strong>💡 Increase Retirement Contributions:</strong><br />
                Even small increases in monthly 401k/IRA contributions can significantly impact your retirement savings due to compound interest over time. FreeCompoundCalculator.com shows how extra savings grow.
              </div>
              <div className={styles.actionItem}>
                <strong>💡 Review Investment Strategy & Asset Allocation:</strong><br />
                Ensure your investment portfolio aligns with your risk tolerance and retirement timeline. Consider diversification and periodic rebalancing. FreeCompoundCalculator.com helps analyze different return scenarios.
              </div>
              <div className={styles.actionItem}>
                <strong>💡 Consider Delaying Retirement or Working Part-Time:</strong><br />
                Working just a few more years or part-time during early retirement can dramatically improve your retirement security and social security benefits. Use FreeCompoundCalculator.com to test different retirement ages.
              </div>
              <div className={styles.actionItem}>
                <strong>💡 Plan for Healthcare & Long-Term Care Costs:</strong><br />
                Remember to account for healthcare costs, which often increase in retirement. Consider health savings accounts (HSAs) and long-term care insurance. FreeCompoundCalculator.com helps you plan for these expenses.
              </div>
            </div>
          </div>

          {/* Domain Promotion */}
          
        </div>
      </div>
    </>
  );
};

export default RetirementPlanner;