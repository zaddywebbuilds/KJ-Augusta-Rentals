import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { initAnalytics, trackPageView } from './lib/analytics';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileBookingBar from './components/MobileBookingBar';
import ReviewPopup from './components/ReviewPopup';
import BookingActivityPopup from './components/BookingActivityPopup';
import EmailCapture from './components/EmailCapture';
import HomePage from './pages/HomePage';
import StayPage from './pages/StayPage';
import MastersPage from './pages/MastersPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';

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

function Analytics() {
  const { pathname, search } = useLocation();

  useEffect(() => { initAnalytics(); }, []);

  useEffect(() => {
    // Deferred so PageMeta's own effect has set the route title before it is
    // read. A timeout rather than a frame: rAF never fires in a background
    // tab, which would silently drop the page view.
    const id = setTimeout(() => trackPageView(pathname + search), 0);
    return () => clearTimeout(id);
  }, [pathname, search]);

  return null;
}

export default function App() {
  return (
    // overflow-x-clip (not -hidden) contains off-screen entry-animation
    // transforms without creating a scroll container that would break
    // sticky positioning inside the pages.
    <div className="min-h-screen bg-ivory text-ink overflow-x-clip">
      <ScrollBehaviour />
      <Analytics />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/stays/:slug" element={<StayPage />} />
          <Route path="/masters" element={<MastersPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
      <MobileBookingBar />
      <ReviewPopup />
      <BookingActivityPopup />
      <EmailCapture />
    </div>
  );
}
