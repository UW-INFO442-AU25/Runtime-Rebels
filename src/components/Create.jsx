import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../index.css";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, set } from "firebase/database";
import { db } from "../firebase";

export default function Create() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCred.user, { displayName: name });

      await set(ref(db, `users/${userCred.user.uid}`), {
        name,
        email,
        phoneNumber: "",
        country: "",
        language: "",
        timeZone: "",
        avatar: ""
      });

      // Redirect to quiz page after signup
      navigate("/quiz");
    } catch (err) {
      console.error("Signup error:", err);
      setError("Failed to create account — try again.");
    }
  };

  return (
    <main className="signup-page">
      <section className="signup-card">
        <div className="signup-left">
          <h1 className="signup-title">Create your account</h1>
          <p className="signup-subtitle">
            Because life after work shouldn’t be faced alone.
          </p>

          <form className="signup-form" onSubmit={handleSignup} aria-label="Create account form">
            <div className="field">
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                aria-required="true"
              />
            </div>

            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-required="true"
              />
            </div>

            <div className="field field-row">
              <div className="field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-required="true"
                />
              </div>

              <div className="field">
                <label htmlFor="confirm">Confirm password</label>
                <input
                  id="confirm"
                  name="confirm"
                  type="password"
                  placeholder="••••••••"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  aria-required="true"
                />
              </div>
            </div>

            <button className="btn-primary" type="submit">
              Create account
            </button>

            {error && (
              <p className="error-text" role="alert" aria-live="assertive">
                {error}
              </p>
            )}

            <p className="auth-switch">
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </form>
        </div>

        <aside className="signup-visual" aria-hidden="true">
          <img src="/img/happyretiredcouple.jpg" alt="" />
        </aside>
      </section>
    </main>
  );
}
