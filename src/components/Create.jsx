import React from "react";
import { Link } from "react-router-dom";
import "../index.css";

export default function Create() {
  return (
    <main className="signup-page">
      <section className="signup-card">
        <div className="signup-left">
          <h1 className="signup-title">
            Create your account
          </h1>
          <p className="signup-subtitle">
            Because life after work shouldn’t be faced alone.
          </p>

          <form
            className="signup-form"
            onSubmit={(e) => {
              e.preventDefault();
              // TODO: handle your submit flow here
            }}
          >
            <div className="field">
              <label htmlFor="name">Full name</label>
              <input id="name" name="name" type="text" placeholder="Jane Doe" required />
            </div>

            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" placeholder="you@example.com" required />
            </div>

            <div className="field field-row">
              <div className="field">
                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" placeholder="••••••••" required />
              </div>
              <div className="field">
                <label htmlFor="confirm">Confirm</label>
                <input id="confirm" name="confirm" type="password" placeholder="••••••••" required />
              </div>
            </div>

            {/* <div className="tos">
            // If we are including a TOS then add this. Not sure if necessary tho.
              <input id="tos" type="checkbox" required />
              <label htmlFor="tos">
                I agree to the <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a>.
              </label>
            </div> */}

            <button className="btn-primary" type="submit">Create account</button>

            <div className="or">
              <span>or</span>
            </div>

            <p className="auth-switch">
              Already have an account? <Link to="/login">Log in</Link>
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
