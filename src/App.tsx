import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Introduction from './components/Introduction';
import PropertyStats from './components/PropertyStats';
import StorySection from './components/StorySection';
import Amenities from './components/Amenities';
import VideoFeature from './components/VideoFeature';
import Gallery from './components/Gallery';
import RoomTour from './components/RoomTour';
import WhoItsFor from './components/WhoItsFor';
import AugustaConnection from './components/AugustaConnection';
import Reviews from './components/Reviews';
import AboutKJ from './components/AboutKJ';
import FAQ from './components/FAQ';
import BookingPanel from './components/BookingPanel';
import LocationSection from './components/LocationSection';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import MobileBookingBar from './components/MobileBookingBar';

function App() {
  return (
    // overflow-x-clip (not -hidden) contains off-screen entry-animation
    // transforms without creating a scroll container that would break
    // the sticky booking panel in the FAQ section.
    <div className="min-h-screen bg-ivory text-ink overflow-x-clip">
      <Navbar />
      <Hero />
      <Introduction />
      <PropertyStats />
      <StorySection />
      <Amenities />
      <VideoFeature />
      <Gallery />
      <RoomTour />
      <WhoItsFor />
      <AugustaConnection />
      <Reviews />
      <AboutKJ />
      <FAQ />
      <BookingPanel />
      <LocationSection />
      <FinalCTA />
      <Footer />
      <MobileBookingBar />
    </div>
  );
}

export default App;
