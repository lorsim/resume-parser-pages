function ContactCard({ email, phone, links }) {
  if (!email && !phone && (!links || links.length === 0)) return null

  return (
    <div className="info-card">
      <h2>Contact</h2>
      <div className="info-section">
        {email && (
          <p>
            <strong>Email:</strong> {email}
          </p>
        )}
        {phone && (
          <p>
            <strong>Phone:</strong> {phone}
          </p>
        )}
      </div>

      {links?.length > 0 && (
        <div className="info-section">
          <h3>Links</h3>
          <ul className="links-list">
            {links.map((link, i) => (
              <li key={i}>
                <a href={link.url} target="_blank" rel="noreferrer">
                  {link.label || link.url}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default ContactCard
