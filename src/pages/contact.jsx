'use client';

import { useState } from 'react';
import styles from './Contact.module.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (submitError) setSubmitError('');
    if (submitSuccess) setSubmitSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setSubmitError('Please fill in all fields.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setSubmitError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    
    const form = new FormData();
    form.append('name', formData.name);
    form.append('email', formData.email);
    form.append('message', formData.message);
    form.append('_subject', 'New Contact Form Submission - FreeCompoundCalculator');
    form.append('_autoresponse', 'Thank you for contacting FreeCompoundCalculator! We have received your message and will get back to you within 24 hours.');
    form.append('_template', 'table'); // Better email formatting
    form.append('_captcha', 'false'); // Disable captcha for better UX

    try {
      const response = await fetch('https://formsubmit.co/ajax/your-email@domain.com', {
        method: 'POST',
        body: form,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        setSubmitSuccess(true);
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.contactPage}>
      <div className={styles.contactContainer}>
        <h1 className={styles.sectionTitle}>Get in Touch With Us</h1>
        <p className={styles.subtitle}>
          Have questions about our Free Compound Interest Calculator tool? Our team is here to help.
        </p>

        <form onSubmit={handleSubmit} className={styles.contactForm} noValidate>
          <div className={styles.formGroup}>
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Your full name"
              disabled={isSubmitting}
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              disabled={isSubmitting}
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="5"
              placeholder="Tell us how we can assist you with compound interest calculations, investment planning, or any other questions..."
              disabled={isSubmitting}
              className={styles.formTextarea}
            ></textarea>
          </div>

          {submitSuccess && (
            <div className={styles.formSuccess}>
              ✅ Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.
            </div>
          )}

          {submitError && (
            <div className={styles.formError}>
              ❌ {submitError}
            </div>
          )}

          <button 
            type="submit" 
            className={styles.submitBtn} 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className={styles.loadingText}>
                <span className={styles.spinner}></span>
                Sending...
              </span>
            ) : (
              'Send Message'
            )}
          </button>
        </form>

        <div className={styles.contactInfo}>
          <p>
            Prefer email? Reach us directly at{' '}
            <a href="mailto:support@freecompoundcalculator.com">
              support@freecompoundcalculator.com
            </a>
          </p>
        </div>

        <div className={styles.trustIndicators}>
          <h3>Your Privacy Matters</h3>
          <p>
            We use FormSubmit.co to handle our contact form submissions. Your information is encrypted 
            and never shared with third parties. We typically respond within 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;