import React from "react";
import "../index.css";
const heroImg = "/img/resourcesbanner.png"

export default function Resources() {
  return (
    <div className="resources-page">

      {/* === HERO SECTION === */}
      <section
        className="resources-hero"
        style={{ backgroundImage: `url(${heroImg})` }}
        aria-label="Resources hero"
      >
        <div className="hero-overlay">
          <h1>
            22.8% of U.S. adults experienced mental illness in 2021, representing 1 in 5 adults (NAMH).
          </h1>
          <p>
            While retiring can be rewarding, it can also trigger stress, anxiety, and depression.
            These resources can help you cope with retirement depression and find new purpose in life.
          </p>
        </div>
      </section>

      {/* === FILTER + GRID CARD === */}
      <section className="filter-section" role="region" aria-label="Filter resources">
        <div className="filter-card">

          <div className="filter-buttons" role="tablist" aria-label="Categories">
            <button className="pill active" role="tab" aria-selected="true">All</button>
            <button className="pill" role="tab">General</button>
            <button className="pill" role="tab">Mental Health</button>
            <button className="pill" role="tab">Community</button>
            <button className="pill" role="tab">Lifestyle</button>
          </div>

          <div className="filter-controls">
            <div className="field">
              <input type="text" placeholder="Search keywords..." aria-label="Search keywords" />
            </div>
            <div className="field">
              <select aria-label="Select topic" defaultValue="__default">
                <option disabled value="__default">Select topic</option>
                <option>Wellness</option>
                <option>Stress</option>
                <option>Purpose</option>
              </select>
            </div>
            <div className="field">
              <select aria-label="Category" defaultValue="__default">
                <option disabled value="__default">Category</option>
                <option>Article</option>
                <option>Guide</option>
                <option>Story</option>
              </select>
            </div>
            <button className="search-btn" aria-label="Search">Search</button>
          </div>

          {/* === RESOURCES GRID === */}
          <div className="resource-grid resources-grid--wide">
            <article className="resource-card">
              <div className="thumb" />
              <h3>Life After Retirement: A Simple Guide to Wellness</h3>
            </article>

            <article className="resource-card">
              <div className="thumb" />
              <h3>What Happens to Our Minds After We Retire?</h3>
            </article>

            <article className="resource-card">
              <div className="thumb" />
              <h3>Daily Habits That Boost Mental Health in Retirement</h3>
            </article>

            <article className="resource-card">
              <div className="thumb" />
              <h3>I Found Joy After Retirement: Real Stories of Hope</h3>
            </article>

            <article className="resource-card">
              <div className="thumb" />
              <h3>The Emotional Side of Retirement: What No One Talks About</h3>
            </article>

            <article className="resource-card">
              <div className="thumb" />
              <h3>How Social Connection Protects Your Mental Health</h3>
            </article>
          </div>

        </div>
      </section>
    </div>
  );
}
