import React from "react";
import { FaComments, FaCalendarAlt, FaMapMarkedAlt, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router";

export default function Overview() {
  return (
    <section className="overview">
      <div className="overview-container">
        <div className="overview-text">
          <h1>Because life after work should not be faced alone.</h1>
          <p className="overview-subtitle">
            Welcome to <strong>AzureHaven</strong>! A platform designed to bring 
            individuals who are retiring into communities closer together. 
            Our mission is to strengthen connection, encourage participation, 
            and enhance mental well-being through meaningful engagement and shared experiences.
          </p>

          <ul className="overview-features">
            <li>
              <FaComments className="feature-icon" /> Join the <strong>Discussion</strong> share stories, advice, and laughter.
            </li>
            <li>
              <FaCalendarAlt className="feature-icon" /> Stay organized with your <strong> Calendar</strong>.
            </li>
            <li>
              <FaMapMarkedAlt className="feature-icon" /> Explore local gatherings with our <strong>Interactive Event Map</strong>.
            </li>
          </ul>

          <Link to="/create" className="overview-button">
            Join the Community <FaArrowRight className="arrow-icon" />
          </Link>
        </div>
      </div>
    </section>
  );
}
