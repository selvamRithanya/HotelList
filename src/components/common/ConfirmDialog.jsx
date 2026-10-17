import Modal from './Modal';
import Spinner from './Spinner';

export default function ConfirmDialog({
  open,
  title,
  message,
  children,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'danger',
  busy = false,
  error,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal
      open={open}
      title={title}
      size="sm"
      onClose={busy ? undefined : onCancel}
      closeOnBackdrop={!busy}
      footer={
        <>
          <button type="button" className="btn btn--secondary" onClick={onCancel} disabled={busy} data-autofocus>
            {cancelLabel}
          </button>
          <button type="button" className={`btn btn--${tone}`} onClick={onConfirm} disabled={busy}>
            {busy && <Spinner size="sm" />}
            {confirmLabel}
          </button>
        </>
      }
    >
      {message && <p>{message}</p>}
      {children}
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </Modal>
  );
}
