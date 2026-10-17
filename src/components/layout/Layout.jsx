import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AppBar from './AppBar';
import Toasts from '../common/Toasts';
import AlertModal from '../common/AlertModal';
import { PageLoader } from '../common/Spinner';
import { SITE_NAME } from '../../config';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function Layout() {
  return (
    <div className="app">
      <a href="#main" className="skip-link">Skip to main content</a>
      <ScrollToTop />
      <AppBar />
      <main id="main" className="app__main" tabIndex={-1}>
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <footer className="app-footer">
        <div className="container app-footer__inner">
          <p>
            <strong>{SITE_NAME}</strong> · Be comfortable with your own stay
          </p>
          <p>Map data © OpenStreetMap contributors</p>
        </div>
      </footer>
      <Toasts />
      <AlertModal />
    </div>
  );
}
