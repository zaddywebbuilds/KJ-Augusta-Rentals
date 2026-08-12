import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileBookingBar from './components/MobileBookingBar';
import ReviewPopup from './components/ReviewPopup';
import BookingActivityPopup from './components/BookingActivityPopup';
import HomePage from './pages/HomePage';
import StayPage from './pages/StayPage';
import MastersPage from './pages/MastersPage';

function ScrollBehaviour() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Let the destination route render before hunting for the anchor.
      requestAnimationFrame(() =>
        document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
      );
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    // overflow-x-clip (not -hidden) contains off-screen entry-animation
    // transforms without creating a scroll container that would break
    // sticky positioning inside the pages.
    <div className="min-h-screen bg-ivory text-ink overflow-x-clip">
      <ScrollBehaviour />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/stays/:slug" element={<StayPage />} />
          <Route path="/masters" element={<MastersPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
      <MobileBookingBar />
      <ReviewPopup />
      <BookingActivityPopup />
    </div>
  );
}
