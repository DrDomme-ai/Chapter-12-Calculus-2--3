import MathHeroVisual from './MathHeroVisual'

export default function HeroSection({ onScrollToCourses, onOpenReadiness }) {
  return (
    <section className="home-hero">
      <div className="home-hero-copy">
        <h1 className="home-product-title">Interactive Calculus</h1>
        <p className="home-hero-tagline">Explore. Visualize. Practice. Master.</p>
        <h2 className="home-hero-headline">
          See the mathematics.<br />
          Understand the mathematics.<br />
          Master the mathematics.
        </h2>
        <p className="home-hero-description">
          An interactive learning environment for Calculus II and Calculus III. Review the mathematical foundations, explore new concepts visually, work through examples, practice independently, and build mastery.
        </p>
        <div className="home-hero-actions">
          <button className="primary-button" type="button" onClick={onScrollToCourses}>EXPLORE COURSES</button>
          <button className="secondary-button" type="button" onClick={onOpenReadiness}>START FUNDAMENTAL REVIEW</button>
        </div>
      </div>
      <MathHeroVisual />
    </section>
  )
}
