function EducationSection({ education }) {
  // Always render the section, even if education array is empty
  return (
    <section className="data-card">
      <h2>Education</h2>
      <div className="card-content">
        {!education || education.length === 0 ? (
          <p className="no-data-message">No education information available</p>
        ) : (
          education.map((edu, i) => (
            <div key={i} className="education-item">
              <div className="education-header">
                <div className="education-title">
                  <h3>{edu.degree || "Degree not specified"}</h3>
                  <p>{edu.institution || edu.school || "Institution not specified"}</p>
                  {edu.location && <p className="location">{edu.location}</p>}
                  {edu.gpa && <p className="gpa">GPA: {edu.gpa}</p>}
                </div>
                <div className="education-date">
                  {edu.startDate || (edu.dates && edu.dates.start)
                    ? `${edu.startDate || edu.dates.start} – ${edu.endDate || edu.dates.end || "Present"}`
                    : "Dates not specified"}
                </div>
              </div>

              {edu.courses && edu.courses.length > 0 && (
                <div className="courses">
                  <h4>Relevant Courses:</h4>
                  <p>{edu.courses.join(", ")}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  )
}

export default EducationSection
