export default function Feature({ icon, title, children, backgroundImg, meta, onClick }) {
  const clickable = typeof onClick === 'function'
  const commonRootProps = clickable
    ? {
        onClick,
        role: 'link',
        tabIndex: 0,
        onKeyDown: (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onClick()
          }
        },
      }
    : {}

  // If we have a background image (from API), render a richer “story” card
  if (backgroundImg) {
    return (
      <article className={`feature feature--story${clickable ? ' feature--clickable' : ''}`} {...commonRootProps}>
        <div className="feature-body">
          {meta && (
            <p className="feature-meta">
              <span className="feature-date">{meta.dateText}</span>
              <span aria-hidden="true"> · </span>
              {meta.sourceHref ? (
                <a
                  className="feature-source"
                  href={meta.sourceHref}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  {meta.sourceText}
                </a>
              ) : (
                <span className="feature-source">{meta.sourceText}</span>
              )}
            </p>
          )}
          <h3 className="feature-title">{title}</h3>
          {children && <p className="feature-desc">{children}</p>}
        </div>
        <img className="feature-thumb" src={backgroundImg} alt="" loading="lazy" />
      </article>
    )
  }

  // Fallback to the original compact feature layout (static features)
  return (
    <div className={`feature${clickable ? ' feature--clickable' : ''}`} {...commonRootProps}>
      <div className="feature-icon" aria-hidden="true">{icon}</div>
      <div>
        <h3 className="feature-title">{title}</h3>
        <p className="feature-desc">{children}</p>
      </div>
    </div>
  )
}
