import Link from 'next/link';

export function PitcherCartridgeVideo() {
  return <section className="wc-pitcher-video" aria-labelledby="pitcher-video-heading">
    <figure>
      <video
        controls
        playsInline
        preload="none"
        poster="/media/pitcher-cartridge-guide.jpg"
        width={720}
        height={1280}
        aria-labelledby="pitcher-video-heading"
        aria-describedby="pitcher-video-caption"
      >
        <source src="/media/pitcher-cartridge-guide.mp4" type="video/mp4" />
        <track kind="captions" src="/media/pitcher-cartridge-guide.en.vtt" srcLang="en" label="English" />
        <a href="/media/pitcher-cartridge-guide.mp4">Watch the pitcher cartridge guide</a>
      </video>
      <figcaption id="pitcher-video-caption">21 seconds · Captions included</figcaption>
    </figure>
    <div>
      <p className="wc-pitcher-video-eyebrow">JOE’S QUICK BUYING TIP</p>
      <h2 id="pitcher-video-heading">Choosing a water filter pitcher? Check the cartridge.</h2>
      <p>Check the exact cartridge’s certified reduction claims, replacement schedule and ongoing cost before choosing a pitcher.</p>
      <Link href="/quiz" className="wc-reading-cta__btn">Take the free 3-question quiz →</Link>
      <details>
        <summary>Read the video transcript</summary>
        <p>Before you buy a water filter pitcher, check more than the pitcher. The cartridge inside matters most. Different cartridges reduce different contaminants, and replacement costs can add up. Check what the specific filter is certified to reduce, and how often you’ll need to replace it. Want help choosing? Take my free, three-question quiz at WaterCheckup.com.</p>
      </details>
    </div>
  </section>;
}
