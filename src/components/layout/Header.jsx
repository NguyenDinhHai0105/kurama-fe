import Brand from '../ui/Brand.jsx'
import { navLinks } from '../../data/navLinks.js'

export default function Header() {
  return (
    <header className="header">
      <a className="brand" href="#home" aria-label="Home">
        <Brand />
      </a>
      <nav className="nav">
        {navLinks.map(({ href, label, variant }) => (
          <a key={href} className={variant ? `btn ${variant}` : ''} href={href}>
            {label}
          </a>
        ))}
      </nav>
    </header>
  )
}
