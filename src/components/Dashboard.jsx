"use client"

import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { API_URL } from "../config"

function Dashboard() {
  const [activeTab, setActiveTab] = useState("upload")
  const [file, setFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const [recentUploads, setRecentUploads] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  // Fetch recent uploads when the component mounts or when activeTab changes to 'recent'
  useEffect(() => {
    if (activeTab === "recent") {
      fetchRecentUploads()
    }
  }, [activeTab])

  const fetchRecentUploads = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_URL}/api/resumes`)

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`)
      }

      const data = await response.json()
      setRecentUploads(data)
    } catch (error) {
      setError(`Failed to load recent uploads: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0])
    }
  }

  const validateAndSetFile = (file) => {
    setError(null)

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "text/plain",
    ]

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      const ext = file.name.split(".").pop()?.toLowerCase()
      if (!ext || !["pdf", "docx", "doc", "txt"].includes(ext)) {
        setError("Please upload a PDF, DOCX, DOC, or TXT file")
        return
      }
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB")
      return
    }

    setFile(file)
  }

  const handleSubmit = async () => {
    if (!file) return

    try {
      setIsUploading(true)
      setError(null)

      // Create form data
      const formData = new FormData()
      formData.append("resume", file)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 5, 90))
      }, 300)

      // Upload to backend
      const response = await fetch(`${API_URL}/api/parse`, {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`)
      }

      const data = await response.json()
      setProgress(100)

      // Navigate to resume view after a short delay
      setTimeout(() => {
        navigate(`/resume/${data.id}`)
      }, 1000)
    } catch (error) {
      setError(`Upload failed: ${error.message}`)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="dashboard">
      <div className="hero">
        <h1>Intelligent Resume Parser</h1>
        <p>Upload a resume in PDF, DOCX, or TXT format and our parser will extract structured data.</p>
      </div>

      <div className="tabs">
        <div className="tab-list">
          <button className={`tab ${activeTab === "upload" ? "active" : ""}`} onClick={() => setActiveTab("upload")}>
            Upload Resume
          </button>
          <button className={`tab ${activeTab === "recent" ? "active" : ""}`} onClick={() => setActiveTab("recent")}>
            Recent Uploads
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "upload" && (
            <div className="upload-section">
              <div
                className={`drop-zone ${isDragging ? "active" : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="drop-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <div className="drop-text">
                  <h3>Drag & drop your resume</h3>
                  <p>Supports PDF, DOCX, DOC, and TXT files up to 10MB</p>
                </div>
                <div className="file-input">
                  <label htmlFor="resume-upload">
                    <span>Or select a file from your computer</span>
                    <input
                      id="resume-upload"
                      type="file"
                      className="hidden"
                      accept=".pdf,.docx,.doc,.txt"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </div>

              {file && (
                <div className="selected-file">
                  <div className="file-info">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">({Math.round(file.size / 1024)} KB)</span>
                  </div>
                  <button className="parse-button" onClick={handleSubmit} disabled={isUploading}>
                    {isUploading ? "Processing..." : "Parse Resume"}
                  </button>
                </div>
              )}

              {isUploading && (
                <div className="upload-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                  </div>
                  <div className="progress-text">
                    <span>Uploading and parsing resume...</span>
                    <span>{progress}%</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="error-message">
                  <span>{error}</span>
                </div>
              )}
            </div>
          )}

          {activeTab === "recent" && (
            <div className="recent-section">
              {isLoading ? (
                <div className="loading">Loading recent uploads...</div>
              ) : error ? (
                <div className="error-message">{error}</div>
              ) : recentUploads.length === 0 ? (
                <div className="no-uploads">No recent uploads found</div>
              ) : (
                <div className="uploads-list">
                  {recentUploads.map((upload) => (
                    <div key={upload.id} className="upload-item">
                      <div className="upload-info">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                          <polyline points="10 9 9 9 8 9" />
                        </svg>
                        <div>
                          <p className="file-name">{upload.fileName}</p>
                          <p className="upload-date">Uploaded {new Date(upload.uploadedAt).toLocaleString()}</p>
                        </div>
                      </div>
                      <Link to={`/resume/${upload.id}`} className="view-button">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                        View
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
