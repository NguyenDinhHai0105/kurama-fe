import { useRef } from 'react'

export default function Feature({ icon, title, children, backgroundImg, onClick }) {
  const clickable = typeof onClick === 'function'
  const cardRef = useRef(null)

  const commonRootProps = {}
  if (clickable) {
    commonRootProps.onClick = onClick
    commonRootProps.role = 'link'
    commonRootProps.tabIndex = 0
    commonRootProps.onKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onClick()
      }
    }
  }

  // Clean up title: remove underscores and dots, collapse extra spaces
  const beautifyTitle = (val) => String(val ?? '')
    .replace(/[_.]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
  const displayTitle = beautifyTitle(title)

  const handleMouseMove = (e) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    el.style.setProperty('--mx', `${x}px`)
    el.style.setProperty('--my', `${y}px`)
  }

  const handleMouseLeave = () => {
    const el = cardRef.current
    if (!el) return
    el.style.removeProperty('--mx')
    el.style.removeProperty('--my')
  }

  // If we have a background image (from API), render with gradient border effect
  if (backgroundImg) {
    return (
      <article
        ref={cardRef}
        className={`feature feature--story feature--bg-card${clickable ? ' feature--clickable' : ''}`}
        style={{ backgroundImage: `url(${backgroundImg})` }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...commonRootProps}
      >
        <div className="feature-overlay" aria-hidden="true" />
        <div className="feature-body">
          <h3 className="feature-title feature-title--hero">{displayTitle}</h3>
        </div>
      </article>
    )
  }

  // Fallback to the original compact feature layout (static features)
  return (
    <div className={`feature${clickable ? ' feature--clickable' : ''}`} {...commonRootProps}>
      <div className="feature-icon" aria-hidden="true">{icon}</div>
      <div>
        <h3 className="feature-title">{displayTitle}</h3>
        <p className="feature-desc">{children}</p>
      </div>
    </div>
  )
}
