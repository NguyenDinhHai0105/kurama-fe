export default function ShowcaseCard({ title, children, ctaLabel = 'Learn more', href = '#' }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{children}</p>
      <a className="btn btn-sm btn-outline-secondary" href={href}>{ctaLabel}</a>
    </div>
  )
}
