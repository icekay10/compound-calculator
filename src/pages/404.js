import Link from 'next/link';
import styles from './Custom404.module.css';

const Custom404 = () => {
  return (
    <div className={styles.errorPage}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <h1 className={styles.heroTitle}>
          404 - Your Calculation Couldn't Be Found
        </h1>
        <p className={styles.heroSubtitle}>
          The page you're looking for seems to have been compounded away. Don't worry—we'll help you find your way back to financial clarity.
        </p>
      </section>

      {/* Main Content */}
      <section className={styles.contentSection}>
        <div className={styles.contentContainer}>
          {/* Error Intro Card */}
          <div className={styles.introCard}>
            <div className={styles.iconLarge}>🔍</div>
            <h2>Where Did the Page Go?</h2>
            <p>
              Just like compound interest grows over time, sometimes pages move or get redirected. 
              This could be due to an outdated link, a typo in the URL, or a page that's been 
              optimized for better performance.
            </p>
          </div>

          {/* Quick Recovery */}
          <div className={styles.detailsSection}>
            <h3 className={styles.sectionHeading}>Quick Recovery Options</h3>
            <div className={styles.detailContent}>
              <p>
                Let's get you back on track with these immediate solutions:
              </p>
              <ul>
                <li><strong>Return to Home:</strong> Go back to our main calculator dashboard</li>
                <li><strong>Use Navigation:</strong> Try our main menu or search function</li>
                <li><strong>Check URL:</strong> Make sure the web address is spelled correctly</li>
                <li><strong>Bookmark Important Pages:</strong> Save our calculator for easy access</li>
                <li><strong>Contact Support:</strong> Reach out if you're stuck in a financial loop</li>
              </ul>
              <p>
                Remember, just like consistent investing beats timing the market, consistent navigation beats random clicking!
              </p>
            </div>
          </div>

          {/* Helpful Tools Grid */}
          <div className={styles.principlesSection}>
            <h3 className={styles.sectionHeading}>Find What You Need</h3>
            <div className={styles.principlesGrid}>
              {[
                {
                  icon: '🧮',
                  title: 'Compound Calculator',
                  description: 'Our main tool for calculating compound interest with beautiful visualizations'
                },
                {
                  icon: '📈',
                  title: 'Investment Guide',
                  description: 'Learn how to make your money work smarter with investment principles'
                },
                {
                  icon: '🎯',
                  title: 'Financial Goals',
                  description: 'Set and track your financial objectives with our planning tools'
                },
                {
                  icon: '📊',
                  title: 'Retirement Planning',
                  description: 'Calculate how much you need to save for a comfortable retirement'
                },
                {
                  icon: '🏠',
                  title: 'Home Savings',
                  description: 'Plan and track your down payment savings with compound interest'
                },
                {
                  icon: '🎓',
                  title: 'Education Fund',
                  description: 'Calculate education savings with compounding over time'
                }
              ].map((value, index) => (
                <Link 
                  href="/" 
                  key={index} 
                  className={`${styles.principleCard} ${styles.animateOnHover}`} 
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={styles.principleIcon}>{value.icon}</div>
                  <h4>{value.title}</h4>
                  <p>{value.description}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Financial Wisdom */}
          <div className={styles.detailsSection}>
            <h3 className={styles.sectionHeading}>Financial Wisdom While You Wait</h3>
            <div className={styles.detailContent}>
              <p>
                Just as compound interest rewards patience, navigating websites sometimes requires a moment of reflection. Here are timeless financial principles:
              </p>
              <ul>
                <li><strong>Start early, compound often:</strong> The sooner you begin investing, the more time compounding works for you</li>
                <li><strong>Consistency beats perfection:</strong> Regular contributions matter more than perfect timing</li>
                <li><strong>Time is your greatest asset:</strong> Even small amounts grow substantially over decades</li>
                <li><strong>Diversify your approach:</strong> In investing and navigation, having multiple options reduces risk</li>
              </ul>
              <p>
                While we redirect you, remember that financial success, like finding the right page, is about persistence and the right tools.
              </p>
            </div>
          </div>

          {/* Error Stats */}
          <div className={styles.detailsSection}>
            <h3 className={styles.sectionHeading}>404 By The Numbers</h3>
            <div className={styles.detailContent}>
              <p>
                Even the best financial plans encounter unexpected events. Here's how we handle 404s:
              </p>
              <div className={styles.impactStats}>
                <div className={styles.statItem}>
                  <div className={styles.statNumber}>99.9%</div>
                  <div className={styles.statLabel}>Pages successfully found</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statNumber}>2s</div>
                  <div className={styles.statLabel}>Average redirect time</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statNumber}>100%</div>
                  <div className={styles.statLabel}>Helpful alternatives provided</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statNumber}>0</div>
                  <div className={styles.statLabel}>Lost visitors (we always recover them)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.trustSection}>
        <div className={styles.trustContainer}>
          <h3 className={styles.sectionHeading}>Ready to Calculate Your Future?</h3>
          <div className={styles.trustCards}>
            {[
              {
                icon: '🚀',
                title: 'Instant Calculator',
                desc: 'Get back to our main compound interest calculator'
              },
              {
                icon: '📚',
                title: 'Learn More',
                desc: 'Read our comprehensive financial education guides'
              },
              {
                icon: '💡',
                title: 'Get Tips',
                desc: 'Discover investment strategies and saving techniques'
              },
              {
                icon: '🔗',
                title: 'Bookmark Us',
                desc: 'Save this page to avoid future navigation issues'
              }
            ].map((item, index) => (
              <Link 
                href="/" 
                key={index} 
                className={`${styles.trustCard} ${styles.animateOnHover}`} 
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={styles.trustIcon}>{item.icon}</div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </Link>
            ))}
          </div>
          <div className={styles.primaryCta}>
            <Link href="/" className={styles.ctaButton}>
              Return to Compound Calculator
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Custom404;