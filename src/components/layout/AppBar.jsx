import { Link, NavLink } from 'react-router-dom';
import Icon from '../common/Icon';
import ThemeToggle from './ThemeToggle';
import { SITE_NAME } from '../../config';

export default function AppBar() {
  return (
    <header className="app-bar">
      <div className="container app-bar__inner">
        <Link to="/hotels" className="app-bar__brand">
          <span className="app-bar__logo" aria-hidden="true">
            <Icon name="building" size={18} />
          </span>
          {SITE_NAME}
        </Link>
        <nav className="app-bar__nav" aria-label="Main">
          <NavLink to="/hotels" end className="app-bar__link">
            <Icon name="building" size={17} />
            <span className="">Hotels</span>
          </NavLink>
          <NavLink to="/hotels/new" className="app-bar__link app-bar__link--outline">
            <Icon name="plus" size={17} />
          </NavLink>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
