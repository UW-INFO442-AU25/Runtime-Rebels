import React from "react";
import { Link } from "react-router-dom";
import "../index.css";

export default function Login() {
  return (
    <main className="signup-page">
      <section className="signup-card">
        <div className="signup-left">
          <h1 className="signup-title">
            Log in
          </h1>

          <form
            className="signup-form"
            onSubmit={(e) => {
              e.preventDefault();
              // Handle your submit flow here
            }}
          >

            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" placeholder="you@example.com" required />
            </div>

            <div className="field field-row">
              <div className="field">
                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" placeholder="••••••••" required />
              </div>
            </div>

            <button className="btn-primary" type="submit">Log in</button>

            <div className="or">
              <span>or</span>
            </div>

            <p className="auth-switch">
              Don't have an account? <Link to="/create">Sign up</Link>
            </p>
          </form>
        </div>

        <aside className="signup-visual" aria-hidden="true">
          <img src="./public/img/happyretiredcouple.jpg" alt="" />
        </aside>
      </section>
    </main>
  );
}
