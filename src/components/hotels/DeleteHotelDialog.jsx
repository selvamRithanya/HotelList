import ConfirmDialog from '../common/ConfirmDialog';

// Confirmation =>delete
export default function DeleteHotelDialog({ hotel, deleteImage, onDeleteImageChange, busy, error, onConfirm, onCancel }) {
  return (
    <ConfirmDialog
      open={Boolean(hotel)}
      title="Delete hotel?"
      confirmLabel={busy ? 'Deleting…' : 'Delete'}
      busy={busy}
      error={error}
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      {hotel && (
        <>
          <p>
            <strong className="text-strong">{hotel.title}</strong> will be permanently removed. This cannot be undone.
          </p>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={deleteImage}
              disabled={busy}
              onChange={(event) => onDeleteImageChange(event.target.checked)}
            />
            <span>Also delete the image file from the server</span>
          </label>
        </>
      )}
    </ConfirmDialog>
  );
}
