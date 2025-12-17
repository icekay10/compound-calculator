import Link from 'next/link';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3>FreeCompoundCalculator</h3>
          <p>Professional compound interest calculator for smarter financial decisions.</p>
        </div>
        <div className={styles.footerSection}>
          <h4>Quick Links</h4>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/free-compound-interest-calculator">Compound Interest Calculator</Link></li>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div className={styles.footerSection}>
          <h4>Tools</h4>
          <ul>
            <li><Link href="/basic-calculator">Basic Calculator</Link></li>
            <li><Link href="/advanced-calculator">Advanced Calculator</Link></li>
            <li><Link href="/retirement-planner">Retirement Planner</Link></li>
            <li><Link href="/savings-calculator">Savings Calculator</Link></li>
          </ul>
        </div>
        
      </div>
      <div className={styles.footerBottom}>
        <p>&copy; {new Date().getFullYear()} FreeCompoundCalculator. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;