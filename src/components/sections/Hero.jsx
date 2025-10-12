export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <p className="eyebrow">Dev Blog • Engineering notes & updates</p>
        <h1>Kurama Dev Blog</h1>
        <p className="subhead">
          Practical write‑ups from the team: release notes, deep dives, and tips
          for building fast, reliable frontends. No fluff—just lessons learned.
        </p>
        <div className="cta-group">
          <a className="btn btn-primary" href="#features">Read latest posts</a>
          <a className="btn btn-outline-secondary" href="#get-started">About this blog</a>
        </div>
        <div className="meta">
          <span>📰 RSS available</span>
          <span>🧩 Open source</span>
          <span>🔍 No trackers</span>
        </div>
      </div>
      <div className="hero-media" aria-hidden="true">
        <div className="glass">
          <div className="code">{`import { createRoot } from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')).render(<App />)

function FeatureCard({ title, children }) {
  return (
    <article className='card'>
      <h3>{title}</h3>
      <p>{children}</p>
    </article>
  )
}`}</div>
        </div>
      </div>
    </section>
  )
}
