import { Link } from 'react-router-dom';
export default function PageHeader({ title, subtitle, breadcrumbs = [], actions, variant = 'default', children }) {
  return (
    <div className={`page-header page-header--${variant}`}>
      <div className="container">
        <div className="page-header__inner">
          <div className="page-header__text">
            {breadcrumbs.length > 0 && (
              <nav aria-label="Breadcrumb" className="breadcrumb">
                <ol>
                  {breadcrumbs.map((crumb, index) => {
                    const isLast = index === breadcrumbs.length - 1;
                    return (
                      <li key={`${crumb.label}-${index}`}>
                        {crumb.to && !isLast ? (
                          <Link to={crumb.to}>{crumb.label}</Link>
                        ) : (
                          <span aria-current={isLast ? 'page' : undefined}>{crumb.label}</span>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </nav>
            )}
            <h1 className="page-header__title">{title}</h1>
            {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="page-header__actions">{actions}</div>}
        </div>
        {children && <div className="page-header__extra">{children}</div>}
      </div>
    </div>
  );
}
