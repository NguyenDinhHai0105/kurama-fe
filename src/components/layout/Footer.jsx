import Brand from '../ui/Brand.jsx'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <a className="brand small" href="#home">
          <Brand simple />
        </a>
        <nav>
          <a href="#features">Features</a>
          <a href="#showcase">Showcase</a>
          <a href="#pricing">Pricing</a>
          <a href="#contact">Contact</a>
        </nav>
        <p className="copyright">© {new Date().getFullYear()} Kurama. All rights reserved.</p>
      </div>
    </footer>
  )
}
