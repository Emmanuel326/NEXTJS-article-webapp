"use client";

import { useState } from "react";
import styles from "../styles/contact.module.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.message.trim()) newErrors.message = "Message cannot be empty";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      // Simulate form submission delay
      setTimeout(() => {
        setSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
        setIsSubmitting(false);
        // Hide success message after 3 seconds
        setTimeout(() => setSubmitted(false), 3000);
      }, 1500);
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.contactContainer}>
        <h1 className={styles.title}>Contact Us</h1>
        <p className={styles.subtitle}>
          We’d love to hear from you! Fill out the form below.
        </p>

        {submitted && (
          <div className={styles.successMsg} aria-live="polite">
            ✅ Message sent successfully!
          </div>
        )}

        <form className={styles.contactForm} onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className={styles.field}>
            <label className={styles.label}>Name</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              aria-invalid={errors.name ? "true" : "false"}
            />
            {errors.name && <p className={styles.error}>{errors.name}</p>}
          </div>

          {/* Email Field */}
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              className={styles.input}
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              aria-invalid={errors.email ? "true" : "false"}
            />
            {errors.email && <p className={styles.error}>{errors.email}</p>}
          </div>

          {/* Message Field */}
          <div className={styles.field}>
            <label className={styles.label}>Message</label>
            <textarea
              className={styles.textarea}
              placeholder="Write your message..."
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              aria-invalid={errors.message ? "true" : "false"}
            ></textarea>
            {errors.message && (
              <p className={styles.error}>{errors.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className={styles.field}>
            <button
              type="submit"
              className={styles.button}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>

        {/* Contact Details */}
        <div className={styles.contactDetails}>
          <p>📍 Address: Baraka House, East Road, Box 16478-20100, Nairobi, Kenya​</p>
          <p>📞 Phone: +254 704307624</p>
          <p>✉️ Email: ubuntumail285@gmail.com</p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
