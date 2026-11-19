export function AffiliateDisclosure({
  style,
}: {
  style?: React.CSSProperties;
}) {
  return (
    <p
      className="wc-affiliate-disclosure"
      style={{
        fontSize: 13,
        lineHeight: 1.55,
        color: '#94a3b8',
        margin: '0 0 12px',
        ...style,
      }}
    >
      Affiliate disclosure: some filter links are affiliate links. If you buy through them,
      WaterCheckup may earn a commission at no extra cost to you. As an Amazon Associate I
      earn from qualifying purchases. Compare the exact model’s published reduction claims
      before you buy.
    </p>
  );
}
