import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { hotelsApi } from '../../api/hotelsApi';

const toSerializableError = (err) => ({
  message: err?.message || 'Something went wrong',
  status: err?.status ?? null,
  details: err?.details ?? null,
});

// Wraps an API call in a thunk that rejects with a serializable { message, status, details }.
function apiThunk(type, call) {
  return createAsyncThunk(type, async (arg, { rejectWithValue, signal }) => {
    try {
      return await call(arg, signal);
    } catch (err) {
      return rejectWithValue(toSerializableError(err));
    }
  });
}

export const fetchHotels = apiThunk('hotels/fetchList', (params, signal) => hotelsApi.list(params, { signal }));

export const fetchHotelById = apiThunk('hotels/fetchOne', (id, signal) =>
  hotelsApi.get(id, { signal }).then((res) => res.data)
);

export const createHotel = apiThunk('hotels/create', (formData) =>
  hotelsApi.create(formData).then((res) => res.data)
);

export const updateHotel = apiThunk('hotels/update', ({ id, formData }) =>
  hotelsApi.update(id, formData).then((res) => res.data)
);

export const deleteHotel = apiThunk('hotels/delete', ({ id, deleteImage }) =>
  hotelsApi.remove(id, { deleteImage }).then(() => ({ id }))
);

const sameId = (a, b) => String(a) === String(b);

const initialState = {
  list: { items: [], total: 0, status: 'idle', error: null, requestId: null },
  // `id` is the hotel currently requested, so stale results for another hotel are never shown.
  current: { id: null, item: null, status: 'idle', error: null, requestId: null },
};

function replaceInList(state, hotel) {
  const index = state.list.items.findIndex((h) => sameId(h.id, hotel.id));
  if (index !== -1) state.list.items[index] = hotel;
}

function setCurrent(state, hotel) {
  state.current = { id: String(hotel.id), item: hotel, status: 'succeeded', error: null, requestId: null };
}

const hotelsSlice = createSlice({
  name: 'hotels',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHotels.pending, (state, action) => {
        state.list.status = 'loading';
        state.list.error = null;
        state.list.requestId = action.meta.requestId;
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        if (state.list.requestId !== action.meta.requestId) return;
        state.list.items = action.payload.data;
        state.list.total = action.payload.pagination.total;
        state.list.status = 'succeeded';
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        if (action.meta.aborted || state.list.requestId !== action.meta.requestId) return;
        state.list.status = 'failed';
        state.list.error = action.payload ?? { message: action.error.message };
      })

      .addCase(fetchHotelById.pending, (state, action) => {
        const id = String(action.meta.arg);
        if (state.current.id !== id) state.current.item = null;
        state.current.id = id;
        state.current.status = 'loading';
        state.current.error = null;
        state.current.requestId = action.meta.requestId;
      })
      .addCase(fetchHotelById.fulfilled, (state, action) => {
        if (state.current.requestId !== action.meta.requestId) return;
        setCurrent(state, action.payload);
        replaceInList(state, action.payload);
      })
      .addCase(fetchHotelById.rejected, (state, action) => {
        if (action.meta.aborted || state.current.requestId !== action.meta.requestId) return;
        state.current.status = 'failed';
        state.current.error = action.payload ?? { message: action.error.message };
      })

      .addCase(createHotel.fulfilled, (state, action) => {
        setCurrent(state, action.payload);
      })
      .addCase(updateHotel.fulfilled, (state, action) => {
        setCurrent(state, action.payload);
        replaceInList(state, action.payload);
      })
      .addCase(deleteHotel.fulfilled, (state, action) => {
        const { id } = action.payload;
        const before = state.list.items.length;
        state.list.items = state.list.items.filter((h) => !sameId(h.id, id));
        if (state.list.items.length < before) state.list.total = Math.max(0, state.list.total - 1);
        if (state.current.id === String(id)) state.current = initialState.current;
      });
  },
});

export const selectHotelList = (state) => state.hotels.list;
export const selectCurrentHotel = (state) => state.hotels.current;
export const selectHotelFromList = (state, id) => state.hotels.list.items.find((h) => sameId(h.id, id));

export default hotelsSlice.reducer;
