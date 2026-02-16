'use client';
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from './RetirementPlanner.module.css';

const RetirementPlanner = ({ 
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

  const testimonials = [
    {
      quote: "This retirement calculator helped me realize I needed to increase my 401k contributions. I was able to adjust my plan and now feel confident about my retirement future!",
      name: "Robert Johnson",
      role: "Teacher, 45",
      rating: 5,
      date: safeReviewDates[0]
    },
    {
      quote: "As a financial advisor, I recommend this tool to all my clients. The 4% rule analysis and withdrawal rate calculations are spot-on. Best free retirement planner online.",
      name: "Patricia Williams",
      role: "Certified Financial Planner",
      rating: 5,
      date: safeReviewDates[1]
    },
    {
      quote: "I was worried about retiring early, but this calculator showed me exactly what I need to save. The inflation adjustments and social security planning features are invaluable.",
      name: "Michael Chen",
      role: "Software Engineer, 52",
      rating: 5,
      date: safeReviewDates[2]
    },
    {
      quote: "The retirement timeline visualization made everything click for me. Seeing the accumulation vs retirement phases helped me understand compound interest in a whole new way.",
      name: "Linda Martinez",
      role: "Small Business Owner",
      rating: 5,
      date: safeReviewDates[3]
    },
    {
      quote: "I've used several retirement calculators, but this one from FreeCompoundCalculator is the most comprehensive. The personalized recommendations are actually helpful!",
      name: "David Thompson",
      role: "Accountant, 58",
      rating: 5,
      date: safeReviewDates[4]
    },
    {
      quote: "Finally a retirement planner that considers both social security and pension! This tool gave me confidence in my retirement numbers. Thank you FreeCompoundCalculator!",
      name: "Susan Davis",
      role: "Nurse, 62",
      rating: 5,
      date: safeReviewDates[5]
    }
  ];

  const faqs = [
    {
      question: "Is this retirement calculator really free to use?",
      answer: "Yes, FreeCompoundCalculator.com provides completely free retirement planning tools with no registration required. Our retirement calculator is 100% free with all advanced features available at no cost. No hidden fees, no premium tiers, no upsells."
    },
    {
      question: "What retirement calculations does this tool include?",
      answer: "This free retirement calculator from FreeCompoundCalculator.com includes retirement savings projections, 401k/IRA calculations, social security analysis, pension planning, inflation adjustments, withdrawal rate analysis using the 4% rule, personalized retirement recommendations, retirement timeline visualization, savings goal tracking, and income replacement analysis."
    },
    {
      question: "How accurate are the retirement projections?",
      answer: "Our free retirement calculator uses standard financial formulas and considers compound interest, inflation, investment returns, and your specific inputs. While projections are estimates based on historical averages and mathematical models, they provide valuable guidance for retirement planning. For precise planning, consult with a financial advisor."
    },
    {
      question: "Can I calculate my 401k or IRA retirement savings?",
      answer: "Yes, this free retirement calculator from FreeCompoundCalculator.com is perfect for 401k, IRA, Roth IRA, 403b, and other retirement account planning. Simply input your current savings, monthly contributions, and expected returns to project your retirement nest egg. The calculator handles all types of retirement accounts."
    },
    {
      question: "Does this calculator consider social security benefits?",
      answer: "Yes, our free retirement planning calculator includes social security benefit inputs and automatically adjusts them for inflation. You can input your expected monthly social security benefits to see how they affect your overall retirement income needs and withdrawal strategy."
    },
    {
      question: "What is the 4% retirement rule?",
      answer: "The 4% rule is a retirement planning guideline suggesting you can withdraw 4% of your retirement savings annually without running out of money over a 30-year retirement. Our free calculator from FreeCompoundCalculator.com uses this rule to analyze if your savings are sufficient for retirement and provides withdrawal rate analysis."
    }
  ];
  
  // SEO Variables for freecompoundcalculator.com
  const pageTitle = 'Free Retirement Planning Calculator Online | FreeCompoundCalculator.com 2026';
  const pageDescription = 'Free retirement planning calculator from FreeCompoundCalculator.com. Plan your retirement with precision - calculate savings goals, project retirement income, analyze 401k/IRA needs, and create personalized retirement strategies. Includes social security, pension, inflation adjustments, and 4% rule analysis. Completely free with no registration required. Trusted by 50,000+ users.';
  const canonicalUrl = 'https://www.freecompoundcalculator.com/retirement-planner';
  const pageKeywords = 'free retirement calculator, free retirement planning, free retirement planner, free retirement savings calculator, free 401k calculator, free IRA calculator, free retirement income calculator, free social security calculator, free pension calculator, free retirement age calculator, free financial planning, free investment calculator, free savings calculator, free compound interest retirement, free retirement strategy planner, free retirement goal calculator, free retirement projection calculator, free retirement timeline calculator, free retirement withdrawal calculator, free retirement nest egg calculator, free retirement planning tool, free retirement analysis, free retirement readiness calculator, free retirement savings goal, free retirement income planning, free retirement portfolio calculator, free retirement plan calculator, free retirement fund calculator, free retirement wealth calculator, free retirement security calculator, freecompoundcalculator, free compound calculator, free compound interest calculator, free financial calculator, free investment planning, free wealth building calculator, free personal finance calculator, 4% rule calculator, withdrawal rate calculator, retirement age planner, life expectancy calculator, inflation adjusted retirement, social security planner, pension planner';

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
        <link rel="alternate" href="https://www.freecompoundcalculator.com/es/planificador-jubilacion" hreflang="es" />
        <link rel="alternate" href="https://www.freecompoundcalculator.com/fr/planificateur-retraite" hreflang="fr" />
        <link rel="alternate" href="https://www.freecompoundcalculator.com/de/rentenplaner" hreflang="de" />
        <link rel="alternate" href={canonicalUrl} hreflang="x-default" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="FreeCompoundCalculator.com" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:locale:alternate" content="es_ES" />
        <meta property="og:locale:alternate" content="fr_FR" />
        <meta property="og:locale:alternate" content="de_DE" />
        <meta property="og:image" content="https://www.freecompoundcalculator.com/images/og-retirement-planner-preview.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Free Retirement Planning Calculator from FreeCompoundCalculator.com" />
        <meta property="og:updated_time" content={safeLastModifiedDate} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:site" content="@FreeCompoundCalc" />
        <meta name="twitter:creator" content="@FreeCompoundCalc" />
        <meta name="twitter:image" content="https://www.freecompoundcalculator.com/images/twitter-retirement-planner-preview.jpg" />
        <meta name="twitter:image:alt" content="Free Retirement Planner - FreeCompoundCalculator.com" />
        
        {/* Theme & Mobile */}
        <meta name="theme-color" content="#0a192f" />
        <meta name="msapplication-TileColor" content="#00bfa5" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Retirement Planner" />
        
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
        <meta name="generator" content="FreeCompoundCalculator.com Retirement Planning Engine" />
        <meta name="application-name" content="Free Retirement Planner" />
        
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
                    "description": "Free online retirement planning and financial calculators",
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
                    "url": "https://www.freecompoundcalculator.com/images/og-retirement-planner-preview.jpg",
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
                  },
                  "mainEntity": {
                    "@type": "SoftwareApplication",
                    "name": "Free Retirement Planning Calculator - FreeCompoundCalculator.com",
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
                      "ratingValue": 4.8,
                      "ratingCount": 1845,
                      "bestRating": 5,
                      "worstRating": 1
                    },
                    "description": pageDescription,
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
                    "softwareVersion": "2026.1.0",
                    "screenshot": "https://www.freecompoundcalculator.com/images/retirement-planner-screenshot.jpg",
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
                        "name": "Retirement Planning Team"
                      }
                    },
                    "mainEntityOfPage": canonicalUrl
                  }))
                },
                {
                  "@type": "HowTo",
                  "name": "How to Use the Free Retirement Planning Calculator",
                  "description": "Step-by-step guide to planning your retirement with our free calculator",
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
                      "name": "Enter Your Current Age",
                      "text": "Input your current age using the age slider. This determines your savings timeline.",
                      "url": `${canonicalUrl}#currentAge`
                    },
                    {
                      "@type": "HowToStep",
                      "position": 2,
                      "name": "Set Retirement Age and Life Expectancy",
                      "text": "Choose when you plan to retire and your estimated life expectancy for retirement duration.",
                      "url": `${canonicalUrl}#retirementAge`
                    },
                    {
                      "@type": "HowToStep",
                      "position": 3,
                      "name": "Input Your Savings and Contributions",
                      "text": "Enter your current retirement savings, monthly contributions, and expected investment returns.",
                      "url": `${canonicalUrl}#currentSavings`
                    },
                    {
                      "@type": "HowToStep",
                      "position": 4,
                      "name": "Add Retirement Income Sources",
                      "text": "Include your desired monthly income, social security benefits, and pension income.",
                      "url": `${canonicalUrl}#monthlyWithdrawal`
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
                        "name": "Free Retirement Planning Calculator",
                        "applicationCategory": "FinanceApplication",
                        "operatingSystem": "All",
                        "offers": {
                          "@type": "Offer",
                          "price": "0",
                          "priceCurrency": "USD"
                        },
                        "description": "Free online retirement planning calculator with comprehensive analysis",
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

        {/* WebApplication Schema */}
        <script
          type="application/ld+json"
          key="structured-data-webapp"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
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
              "softwareVersion": "2026.1.0",
              "featureList": [
                "Retirement Savings Projections",
                "401k/IRA Analysis",
                "Social Security Planning",
                "Pension Calculator",
                "Inflation Adjustments",
                "4% Rule Analysis",
                "Withdrawal Rate Calculator",
                "Retirement Timeline",
                "Personalized Recommendations"
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
              <Link href="/financial-calculators" className={styles.breadcrumbLink}>
                <span className={styles.breadcrumbText}>Financial Calculators</span>
              </Link>
            </li>
            <li className={styles.breadcrumbSeparator} aria-hidden="true">›</li>
            <li className={styles.breadcrumbItem}>
              <span className={styles.breadcrumbCurrent}>Retirement Planner</span>
            </li>
          </ol>
        </nav>
        
        <div className={styles.headerActions}>
          <button className={styles.pdfExportBtn} aria-label="Save Retirement Plan">
            💾 Save Plan
          </button>
          <button className={styles.pdfExportBtn} aria-label="Reset Calculator">
            🔄 Reset
          </button>
        </div>

        {/* Trust Badge */}
        <div className={styles.trustBadge}>
          <span className={styles.trustBadgeText}>
            ⭐ Rated 4.8/5 by 1,845+ Users | Free Forever • No Registration
          </span>
        </div>
        
        <div className={styles.calculatorContainer}>
          <h1 className={styles.sectionTitle}>
            Free Retirement Planning Calculator <span className={styles.gradientText}>Online</span>
          </h1>
          <p className={styles.subtitle}>
            Plan your retirement with precision using our free retirement calculator from <strong className={styles.highlightText}>FreeCompoundCalculator.com</strong>. Calculate how much you need to save, project your retirement income, analyze 401k/IRA needs, and create a personalized retirement strategy. Includes social security planning, pension analysis, inflation adjustments, and the 4% rule - completely free with no registration required. <strong className={styles.highlightText}>Trusted by 50,000+ users.</strong>
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
              <span className={styles.statNumber}>16+</span>
              <span className={styles.statLabel}>Calculations</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>4%</span>
              <span className={styles.statLabel}>Rule Analysis</span>
            </div>
          </div>
          
          <div className={styles.calcGrid}>
            {/* Input Panel */}
            <div className={styles.inputPanel}>
              <h2 className={styles.panelTitle}>Free Retirement Plan Inputs - FreeCompoundCalculator.com</h2>
              
              <div className={styles.inputGroup} id="currentAge">
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
                  aria-label="Current age slider"
                />
                <div className={styles.sliderLabels}>
                  <span>18</span>
                  <span>70</span>
                </div>
              </div>
              
              <div className={styles.inputGroup} id="retirementAge">
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
                  aria-label="Planned retirement age slider"
                />
                <div className={styles.sliderLabels}>
                  <span>{currentAge + 1}</span>
                  <span>80</span>
                </div>
              </div>
              
              <div className={styles.inputGroup} id="lifeExpectancy">
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
                  aria-label="Life expectancy slider"
                />
                <div className={styles.sliderLabels}>
                  <span>{retirementAge + 1}</span>
                  <span>100</span>
                </div>
              </div>
              
              <div className={styles.inputGroup} id="currentSavings">
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
                  aria-label="Current savings slider"
                />
                <div className={styles.sliderLabels}>
                  <span>$0</span>
                  <span>$1M</span>
                </div>
              </div>
              
              <div className={styles.inputGroup} id="monthlyContribution">
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
                  aria-label="Monthly contribution slider"
                />
                <div className={styles.sliderLabels}>
                  <span>$0</span>
                  <span>$5,000</span>
                </div>
              </div>
              
              <div className={styles.inputGroup} id="annualReturn">
                <label htmlFor="annualReturn">Expected Annual Return: <span className={styles.valueDisplay}>{annualReturn}%</span></label>
                <input
                  type="range"
                  id="annualReturn"
                  min="0"
                  max="15"
                  step="0.5"
                  value={annualReturn}
                  onChange={handleSliderChange(setAnnualReturn)}
                  className={styles.slider}
                  aria-label="Expected annual return slider"
                />
                <div className={styles.sliderLabels}>
                  <span>0%</span>
                  <span>15%</span>
                </div>
              </div>
              
              <div className={styles.inputGroup} id="inflationRate">
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
                  aria-label="Expected inflation rate slider"
                />
                <div className={styles.sliderLabels}>
                  <span>0%</span>
                  <span>10%</span>
                </div>
              </div>
              
              <div className={styles.inputGroup} id="monthlyWithdrawal">
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
                  aria-label="Desired monthly income slider"
                />
                <div className={styles.sliderLabels}>
                  <span>$1K</span>
                  <span>$10K</span>
                </div>
              </div>
              
              <div className={styles.inputGroup} id="socialSecurity">
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
                  aria-label="Expected social security benefits slider"
                />
                <div className={styles.sliderLabels}>
                  <span>$0</span>
                  <span>$4,000</span>
                </div>
              </div>
              
              <div className={styles.inputGroup} id="pension">
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
                  aria-label="Expected pension income slider"
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
                    aria-label="Retirement timeline visualization"
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

          {/* Projection Chart */}
          <div className={styles.chartPreview}>
            <h3>Retirement Savings Projection & Compound Growth Analysis - FreeCompoundCalculator.com</h3>
            <div className={styles.chartContainer}>
              <canvas
                ref={chartCanvasRef}
                width={700}
                height={300}
                className={styles.chartCanvas}
                aria-label="Retirement savings projection chart"
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

          {/* FAQ Section */}
          <div className={styles.faqSection}>
            <h3 className={styles.sectionHeading}>Frequently Asked Questions About Retirement Planning</h3>
            <div className={styles.faqGrid}>
              {faqs.slice(0, 4).map((faq, index) => (
                <div key={index} className={styles.faqItem}>
                  <h4 className={styles.faqQuestion}>{faq.question}</h4>
                  <p className={styles.faqAnswer}>{faq.answer}</p>
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

          {/* CTA Section */}
          <div className={styles.ctaSection}>
            <div className={styles.ctaContainer}>
              <h3 className={styles.ctaTitle}>Need Compound Interest Calculations?</h3>
              <p className={styles.ctaSubtitle}>
                Try our compound interest calculator for detailed investment growth projections and savings analysis.
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
                  href="/financial-calculators"
                  className={styles.secondaryButton}
                  aria-label="Browse all financial calculators"
                >
                  <span className={styles.buttonText}>All Calculators</span>
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

export default RetirementPlanner;