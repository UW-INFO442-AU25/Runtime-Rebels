import React, { useState } from "react";
import "../index.css";
const heroImg = "/img/resourcesbanner.png";

// ======================
// RESOURCE DATA ARRAY
// ======================
const resourcesData = [

  // External links
  {
    title: "SAMHSA: Resources for Older Adults",
    description: "Support for older adults with mental and substance use disorders.",
    link: "https://www.samhsa.gov/communities/older-adults",
    category: "Mental Health",
    type: "Guide",
    topic: "Stress",
  },
  {
    title: "NIMH: Older Adults & Mental Health",
    description: "Mental health information specifically for older adults.",
    link: "https://www.nimh.nih.gov/health/topics/older-adults-and-mental-health",
    category: "Mental Health",
    type: "Article",
    topic: "Wellness",
  },
  {
    title: "NIMH: Caring for Your Mental Health",
    description: "Simple steps and practices to maintain mental well-being.",
    link: "https://www.nimh.nih.gov/health/topics/caring-for-your-mental-health",
    category: "Mental Health",
    type: "Guide",
    topic: "Wellness",
  },
  {
    title: "WHO: Mental Health of Older Adults",
    description: "Global statistics and key risk factors affecting mental health later in life.",
    link: "https://www.who.int/news-room/fact-sheets/detail/mental-health-of-older-adults",
    category: "Mental Health",
    type: "Article",
    topic: "Stress",
  },
  {
    title: "CDC Mental Health Resources",
    description: "Evidence-based guidance on caring for mental health.",
    link: "https://www.cdc.gov/mental-health/caring/index.html",
    category: "Mental Health",
    type: "Guide",
    topic: "Wellness",
  },
  {
    title: "National Alliance on Mental Illness (NAMI)",
    description: "Support, education, and advocacy for mental health.",
    link: "https://www.nami.org/",
    category: "Community",
    type: "Guide",
    topic: "Purpose",
  },
  {
    title: "Best Online Therapy Services",
    description: "Independent review of top online therapy platforms.",
    link: "https://www.forbes.com/health/l/best-online-therapy/",
    category: "Mental Health",
    type: "Article",
    topic: "Stress",
  },
  {
    title: "Psychology Today: Find a Therapist",
    description: "Search tool to find therapists by location and specialty.",
    link: "https://www.psychologytoday.com/us",
    category: "Community",
    type: "Guide",
    topic: "Purpose",
  },
  {
    title: "Harvard: Importance of Social Connection",
    description: "How social ties support healthier, longer lives.",
    link: "https://hsph.harvard.edu/news/the-importance-of-connections-ways-to-live-a-longer-healthier-life/",
    category: "Lifestyle",
    type: "Article",
    topic: "Purpose",
  },
  {
    title: "Mental Health America: Connect With Others",
    description: "Steps to build meaningful connection and support networks.",
    link: "https://mhanational.org/resources/connect-with-others/",
    category: "Community",
    type: "Guide",
    topic: "Purpose",
  },
];

export default function Resources() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState("");
  const [type, setType] = useState("");

  // FILTERED RESULTS
  const filteredResources = resourcesData.filter((r) => {
    const matchCategory = category === "All" || r.category === category;
    const matchTopic = topic === "" || r.topic === topic;
    const matchType = type === "" || r.type === type;

    const matchSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      (r.description && r.description.toLowerCase().includes(search.toLowerCase()));

    return matchCategory && matchTopic && matchType && matchSearch;
  });

  const categories = ["All", "General", "Mental Health", "Community", "Lifestyle"];

  return (
    <div className="resources-page">

      {/* HERO */}
      <section
        className="resources-hero"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="hero-overlay">
          <h1>While retiring can be exciting, it can also be stressful.
          These resources help you cope with retirement depression and find new purpose in life.</h1>
          <p>
            22.8% of U.S. adults experienced mental illness in 2021.
          </p>
        </div>
      </section>

      {/* FILTERS */}
      <section className="filter-section">
        <div className="filter-card">

          {/* CATEGORY PILLS */}
          <div className="filter-buttons">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`pill ${category === cat ? "active" : ""}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* DROPDOWNS + SEARCH */}
          <div className="filter-controls">
            <div className="field">
              <input
                type="text"
                placeholder="Search keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* RESOURCE GRID */}
          <div className="resource-grid resources-grid--wide">

            {filteredResources.map((res, index) => (
              <article className="resource-card" key={index}>
                <div className="thumb" />

                {res.link ? (
                  <h3>
                    <a href={res.link} target="_blank" rel="noopener noreferrer">
                      {res.title}
                    </a>
                  </h3>
                ) : (
                  <h3>{res.title}</h3>
                )}

                {res.description && <p>{res.description}</p>}
              </article>
            ))}

            {filteredResources.length === 0 && (
              <p className="no-results">No resources match your search.</p>
            )}

          </div>
        </div>
      </section>
    </div>
  );
}
