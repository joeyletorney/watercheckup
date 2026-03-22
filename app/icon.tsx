import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        background: 'linear-gradient(135deg, #0891b2, #06b6d4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 12px #06b6d466',
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 40 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 2C20 2 4 18 4 30C4 39.9 11.2 48 20 48C28.8 48 36 39.9 36 30C36 18 20 2 20 2Z"
          fill="white"
          opacity="0.95"
        />
        <polyline
          points="12,30 18,38 29,22"
          stroke="#0891b2"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>,
    { ...size }
  );
}
