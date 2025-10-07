import Header from '../components/layout/Header.jsx'
import Footer from '../components/layout/Footer.jsx'
import Hero from '../components/sections/Hero.jsx'
import Features from '../components/sections/Features/Features.jsx'
import Showcase from '../components/sections/Showcase/Showcase.jsx'
import CTA from '../components/sections/CTA.jsx'

function Landing() {
  return (
    <div className="landing">
      <Header />
      <main>
        <Hero />
        <Features />
        <Showcase />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}

export default Landing
