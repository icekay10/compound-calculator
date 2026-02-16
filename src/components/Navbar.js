'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && 
          !event.target.closest(`.${styles.navbarMenu}`) && 
          !event.target.closest(`.${styles.navbarToggle}`)) {
        setIsOpen(false);
      }
    };

    // Handle scroll effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen]);

  // Prevent body scroll when menu is open on mobile
  useEffect(() => {
    if (isOpen && window.innerWidth <= 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
      <Link href="/" className={styles.navbarLogo} onClick={() => setIsOpen(false)}>
        FreeCompoundCalculator
      </Link>

      <div className={`${styles.navbarMenu} ${isOpen ? styles.active : ''}`}>
        <Link href="/" onClick={toggleMenu}>Home</Link>
        <Link href="/free-compound-interest-calculator" onClick={toggleMenu}>Compound Interest Calculator</Link>
        <Link href="/about" onClick={toggleMenu}>About Us</Link>
        <Link href="/contact" onClick={toggleMenu}>Contact</Link>
      </div>

      <button 
        className={`${styles.navbarToggle} ${isOpen ? styles.active : ''}`} 
        onClick={toggleMenu} 
        aria-label="Toggle menu"
      >
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
      </button>
      
      {/* Overlay for mobile when menu is open */}
      {isOpen && <div className={styles.menuOverlay} onClick={toggleMenu}></div>}
    </nav>
  );
};

export default Navbar;