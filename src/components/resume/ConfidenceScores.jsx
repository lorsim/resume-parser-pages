function ConfidenceScores({ overall, fields }) {
  if (!overall) return null

  return (
    <div className="info-card">
      <h2>Extraction Quality</h2>
      <div className="confidence-section">
        <div className="confidence-header">
          <span>Overall</span>
          <span>{overall}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${overall}%` }} />
        </div>
      </div>

      {fields && Object.entries(fields).length > 0 && (
        <div className="field-confidence">
          {Object.entries(fields).map(([key, value]) => (
            <div key={key} className="field-item">
              <div className="field-header">
                <span>{key}</span>
                <span>{value}%</span>
              </div>
              <div className="progress-bar small">
                <div
                  className={`progress-fill ${value > 80 ? "high" : value > 50 ? "medium" : "low"}`}
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ConfidenceScores
