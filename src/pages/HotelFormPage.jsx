import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Seo from '../components/common/Seo';
import { PageLoader } from '../components/common/Spinner';
import StateMessage from '../components/common/StateMessage';
import PageHeader from '../components/layout/PageHeader';
import HotelForm from '../components/hotels/HotelForm';
import { createHotel, fetchHotelById, selectCurrentHotel, updateHotel } from '../features/hotels/hotelsSlice';
import { showToast } from '../features/ui/uiSlice';

// Handles both /hotels/new and /hotels/:id/edit with the same HotelForm.
export default function HotelFormPage() {
  const { id } = useParams();
  const isEdit = id !== undefined;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const current = useSelector(selectCurrentHotel);

  useEffect(() => {
    if (!isEdit) return undefined;
    const request = dispatch(fetchHotelById(id));
    return () => request.abort();
  }, [dispatch, id, isEdit]);

  const hotel = isEdit && current.id === id ? current.item : null;

  const handleSubmit = async (formData) => {
    const saved = await dispatch(isEdit ? updateHotel({ id, formData }) : createHotel(formData)).unwrap();
    dispatch(showToast({ type: 'success', message: isEdit ? 'Hotel updated successfully.' : 'Hotel created successfully.' }));
    navigate(`/hotels/${saved.id}`);
  };

  const handleCancel = () => navigate(isEdit ? `/hotels/${id}` : '/hotels');

  if (isEdit && !hotel) {
    if (current.id === id && current.status === 'failed') {
      return (
        <>
          <Seo title="Hotel not found" noIndex />
          <div className="container">
            <StateMessage icon="alert" tone="danger" title="Couldn’t load this hotel" message={current.error?.message}>
              <Link to="/hotels" className="btn btn--secondary">Back to hotels</Link>
            </StateMessage>
          </div>
        </>
      );
    }
    return <PageLoader label="Loading hotel…" />;
  }
   const title = isEdit ? `Edit ${hotel.title}` : 'Add a new hotel';
  const breadcrumbs = isEdit
    ? [
        { label: 'Home', to: '/' },
        { label: 'Hotels', to: '/hotels' },
        { label: hotel.title, to: `/hotels/${hotel.id}` },
        { label: 'Edit' },
      ]
    : [{ label: 'Home', to: '/' }, { label: 'Hotels', to: '/hotels' }, { label: 'Add hotel' }];

  return (
    <>
      <Seo title={title} description={isEdit ? `Update the details of ${hotel.title}.` : 'Add a new hotel listing.'} noIndex />
      <PageHeader title={isEdit ? 'Edit hotel' : 'Add hotel'} breadcrumbs={breadcrumbs} />
      <div className="container container--narrow">
        <HotelForm
          key={hotel ? `${hotel.id}-${hotel.updated_at}` : 'new'}
          hotel={hotel}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitLabel={isEdit ? 'Save changes' : 'Create hotel'}
        />
      </div>
    </>
  );
}
