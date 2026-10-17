import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Icon from './Icon';
import { dismissToast, selectToasts } from '../../features/ui/uiSlice';
import './Toasts.css';

const ICON_BY_TYPE = { success: 'checkCircle', error: 'alert', info: 'info' };

function Toast({ toast }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => dispatch(dismissToast(toast.id)), toast.duration);
    return () => clearTimeout(timer);
  }, [dispatch, toast.id, toast.duration]);

  return (
    <div className={`toast toast--${toast.type}`} role={toast.type === 'error' ? 'alert' : 'status'}>
      <Icon name={ICON_BY_TYPE[toast.type] ?? 'info'} size={18} className="toast__icon" />
      <p className="toast__message">{toast.message}</p>
      <button type="button" className="toast__close" onClick={() => dispatch(dismissToast(toast.id))} aria-label="Dismiss notification">
        <Icon name="x" size={16} />
      </button>
    </div>
  );
}

export default function Toasts() {
  const toasts = useSelector(selectToasts);
  return (
    <div className="toasts" aria-live="polite">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
