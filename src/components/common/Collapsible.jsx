import { useId, useState } from 'react';
import Icon from './Icon';

// Section with a heading button that shows/hides its content (filter sidebar groups).
export default function Collapsible({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  const bodyId = useId();

  return (
    <section className="collapsible">
      <h3 className="collapsible__heading">
        <button
          type="button"
          className="collapsible__toggle"
          aria-expanded={open}
          aria-controls={bodyId}
          onClick={() => setOpen((value) => !value)}
        >
          {title}
          <Icon name="chevronDown" size={16} className="collapsible__icon" />
        </button>
      </h3>
      <div id={bodyId} className="collapsible__body" hidden={!open}>
        {children}
      </div>
    </section>
  );
}
