import ShowcaseCard from './ShowcaseCard.jsx'

export default function Showcase() {
  return (
    <section className="showcase" id="showcase">
      <div className="showcase-inner">
        <h2>Reusable building blocks</h2>
        <p>Cards, buttons, and layouts you can adapt in minutes.</p>
        <div className="cards">
          <ShowcaseCard title="Card Title">Quick summary about a feature or benefit.</ShowcaseCard>
          <ShowcaseCard title="Another Card" ctaLabel="Explore">Consistent spacing, clean typography, and themes.</ShowcaseCard>
          <ShowcaseCard title="One More" ctaLabel="Get started">Drop in your content and ship quickly.</ShowcaseCard>
        </div>
      </div>
    </section>
  )
}
