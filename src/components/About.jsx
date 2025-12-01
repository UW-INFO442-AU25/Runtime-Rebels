import React from "react";
import "../index.css";

export default function About() {
  const team = [
    {
      name: "Celine Chen",
      role: "Runtime Rebels",
      img: "./public/img/insert.jpg",
      bio: "Senior studying Informatics at the University of Washington.",
      links: { linkedin: "https://www.linkedin.com/in/celinechenn/" },
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
        <div
          className="avatar-fallback"
          role="img"
          aria-label={name ? `${name} headshot placeholder` : "User headshot placeholder"}
        >
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
      <section className="about-hero" aria-labelledby="about-hero-title">
        <h1 id="about-hero-title">About Azure Haven</h1>
        <p>
          We’re a small team developing tools to help retired adults find
          community, purpose, and peace of mind without added complexity as
          part of our INFO 442 software development course. Our goal is to
          support the mental health of retired adults and help them build
          meaningful connections.
        </p>
      </section>

      {/* Team */}
      <section className="team" aria-labelledby="team-title">
        <h2 id="team-title">Our Team</h2>
        <ul className="team-grid">
          {team.map((member) => (
            <li key={member.name} className="team-card">
              <div className="avatar-wrap">
                <Avatar name={member.name} src={member.img} />
              </div>

              <div className="team-content">
                <h3>{member.name}</h3>
                <p className="role">{member.role}</p>
                <p className="bio">{member.bio}</p>

                <div className="links">
                  {member.links?.linkedin && (
                    <a
                      href={member.links.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Visit ${member.name}'s LinkedIn profile`}
                    >
                      LinkedIn
                    </a>
                  )}
                  {member.links?.github && member.links.github !== "#" && (
                    <a
                      href={member.links.github}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Visit ${member.name}'s GitHub profile`}
                    >
                      GitHub
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
