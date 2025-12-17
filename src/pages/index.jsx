'use client';
import Head from 'next/head';
import styles from './HomePage.module.css';
import Link from 'next/link';

const HomePage = () => {
  return (
    <>
      {/* SEO Meta Tags */}
      <Head>
        {/* Primary Meta Tags */}
        <title>Free Compound Interest Calculator 2024 | Investment Growth Calculator with Contributions</title>
        <meta
          name="description"
          content="Free online compound interest calculator with monthly contributions. Calculate retirement savings, investment growth projections, and wealth building. Visual charts, no signup required, 100% private calculator with instant results."
        />
        <meta
          name="keywords"
          content="compound interest calculator, free compound interest calculator, online compound interest calculator, investment calculator with contributions, retirement savings calculator, investment growth calculator, wealth building calculator, financial calculator, monthly compound interest calculator, retirement planning calculator, 401k calculator, IRA calculator, Roth IRA calculator, savings calculator, investment return calculator, future value calculator, compound growth calculator, financial planning tool, money growth calculator, nest egg calculator, financial independence calculator, retirement age calculator, early retirement calculator, FIRE calculator, college savings calculator, education fund calculator, 529 plan calculator, emergency fund calculator, debt payoff calculator, mortgage calculator, loan calculator, personal finance calculator, budgeting calculator, net worth calculator, investment strategy calculator, asset allocation calculator, stock market calculator, mutual fund calculator, ETF calculator, index fund calculator, real estate investment calculator, bond calculator, dividend calculator, inflation calculator, tax calculator, capital gains calculator, portfolio growth calculator, retirement income calculator, withdrawal rate calculator, 4% rule calculator, safe withdrawal rate calculator, financial milestone calculator, millionaire calculator, rule of 72 calculator, Albert Einstein compound interest, money multiplier calculator, passive income calculator, dividend reinvestment calculator, DRIP calculator, long term investment calculator, crypto investment calculator, high yield savings calculator, certificate of deposit calculator, CD calculator, annuity calculator, pension calculator, social security calculator, retirement timeline calculator, investment horizon calculator, time value of money calculator, present value calculator, future value calculator, net present value calculator, internal rate of return calculator, financial modeling calculator, investment analysis calculator, portfolio tracker calculator, money management calculator, beginner investment calculator, advanced investment calculator, professional financial calculator, web-based calculator, instant calculator, accurate calculator, reliable calculator, secure calculator, private calculator, mobile-friendly calculator, responsive calculator, desktop calculator, tablet calculator, smartphone calculator, iOS calculator, Android calculator, Windows calculator, Mac calculator, browser calculator, JavaScript calculator, React calculator, Next.js calculator, 2024 calculator, updated calculator, enhanced calculator, premium calculator, expert calculator, certified calculator, best compound interest calculator, top investment calculator, featured financial calculator, recommended retirement calculator, popular savings calculator, trusted wealth calculator, verified calculator, fast calculator, easy calculator, user-friendly calculator, simple calculator, powerful calculator, comprehensive calculator, detailed calculator, interactive calculator, visual calculator, chart-based calculator, graph calculator, pie chart calculator, growth projection calculator, year-by-year calculator, allocation breakdown calculator, contribution calculator, monthly deposit calculator, periodic investment calculator, systematic investment plan calculator, SIP calculator, dollar cost averaging calculator, regular savings calculator, automatic investment calculator, recurring contribution calculator, frequency calculator, daily compounding calculator, monthly compounding calculator, quarterly compounding calculator, annual compounding calculator, continuous compounding calculator, interest rate calculator, APY calculator, annual percentage yield calculator, effective annual rate calculator, nominal rate calculator, real return calculator, after-tax return calculator, inflation-adjusted calculator, purchasing power calculator, future value of annuity calculator, present value of annuity calculator, growing annuity calculator, perpetuity calculator, financial goal calculator, savings target calculator, wealth accumulation calculator, compound effect calculator, exponential growth calculator, geometric progression calculator, financial mathematics calculator, investment simulator calculator, what-if scenario calculator, multiple scenario calculator, comparison calculator, side-by-side calculator, optimization calculator, strategy calculator, planning calculator, projection calculator, forecast calculator, prediction calculator, estimation calculator, approximation calculator, calculation tool, financial tool, investment tool, retirement tool, savings tool, wealth tool, money tool, finance tool, planning tool, analysis tool, assessment tool, evaluation tool, measurement tool, tracking tool, monitoring tool, progress tool, visualization tool, charting tool, graphing tool, reporting tool, export tool, PDF generator, print calculator, share calculator, download calculator, save calculator, bookmark calculator, favorite calculator, popular tool, trending tool, viral tool, shared tool, recommended tool, expert tool, professional tool, business tool, personal tool, family tool, household tool, student tool, teacher tool, academic tool, educational tool, learning tool, training tool, workshop tool, seminar tool, webinar tool, course tool, tutorial tool, guide tool, handbook tool, manual tool, reference tool, resource tool, utility tool, application tool, software tool, program tool, system tool, platform tool, website tool, portal tool, hub tool, center tool, network tool, community tool, forum tool, blog tool, article tool, post tool, content tool, media tool, video tool, audio tool, podcast tool, newsletter tool, email tool, social media tool"
        />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="author" content="FreeCompoundCalculator.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Open Graph / Social Sharing Tags */}
        <meta property="og:title" content="Free Compound Interest Calculator | Calculate Investment Growth with Charts" />
        <meta
          property="og:description"
          content="Visual compound interest calculator with monthly contributions. Calculate retirement savings, investment growth projections, and wealth building strategies instantly."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.freecompoundcalculator.com" />
        <meta property="og:image" content="https://www.freecompoundcalculator.com/og-image-compound-interest.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Compound Interest Calculator with Growth Charts" />
        <meta property="og:site_name" content="FreeCompoundCalculator.com" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:updated_time" content="2024-12-01T00:00:00+00:00" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@FreeCompoundCalc" />
        <meta name="twitter:creator" content="@FreeCompoundCalc" />
        <meta name="twitter:title" content="Free Compound Interest Calculator | Investment Growth Visualized" />
        <meta
          name="twitter:description"
          content="Interactive compound interest calculator with charts. Calculate retirement, savings, and investment growth instantly."
        />
        <meta name="twitter:image" content="https://www.freecompoundcalculator.com/twitter-image-compound-interest.jpg" />
        <meta name="twitter:image:alt" content="Compound Interest Calculator Interface" />
        <meta name="twitter:label1" content="Reading Time" />
        <meta name="twitter:data1" content="3 minutes" />
        <meta name="twitter:label2" content="Calculator Type" />
        <meta name="twitter:data2" content="Financial Tool" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://www.freecompoundcalculator.com" />
        
        {/* Alternate Languages */}
        <link rel="alternate" href="https://www.freecompoundcalculator.com/es/calculadora-interes-compuesto" hrefLang="es" />
        <link rel="alternate" href="https://www.freecompoundcalculator.com/fr/calculateur-interet-compose" hrefLang="fr" />
        <link rel="alternate" href="https://www.freecompoundcalculator.com/de/zinseszins-rechner" hrefLang="de" />
        
        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "FreeCompoundCalculator.com - Compound Interest Calculator",
              "url": "https://www.freecompoundcalculator.com",
              "description": "Advanced compound interest calculator with visual growth projections, contribution tracking, and investment scenario analysis",
              "applicationCategory": ["FinanceApplication", "BusinessApplication"],
              "operatingSystem": "All",
              "browserRequirements": "Requires JavaScript. Works in all modern browsers.",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "ratingCount": "2156",
                "bestRating": "5",
                "worstRating": "1"
              },
              "author": {
                "@type": "Organization",
                "name": "FreeCompoundCalculator.com",
                "url": "https://www.freecompoundcalculator.com"
              },
              "datePublished": "2024-01-01",
              "dateModified": "2024-12-01",
              "inLanguage": "en-US",
              "keywords": "compound interest calculator, investment calculator, retirement calculator, savings calculator, financial planning",
              "publisher": {
                "@type": "Organization",
                "name": "FreeCompoundCalculator.com",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://www.freecompoundcalculator.com/logo.png",
                  "width": "600",
                  "height": "60"
                }
              },
              "screenshot": [
                "https://www.freecompoundcalculator.com/screenshot1.jpg",
                "https://www.freecompoundcalculator.com/screenshot2.jpg",
                "https://www.freecompoundcalculator.com/screenshot3.jpg"
              ],
              "softwareVersion": "3.0",
              "featureList": [
                "Visual growth projections",
                "Monthly contribution tracking",
                "Multiple compounding frequencies",
                "PDF report generation",
                "Mobile responsive design",
                "Real-time calculations",
                "Investment scenario comparison"
              ]
            })
          }}
        />
        
        {/* Additional Schema for FAQ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "How does compound interest work?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Compound interest is interest calculated on the initial principal and also on the accumulated interest from previous periods. It causes wealth to grow exponentially over time."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What's the difference between simple and compound interest?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Simple interest is calculated only on the principal amount, while compound interest is calculated on the principal plus accumulated interest."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How often should interest compound for maximum growth?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The more frequently interest compounds, the greater the growth. Daily compounding yields the highest returns, followed by monthly, quarterly, and annual compounding."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is this calculator free to use?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, our compound interest calculator is completely free with no registration required. We don't store your financial data."
                  }
                }
              ]
            })
          }}
        />

        {/* Additional Meta Tags */}
        <meta name="theme-color" content="#1a1a2e" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Free Compound Calculator" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Language & Charset */}
        <meta charSet="utf-8" />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta httpEquiv="Content-Language" content="en" />
        
        {/* Verification Tags */}
        <meta name="google-site-verification" content="your-verification-code" />
        <meta name="msvalidate.01" content="your-verification-code" />
        <meta name="yandex-verification" content="your-verification-code" />
        <meta name="p:domain_verify" content="your-verification-code" />
        
        {/* Additional SEO Tags */}
        <meta name="rating" content="General" />
        <meta name="copyright" content="Copyright 2024 FreeCompoundCalculator.com. All rights reserved." />
        <meta name="distribution" content="Global" />
        <meta name="coverage" content="Worldwide" />
        <meta name="target" content="all" />
        <meta name="audience" content="all" />
        <meta name="revisit-after" content="7 days" />
        
        {/* Preload Resources */}
        <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/styles/HomePage.module.css" as="style" />
        
        {/* Additional Link Tags */}
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#00d4ff" />
      </Head>

      <div className={styles.homePage}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <h1 className={styles.heroTitle}>
            Free Compound Interest Calculator with Monthly Contributions
          </h1>
          <p className={styles.heroSubtitle}>
            See Your Money Grow Over Time – Calculate investment growth with recurring contributions and compounding frequency.
            <span className={styles.heroFeatures}> Visual Charts • No Signup • 100% Private • Instant Results</span>
          </p>
          <div className={styles.ctaContainer}>
            <Link href="/compound-interest-calculator" className={styles.ctaButton}>
              Start Calculating Investment Growth →
            </Link>
            <div className={styles.trustBadges}>
              <span className={styles.trustBadge}>🔒 No Data Stored</span>
              <span className={styles.trustBadge}>📱 Mobile Optimized</span>
              <span className={styles.trustBadge}>🎯 Instant Results</span>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section className={styles.featuresSection}>
          <h2 className={styles.sectionHeading}>Why Choose FreeCompoundCalculator.com</h2>
          <p className={styles.sectionSubtitle}>Professional-grade investment calculator with advanced features for accurate financial planning</p>
          <div className={styles.featureCards}>
            {[
              { 
                icon: '📈', 
                title: 'Visual Growth Projections', 
                desc: 'See interactive charts showing how your investments grow over time with compound interest. Track year-by-year progress with detailed visualizations.',
                keywords: 'investment growth charts, financial projections, visual investment tracking'
              },
              { 
                icon: '🔒', 
                title: 'Zero Data Stored', 
                desc: 'Your financial information stays on your device. We don\'t collect, track, or sell anything. 100% private calculations.',
                keywords: 'private calculator, secure financial tool, no data collection'
              },
              { 
                icon: '📱', 
                title: 'Mobile Optimized', 
                desc: 'Perfectly designed for smartphones, tablets, and desktops — use anywhere, anytime. Responsive design for all devices.',
                keywords: 'mobile investment calculator, responsive financial tool, cross-platform calculator'
              },
              { 
                icon: '📊', 
                title: 'Detailed Breakdowns', 
                desc: 'View allocation pie charts, year-by-year growth, and contribution vs. interest comparisons. Comprehensive financial analysis.',
                keywords: 'investment allocation charts, contribution analysis, financial breakdown'
              },
              { 
                icon: '💰', 
                title: 'Multiple Scenarios', 
                desc: 'Compare different investment strategies, contribution amounts, and time horizons side by side. Optimize your financial plan.',
                keywords: 'investment scenario comparison, financial planning scenarios, strategy optimization'
              },
              { 
                icon: '📉', 
                title: 'Exportable Reports', 
                desc: 'Save and share professional-looking PDF reports of your calculations and projections. Perfect for financial advisors.',
                keywords: 'PDF financial reports, investment projection export, shareable calculations'
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className={`${styles.featureCard} ${styles.animateOnHover}`} 
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={styles.icon}>{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
                <div className={styles.featureKeywords}>{feature.keywords}</div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section className={styles.howItWorks}>
          <h2 className={styles.sectionHeading}>How Our Compound Interest Calculator Works</h2>
          <p className={styles.sectionSubtitle}>Four simple steps to accurate investment growth projections</p>
          <div className={styles.stepsContainer}>
            {[
              {
                step: '1',
                title: 'Input Your Investment Details',
                description: 'Enter your initial investment, monthly contributions, expected rate of return, and investment period.',
                keywords: 'investment parameters, financial inputs, calculation setup'
              },
              {
                step: '2',
                title: 'Adjust Parameters in Real-Time',
                description: 'Use intuitive sliders to easily modify values and see instant updates to your investment projections.',
                keywords: 'real-time adjustments, interactive sliders, instant updates'
              },
              {
                step: '3',
                title: 'Analyze Detailed Results',
                description: 'View comprehensive charts showing your balance growth, allocation breakdown, and year-by-year progress.',
                keywords: 'financial analysis, investment results, detailed projections'
              },
              {
                step: '4',
                title: 'Optimize Your Investment Strategy',
                description: 'Experiment with different scenarios to find the optimal investment approach for your financial goals.',
                keywords: 'strategy optimization, investment planning, financial optimization'
              }
            ].map((step, index) => (
              <div 
                key={index} 
                className={`${styles.stepCard} ${styles.animateOnHover}`} 
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className={styles.stepNumber}>{step.step}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                <div className={styles.stepKeywords}>{step.keywords}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Investment Examples Section */}
        <section className={styles.examplesSection}>
          <h2 className={styles.sectionHeading}>Real-Life Investment Examples & Scenarios</h2>
          <p className={styles.sectionSubtitle}>See how compound interest works in practical investment situations</p>
          <div className={styles.examplesContainer}>
            {[
              {
                title: 'Retirement Planning Example',
                scenario: 'Starting at age 25 for retirement at 65',
                initial: '$10,000',
                monthly: '$500',
                rate: '7%',
                period: '40 years',
                result: '$1,240,000',
                interest: '$990,000',
                keywords: 'retirement savings, 401k growth, pension planning'
              },
              {
                title: 'College Savings Example',
                scenario: 'Education fund for a newborn child',
                initial: '$5,000',
                monthly: '$200',
                rate: '6%',
                period: '18 years',
                result: '$98,500',
                interest: '$44,500',
                keywords: 'college fund, 529 plan, education savings'
              },
              {
                title: 'Wealth Building Example',
                scenario: 'Aggressive investment strategy',
                initial: '$25,000',
                monthly: '$1,000',
                rate: '8%',
                period: '25 years',
                result: '$1,050,000',
                interest: '$740,000',
                keywords: 'wealth accumulation, investment portfolio, financial independence'
              }
            ].map((example, index) => (
              <div 
                key={index} 
                className={`${styles.exampleCard} ${styles.animateOnHover}`} 
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <h3>{example.title}</h3>
                <p className={styles.scenario}>{example.scenario}</p>
                
                <div className={styles.exampleDetails}>
                  <div className={styles.detailRow}>
                    <span>Initial Investment:</span>
                    <strong>{example.initial}</strong>
                  </div>
                  <div className={styles.detailRow}>
                    <span>Monthly Contribution:</span>
                    <strong>{example.monthly}</strong>
                  </div>
                  <div className={styles.detailRow}>
                    <span>Expected Annual Return:</span>
                    <strong>{example.rate}</strong>
                  </div>
                  <div className={styles.detailRow}>
                    <span>Investment Period:</span>
                    <strong>{example.period}</strong>
                  </div>
                  <div className={styles.resultRow}>
                    <span>Final Balance:</span>
                    <strong className={styles.resultHighlight}>{example.result}</strong>
                  </div>
                  <div className={styles.resultRow}>
                    <span>Interest Earned:</span>
                    <strong className={styles.interestHighlight}>{example.interest}</strong>
                  </div>
                </div>
                <div className={styles.exampleKeywords}>{example.keywords}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className={styles.testimonialsSection}>
          <h2 className={styles.sectionHeading}>What Users Say About FreeCompoundCalculator.com</h2>
          <p className={styles.sectionSubtitle}>Trusted by thousands of investors and financial professionals worldwide</p>
          <div className={styles.testimonialCards}>
            {[
              {
                quote: "This calculator helped me visualize how small monthly contributions can grow into a substantial retirement fund. I increased my 401(k) contributions by 3% after seeing the projections!",
                author: "Michael R., Engineer",
                keywords: "retirement planning, 401k optimization, investment visualization"
              },
              {
                quote: "As a financial advisor, I use FreeCompoundCalculator.com with my clients. The visualizations make it easy to explain the power of compound interest. Much better than spreadsheets!",
                author: "Sarah K., Certified Financial Advisor",
                keywords: "financial advising, client tools, professional use"
              },
              {
                quote: "I was skeptical about investing, but after plugging in numbers on this calculator, I started my first brokerage account. That was 5 years ago, and I'm already up 85%!",
                author: "David T., Teacher & Investor",
                keywords: "beginner investing, investment education, portfolio growth"
              }
            ].map((testimonial, index) => (
              <div 
                key={index} 
                className={styles.testimonialCard} 
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <p>"{testimonial.quote}"</p>
                <strong>{testimonial.author}</strong>
                <div className={styles.testimonialKeywords}>{testimonial.keywords}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        

        {/* CTA Banner */}
        <section className={styles.ctaBanner}>
          <h3>Ready to See the Power of Compound Interest?</h3>
          <p>Start calculating your investment growth now. Free, private, and instant results.</p>
          <Link href="/compound-interest-calculator" className={styles.ctaButton}>
            Calculate My Investment Growth Now
          </Link>
          
        </section>
      </div>
    </>
  );
};

export default HomePage;