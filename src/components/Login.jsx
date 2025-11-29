import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import "../index.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      console.error("Email Login Error:", err);
      setError("Invalid email or password.");
    }
  };

  return (
    <main className="signup-page">
      <section className="signup-card">
        <div className="signup-left">
          <h1 className="signup-title">Log in</h1>

          <form className="signup-form" onSubmit={handleEmailLogin}>
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
                />
              </div>
            </div>

            <button className="btn-primary" type="submit">
              Log in
            </button>

            {error && <p className="error-text">{error}</p>}

            <p className="auth-switch">
              Don't have an account? <Link to="/create">Sign up</Link>
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
