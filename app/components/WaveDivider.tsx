/** Decorative section break — purely visual (home / marketing surfaces). */
export function WaveDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div
      aria-hidden
      className="wc-wave-divider"
      style={{
        lineHeight: 0,
        marginTop: flip ? 0 : 4,
        marginBottom: flip ? 4 : 0,
        transform: flip ? 'rotate(180deg)' : undefined,
      }}
    >
      <svg
        viewBox="0 0 1440 56"
        preserveAspectRatio="none"
        style={{ display: 'block', width: '100%', height: 'clamp(24px, 4.5vw, 44px)' }}
      >
        <path
          fill="rgba(6,182,212,0.06)"
          d="M0,30 C220,6 460,50 720,30 C980,10 1220,46 1440,26 L1440,56 L0,56 Z"
        />
        <path
          fill="none"
          stroke="rgba(34,211,238,0.14)"
          strokeWidth="1"
          d="M0,26 C220,2 460,46 720,26 C980,6 1220,42 1440,22"
        />
      </svg>
    </div>
  );
}
