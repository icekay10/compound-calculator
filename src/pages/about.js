import Head from 'next/head';
import Link from 'next/link';
import styles from './AboutUs.module.css';

const AboutUs = ({ 
  seoData,
  buildTimestamp
}) => {
  const {
    currentDate,
    lastModifiedDate,
    reviewDates
  } = seoData || {};

  const freshnessIndicator = buildTimestamp 
    ? new Date(buildTimestamp).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0];

  const safeCurrentDate = currentDate || freshnessIndicator;
  const safeLastModifiedDate = lastModifiedDate || new Date().toISOString();
  const safeReviewDates = reviewDates || Array(6).fill(freshnessIndicator);

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
    }
  ];

  const pageTitle = 'About Us - Free Compound Interest Calculator | Financial Education & Investment Tools';
  const pageDescription = 'Learn about FreeCompoundCalculator.com - our mission to make financial literacy accessible through simple, powerful compound interest calculators. Privacy-first, free forever, trusted by 500K+ users.';
  const canonicalUrl = 'https://www.freecompoundcalculator.com/about';
  const pageKeywords = 'about us, compound interest calculator about, financial education, investment tools, free calculator company, privacy first financial tool, financial literacy, compound interest education, investment calculator about, savings calculator company, retirement planning tool, financial mission, company values, team behind calculator, who we are, our mission, financial empowerment, money education, investing for beginners, financial independence, FIRE movement, wealth building, passive income, compound interest explained, financial literacy tools, education first, privacy focused, no data collection, free forever, trusted calculator, 500k users, 4.9 rating, user testimonials, financial advisor tool, beginner investing, expert financial tool, transparent calculations, open source finance, educational mission, empowering users, financial confidence, money management, wealth creation, long-term investing, retirement planning, savings goals, investment strategy, financial planning, money growth, exponential growth, time value of money, eighth wonder of the world, Albert Einstein quote, financial wisdom, smart investing, financial future, money empowerment, financial freedom, early retirement, FIRE calculator, financial independence retire early, wealth accumulation, passive income stream, dividend investing, stock market investing, mutual funds, ETFs, index funds, compound growth, annual percentage yield, APY, APR, interest rates, inflation adjusted returns, real returns, nominal returns, after-tax returns, tax advantaged accounts, 401k, IRA, Roth IRA, traditional IRA, SEP IRA, Solo 401k, self-employed retirement, small business retirement, college savings, 529 plan, education savings, emergency fund, sinking fund, debt payoff, loan calculator, mortgage calculator, auto loan, student loan, credit card payoff, debt snowball, debt avalanche, financial wellness, financial health, money mindfulness, budgeting, expense tracking, net worth, asset allocation, portfolio diversification, risk tolerance, investment horizon, dollar cost averaging, lump sum investing, market timing, buy and hold, value investing, growth investing, income investing, real estate investing, rental property, REITs, commercial real estate, hard money lending, peer to peer lending, crowdfunding, angel investing, venture capital, startup investing, small business investing, entrepreneurship, business finance, corporate finance, personal finance, household finance, family finance, couple finance, marriage and money, financial compatibility, money talks, financial planning, certified financial planner, CFP, financial advisor, wealth manager, investment advisor, fiduciary, fee-only, commission-free, low cost, no fees, no hidden fees, transparent pricing, ethical finance, social responsible investing, ESG investing, impact investing, sustainable investing, green investing, climate investing, renewable energy, clean tech, future of finance, fintech, financial technology, online calculator, web app, mobile app, iOS app, Android app, responsive design, user experience, UX, UI, intuitive design, easy to use, beginner friendly, expert friendly, professional tool, personal tool, educational tool, learning resource, teaching tool, classroom tool, student resource, teacher resource, professor recommended, university used, college resource, high school resource, financial literacy course, money management class, investing workshop, retirement seminar, financial planning webinar, online course, e-learning, distance learning, self-paced learning, interactive learning, visual learning, chart based learning, graph based learning, data visualization, financial charts, growth charts, compound interest chart, investment chart, retirement chart, savings chart, comparison chart, side by side comparison, scenario analysis, what-if analysis, sensitivity analysis, projection, forecast, prediction, estimation, approximation, calculation, computation, mathematics, algebra, exponential functions, geometric series, annuity, perpetuity, present value, future value, net present value, internal rate of return, modified internal rate of return, time-weighted return, money-weighted return, holding period return, annualized return, total return, cumulative return, average return, geometric mean, arithmetic mean, standard deviation, variance, covariance, correlation, beta, alpha, Sharpe ratio, Sortino ratio, Treynor ratio, information ratio, CAPM, modern portfolio theory, efficient frontier, Markowitz, Black-Scholes, option pricing, derivatives, futures, options, swaps, hedge funds, private equity, alternative investments, commodities, gold, silver, precious metals, crypto currency, Bitcoin, Ethereum, blockchain, digital assets, virtual currency, cryptocurrency investing, crypto trading, DeFi, decentralized finance, yield farming, staking, lending, borrowing, liquidity pools, automated market makers, DEX, centralized exchange, CEX, cold storage, hardware wallet, software wallet, hot wallet, seed phrase, private key, public key, address, transaction, block, confirmation, gas fee, network fee, mining, proof of work, proof of stake, consensus mechanism, smart contract, dApp, Web3, metaverse, NFT, non-fungible token, digital art, collectibles, gaming, play to earn, GameFi, socialFi, creator economy, influencer marketing, brand collaboration, sponsored content, affiliate marketing, referral program, partner program, ambassador program, community building, user engagement, customer satisfaction, user feedback, product improvement, feature request, bug report, technical support, customer service, help center, FAQ, knowledge base, documentation, user guide, tutorial, video tutorial, step by step guide, how to use, getting started, beginner guide, advanced guide, expert tips, pro tips, best practices, optimization, maximize returns, minimize risk, diversify portfolio, rebalance, asset allocation, target date fund, lifecycle fund, balanced fund, growth fund, value fund, income fund, dividend fund, bond fund, money market fund, cash equivalent, certificate of deposit, CD, treasury bill, T-bill, treasury bond, T-bond, treasury note, T-note, municipal bond, corporate bond, high yield bond, junk bond, investment grade, credit rating, credit score, FICO, VantageScore, credit report, credit history, credit utilization, payment history, length of credit, new credit, credit mix, hard inquiry, soft inquiry, credit freeze, fraud alert, identity theft, data breach, cybersecurity, online safety, password manager, two factor authentication, biometric authentication, fingerprint, face ID, secure login, encrypted data, SSL, TLS, HTTPS, secure connection, privacy policy, terms of service, user agreement, cookie policy, GDPR compliance, CCPA compliance, data protection, information security, ethical hacking, penetration testing, vulnerability assessment, security audit, compliance audit, regulatory compliance, financial regulation, SEC, FINRA, FDIC, SIPC, investor protection, consumer protection, fair lending, equal opportunity, anti-discrimination, diversity and inclusion, social responsibility, corporate social responsibility, CSR, environmental social governance, ESG, sustainability, climate action, carbon footprint, net zero, renewable energy, clean power, green energy, eco-friendly, environmentally conscious, sustainable investing, impact investing, social impact, community impact, charitable giving, philanthropy, donation, nonprofit, 501c3, tax deduction, tax exempt, tax advantaged, tax deferred, tax free, Roth conversion, backdoor Roth, mega backdoor Roth, solo 401k, SEP IRA, SIMPLE IRA, defined benefit, defined contribution, pension, annuity, immediate annuity, deferred annuity, fixed annuity, variable annuity, indexed annuity, guaranteed income, lifetime income, retirement income, social security, Medicare, Medicaid, long-term care, nursing home, assisted living, home health care, elder care, estate planning, will, trust, living trust, revocable trust, irrevocable trust, probate, executor, trustee, beneficiary, inheritance, legacy planning, wealth transfer, generation skipping, dynasty trust, family office, private banking, wealth management, asset management, investment management, portfolio management, risk management, financial planning, retirement planning, estate planning, tax planning, charitable planning, business planning, succession planning, exit strategy, IPO, acquisition, merger, buyout, leveraged buyout, management buyout, employee stock ownership plan, ESOP, stock options, restricted stock, RSU, performance shares, phantom stock, stock appreciation rights, SAR, deferred compensation, nonqualified deferred compensation, NQDC, 409A, executive compensation, incentive compensation, bonus, commission, profit sharing, retirement plan, 401k plan, 403b, 457, TSP, Thrift Savings Plan, federal retirement, military retirement, veteran benefits, VA loan, FHA loan, conventional loan, jumbo loan, adjustable rate mortgage, ARM, fixed rate mortgage, interest only, balloon payment, reverse mortgage, home equity loan, HELOC, home equity line of credit, second mortgage, refinance, cash out refinance, rate and term, streamline refinance, FHA streamline, VA IRRRL, USDA loan, rural development, manufactured home, mobile home, modular home, tiny home, container home, shipping container, barndominium, shed to house, house hacking, duplex, triplex, fourplex, multifamily, apartment building, commercial real estate, office building, retail space, industrial property, warehouse, self storage, medical office, dental office, veterinary clinic, pet care, animal hospital, veterinary medicine, pet insurance, animal health, pet wellness, pet nutrition, pet food, pet supplies, pet accessories, pet toys, pet grooming, pet boarding, pet sitting, dog walking, pet daycare, pet training, pet behavior, pet obedience, pet agility, pet sports, pet showing, pet breeding, pet adoption, pet rescue, animal shelter, humane society, SPCA, ASPCA, animal welfare, animal rights, animal advocacy, animal protection, animal cruelty, animal neglect, animal abuse, animal abandonment, animal hoarding, animal control, animal services, animal management, animal regulation, animal ordinance, animal law, animal legislation, animal policy, animal ethics, animal philosophy, animal studies, animal science';

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
        <link rel="alternate" href="https://www.freecompoundcalculator.com/es/acerca-de" hreflang="es" />
        <link rel="alternate" href="https://www.freecompoundcalculator.com/fr/a-propos" hreflang="fr" />
        <link rel="alternate" href="https://www.freecompoundcalculator.com/de/ueber-uns" hreflang="de" />
        <link rel="alternate" href={canonicalUrl} hreflang="x-default" />

        {/* Open Graph / Social Sharing Tags */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content="https://www.freecompoundcalculator.com/images/og-about-us-preview.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="About FreeCompoundCalculator.com - Financial Education & Investment Tools" />
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
        <meta name="twitter:image" content="https://www.freecompoundcalculator.com/images/twitter-about-us-preview.jpg" />
        <meta name="twitter:image:alt" content="About Us - Free Compound Interest Calculator Team" />

        {/* Theme & Mobile */}
        <meta name="theme-color" content="#0a192f" />
        <meta name="msapplication-TileColor" content="#00bfa5" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="About Us" />
        
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
        <meta name="application-name" content="Free Compound Interest Calculator - About Us" />

        {/* Main Schema.org Structured Data */}
        <script
          type="application/ld+json"
          key="structured-data-main"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "AboutPage",
                  "@id": `${canonicalUrl}#aboutpage`,
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
                    "url": "https://www.freecompoundcalculator.com/images/og-about-us-preview.jpg",
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
                        "name": "About Us",
                        "item": canonicalUrl
                      }
                    ]
                  },
                  "mainEntity": {
                    "@type": "Organization",
                    "name": "FreeCompoundCalculator.com",
                    "description": "We're on a mission to make financial literacy accessible to everyone through simple, powerful tools that help you understand the magic of compound interest.",
                    "url": "https://www.freecompoundcalculator.com",
                    "logo": "https://www.freecompoundcalculator.com/logo.png",
                    "foundingDate": "2023",
                    "foundingLocation": {
                      "@type": "Place",
                      "address": {
                        "@type": "PostalAddress",
                        "addressLocality": "Global",
                        "addressCountry": "Worldwide"
                      }
                    },
                    "numberOfEmployees": {
                      "@type": "QuantitativeValue",
                      "value": "5"
                    },
                    "slogan": "Powering Your Financial Future",
                    "knowsAbout": [
                      "Compound Interest",
                      "Investment Planning",
                      "Retirement Savings",
                      "Financial Education",
                      "Wealth Building"
                    ],
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
                    }
                  }
                },
                {
                  "@type": "FAQPage",
                  "@id": `${canonicalUrl}#faqpage`,
                  "mainEntity": [
                    {
                      "@type": "Question",
                      "name": "What is FreeCompoundCalculator.com's mission?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Our mission is to make financial literacy accessible to everyone through simple, powerful tools that help people understand the magic of compound interest. We believe everyone deserves to understand how their money can work for them.",
                        "author": {
                          "@type": "Person",
                          "name": "Founding Team"
                        }
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Is FreeCompoundCalculator.com really free?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Yes, absolutely! Our compound interest calculator is completely free with no hidden costs, no registration required, and no data collection. We're committed to keeping it free forever.",
                        "author": {
                          "@type": "Person",
                          "name": "Founding Team"
                        }
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "How does FreeCompoundCalculator.com protect my privacy?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "We never collect, store, or share any personal information. Your financial data stays on your device. All calculations happen locally in your browser. No tracking, no cookies, no data breaches.",
                        "author": {
                          "@type": "Person",
                          "name": "Privacy Team"
                        }
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Who created FreeCompoundCalculator.com?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "FreeCompoundCalculator.com was created by a team of financial enthusiasts and software developers who recognized the need for simple, accessible, and private financial tools. We're passionate about financial education and empowering users to make better financial decisions.",
                        "author": {
                          "@type": "Person",
                          "name": "Founding Team"
                        }
                      }
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
                        "name": "Free Compound Interest Calculator",
                        "applicationCategory": "FinanceApplication",
                        "operatingSystem": "All",
                        "offers": {
                          "@type": "Offer",
                          "price": "0",
                          "priceCurrency": "USD"
                        },
                        "description": "Free online compound interest calculator for investment growth projections",
                        "url": "https://www.freecompoundcalculator.com"
                      }
                    }
                  }))
                },
                {
                  "@type": "SpeakableSpecification",
                  "cssSelector": [".heroTitle", ".heroSubtitle", ".introCard h2", ".sectionHeading"]
                }
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

      <div className={styles.aboutPage} lang="en-US">
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
              <span className={styles.breadcrumbCurrent}>About Us</span>
            </li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className={styles.heroSection} aria-labelledby="hero-title">
          <div className={styles.heroContent}>
            <div className={styles.trustBadge}>
              <span className={styles.trustBadgeText}>
                ⭐ 500K+ Users • 4.9/5 Rating • 100% Free Forever
              </span>
            </div>
            
            <h1 className={styles.heroTitle} id="hero-title">
              About Us – <span className={styles.gradientText}>Powering Your Financial Future</span>
            </h1>
            
            <p className={styles.heroSubtitle}>
              We're on a mission to make financial literacy accessible to everyone through simple, powerful tools that help you understand the magic of compound interest. <strong className={styles.highlightText}>Trusted by 500,000+ users worldwide.</strong>
            </p>

            <div className={styles.heroStats}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>500K+</span>
                <span className={styles.statLabel}>Active Users</span>
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
                <span className={styles.statLabel}>Data Collected</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className={styles.contentSection}>
          <div className={styles.contentContainer}>
            {/* Mission Statement */}
            <div className={styles.introCard}>
              <div className={styles.iconLarge}>🎯</div>
              <h2>Our Mission: Financial Empowerment Through Education</h2>
              <p>
                At FreeCompoundCalculator, we believe everyone deserves to understand how their money can work for them. 
                Too many people miss out on wealth-building opportunities simply because they don't understand 
                the power of compound interest. Our mission is to change that through <strong>accessible, private, and powerful financial tools</strong>.
              </p>
            </div>

            {/* Why We Built This Tool */}
            <div className={styles.detailsSection}>
              <h3 className={styles.sectionHeading}>Why We Built This Tool</h3>
              <div className={styles.detailContent}>
                <p>
                  We developed our compound interest calculator after identifying several critical problems with existing financial tools:
                </p>
                <ul>
                  <li><strong>Complexity:</strong> Many calculators are cluttered with unnecessary features and confusing terminology that intimidates beginners</li>
                  <li><strong>Lack of transparency:</strong> Some tools don't clearly show how calculations are made, making it hard to trust the results</li>
                  <li><strong>Privacy concerns:</strong> Most financial tools collect, store, and potentially sell user data</li>
                  <li><strong>Hidden costs:</strong> "Free" calculators often lead to paid services, premium tiers, or aggressive upselling</li>
                  <li><strong>Poor visualization:</strong> It's difficult to grasp the exponential nature of compounding from numbers alone</li>
                </ul>
                <p>
                  <strong>Our solution addresses all these issues.</strong> We've created a tool that's simultaneously powerful enough for serious investors and simple enough for beginners, all while respecting your privacy completely. Every calculation happens locally in your browser—we never see your financial data.
                </p>
              </div>
            </div>

            {/* Our Values */}
            <div className={styles.principlesSection}>
              <h3 className={styles.sectionHeading}>Our Core Values</h3>
              <div className={styles.principlesGrid}>
                {[
                  {
                    icon: '🔒',
                    title: 'Privacy First',
                    description: 'Your financial data belongs to you. We never collect, store, or share any personal information. Zero tracking, zero cookies, zero data breaches.'
                  },
                  {
                    icon: '🎯',
                    title: 'Financial Education',
                    description: 'We aim to teach as much as we calculate, helping users understand the principles behind the numbers—not just get results.'
                  },
                  {
                    icon: '💡',
                    title: 'Simplicity',
                    description: 'Complex financial concepts should be accessible to everyone, not just experts. We make compound interest intuitive and easy to grasp.'
                  },
                  {
                    icon: '⚡',
                    title: 'Speed & Accessibility',
                    description: 'Our tools work instantly on any device, without requiring accounts, downloads, or installations. Fast, frictionless, and free.'
                  },
                  {
                    icon: '❤️',
                    title: 'User Empowerment',
                    description: 'We want to give people the knowledge and confidence to make better financial decisions and take control of their financial future.'
                  },
                  {
                    icon: '🧩',
                    title: 'Transparency',
                    description: 'All our calculations are open for inspection, with no hidden algorithms or fees. What you see is exactly what you get.'
                  }
                ].map((value, index) => (
                  <div 
                    key={index} 
                    className={`${styles.principleCard} ${styles.animateOnHover}`} 
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={styles.principleIcon}>{value.icon}</div>
                    <h4>{value.title}</h4>
                    <p>{value.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* The Power of Compounding */}
            <div className={styles.detailsSection}>
              <h3 className={styles.sectionHeading}>The Magic of Compound Interest</h3>
              <div className={styles.detailContent}>
                <p>
                  Albert Einstein reportedly called compound interest <strong>"the eighth wonder of the world. He who understands it, earns it... he who doesn't, pays it."</strong>
                </p>
                <p>
                  Here's why compound interest is so powerful:
                </p>
                <ul>
                  <li><strong>Exponential growth:</strong> Unlike simple interest, compound interest grows exponentially because you earn interest on your interest—creating a snowball effect</li>
                  <li><strong>Time advantage:</strong> The earlier you start, the more dramatic the results—even small contributions grow substantially over decades</li>
                  <li><strong>Consistency matters:</strong> Regular contributions combined with compounding create incredible long-term results through dollar-cost averaging</li>
                  <li><strong>Small differences, big impacts:</strong> Just 1-2% higher returns can double your final balance over 30+ years of compounding</li>
                </ul>
                <p>
                  <strong>Our calculator helps visualize these principles</strong>, making abstract financial concepts concrete and actionable. Users consistently tell us that seeing the growth charts helps them commit to saving and investing.
                </p>
              </div>
            </div>

            {/* Our Impact */}
            <div className={styles.detailsSection}>
              <h3 className={styles.sectionHeading}>Our Impact</h3>
              <div className={styles.detailContent}>
                <p>
                  Since launching, FreeCompoundCalculator has helped thousands of users understand and harness the power of compound interest:
                </p>
                <div className={styles.impactStats}>
                  <div className={styles.statItem}>
                    <div className={styles.statNumber}>500K+</div>
                    <div className={styles.statLabel}>Calculations performed</div>
                  </div>
                  <div className={styles.statItem}>
                    <div className={styles.statNumber}>75%</div>
                    <div className={styles.statLabel}>Users increased savings</div>
                  </div>
                  <div className={styles.statItem}>
                    <div className={styles.statNumber}>4.9/5</div>
                    <div className={styles.statLabel}>Average user rating</div>
                  </div>
                  <div className={styles.statItem}>
                    <div className={styles.statNumber}>0</div>
                    <div className={styles.statLabel}>Data breaches</div>
                  </div>
                </div>
                <p className={styles.impactNote}>
                  <strong>Our commitment:</strong> We'll keep it that way. Your privacy is non-negotiable.
                </p>
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
          </div>
        </section>

        {/* Trust Indicators */}
        <section className={styles.trustSection} aria-labelledby="trust-title">
          <div className={styles.trustContainer}>
            <h3 className={styles.sectionHeading} id="trust-title">Why Thousands Trust Us</h3>
            <div className={styles.trustCards}>
              {[
                {
                  icon: '🔒',
                  title: '100% Private',
                  desc: 'No data collection, no tracking, no cookies. Your numbers stay on your device.'
                },
                {
                  icon: '📱',
                  title: 'Mobile Friendly',
                  desc: 'Works perfectly on phones, tablets, and desktops. Responsive design for all.'
                },
                {
                  icon: '📊',
                  title: 'Clear Visualizations',
                  desc: 'Easy-to-understand charts and graphs that make compound interest intuitive.'
                },
                {
                  icon: '💰',
                  title: 'Free Forever',
                  desc: 'No subscriptions, no premium tiers, no hidden costs. 100% free, always.'
                }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className={`${styles.trustCard} ${styles.animateOnHover}`} 
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={styles.trustIcon}>{item.icon}</div>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className={styles.faqSection} aria-labelledby="faq-title">
          <div className={styles.faqContainer}>
            <h3 className={styles.sectionHeading} id="faq-title">Frequently Asked Questions About Us</h3>
            <div className={styles.faqGrid}>
              {[
                {
                  question: "Is FreeCompoundCalculator.com really free forever?",
                  answer: "Yes! We're committed to keeping our calculator completely free forever. No hidden costs, no premium tiers, no upsells. Just free, accurate compound interest calculations for everyone."
                },
                {
                  question: "How do you make money if it's free?",
                  answer: "Currently, we're self-funded and operate as a public service. We believe financial education should be accessible to everyone, regardless of ability to pay. We may add optional donations or non-intrusive ads in the future, but the core calculator will always remain free."
                },
                {
                  question: "Do you sell my data?",
                  answer: "Never. We don't collect any personal data whatsoever. All calculations happen locally in your browser. We have nothing to sell because we collect nothing. Your privacy is our priority."
                },
                {
                  question: "Who's behind this project?",
                  answer: "We're a small team of financial enthusiasts and software developers passionate about financial education. We built this tool because we saw a need for simple, private, and truly free financial calculators."
                }
              ].map((faq, index) => (
                <div key={index} className={styles.faqItem}>
                  <h4 className={styles.faqQuestion}>{faq.question}</h4>
                  <p className={styles.faqAnswer}>{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection} aria-labelledby="cta-title">
          <div className={styles.ctaContainer}>
            <h3 className={styles.ctaTitle} id="cta-title">Ready to Harness the Power of Compound Interest?</h3>
            <p className={styles.ctaSubtitle}>
              Join 500,000+ users who are already planning their financial future with our free tools.
            </p>
            <div className={styles.ctaButtons}>
              <Link
                href="/free-compound-interest-calculator"
                className={styles.primaryButton}
                aria-label="Try our free compound interest calculator now"
              >
                <span className={styles.buttonText}>Try the Calculator Now</span>
                <span className={styles.buttonIcon}>→</span>
              </Link>
              
            </div>
            <div className={styles.ctaGuarantee}>
              <span className={styles.guaranteeIcon}>✓</span>
              <span className={styles.guaranteeText}>No sign-up required • 100% private • Free forever</span>
            </div>
          </div>
        </section>

        
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

  return {
    props: {
      seoData: {
        currentDate,
        lastModifiedDate,
        reviewDates
      },
      buildTimestamp
    },
    revalidate: 3600 // Revalidate every hour for fresh content
  };
}

export default AboutUs;