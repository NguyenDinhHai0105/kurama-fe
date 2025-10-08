export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <p className="eyebrow">Modern React tooling • 2025-ready</p>
        <h1>Build delightful experiences at startup speed</h1>
        <p className="subhead">
          Ship accessible, responsive apps faster with a clean React + Vite setup,
          smart defaults, and zero heavy dependencies. Designed for real teams
          who iterate quickly.
        </p>
        <div className="cta-group">
          <a className="btn btn-primary" href="#get-started">Start free</a>
          <a className="btn btn-outline-secondary" href="#docs">Read docs</a>
        </div>
        <div className="meta">
          <span>⚡ Fast dev server</span>
          <span>🔒 Type-safe ready</span>
          <span>🌓 Dark-mode aware</span>
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
