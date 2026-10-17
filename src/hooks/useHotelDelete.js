import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteHotel } from '../features/hotels/hotelsSlice';
import { showAlert } from '../features/ui/uiSlice';

// Drives the delete confirmation dialog. Render <DeleteHotelDialog {...dialogProps} />
// and call requestDelete(hotel) from any delete button.
export function useHotelDelete({ onDeleted } = {}) {
  const dispatch = useDispatch();
  const [hotel, setHotel] = useState(null);
  const [deleteImage, setDeleteImage] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const requestDelete = useCallback((target) => {
    setHotel(target);
    setDeleteImage(true);
    setError('');
  }, []);

  const cancel = useCallback(() => {
    if (!busy) setHotel(null);
  }, [busy]);

  const confirm = useCallback(async () => {
    if (!hotel) return;
    setBusy(true);
    setError('');
    try {
      await dispatch(deleteHotel({ id: hotel.id, deleteImage })).unwrap();
      setHotel(null);
      dispatch(showAlert({ title: 'Hotel deleted', message: `“${hotel.title}” was deleted successfully.` }));
      onDeleted?.(hotel);
    } catch (err) {
      setError(err.message || 'The hotel could not be deleted.');
    } finally {
      setBusy(false);
    }
  }, [dispatch, hotel, deleteImage, onDeleted]);

  return {
    requestDelete,
    dialogProps: { hotel, deleteImage, onDeleteImageChange: setDeleteImage, busy, error, onConfirm: confirm, onCancel: cancel },
  };
}
