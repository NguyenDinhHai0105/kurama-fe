export default function Brand({ simple = false }) {
  return (
    <>
      <svg className="brand-mark" viewBox="0 0 64 64" aria-hidden="true">
        {/* Fox head icon */}
        <defs>
          <linearGradient id="foxFace" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#fb923c" />
          </linearGradient>
        </defs>
        {/* Ears */}
        <path d="M8 10 L24 20 L20 4 Z" fill="#f97316" />
        <path d="M56 10 L40 20 L44 4 Z" fill="#f97316" />
        {/* Face base */}
        <path d="M12 18 C18 12, 46 12, 52 18 C58 24, 60 34, 52 44 C46 52, 18 52, 12 44 C4 34, 6 24, 12 18 Z" fill={simple ? '#f97316' : 'url(#foxFace)'} />
        {/* Cheeks / snout */}
        <path d="M20 40 C24 34, 40 34, 44 40 C40 46, 24 46, 20 40 Z" fill="#fff7ed" />
        {/* Eyes */}
        <circle cx="26" cy="32" r="2" fill="#111827" />
        <circle cx="38" cy="32" r="2" fill="#111827" />
        {/* Nose */}
        <circle cx="32" cy="40" r="2.2" fill="#0b0b0f" />
      </svg>
      <span className="brand-name">Kurama</span>
    </>
  )
}
