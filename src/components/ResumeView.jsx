import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { API_URL } from "../config"
import ContactCard from "./resume/ContactCard"
import ExperienceSection from "./resume/ExperienceSection"
import EducationSection from "./resume/EducationSection"
import ConfidenceScores from "./resume/ConfidenceScores"
import SkillsSection from "./resume/SkillsSection"

function ResumeView() {
  const { id } = useParams()
  const [resume, setResume] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("structured")

  useEffect(() => {
    const fetchResume = async () => {
      try {
        setIsLoading(true)
        const res = await fetch(`${API_URL}/api/resumes/${id}`)
        if (!res.ok) throw new Error("Failed to fetch resume")
        const data = await res.json()
        console.log("Fetched resume data:", data) // Debug log
        setResume(data)
      } catch (err) {
        console.error("Error fetching resume:", err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) fetchResume()
  }, [id])

  if (isLoading) return <div className="loading">Loading resume...</div>
  if (error || !resume) return <div className="error-message">{error || "Resume not found"}</div>

  return (
    <div className="resume-view">
      <div className="back-link">
        <Link to="/">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Dashboard
        </Link>
      </div>

      <div className="resume-header">
        <div>
          <h1>{resume.candidateName}</h1>
          <p className="file-name">
            {resume.fileName}
            {resume.fileName && <span className="file-type">{resume.fileName.split(".").pop()?.toUpperCase()}</span>}
          </p>
        </div>
        <div className="actions">
          <button className="action-button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download JSON
          </button>
        </div>
      </div>

      <div className="resume-content">
        <aside className="sidebar">
          <ContactCard email={resume.email} phone={resume.phone} links={resume.links} />
          <SkillsSection skills={resume.skills} />
          <ConfidenceScores overall={resume.confidenceScore} fields={resume.fieldConfidence} />
        </aside>

        <main className="main-content">
          {/* Fixed tab buttons */}
          <div className="tabs-container">
            <div className="tabs-header">
              <button
                className={`tab-button ${activeTab === "structured" ? "active" : ""}`}
                onClick={() => setActiveTab("structured")}
              >
                Structured Data
              </button>
              <button
                className={`tab-button ${activeTab === "original" ? "active" : ""}`}
                onClick={() => setActiveTab("original")}
              >
                Original Resume
              </button>
            </div>

            <div className="tabs-content">
              {activeTab === "structured" && (
                <div className="structured-data">
                  {resume.professionalSummary && (
                    <section className="data-card">
                      <h2>Professional Summary</h2>
                      <div className="card-content">
                        <p>{resume.professionalSummary}</p>
                      </div>
                    </section>
                  )}

                  <ExperienceSection experience={resume.experience} />
                  
                  {/* Always render the education section */}
                  <EducationSection education={resume.education || []} />

                  {resume.projects && resume.projects.length > 0 && (
                    <section className="data-card">
                      <h2>Projects</h2>
                      <div className="card-content">
                        {resume.projects.map((project, i) => (
                          <div key={i} className="project-item">
                            <h3>{project.name}</h3>
                            {project.description && <p>{project.description}</p>}
                            {project.technologies && project.technologies.length > 0 && (
                              <div className="technologies">
                                {project.technologies.map((tech, j) => (
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
                  )}

                  {resume.certifications && resume.certifications.length > 0 && (
                    <section className="data-card">
                      <h2>Certifications</h2>
                      <div className="card-content">
                        {resume.certifications.map((cert, i) => (
                          <div key={i} className="certification-item">
                            <h3>{cert.name}</h3>
                            <p>
                              {cert.issuer} {cert.date && `(${cert.date})`}
                            </p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              )}

              {activeTab === "original" && (
                <div className="resume-viewer">
                  <iframe
                    src={`${API_URL}${resume.fileUrl}#toolbar=0`}
                    title="Original Resume"
                    className="resume-iframe"
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default ResumeView
