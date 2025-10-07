export default function Brand({ simple = false }) {
  return (
    <>
      <svg className="brand-mark" viewBox="0 0 24 24" aria-hidden="true">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        <path fill={simple ? 'currentColor' : 'url(#g)'} d="M12 2l3.09 6.26L22 9.27l-5 4.88L18.18 22 12 18.76 5.82 22 7 14.15l-5-4.88 6.91-1.01z"/>
      </svg>
      <span className="brand-name">Kurama</span>
    </>
  )
}
