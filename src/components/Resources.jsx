import React from "react";
import "../index.css";

export default function Resources()  {
  return (
    <div className="resources-page">

      {/* === HERO SECTION === */}
      <section className="resources-hero">
        <div className="hero-overlay">
          <h1>22.8% of U.S. adults experienced mental illness in 2021, representing 1 in 5 adults (NAMH).</h1>
          <p>
            While retiring can be rewarding, it can also trigger stress, anxiety, and depression. These resources can help you cope with retirement depression and find new purpose in life.
          </p>
        </div>
      </section>

      {/* === FILTER SECTION === */}
      <section className="filter-section">
        <div className="filter-buttons">
          <button className="active">All</button>
          <button>General</button>
          <button>Mental Health</button>
          <button>Community</button>
          <button>Lifestyle</button>
        </div>

        <div className="filter-controls">
          <input type="text" placeholder="Search keywords..." />
          <select>
            <option>Select topic</option>
          </select>
          <select>
            <option>Category</option>
          </select>
          <button className="search-btn">Search</button>
        </div>
      </section>

      {/* === RESOURCES GRID === */}
      <section className="resource-grid">
        <div className="resource-card">
          <h3>Life After Retirement: A Simple Guide to Wellness</h3>
          <p>
            Explore ways to stay mentally and physically healthy while adjusting to retirement life.
          </p>
        </div>

        <div className="resource-card">
          <h3>What Happens to Our Minds After We Retire?</h3>
          <p>
            Learn how the transition affects cognition and what activities can 
            help maintain clarity and focus.
          </p>
        </div>

        <div className="resource-card">
          <h3>Daily Habits That Boost Mental Health in Retirement</h3>
          <p>
            Description
          </p>
        </div>

        <div className="resource-card">
          <h3>I Found Joy After Retirement: Real Stories of Hope</h3>
          <p>
            Description
          </p>
        </div>

        <div className="resource-card">
          <h3>The Emotional Side of Retirement: What No One Talks About</h3>
          <p>
            Description
          </p>
        </div>

        <div className="resource-card">
          <h3>How Social Connection Protects Your Mental Health</h3>
          <p>
            Description
          </p>
        </div>
      </section>
    </div>
  );
}