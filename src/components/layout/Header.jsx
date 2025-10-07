import Brand from '../ui/Brand.jsx'
import { navLinks } from '../../data/navLinks.js'
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="header">
      <Link className="brand" to="/" aria-label="Home">
        <Brand />
      </Link>
      <nav className="nav">
        {navLinks.map(({ href, label, variant }) => {
          const className = variant ? `btn ${variant}` : ''
          if (href?.startsWith('#')) {
            return (
              <Link key={href} className={className} to={{ pathname: '/', hash: href }}>
                {label}
              </Link>
            )
          }
          return (
            <a key={href} className={className} href={href}>
              {label}
            </a>
          )
        })}
      </nav>
    </header>
  )
}
