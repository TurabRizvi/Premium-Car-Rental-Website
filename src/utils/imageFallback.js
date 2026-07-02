// Inline SVG placeholder shown when a local car image hasn't been added yet,
// so the UI degrades gracefully instead of showing a broken image icon.
export const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
      <rect width="400" height="300" fill="#181B22"/>
      <g fill="none" stroke="#C9A15A" stroke-width="2" opacity="0.6">
        <rect x="60" y="150" width="280" height="60" rx="12"/>
        <circle cx="120" cy="220" r="18"/>
        <circle cx="280" cy="220" r="18"/>
        <path d="M85 150 L115 105 H285 L315 150"/>
      </g>
      <text x="200" y="260" fill="#8B8F98" font-family="sans-serif" font-size="13" text-anchor="middle">
        Image not added yet
      </text>
    </svg>
  `)

export function handleImageError(e) {
  if (e.target.src !== FALLBACK_IMAGE) {
    e.target.src = FALLBACK_IMAGE
  }
}
