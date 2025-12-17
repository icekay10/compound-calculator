'use client';
import { useState } from 'react';
import Head from 'next/head';
import styles from './PrivacyPolicy.module.css';

const PrivacyPolicy = () => {
  const [lastUpdated] = useState('December 2024');
  const [effectiveDate] = useState('January 1, 2025');
  
  // Sections state for accordion functionality
  const [expandedSections, setExpandedSections] = useState({
    dataCollection: true,
    dataUsage: false,
    dataSharing: false,
    dataSecurity: false,
    userRights: false,
    cookies: false,
    thirdParty: false,
    children: false,
    changes: false,
    contact: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Dynamic SEO variables
  const pageTitle = `Privacy Policy | FinanceTools Calculator Suite`;
  const pageDescription = `Read our comprehensive privacy policy. Learn how we collect, use, and protect your data across our financial calculator tools.`;

  return (
    <>
      {/* SEO Meta Tags */}
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="privacy policy, data protection, privacy statement, GDPR, CCPA, data security" />
        <meta name="author" content="FinanceTools Inc." />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:site_name" content="FinanceTools Pro" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        
        {/* Language & Charset */}
        <meta charSet="utf-8" />
      </Head>
      
      {/* Page Content */}
      <div className={styles.calculatorPage}>
        <div className={styles.calculatorContainer}>
          <h1 className={styles.sectionTitle}>Privacy Policy</h1>
          <p className={styles.subtitle}>
            Your privacy is important to us. This policy explains how we collect, use, disclose, 
            and safeguard your information when you use our financial calculator tools.
          </p>
          
          {/* Policy Summary */}
          <div className={styles.inputPanel}>
            <div className={styles.summaryCard}>
              <h3>📋 Policy Overview</h3>
              <div className={styles.summaryGrid}>
                <div className={styles.summaryItem}>
                  <div className={styles.summaryIcon}>🔒</div>
                  <div className={styles.summaryContent}>
                    <h4>Data Protection</h4>
                    <p>We implement industry-standard security measures to protect your data</p>
                  </div>
                </div>
                <div className={styles.summaryItem}>
                  <div className={styles.summaryIcon}>📊</div>
                  <div className={styles.summaryContent}>
                    <h4>Transparency</h4>
                    <p>Clear disclosure of what data we collect and how we use it</p>
                  </div>
                </div>
                <div className={styles.summaryItem}>
                  <div className={styles.summaryIcon}>👤</div>
                  <div className={styles.summaryContent}>
                    <h4>User Control</h4>
                    <p>You have rights to access, correct, or delete your information</p>
                  </div>
                </div>
                <div className={styles.summaryItem}>
                  <div className={styles.summaryIcon}>🌐</div>
                  <div className={styles.summaryContent}>
                    <h4>Compliance</h4>
                    <p>Adherence to GDPR, CCPA, and other privacy regulations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Policy Details */}
          <div className={styles.calcGrid}>
            {/* Main Policy Content */}
            <div className={styles.inputPanel}>
              <h3 className={styles.panelTitle}>Detailed Privacy Policy</h3>
              
              <div className={styles.policySection}>
                <div 
                  className={styles.policyHeader}
                  onClick={() => toggleSection('dataCollection')}
                >
                  <h4>1. Information We Collect</h4>
                  <span className={styles.expandIcon}>
                    {expandedSections.dataCollection ? '−' : '+'}
                  </span>
                </div>
                
                {expandedSections.dataCollection && (
                  <div className={styles.policyContent}>
                    <p><strong>Personal Information:</strong> When you use our calculators, we may collect:</p>
                    <ul className={styles.policyList}>
                      <li>Basic contact information (if you choose to subscribe)</li>
                      <li>Email address for account creation or support</li>
                      <li>Any information you voluntarily provide through feedback forms</li>
                    </ul>
                    
                    <p><strong>Usage Data:</strong> We automatically collect:</p>
                    <ul className={styles.policyList}>
                      <li>Browser type and version</li>
                      <li>Operating system and device information</li>
                      <li>IP address (anonymized for analytics)</li>
                      <li>Pages visited and time spent on our calculators</li>
                      <li>Calculator inputs (processed locally in your browser)</li>
                    </ul>
                    
                    <p className={styles.note}>
                      💡 <strong>Important:</strong> Financial calculations you perform are processed locally in your browser. 
                      We do not store your specific financial data on our servers unless you explicitly save it.
                    </p>
                  </div>
                )}
              </div>
              
              <div className={styles.policySection}>
                <div 
                  className={styles.policyHeader}
                  onClick={() => toggleSection('dataUsage')}
                >
                  <h4>2. How We Use Your Information</h4>
                  <span className={styles.expandIcon}>
                    {expandedSections.dataUsage ? '−' : '+'}
                  </span>
                </div>
                
                {expandedSections.dataUsage && (
                  <div className={styles.policyContent}>
                    <p>We use collected information for the following purposes:</p>
                    
                    <div className={styles.usageGrid}>
                      <div className={styles.usageItem}>
                        <div className={styles.usageIcon}>🚀</div>
                        <div>
                          <h5>Service Improvement</h5>
                          <p>Enhance calculator accuracy and user experience</p>
                        </div>
                      </div>
                      <div className={styles.usageItem}>
                        <div className={styles.usageIcon}>🔧</div>
                        <div>
                          <h5>Technical Support</h5>
                          <p>Troubleshoot issues and provide assistance</p>
                        </div>
                      </div>
                      <div className={styles.usageItem}>
                        <div className={styles.usageIcon}>📈</div>
                        <div>
                          <h5>Analytics</h5>
                          <p>Understand how calculators are used to improve functionality</p>
                        </div>
                      </div>
                      <div className={styles.usageItem}>
                        <div className={styles.usageIcon}>📧</div>
                        <div>
                          <h5>Communication</h5>
                          <p>Respond to inquiries and send service updates</p>
                        </div>
                      </div>
                    </div>
                    
                    <p><strong>Legal Basis for Processing:</strong></p>
                    <ul className={styles.policyList}>
                      <li><strong>Consent:</strong> When you explicitly agree to data collection</li>
                      <li><strong>Legitimate Interest:</strong> Improving our services and user experience</li>
                      <li><strong>Legal Obligation:</strong> Compliance with applicable laws and regulations</li>
                    </ul>
                  </div>
                )}
              </div>
              
              <div className={styles.policySection}>
                <div 
                  className={styles.policyHeader}
                  onClick={() => toggleSection('dataSharing')}
                >
                  <h4>3. Information Sharing & Disclosure</h4>
                  <span className={styles.expandIcon}>
                    {expandedSections.dataSharing ? '−' : '+'}
                  </span>
                </div>
                
                {expandedSections.dataSharing && (
                  <div className={styles.policyContent}>
                    <p>We do not sell, trade, or rent your personal information. We may share data in these limited circumstances:</p>
                    
                    <div className={styles.disclosureTable}>
                      <div className={styles.disclosureRow}>
                        <div className={styles.disclosureCategory}>Service Providers</div>
                        <div className={styles.disclosureDescription}>
                          Trusted third parties who help us operate our website and calculators, subject to strict confidentiality agreements
                        </div>
                      </div>
                      <div className={styles.disclosureRow}>
                        <div className={styles.disclosureCategory}>Legal Requirements</div>
                        <div className={styles.disclosureDescription}>
                          When required by law, court order, or governmental authority
                        </div>
                      </div>
                      <div className={styles.disclosureRow}>
                        <div className={styles.disclosureCategory}>Business Transfers</div>
                        <div className={styles.disclosureDescription}>
                          In connection with a merger, acquisition, or sale of assets
                        </div>
                      </div>
                      <div className={styles.disclosureRow}>
                        <div className={styles.disclosureCategory}>Aggregated Data</div>
                        <div className={styles.disclosureDescription}>
                          Non-personally identifiable, aggregated statistics about calculator usage
                        </div>
                      </div>
                    </div>
                    
                    <p className={styles.note}>
                      🔒 <strong>Important:</strong> Your financial calculation data remains private and is not shared with third parties.
                    </p>
                  </div>
                )}
              </div>
              
              <div className={styles.policySection}>
                <div 
                  className={styles.policyHeader}
                  onClick={() => toggleSection('dataSecurity')}
                >
                  <h4>4. Data Security & Protection</h4>
                  <span className={styles.expandIcon}>
                    {expandedSections.dataSecurity ? '−' : '+'}
                  </span>
                </div>
                
                {expandedSections.dataSecurity && (
                  <div className={styles.policyContent}>
                    <p>We implement comprehensive security measures to protect your information:</p>
                    
                    <div className={styles.securityGrid}>
                      <div className={styles.securityItem}>
                        <div className={styles.securityBadge}>SSL/TLS</div>
                        <p>All data transmission is encrypted using industry-standard protocols</p>
                      </div>
                      <div className={styles.securityItem}>
                        <div className={styles.securityBadge}>Access Control</div>
                        <p>Strict access controls and authentication mechanisms</p>
                      </div>
                      <div className={styles.securityItem}>
                        <div className={styles.securityBadge}>Regular Audits</div>
                        <p>Security assessments and vulnerability testing</p>
                      </div>
                      <div className={styles.securityItem}>
                        <div className={styles.securityBadge}>Data Minimization</div>
                        <p>We only collect data necessary for calculator functionality</p>
                      </div>
                    </div>
                    
                    <p><strong>Local Processing:</strong> Our calculators are designed to process your financial data locally in your browser whenever possible, minimizing server-side data handling.</p>
                    
                    <p><strong>Breach Notification:</strong> In the unlikely event of a data breach, we will notify affected users and relevant authorities as required by law.</p>
                  </div>
                )}
              </div>
              
              <div className={styles.policySection}>
                <div 
                  className={styles.policyHeader}
                  onClick={() => toggleSection('userRights')}
                >
                  <h4>5. Your Privacy Rights</h4>
                  <span className={styles.expandIcon}>
                    {expandedSections.userRights ? '−' : '+'}
                  </span>
                </div>
                
                {expandedSections.userRights && (
                  <div className={styles.policyContent}>
                    <p>Depending on your location, you may have the following rights regarding your personal data:</p>
                    
                    <div className={styles.rightsGrid}>
                      <div className={styles.rightsCard}>
                        <h5>Right to Access</h5>
                        <p>Request a copy of your personal data we hold</p>
                      </div>
                      <div className={styles.rightsCard}>
                        <h5>Right to Rectification</h5>
                        <p>Correct inaccurate or incomplete information</p>
                      </div>
                      <div className={styles.rightsCard}>
                        <h5>Right to Erasure</h5>
                        <p>Request deletion of your personal data</p>
                      </div>
                      <div className={styles.rightsCard}>
                        <h5>Right to Restriction</h5>
                        <p>Limit how we use your personal data</p>
                      </div>
                      <div className={styles.rightsCard}>
                        <h5>Right to Object</h5>
                        <p>Object to certain data processing activities</p>
                      </div>
                      <div className={styles.rightsCard}>
                        <h5>Right to Portability</h5>
                        <p>Receive your data in a structured, machine-readable format</p>
                      </div>
                    </div>
                    
                    <p><strong>How to Exercise Your Rights:</strong></p>
                    <ul className={styles.policyList}>
                      <li>Contact us using the information in the "Contact Us" section</li>
                      <li>We will respond to legitimate requests within 30 days</li>
                      <li>We may need to verify your identity before processing requests</li>
                    </ul>
                    
                    <p><strong>Opt-Out:</strong> You can opt-out of non-essential data collection by adjusting your browser settings or using our cookie consent tool.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Information Panel */}
            <div className={styles.resultsPanel}>
              <h3 className={styles.panelTitle}>Policy Information</h3>
              
              <div className={`${styles.resultCard} ${styles.highlight}`}>
                <h4>Policy Details</h4>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Last Updated:</span>
                  <span className={styles.detailValue}>{lastUpdated}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Effective Date:</span>
                  <span className={styles.detailValue}>{effectiveDate}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Version:</span>
                  <span className={styles.detailValue}>3.0</span>
                </div>
                <p className={styles.resultSubtext}>This policy applies to all FinanceTools calculator applications</p>
              </div>
              
              <div className={styles.resultCard}>
                <div 
                  className={styles.policyHeader}
                  onClick={() => toggleSection('cookies')}
                >
                  <h4>Cookie Policy</h4>
                  <span className={styles.expandIcon}>
                    {expandedSections.cookies ? '−' : '+'}
                  </span>
                </div>
                
                {expandedSections.cookies && (
                  <div className={styles.policyContent}>
                    <p>We use cookies to enhance your calculator experience:</p>
                    <ul className={styles.policyList}>
                      <li><strong>Essential Cookies:</strong> Required for basic functionality</li>
                      <li><strong>Analytics Cookies:</strong> Help us improve our calculators</li>
                      <li><strong>Preference Cookies:</strong> Remember your settings</li>
                    </ul>
                    <p>You can control cookies through your browser settings.</p>
                  </div>
                )}
              </div>
              
              <div className={styles.resultCard}>
                <div 
                  className={styles.policyHeader}
                  onClick={() => toggleSection('thirdParty')}
                >
                  <h4>Third-Party Services</h4>
                  <span className={styles.expandIcon}>
                    {expandedSections.thirdParty ? '−' : '+'}
                  </span>
                </div>
                
                {expandedSections.thirdParty && (
                  <div className={styles.policyContent}>
                    <p>We use these third-party services:</p>
                    <ul className={styles.policyList}>
                      <li><strong>Analytics:</strong> Google Analytics (anonymized data)</li>
                      <li><strong>Hosting:</strong> AWS Cloud Services</li>
                      <li><strong>Support:</strong> Customer service platforms</li>
                    </ul>
                    <p>Each service has its own privacy policy.</p>
                  </div>
                )}
              </div>
              
              <div className={styles.resultCard}>
                <div 
                  className={styles.policyHeader}
                  onClick={() => toggleSection('children')}
                >
                  <h4>Children's Privacy</h4>
                  <span className={styles.expandIcon}>
                    {expandedSections.children ? '−' : '+'}
                  </span>
                </div>
                
                {expandedSections.children && (
                  <div className={styles.policyContent}>
                    <p>Our calculators are not directed at children under 13.</p>
                    <p>We do not knowingly collect personal information from children.</p>
                    <p>If you believe we have collected information from a child, please contact us immediately.</p>
                  </div>
                )}
              </div>
              
              <div className={styles.resultCard}>
                <div 
                  className={styles.policyHeader}
                  onClick={() => toggleSection('changes')}
                >
                  <h4>Policy Changes</h4>
                  <span className={styles.expandIcon}>
                    {expandedSections.changes ? '−' : '+'}
                  </span>
                </div>
                
                {expandedSections.changes && (
                  <div className={styles.policyContent}>
                    <p>We may update this policy periodically.</p>
                    <p>Changes will be posted on this page with an updated effective date.</p>
                    <p>Continued use of our calculators after changes constitutes acceptance.</p>
                  </div>
                )}
              </div>
              
              <div className={styles.resultCard}>
                <div 
                  className={styles.policyHeader}
                  onClick={() => toggleSection('contact')}
                >
                  <h4>Contact Information</h4>
                  <span className={styles.expandIcon}>
                    {expandedSections.contact ? '−' : '+'}
                  </span>
                </div>
                
                {expandedSections.contact && (
                  <div className={styles.policyContent}>
                    <p><strong>Data Protection Officer:</strong></p>
                    <p>Email: privacy@financetools.com</p>
                    <p>Phone: +1 (800) 123-4567</p>
                    <p>Address: 123 Financial District, San Francisco, CA 94105</p>
                    
                    <div className={styles.complianceBadges}>
                      <div className={styles.badge}>GDPR</div>
                      <div className={styles.badge}>CCPA</div>
                      <div className={styles.badge}>Privacy Shield</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Acceptance Section */}
          <div className={styles.sensitivityCard}>
            <h4>📝 Understanding This Policy</h4>
            <div className={styles.strategyGrid}>
              <div className={styles.strategyItem}>
                <h5>Your Consent</h5>
                <p className={styles.strategyValue}>By using our calculators</p>
                <p className={styles.strategyTip}>You acknowledge reading and understanding this privacy policy</p>
              </div>
              <div className={styles.strategyItem}>
                <h5>Data Control</h5>
                <p className={styles.strategyValue}>You're in control</p>
                <p className={styles.strategyTip}>You can manage your privacy preferences and data rights at any time</p>
              </div>
              <div className={styles.strategyItem}>
                <h5>Questions?</h5>
                <p className={styles.strategyValue}>We're here to help</p>
                <p className={styles.strategyTip}>Contact our privacy team with any questions or concerns</p>
              </div>
            </div>
          </div>

          {/* Key Points Table */}
          <div className={styles.milestoneTable}>
            <h4>🔑 Key Privacy Points</h4>
            <div className={styles.tableContainer}>
              <table>
                <thead>
                  <tr>
                    <th>Aspect</th>
                    <th>What We Do</th>
                    <th>What We Don't Do</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Data Collection</td>
                    <td>Collect minimal data needed for calculator functionality</td>
                    <td>Sell your personal information to third parties</td>
                  </tr>
                  <tr>
                    <td>Data Storage</td>
                    <td>Store data securely with encryption</td>
                    <td>Store sensitive financial calculation data on our servers</td>
                  </tr>
                  <tr>
                    <td>Data Sharing</td>
                    <td>Share only with trusted service providers under strict agreements</td>
                    <td>Share your specific financial data or calculations</td>
                  </tr>
                  <tr>
                    <td>User Rights</td>
                    <td>Provide full access to your data and deletion options</td>
                    <td>Make it difficult to exercise your privacy rights</td>
                  </tr>
                  <tr>
                    <td>Transparency</td>
                    <td>Clearly explain all data practices</td>
                    <td>Use hidden tracking or undisclosed data collection</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={styles.tableTip}>
              💡 <strong>Remember:</strong> Our calculators are designed with privacy in mind. 
              Your financial calculations are processed locally whenever possible to protect your data.
            </p>
          </div>

          {/* Compliance Information */}
          <div className={styles.actionCard}>
            <h4>🌐 Global Privacy Compliance</h4>
            <div className={styles.actionGrid}>
              <div className={styles.actionItem}>
                <strong>🇪🇺 GDPR Compliance:</strong><br />
                We comply with the European Union's General Data Protection Regulation (GDPR). 
                EU residents have specific rights regarding their personal data.
              </div>
              <div className={styles.actionItem}>
                <strong>🇺🇸 CCPA Compliance:</strong><br />
                We comply with the California Consumer Privacy Act (CCPA). 
                California residents have specific rights to know, delete, and opt-out of sale of personal information.
              </div>
              <div className={styles.actionItem}>
                <strong>🌍 Other Jurisdictions:</strong><br />
                We strive to comply with privacy laws in all jurisdictions where our calculators are available, 
                including LGPD (Brazil), PIPEDA (Canada), and others.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;