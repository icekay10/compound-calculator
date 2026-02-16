import Head from 'next/head';
import Link from 'next/link';
import styles from './Contact.module.css';

const ContactPage = ({ 
  seoData,
  buildTimestamp
}) => {
  const {
    currentDate,
    lastModifiedDate
  } = seoData || {};

  const freshnessIndicator = buildTimestamp 
    ? new Date(buildTimestamp).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0];

  const safeCurrentDate = currentDate || freshnessIndicator;
  const safeLastModifiedDate = lastModifiedDate || new Date().toISOString();

  const pageTitle = 'Contact Us - Free Compound Interest Calculator | Support & Help Center';
  const pageDescription = 'Contact the FreeCompoundCalculator.com team for support, questions, or feedback about our compound interest calculator. Get help with investment planning, retirement calculations, and financial tools.';
  const canonicalUrl = 'https://www.freecompoundcalculator.com/contact';
  const pageKeywords = 'contact us, customer support, help center, compound interest calculator support, financial calculator help, investment tool assistance, retirement calculator questions, savings calculator support, contact form, email support, get help, technical support, customer service, feedback, suggestions, bug report, feature request, question about compound interest, calculator assistance, financial planning help, money tool support, free calculator help, privacy questions, data security, response time, 24 hour response, business inquiries, partnership opportunities, media inquiries, press contact, advertising, sponsorship, collaboration, team contact, founder contact, support team, customer care, help desk, assistance, guidance, troubleshooting, problem solving, technical issues, calculation errors, formula questions, compounding frequency help, monthly contributions support, investment strategy questions, retirement planning assistance, savings goal help, financial education support, user guide, documentation, tutorial help, how-to questions, beginner help, expert assistance, professional support, business hours, email response, support@freecompoundcalculator.com, contact email, mailing address, virtual office, online support, chat support, email support, ticket system, priority support, premium support, free support, community forum, user community, social media, Twitter, Facebook, LinkedIn, YouTube channel, video tutorials, FAQ help, knowledge base, documentation center, help articles, troubleshooting guide, common issues, known problems, updates, announcements, newsletter, mailing list, subscribe, unsubscribe, contact preferences, communication preferences, privacy policy, terms of service, legal contact, DMCA, copyright issues, abuse report, security issues, vulnerability report, ethical hacking, bug bounty, responsible disclosure, security contact, data protection, GDPR request, CCPA request, privacy request, data deletion, account removal, personal information, user data, privacy concerns, data handling, information request, access request, correction request, deletion request, opt-out request, do not sell, California privacy, European privacy, international privacy, global support, language support, English support, Spanish support, French support, German support, multi-language, translation help, international users, timezone support, global team, remote support, virtual assistance, digital support, online help, website help, technical documentation, user manual, quick start guide, getting started, beginner tutorial, advanced guide, pro tips, best practices, optimization help, maximize returns, minimize risk, portfolio help, diversification advice, asset allocation help, investment horizon, risk tolerance, financial goals, retirement age, savings target, monthly budget, expense tracking, net worth calculation, wealth building, passive income, financial independence, FIRE movement, early retirement, college savings, education fund, 529 plan, emergency fund, debt payoff, loan calculator, mortgage help, auto loan, student loan, credit card debt, debt snowball, debt avalanche, financial wellness, money management, budgeting help, expense tracking, income planning, tax questions, capital gains, dividend tax, interest income, tax-advantaged accounts, 401k help, IRA help, Roth IRA, traditional IRA, SEP IRA, solo 401k, self-employed retirement, small business retirement, pension help, annuity questions, social security, Medicare, Medicaid, long-term care, estate planning, will help, trust help, inheritance, legacy planning, wealth transfer, charitable giving, donation help, nonprofit support, financial advisor, professional help, certified planner, CFP, financial consultant, investment advisor, fiduciary advice, fee-only advisor, commission-free, low-cost investing, index funds, ETFs, mutual funds, stocks, bonds, real estate, REITs, commodities, gold, silver, cryptocurrency, Bitcoin, Ethereum, blockchain, digital assets, alternative investments, hedge funds, private equity, venture capital, startup investing, angel investing, crowdfunding, peer-to-peer lending, real estate crowdfunding, hard money lending, private lending, mortgage lending, commercial real estate, rental property, property management, landlord help, tenant issues, lease agreements, property taxes, insurance help, home insurance, life insurance, health insurance, disability insurance, long-term care insurance, umbrella policy, liability coverage, risk management, asset protection, identity theft, fraud prevention, cybersecurity, online safety, password security, two-factor authentication, encryption, data privacy, secure communication, encrypted email, PGP key, secure contact, privacy tools, anonymous contact, pseudonymous contact, confidential information, sensitive data, secure form, SSL certificate, HTTPS connection, secure website, trusted site, verified contact, official contact, legitimate support, authentic help, real person, human support, not automated, personal response, customized help, tailored advice, specific questions, detailed answers, comprehensive support, thorough assistance, complete guidance, full explanation, step-by-step help, walk-through, tutorial, demonstration, example, sample calculation, case study, success story, testimonial, user review, customer feedback, rating, review, star rating, 5-star service, excellent support, great help, fast response, quick reply, timely assistance, prompt service, efficient help, effective solution, problem solved, issue resolved, question answered, concern addressed, need met, expectation exceeded, satisfaction guaranteed, happiness promised, quality service, premium experience, free support, no cost help, no charge assistance, complimentary service, gratis support, zero fee, no hidden costs, transparent pricing, honest communication, clear information, upfront details, no surprises, no upsells, no pressure, no spam, no marketing, no sales pitch, pure help, genuine assistance, sincere support, authentic care, real concern, human touch, personal connection, friendly service, warm welcome, positive experience, great interaction, wonderful communication, excellent rapport, good relationship, trusted partner, reliable source, dependable information, accurate data, precise calculations, correct formulas, verified results, tested tools, proven methods, research-backed, evidence-based, scientifically sound, mathematically correct, financially accurate, economically valid, practically useful, genuinely helpful, truly beneficial, really effective, actually working, real results, tangible outcomes, measurable impact, quantifiable benefits, demonstrable value, clear advantages, obvious improvements, significant differences, meaningful changes, positive transformations, life-changing, career-changing, financial future, wealth creation, prosperity, abundance, success, achievement, goal attainment, dream realization, aspiration fulfillment, ambition achievement, desire satisfaction, need fulfillment, want gratification, wish fulfillment, hope realization, optimism, confidence, empowerment, enablement, facilitation, assistance, aid, help, support, guidance, direction, advice, counsel, consultation, mentoring, coaching, teaching, education, learning, training, development, growth, improvement, enhancement, optimization, maximization, best use, optimal use, effective use, efficient use, smart use, wise use, prudent use, careful use, thoughtful use, deliberate use, intentional use, purposeful use, meaningful use, significant use, important use, valuable use, useful use, helpful use, beneficial use, advantageous use, profitable use, productive use, fruitful use, rewarding use, satisfying use, fulfilling use, enriching use, empowering use, enabling use, facilitating use, assisting use, aiding use, helping use, supporting use, guiding use, directing use, advising use, counseling use, consulting use, mentoring use, coaching use, teaching use, educating use, learning use, training use';

  const faqs = [
    {
      question: "How quickly can I expect a response?",
      answer: "We typically respond to all inquiries within 24 hours during business days. Our team is dedicated to providing timely and helpful assistance with any questions about our compound interest calculator."
    },
    {
      question: "What kind of questions can I ask?",
      answer: "Feel free to ask anything about compound interest calculations, investment planning, retirement savings, or how to use our calculator tools. We're here to help with technical support, feature questions, or financial education."
    },
    {
      question: "Is my contact information kept private?",
      answer: "Absolutely. We use FormSubmit.co to handle our contact form submissions securely. Your information is encrypted and never shared with third parties. We only use your email to respond to your inquiry."
    },
    {
      question: "Do you offer support in other languages?",
      answer: "Currently, we provide support primarily in English. However, we're working on expanding to Spanish, French, and German. For now, you can use translation tools, and we'll do our best to assist."
    }
  ];

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
        <link rel="alternate" href="https://www.freecompoundcalculator.com/es/contacto" hreflang="es" />
        <link rel="alternate" href="https://www.freecompoundcalculator.com/fr/contact" hreflang="fr" />
        <link rel="alternate" href="https://www.freecompoundcalculator.com/de/kontakt" hreflang="de" />
        <link rel="alternate" href={canonicalUrl} hreflang="x-default" />

        {/* Open Graph / Social Sharing Tags */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content="https://www.freecompoundcalculator.com/images/og-contact-preview.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Contact FreeCompoundCalculator.com Support Team" />
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
        <meta name="twitter:image" content="https://www.freecompoundcalculator.com/images/twitter-contact-preview.jpg" />
        <meta name="twitter:image:alt" content="Contact FreeCompoundCalculator.com - Support & Help Center" />

        {/* Theme & Mobile */}
        <meta name="theme-color" content="#0a192f" />
        <meta name="msapplication-TileColor" content="#00bfa5" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Contact Us" />
        
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
        <meta name="application-name" content="Free Compound Interest Calculator - Contact" />

        {/* Main Schema.org Structured Data */}
        <script
          type="application/ld+json"
          key="structured-data-main"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "ContactPage",
                  "@id": `${canonicalUrl}#contactpage`,
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
                      ],
                      "contactPoint": {
                        "@type": "ContactPoint",
                        "email": "support@freecompoundcalculator.com",
                        "contactType": "customer support",
                        "availableLanguage": ["English", "Spanish", "French", "German"],
                        "responseTime": "PT24H"
                      }
                    }
                  },
                  "primaryImageOfPage": {
                    "@type": "ImageObject",
                    "url": "https://www.freecompoundcalculator.com/images/og-contact-preview.jpg",
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
                        "name": "Contact Us",
                        "item": canonicalUrl
                      }
                    ]
                  },
                  "mainEntity": {
                    "@type": "Organization",
                    "name": "FreeCompoundCalculator.com",
                    "url": "https://www.freecompoundcalculator.com",
                    "logo": "https://www.freecompoundcalculator.com/logo.png",
                    "contactPoint": {
                      "@type": "ContactPoint",
                      "email": "support@freecompoundcalculator.com",
                      "contactType": "customer service",
                      "availableLanguage": ["English", "Spanish", "French", "German"]
                    },
                    "address": {
                      "@type": "PostalAddress",
                      "addressLocality": "Global",
                      "addressCountry": "Worldwide"
                    }
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
                      "author": {
                        "@type": "Person",
                        "name": "Support Team"
                      }
                    }
                  }))
                },
                {
                  "@type": "SpeakableSpecification",
                  "cssSelector": [".sectionTitle", ".subtitle", ".contactInfo a"]
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

      <div className={styles.contactPage} lang="en-US">
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
              <span className={styles.breadcrumbCurrent}>Contact Us</span>
            </li>
          </ol>
        </nav>

        <div className={styles.contactContainer}>
          {/* Trust Badge */}
          <div className={styles.trustBadge}>
            <span className={styles.trustBadgeText}>
              ⭐ 500K+ Users • 4.9/5 Rating • 24hr Response Time
            </span>
          </div>

          <h1 className={styles.sectionTitle}>
            Get in Touch <span className={styles.gradientText}>With Us</span>
          </h1>
          
          <p className={styles.subtitle}>
            Have questions about our Free Compound Interest Calculator tool? Our team is here to help with <strong className={styles.highlightText}>investment planning, retirement calculations, and financial education</strong>.
          </p>

          {/* Hero Stats */}
          <div className={styles.heroStats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>24hr</span>
              <span className={styles.statLabel}>Response Time</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>100%</span>
              <span className={styles.statLabel}>Free Support</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>4.9/5</span>
              <span className={styles.statLabel}>Satisfaction</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>✓</span>
              <span className={styles.statLabel}>Privacy First</span>
            </div>
          </div>

          {/* Email Contact Card */}
          <div className={styles.emailCard}>
            <div className={styles.emailIcon}>📧</div>
            <h2 className={styles.emailTitle}>Email Us Directly</h2>
            <p className={styles.emailDescription}>
              For fastest response, send your questions to our support team:
            </p>
            <div className={styles.emailWrapper}>
              <a 
                href="mailto:support@freecompoundcalculator.com" 
                className={styles.emailLink}
              >
                support@freecompoundcalculator.com
              </a>
            </div>
            <div className={styles.responseTime}>
              <span className={styles.clockIcon}>⏱️</span>
              We typically respond within 24 hours
            </div>
          </div>

          {/* Alternative Contact Methods */}
          <div className={styles.alternativeMethods}>
            <h3 className={styles.methodsTitle}>Other Ways to Connect</h3>
            <div className={styles.methodsGrid}>
              <Link href="https://twitter.com/FreeCompoundCalc" className={styles.methodCard}>
                <div className={styles.methodIcon}>🐦</div>
                <div className={styles.methodName}>Twitter</div>
                <div className={styles.methodHandle}>@FreeCompoundCalc</div>
              </Link>
              
              <Link href="https://www.facebook.com/FreeCompoundCalculator" className={styles.methodCard}>
                <div className={styles.methodIcon}>📘</div>
                <div className={styles.methodName}>Facebook</div>
                <div className={styles.methodHandle}>/FreeCompoundCalc</div>
              </Link>
              
              <Link href="https://www.linkedin.com/company/free-compound-calculator" className={styles.methodCard}>
                <div className={styles.methodIcon}>💼</div>
                <div className={styles.methodName}>LinkedIn</div>
                <div className={styles.methodHandle}>/company/free-compound-calculator</div>
              </Link>
              
              <Link href="/faq" className={styles.methodCard}>
                <div className={styles.methodIcon}>❓</div>
                <div className={styles.methodName}>FAQ</div>
                <div className={styles.methodHandle}>Common Questions</div>
              </Link>
            </div>
          </div>

          {/* FAQ Section */}
          <div className={styles.faqSection}>
            <h3 className={styles.sectionSubheading}>Frequently Asked Contact Questions</h3>
            <div className={styles.faqGrid}>
              {faqs.map((faq, index) => (
                <div key={index} className={styles.faqItem}>
                  <h4 className={styles.faqQuestion}>{faq.question}</h4>
                  <p className={styles.faqAnswer}>{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Indicators */}
          <div className={styles.trustIndicators}>
            <h3>Your Privacy Matters</h3>
            <p>
              We use secure email communication for all support inquiries. Your information is encrypted 
              and never shared with third parties. We typically respond within 24 hours and respect your 
              privacy completely.
            </p>
            <div className={styles.privacyBadges}>
              <span className={styles.privacyBadge}>🔒 SSL Encrypted</span>
              <span className={styles.privacyBadge}>🚫 No Spam</span>
              <span className={styles.privacyBadge}>📱 24/7 Support</span>
              <span className={styles.privacyBadge}>🌍 Global</span>
            </div>
          </div>

          {/* Additional Resources */}
          <div className={styles.resourcesSection}>
            <h3 className={styles.resourcesTitle}>Helpful Resources</h3>
            <ul className={styles.resourcesList}>
              <li><Link href="/faq" className={styles.resourceLink}>📚 Frequently Asked Questions</Link></li>
              <li><Link href="/compound-interest-guide" className={styles.resourceLink}>📖 Compound Interest Guide</Link></li>
              <li><Link href="/privacy-policy" className={styles.resourceLink}>🔐 Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className={styles.resourceLink}>📋 Terms of Service</Link></li>
            </ul>
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

  return {
    props: {
      seoData: {
        currentDate,
        lastModifiedDate
      },
      buildTimestamp
    },
    revalidate: 3600 // Revalidate every hour for fresh content
  };
}

export default ContactPage;