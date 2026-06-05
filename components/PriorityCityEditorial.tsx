import { PRIORITY_CITY_INTROS } from '@/lib/priority-city-intros';

/** Renders 2–3 editorial paragraphs for priority city water report pages */
export function PriorityCityEditorial({
  slug,
  style,
}: {
  slug: string;
  style?: React.CSSProperties;
}) {
  const paragraphs = PRIORITY_CITY_INTROS[slug];
  if (!paragraphs?.length) return null;

  return (
    <div style={style}>
      {paragraphs.map((text, i) => (
        <p
          key={i}
          style={{
            fontSize: 15,
            color: '#cbd5e1',
            lineHeight: 1.75,
            margin: i < paragraphs.length - 1 ? '0 0 18px' : '0 0 28px',
          }}
        >
          {text}
        </p>
      ))}
    </div>
  );
}
