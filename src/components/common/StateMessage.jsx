import Icon from './Icon';

// Centered message used for empty results, errors and "not found" screens.
export default function StateMessage({ icon = 'info', tone = 'neutral', title, message, children }) {
  return (
    <div className={`state state--${tone}`}>
      <span className="state__icon">
        <Icon name={icon} size={28} />
      </span>
      <h2 className="state__title">{title}</h2>
      {message && <p className="state__message">{message}</p>}
      {children && <div className="state__actions">{children}</div>}
    </div>
  );
}
