import React from "react";
import "../index.css";

export default function Home() {
  return (
    <div className="home">

      {/* === HERO SECTION === */}
      <section className="hero">
        <div className="hero-text">
          <h1>Because life after work shouldn’t be faced alone.</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
            ex ea commodo consequat.
          </p>
          <div className="hero-buttons">
            <a href="/create">
              <button className="primary-btn">Get Started</button>
            </a>
            <a href="/login">
              <button className="secondary-btn">Log In</button>
            </a>
          </div>
        </div>

        <div className="hero-image">
          <img src="../img/peopleonboat.png" alt="People on a boat" />
        </div>
      </section>

      {/* === MISSION SECTION === */}
      <section className="mission">
        <h2>Our Mission</h2>
        <p>
          We want to bridge the gap in mental health support for retired adults by
          offering accessible tools, guidance, and community resources that
          enhance well-being and reduce isolation.
        </p>
      </section>

      {/* === RESOURCES SECTION === */}
      <section className="resources">
        <h2>Resources</h2>
        <div className="resource-grid">
          <div className="resource-card">
            <h3>Mental Health</h3>
            <p>
              Explore easy-to-understand articles, videos, and tools to help you
              manage stress, anxiety, and overall mental well-being.
            </p>
          </div>
          <div className="resource-card">
            <h3>Guided Wellness Tools</h3>
            <p>
              Try guided exercises like meditation, journaling, and cognitive
              activities designed to support a healthy mind and daily routine.
            </p>
          </div>
          <div className="resource-card">
            <h3>Community</h3>
            <p>
              Connect with peers, share experiences, and find support in a
              welcoming, stigma-free space.
            </p>
          </div>
          <div className="resource-card">
            <h3>Accessibility</h3>
            <p>
              Navigate mental health resources with ease—large fonts, clear
              instructions, and accessibility features make it simple for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* === TESTIMONIAL SECTION === */}
      <section className="testimonials">
        <h2>What Our Community Says</h2>
        <div className="testimonial-grid">
          <div className="testimonial-card">
            <p>
              “Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
              ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat.”
            </p>
            <div className="testimonial-profile">
              <img src="/images/jane.jpg" alt="Jane Doe" />
              <div>
                <h4>Jane Doe</h4>
                <p>65 years old, Seattle, WA</p>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <p>
              “Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
              ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat.”
            </p>
            <div className="testimonial-profile">
              <img src="/images/john.jpg" alt="John Doe" />
              <div>
                <h4>John Doe</h4>
                <p>60 years old, NYC, NY</p>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <p>
              “Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
              ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat.”
            </p>
            <div className="testimonial-profile">
              <img src="/images/robert.jpg" alt="Robert Bob" />
              <div>
                <h4>Robert Bob</h4>
                <p>70 years old, Orlando, FL</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
