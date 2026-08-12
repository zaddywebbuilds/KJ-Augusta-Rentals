import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Sends the visitor to the "Choose Your River House Stay" section — the site's
 * single primary CTA. On the home page that's a scroll; anywhere else it's a
 * route change, with App's ScrollBehaviour handling the anchor once mounted.
 */
export function useGoToStays() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return () => {
    if (pathname === '/') {
      document.querySelector('#stays')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#stays');
    }
  };
}
