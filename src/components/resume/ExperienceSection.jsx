const cleanBullets = (desc) => {
  if (Array.isArray(desc)) return desc
  if (!desc) return []

  return desc
    .split("\n")
    .map((line) => line.replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean)
}

function ExperienceSection({ experience }) {
  if (!experience?.length) return null

  return (
    <section className="data-card">
      <h2>Work Experience</h2>
      <div className="card-content">
        {experience.map((exp, i) => (
          <div key={i} className="experience-item">
            <div className="experience-header">
              <div className="experience-title">
                <h3>{exp.title}</h3>
                <p>{exp.company}</p>
                {exp.location && <p className="location">{exp.location}</p>}
              </div>
              <div className="experience-date">
                {exp.startDate} – {exp.endDate || "Present"}
              </div>
            </div>

            {exp.description && (
              <ul className="experience-description">
                {cleanBullets(exp.description).map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            )}

            {exp.technologies && exp.technologies.length > 0 && (
              <div className="technologies">
                {exp.technologies.map((tech, j) => (
                  <span key={j} className="skill-tag">
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

export default ExperienceSection
