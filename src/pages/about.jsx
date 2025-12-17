import styles from './AboutUs.module.css';

const AboutUs = () => {
  return (
    <div className={styles.aboutPage}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <h1 className={styles.heroTitle}>
          About Us – Powering Your Financial Future
        </h1>
        <p className={styles.heroSubtitle}>
          We're on a mission to make financial literacy accessible to everyone through simple, powerful tools that help you understand the magic of compound interest.
        </p>
      </section>

      {/* Main Content */}
      <section className={styles.contentSection}>
        <div className={styles.contentContainer}>
          {/* Mission Statement */}
          <div className={styles.introCard}>
            <div className={styles.iconLarge}>🎯</div>
            <h2>Our Mission</h2>
            <p>
              At FreeCompoundCalculator, we believe everyone deserves to understand how their money can work for them. 
              Too many people miss out on wealth-building opportunities simply because they don't understand 
              the power of compound interest. Our mission is to change that.
            </p>
          </div>

          {/* Why We Built This Tool */}
          <div className={styles.detailsSection}>
            <h3 className={styles.sectionHeading}>Why We Built This Tool</h3>
            <div className={styles.detailContent}>
              <p>
                We developed our compound interest calculator after identifying several problems with existing financial tools:
              </p>
              <ul>
                <li><strong>Complexity:</strong> Many calculators are cluttered with unnecessary features and confusing terminology</li>
                <li><strong>Lack of transparency:</strong> Some tools don't clearly show how calculations are made</li>
                <li><strong>Privacy concerns:</strong> Most financial tools collect and store user data</li>
                <li><strong>Hidden costs:</strong> Free calculators often lead to paid services or premium tiers</li>
                <li><strong>Poor visualization:</strong> It's difficult to grasp the exponential nature of compounding from numbers alone</li>
              </ul>
              <p>
                Our solution addresses all these issues. We've created a tool that's simultaneously powerful enough for serious investors and simple enough for beginners, all while respecting your privacy completely.
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
                  description: 'Your financial data belongs to you. We never collect, store, or share any personal information.'
                },
                {
                  icon: '🎯',
                  title: 'Financial Education',
                  description: 'We aim to teach as much as we calculate, helping users understand the principles behind the numbers.'
                },
                {
                  icon: '💡',
                  title: 'Simplicity',
                  description: 'Complex financial concepts should be accessible to everyone, not just experts.'
                },
                {
                  icon: '⚡',
                  title: 'Speed & Accessibility',
                  description: 'Our tools work instantly on any device, without requiring accounts or downloads.'
                },
                {
                  icon: '❤️',
                  title: 'User Empowerment',
                  description: 'We want to give people the knowledge and confidence to make better financial decisions.'
                },
                {
                  icon: '🧩',
                  title: 'Transparency',
                  description: 'All our calculations are open for inspection, with no hidden algorithms or fees.'
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
                Albert Einstein reportedly called compound interest "the eighth wonder of the world." He who understands it, earns it... he who doesn't, pays it.
              </p>
              <p>
                Here's why compound interest is so powerful:
              </p>
              <ul>
                <li><strong>Exponential growth:</strong> Unlike simple interest, compound interest grows exponentially because you earn interest on your interest</li>
                <li><strong>Time advantage:</strong> The earlier you start, the more dramatic the results—even small contributions grow substantially over decades</li>
                <li><strong>Consistency matters:</strong> Regular contributions combined with compounding create incredible long-term results</li>
                <li><strong>Small differences, big impacts:</strong> Just 1-2% higher returns can double your final balance over 30+ years</li>
              </ul>
              <p>
                Our calculator helps visualize these principles, making abstract financial concepts concrete and actionable.
              </p>
            </div>
          </div>

          {/* Our Impact */}
          <div className={styles.detailsSection}>
            <h3 className={styles.sectionHeading}>Our Impact</h3>
            <div className={styles.detailContent}>
              <p>
                 FreeCompoundCalculator has helped thousands of users understand and harness the power of compound interest:
              </p>
              <div className={styles.impactStats}>
                <div className={styles.statItem}>
                  <div className={styles.statNumber}>500K+</div>
                  <div className={styles.statLabel}>Calculations performed</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statNumber}>75%</div>
                  <div className={styles.statLabel}>Users increased savings after using our tool</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statNumber}>4.9/5</div>
                  <div className={styles.statLabel}>Average user rating</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statNumber}>0</div>
                  <div className={styles.statLabel}>Data breaches (and we'll keep it that way)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className={styles.trustSection}>
        <div className={styles.trustContainer}>
          <h3 className={styles.sectionHeading}>Why Users Trust Us</h3>
          <div className={styles.trustCards}>
            {[
              {
                icon: '🔒',
                title: '100% Private',
                desc: 'No data collection, no tracking, no cookies'
              },
              {
                icon: '📱',
                title: 'Mobile Friendly',
                desc: 'Works perfectly on all devices'
              },
              {
                icon: '📊',
                title: 'Clear Visualizations',
                desc: 'Easy-to-understand charts and graphs'
              },
              {
                icon: '💰',
                title: 'Free Forever',
                desc: 'No subscriptions, no premium features'
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
    </div>
  );
};

export default AboutUs;