import Brand from '../ui/Brand.jsx'
import { navLinks } from '../../data/navLinks.js'
import { Link } from 'react-router-dom'

function mapVariantToBootstrap(variant) {
  if (!variant) return ''
  switch (variant) {
    case 'btn':
      return 'btn btn-primary'
    case 'btn--ghost':
      return 'btn btn-outline-secondary'
    case 'btn--small':
      return 'btn btn-sm btn-outline-secondary'
    case 'btn--large':
      return 'btn btn-lg btn-primary'
    default:
      return variant.includes('btn') ? 'btn btn-outline-secondary' : ''
  }
}

export default function Header() {
  return (
    <header className="header">
      <Link className="brand" to="/" aria-label="Home">
        <Brand />
      </Link>
      <nav className="nav">
        {navLinks.map(({ href, label, variant }) => {
          const className = mapVariantToBootstrap(variant)
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
