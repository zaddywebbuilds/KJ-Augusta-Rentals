import Hero from '../components/Hero';
import ChooseYourStay from '../components/ChooseYourStay';
import PropertyStats from '../components/PropertyStats';
import Amenities from '../components/Amenities';
import VideoFeature from '../components/VideoFeature';
import AugustaConnection from '../components/AugustaConnection';
import Reviews from '../components/Reviews';
import AboutKJ from '../components/AboutKJ';
import FAQ from '../components/FAQ';
import LocationSection from '../components/LocationSection';
import FinalCTA from '../components/FinalCTA';
import PageMeta from '../components/PageMeta';
import { businessConfig } from '../data/businessConfig';
import { accommodations } from '../data/accommodations';

const SITE = 'https://kjaugustarentals.com';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  name: businessConfig.businessName,
  description:
    'Private Savannah River retreat on three secluded acres in Augusta, Georgia. Waterfront views, private dock, kayaks and a seasonal saltwater pool, with three ways to stay.',
  url: SITE,
  telephone: businessConfig.contact.phoneHref,
  email: businessConfig.contact.email,
  address: {
    '@type': 'PostalAddress',
    addressLocality: businessConfig.location.city,
    addressRegion: 'GA',
    postalCode: businessConfig.location.postalCode,
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: businessConfig.location.latitude,
    longitude: businessConfig.location.longitude,
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: businessConfig.trustSignals.googleRating,
    reviewCount: businessConfig.trustSignals.googleReviewCount,
  },
  amenityFeature: [
    'Private Savannah River frontage',
    'Private dock and boat slip',
    'Six kayaks',
    'Seasonal saltwater pool',
    'Fire pit and outdoor grilling',
    'Three secluded riverfront acres',
  ].map(name => ({ '@type': 'LocationFeatureSpecification', name, value: true })),
  containsPlace: accommodations.map(stay => ({
    '@type': 'Accommodation',
    name: stay.name,
    url: `${SITE}/stays/${stay.slug}`,
    occupancy: { '@type': 'QuantitativeValue', maxValue: stay.guests },
    numberOfBedrooms: stay.bedrooms,
    numberOfBathroomsTotal: stay.bathrooms,
  })),
};

export default function HomePage() {
  return (
    <>
      <PageMeta
        title="KJ Augusta Rentals | Private Savannah River Escape in Augusta, Georgia"
        description="A secluded Savannah River retreat on three private acres — waterfront views, private dock, kayaks, seasonal saltwater pool and exceptional indoor-outdoor living, minutes from the best of Augusta."
        path="/"
        jsonLd={jsonLd}
      />
      <Hero />
      <ChooseYourStay />
      <PropertyStats />
      <Amenities />
      <VideoFeature />
      <AugustaConnection />
      <Reviews />
      <AboutKJ />
      <FAQ />
      <LocationSection />
      <FinalCTA />
    </>
  );
}
