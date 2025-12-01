import React from "react";
import { FaComments, FaCalendarAlt, FaMapMarkedAlt, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router";

export default function Overview() {
  return (
    <section
      className="overview"
      role="region"
      aria-labelledby="overview-heading"
    >
      <div className="overview-container">
        <div className="overview-text">
          <h1 id="overview-heading">
            Because life after work should not be faced alone.
          </h1>

          <p className="overview-subtitle">
            Welcome to <strong>AzureHaven</strong>! A platform designed to bring
            individuals who are retiring into communities closer together.
            Our mission is to strengthen connection, encourage participation,
            and enhance mental well-being through meaningful engagement and shared experiences.
          </p>

          <ul
            className="overview-features"
            aria-label="Platform features and benefits"
          >
            <li>
              <FaComments
                className="feature-icon"
                aria-hidden="true"
              />
              <span>
                Join the <strong>Discussion</strong> share stories, advice, and laughter.
              </span>
            </li>

            <li>
              <FaCalendarAlt
                className="feature-icon"
                aria-hidden="true"
              />
              <span>
                Stay organized with your <strong>Calendar</strong>.
              </span>
            </li>

            <li>
              <FaMapMarkedAlt
                className="feature-icon"
                aria-hidden="true"
              />
              <span>
                Explore local gatherings with our <strong>Interactive Event Map</strong>.
              </span>
            </li>
          </ul>

          <Link
            to="/create"
            className="overview-button"
            aria-label="Join the community and start participating"
          >
            Join the Community
            <FaArrowRight className="arrow-icon" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
