import React from "react";
import "../index.css";

export default function About() {
  const team = [
    {
      name: "Celine Chen",
      role: "Runtime Rebels",
      img: "./public/img/insert.jpg",
      bio: "Senior studying Informatics at the University of Washington.",
      links: { linkedin: "https://www.linkedin.com/in/celinechenn/"},
    },
    {
      name: "Mia (Yoonsoo) Cho",
      role: "Runtime Rebels",
      img: "./public/img/insert.jpg",
      bio: "Senior studying Informatics at the University of Washington.",
      links: { linkedin: "https://www.linkedin.com/in/yoonsoo-cho-a15106236/", github: "#" },
    },
    {
      name: "Ben Nguyen",
      role: "Runtime Rebels",
      img: "./public/img/insert.jpg",
      bio: "Senior studying Informatics and Economics at the University of Washington.",
      links: { linkedin: "https://www.linkedin.com/in/akben/", github: "#" },
    },
    {
      name: "Gabi Schwartz",
      role: "Runtime Rebels",
      img: "./public/img/insert.jpg",
      bio: "Senior studying Informatics and Public Health at the University of Washington.",
      links: { linkedin: "https://www.linkedin.com/in/gabi-schwartz22/", github: "#" },
    },
    {
      name: "Cassidy Wong",
      role: "Runtime Rebels",
      img: "./public/img/insert.jpg",
      bio: "Junior studying Informatics at the University of Washington.",
      links: { linkedin: "https://www.linkedin.com/in/cassidyawong/", github: "#" },
    },
  ];

  const Avatar = ({ name, src }) => {
    const [failed, setFailed] = React.useState(false);
    if (!src || failed) {
      return (
        <div className="avatar-fallback" aria-hidden="true">
          {name?.[0] || "U"}
        </div>
      );
    }
    return (
      <img
        src={src}
        alt={`${name} headshot`}
        onError={() => setFailed(true)}
      />
    );
  };

  return (
    <main className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <h1>About Azure Haven</h1>
        <p>
        We’re a small team developing tools to help retired adults find community, purpose, and peace of mind without added complexity as part of our INFO 442 software development course. Our goal is to support the mental health of retired adults and help them build meaningful connections.        </p>
      </section>

      {/* Team */}
      <section className="team">
        <h2>Our Team</h2>

        <ul className="team-grid">
          {team.map((m) => (
            <li key={m.name} className="team-card">
              <div className="avatar-wrap">
                <Avatar name={m.name} src={m.img} />
              </div>

              <div className="team-content">
                <h3>{m.name}</h3>
                <p className="role">{m.role}</p>
                <p className="bio">{m.bio}</p>

                <div className="links">
                  {m.links?.linkedin && (
                    <a
                      href={m.links.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${m.name} on LinkedIn`}
                    >
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
