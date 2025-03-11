"use client";

import Seo from "../components/Seo"; // Import Seo component
import styles from "../styles/about.module.css";

const About = () => {
  return (
    <>
      {/* Seo Component for About Page */}
      <Seo
        title="About Us - Finance Insights"
        description="Learn more about Finance Insights, our mission, and why we are a trusted source for financial news, investment strategies, and economic analysis."
        url="https://yourfrontenddomain.com/about"
        canonical="https://yourfrontenddomain.com/about"
      />

      <section className={styles["about-section"]}>
        <div className={styles["about-container"]}>
          <h1 className={styles["about-title"]}>About Finance Insights</h1>

          {/* Mission Section */}
          <section className={styles["about-section-item"]}>
            <h2 className={styles["about-subtitle"]}>Our Mission</h2>
            <p>
              At Finance Insights, we strive to provide accurate, insightful, and
              up-to-date financial news, investment strategies, and economic analysis
              to empower individuals and businesses.
            </p>
          </section>

          {/* Why Choose Us */}
          <section className={styles["about-section-item"]}>
            <h2 className={styles["about-subtitle"]}>Why Choose Us?</h2>
            <ul className={styles["about-list"]}>
              <li>✅ Expert financial analysis</li>
              <li>✅ Latest insights on investing, crypto, real estate, and more</li>
              <li>✅ Easy-to-understand finance guides</li>
            </ul>
          </section>

          {/* Our Team */}
          <section className={styles["about-section-item"]}>
            <h2 className={styles["about-subtitle"]}>Meet Our Team</h2>
            <p>
              Our team consists of financial analysts, economists, and tech-savvy writers
              dedicated to providing valuable content to our readers.
            </p>
          </section>
        </div>
      </section>
    </>
  );
};

export default About;
