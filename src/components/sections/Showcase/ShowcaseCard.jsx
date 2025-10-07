export default function ShowcaseCard({ title, children, ctaLabel = 'Learn more', href = '#' }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{children}</p>
      <a className="btn btn--small" href={href}>{ctaLabel}</a>
    </div>
  )
}
