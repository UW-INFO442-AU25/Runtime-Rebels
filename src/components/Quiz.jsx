import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../main";
import { db } from "../main.jsx";
import { ref, update } from "firebase/database";
import "../index.css";

export default function Quiz() {
  const navigate = useNavigate();

  const [answers, setAnswers] = useState({
    interests: "",
    community: "",
    goals: ""
  });

  const handleChange = (e) => {
    setAnswers({
      ...answers,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    try {
      await update(ref(db, `users/${user.uid}`), { quiz: answers });
      navigate("/"); 
    } catch (err) {
      console.error("Quiz save error:", err);
    }
  };

  return (
    <main className="signup-page">
      <section className="signup-card">
        <div className="signup-left">
          <h1 className="signup-title">Let’s personalize your experience</h1>
          <p className="signup-subtitle">Tell us a little about what matters to you.</p>

          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="field">
              <label>What would you like to explore?</label>
              <select
                name="interests"
                value={answers.interests}
                onChange={handleChange}
                required
              >
                <option value="">Select one...</option>
                <option value="wellness">Health & Wellness</option>
                <option value="finance">Retirement Finance</option>
                <option value="community">Local Groups & Events</option>
                <option value="hobbies">Hobbies & Lifelong Learning</option>
              </select>
            </div>

            <div className="field">
              <label>How would you like to connect with others?</label>
              <select
                name="community"
                value={answers.community}
                onChange={handleChange}
                required
              >
                <option value="">Choose an option...</option>
                <option value="local">Local Meetups</option>
                <option value="online">Online Communities</option>
                <option value="both">A mix of both</option>
              </select>
            </div>

            <div className="field">
              <label>What are your goals after retirement?</label>
              <textarea
                name="goals"
                value={answers.goals}
                onChange={handleChange}
                placeholder="Staying active, meeting people, learning new things..."
                required
                rows="3"
              />
            </div>

            <button className="btn-primary">Finish</button>
          </form>
        </div>

        <aside className="signup-visual" aria-hidden="true">
          <img src="/img/happyretiredcouple.jpg" alt="" />
        </aside>
      </section>
    </main>
  );
}
