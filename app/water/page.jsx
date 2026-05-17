// Place this file at: app/water/page.jsx in your Next.js project

import Link from 'next/link';
import { GuideHero } from '@/components/GuideHero';
import { WATER_INDEX_HERO, WATER_INDEX_HERO_ALT } from '@/lib/unsplash-images';
import { SiteHeader } from '../components/SiteHeader';

export const metadata = {
  title: 'Water Quality Reports by City',
  description:
    'Free EPA-based water quality reports for 400,000+ local water utilities tracked. Check PFAS levels, lead violations, contaminant data, and filter recommendations for your area.',
};

const cities = {
  Northeast: [
    { name: 'Baltimore, MD', slug: 'baltimore' },
    { name: 'Boston, MA', slug: 'boston' },
    { name: 'Buffalo, NY', slug: 'buffalo' },
    { name: 'Hartford, CT', slug: 'hartford' },
    { name: 'Jersey City, NJ', slug: 'jersey-city' },
    { name: 'Newark, NJ', slug: 'newark' },
    { name: 'New York, NY', slug: 'new-york' },
    { name: 'Philadelphia, PA', slug: 'philadelphia' },
    { name: 'Pittsburgh, PA', slug: 'pittsburgh' },
    { name: 'Providence, RI', slug: 'providence' },
    { name: 'Rochester, NY', slug: 'rochester' },
    { name: 'Stamford, CT', slug: 'stamford' },
    { name: 'Worcester, MA', slug: 'worcester' },
  ],
  Southeast: [
    { name: 'Atlanta, GA', slug: 'atlanta' },
    { name: 'Baton Rouge, LA', slug: 'baton-rouge' },
    { name: 'Birmingham, AL', slug: 'birmingham' },
    { name: 'Cape Coral, FL', slug: 'cape-coral' },
    { name: 'Charlotte, NC', slug: 'charlotte' },
    { name: 'Chattanooga, TN', slug: 'chattanooga' },
    { name: 'Columbia, SC', slug: 'columbia-sc' },
    { name: 'Cary, NC', slug: 'cary' },
    { name: 'Durham, NC', slug: 'durham' },
    { name: 'Fayetteville, NC', slug: 'fayetteville' },
    { name: 'Fort Lauderdale, FL', slug: 'fort-lauderdale' },
    { name: 'Greensboro, NC', slug: 'greensboro' },
    { name: 'Hialeah, FL', slug: 'hialeah' },
    { name: 'Huntsville, AL', slug: 'huntsville' },
    { name: 'Jackson, MS', slug: 'jackson' },
    { name: 'Jacksonville, FL', slug: 'jacksonville' },
    { name: 'Knoxville, TN', slug: 'knoxville' },
    { name: 'Louisville, KY', slug: 'louisville' },
    { name: 'Lexington, KY', slug: 'lexington' },
    { name: 'Memphis, TN', slug: 'memphis' },
    { name: 'Miami, FL', slug: 'miami' },
    { name: 'Montgomery, AL', slug: 'montgomery' },
    { name: 'Murfreesboro, TN', slug: 'murfreesboro' },
    { name: 'Nashville, TN', slug: 'nashville' },
    { name: 'New Orleans, LA', slug: 'new-orleans' },
    { name: 'Norfolk, VA', slug: 'norfolk' },
    { name: 'Orlando, FL', slug: 'orlando' },
    { name: 'Raleigh, NC', slug: 'raleigh' },
    { name: 'Richmond, VA', slug: 'richmond' },
    { name: 'Savannah, GA', slug: 'savannah' },
    { name: 'St. Petersburg, FL', slug: 'st-petersburg' },
    { name: 'Tallahassee, FL', slug: 'tallahassee' },
    { name: 'Tampa, FL', slug: 'tampa' },
    { name: 'Virginia Beach, VA', slug: 'virginia-beach' },
    { name: 'Washington, DC', slug: 'washington-dc' },
    { name: 'West Palm Beach, FL', slug: 'west-palm-beach' },
    { name: 'Winston-Salem, NC', slug: 'winston-salem' },
  ],
  Midwest: [
    { name: 'Akron, OH', slug: 'akron' },
    { name: 'Chicago, IL', slug: 'chicago' },
    { name: 'Cincinnati, OH', slug: 'cincinnati' },
    { name: 'Cleveland, OH', slug: 'cleveland' },
    { name: 'Columbus, OH', slug: 'columbus' },
    { name: 'Dayton, OH', slug: 'dayton' },
    { name: 'Des Moines, IA', slug: 'des-moines' },
    { name: 'Detroit, MI', slug: 'detroit' },
    { name: 'Fargo, ND', slug: 'fargo' },
    { name: 'Fort Wayne, IN', slug: 'fort-wayne' },
    { name: 'Grand Rapids, MI', slug: 'grand-rapids' },
    { name: 'Indianapolis, IN', slug: 'indianapolis' },
    { name: 'Kansas City, MO', slug: 'kansas-city' },
    { name: 'Lincoln, NE', slug: 'lincoln' },
    { name: 'Madison, WI', slug: 'madison' },
    { name: 'Milwaukee, WI', slug: 'milwaukee' },
    { name: 'Minneapolis, MN', slug: 'minneapolis' },
    { name: 'Omaha, NE', slug: 'omaha' },
    { name: 'Sioux Falls, SD', slug: 'sioux-falls' },
    { name: 'Springfield, MO', slug: 'springfield-mo' },
    { name: 'St. Louis, MO', slug: 'st-louis' },
    { name: 'St. Paul, MN', slug: 'st-paul' },
    { name: 'Toledo, OH', slug: 'toledo' },
    { name: 'Wichita, KS', slug: 'wichita' },
  ],
  South: [
    { name: 'Albuquerque, NM', slug: 'albuquerque' },
    { name: 'Arlington, TX', slug: 'arlington' },
    { name: 'Austin, TX', slug: 'austin' },
    { name: 'Brownsville, TX', slug: 'brownsville' },
    { name: 'Corpus Christi, TX', slug: 'corpus-christi' },
    { name: 'Dallas, TX', slug: 'dallas' },
    { name: 'El Paso, TX', slug: 'el-paso' },
    { name: 'Fort Worth, TX', slug: 'fort-worth' },
    { name: 'Garland, TX', slug: 'garland' },
    { name: 'Houston, TX', slug: 'houston' },
    { name: 'Irving, TX', slug: 'irving' },
    { name: 'Laredo, TX', slug: 'laredo' },
    { name: 'Little Rock, AR', slug: 'little-rock' },
    { name: 'Lubbock, TX', slug: 'lubbock' },
    { name: 'McAllen, TX', slug: 'mcallen' },
    { name: 'Oklahoma City, OK', slug: 'oklahoma-city' },
    { name: 'Plano, TX', slug: 'plano' },
    { name: 'San Antonio, TX', slug: 'san-antonio' },
  ],
  West: [
    { name: 'Alexandria, VA', slug: 'alexandria' },
    { name: 'Anaheim, CA', slug: 'anaheim' },
    { name: 'Anchorage, AK', slug: 'anchorage' },
    { name: 'Ann Arbor, MI', slug: 'ann-arbor' },
    { name: 'Aurora, CO', slug: 'aurora' },
    { name: 'Bakersfield, CA', slug: 'bakersfield' },
    { name: 'Boise, ID', slug: 'boise' },
    { name: 'Chandler, AZ', slug: 'chandler' },
    { name: 'Chula Vista, CA', slug: 'chula-vista' },
    { name: 'Colorado Springs, CO', slug: 'colorado-springs' },
    { name: 'Denver, CO', slug: 'denver' },
    { name: 'Fort Collins, CO', slug: 'fort-collins' },
    { name: 'Fremont, CA', slug: 'fremont' },
    { name: 'Fresno, CA', slug: 'fresno' },
    { name: 'Gilbert, AZ', slug: 'gilbert' },
    { name: 'Glendale, AZ', slug: 'glendale-az' },
    { name: 'Glendale, CA', slug: 'glendale-ca' },
    { name: 'Henderson, NV', slug: 'henderson' },
    { name: 'Honolulu, HI', slug: 'honolulu' },
    { name: 'Lakewood, CO', slug: 'lakewood' },
    { name: 'Las Vegas, NV', slug: 'las-vegas' },
    { name: 'Long Beach, CA', slug: 'long-beach' },
    { name: 'Los Angeles, CA', slug: 'los-angeles' },
    { name: 'Mesa, AZ', slug: 'mesa' },
    { name: 'Modesto, CA', slug: 'modesto' },
    { name: 'Peoria, AZ', slug: 'peoria-az' },
    { name: 'Phoenix, AZ', slug: 'phoenix' },
    { name: 'Portland, OR', slug: 'portland' },
    { name: 'Provo, UT', slug: 'provo' },
    { name: 'Reno, NV', slug: 'reno' },
    { name: 'Riverside, CA', slug: 'riverside' },
    { name: 'Sacramento, CA', slug: 'sacramento' },
    { name: 'Salt Lake City, UT', slug: 'salt-lake-city' },
    { name: 'San Diego, CA', slug: 'san-diego' },
    { name: 'San Francisco, CA', slug: 'san-francisco' },
    { name: 'San Jose, CA', slug: 'san-jose' },
    { name: 'Scottsdale, AZ', slug: 'scottsdale' },
    { name: 'Seattle, WA', slug: 'seattle' },
    { name: 'Spokane, WA', slug: 'spokane' },
    { name: 'Stockton, CA', slug: 'stockton' },
    { name: 'Tacoma, WA', slug: 'tacoma' },
    { name: 'Tempe, AZ', slug: 'tempe' },
    { name: 'Tucson, AZ', slug: 'tucson' },
    { name: 'Virginia Beach, VA', slug: 'virginia-beach' },
  ],
};

const regionColors = {
  Northeast: 'bg-blue-50 border-blue-200',
  Southeast: 'bg-green-50 border-green-200',
  Midwest: 'bg-yellow-50 border-yellow-200',
  South: 'bg-orange-50 border-orange-200',
  West: 'bg-purple-50 border-purple-200',
};

export default function WaterDirectoryPage() {
  const totalCities = Object.values(cities).flat().length;

  return (
    <>
      <SiteHeader variant="inner" showCta ctaLabel="Check My ZIP →" />
      <main className="max-w-5xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-12">
        <GuideHero
          src={WATER_INDEX_HERO}
          alt={WATER_INDEX_HERO_ALT}
          eyebrow="CITY DIRECTORY"
          title="Water Quality Reports by City"
        />
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6 mt-6 text-center">
          Free EPA tap water reports for {totalCities}+ US cities. See PFAS
          detections, lead violations, contaminant history, and certified filter
          recommendations — all from live EPA data.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 mb-8">
          <span>✅ EPA SDWIS violation records</span>
          <span>✅ PFAS UCMR5 monitoring data</span>
          <span>✅ Lead tap sampling results</span>
          <span>✅ 100% free, no login</span>
        </div>
        {/* ZIP search CTA */}
        <div className="bg-blue-600 text-white rounded-xl p-6 max-w-xl mx-auto">
          <p className="font-semibold mb-3">
            Don't see your city? Check any ZIP code:
          </p>
          <Link
            href="/"
            className="inline-block bg-white text-blue-600 font-bold px-6 py-3 rounded-lg hover:bg-blue-50 transition"
          >
            Get My Free Water Report →
          </Link>
        </div>
      </div>

      {/* City grid by region */}
      {Object.entries(cities).map(([region, regionCities]) => (
        <section key={region} className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 border-b pb-2">
            {region}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {regionCities.map((city) => (
              <Link
                key={`${region}-${city.slug}`}
                href={`/water/${city.slug}`}
                className={`block border rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:border-blue-400 hover:text-blue-600 hover:shadow-sm transition ${regionColors[region]}`}
              >
                {city.name}
              </Link>
            ))}
          </div>
        </section>
      ))}

      {/* Bottom CTA */}
      <div className="mt-12 text-center border-t pt-10">
        <h2 className="text-xl font-bold text-gray-800 mb-3">
          Not sure which filter is right for your city?
        </h2>
        <p className="text-gray-600 mb-5">
          Answer 3 quick questions and get a personalized recommendation based
          on your water report.
        </p>
        <Link
          href="/quiz"
          className="inline-block bg-blue-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Take the Filter Finder Quiz →
        </Link>
      </div>
    </main>
    </>
  );
}
