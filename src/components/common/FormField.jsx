import Icon from './Icon';

// Label + control + error/hint line. The control should set
// aria-describedby={describedBy(id, error, hint)} so screen readers read the message.
export default function FormField({ id, label, required, hint, error, counter, children }) {
  return (
    <div className="field">
      {label && (
        <label className="field__label" htmlFor={id}>
          {label}
          {required && <span className="field__required" aria-hidden="true">*</span>}
        </label>
      )}
      {children}
      {(error || hint || counter) && (
        <div className="field__footer">
          {error ? (
            <p className="field__error" id={`${id}-error`}>
              <Icon name="alert" size={13} />
              {error}
            </p>
          ) : (
            <p className="field__hint" id={`${id}-hint`}>{hint}</p>
          )}
          {counter && <span className="field__counter">{counter}</span>}
        </div>
      )}
    </div>
  );
}

export function describedBy(id, error, hint) {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}
