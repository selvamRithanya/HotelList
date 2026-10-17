import { Link } from 'react-router-dom';
import Seo from '../components/common/Seo';
import StateMessage from '../components/common/StateMessage';

export default function NotFoundPage() {
  return (
    <>
      <Seo title="Page not found" noIndex />
      <div className="container">
        <StateMessage icon="alert" title="Page not found" message="The page you’re looking for doesn’t exist.">
          <Link to="/hotels" className="btn btn--primary">Browse hotels</Link>
        </StateMessage>
      </div>
    </>
  );
}
