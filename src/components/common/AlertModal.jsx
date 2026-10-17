import { useId } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from './Modal';
import Icon from './Icon';
import { closeAlert, selectAlert } from '../../features/ui/uiSlice';

// Global popup driven by the ui slice (e.g. the success message after deleting a hotel).
export default function AlertModal() {
  const alert = useSelector(selectAlert);
  const dispatch = useDispatch();
  const titleId = useId();
  const close = () => dispatch(closeAlert());

  return (
    <Modal open={Boolean(alert)} onClose={close} size="sm" labelledBy={titleId}>
      {alert && (
        <div className="alert-modal" role="alert">
          <span className={`alert-modal__icon alert-modal__icon--${alert.type}`}>
            <Icon name={alert.type === 'error' ? 'alert' : 'checkCircle'} size={34} />
          </span>
          <h2 id={titleId} className="alert-modal__title">{alert.title}</h2>
          {alert.message && <p>{alert.message}</p>}
          <button type="button" className="btn btn--primary" onClick={close} data-autofocus>
            OK
          </button>
        </div>
      )}
    </Modal>
  );
}
