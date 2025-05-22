function SkillsSection({ skills }) {
  if (!skills?.length) return null

  return (
    <div className="info-card">
      <h2>Skills</h2>
      <div className="skills-list">
        {skills.map((skill, i) => (
          <span key={i} className="skill-tag">
            {skill}
          </span>
        ))}
      </div>
    </div>
  )
}

export default SkillsSection
