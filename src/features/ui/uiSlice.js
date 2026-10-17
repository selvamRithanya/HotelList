import { createSlice, nanoid } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    toasts: [],
    // message
    alert: null,
  },
  reducers: {
    showToast: {
      reducer(state, action) {
        state.toasts.push(action.payload);
      },
      prepare({ type = 'info', message, duration = 4000 }) {
        return { payload: { id: nanoid(), type, message, duration } };
      },
    },
    dismissToast(state, action) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    showAlert(state, action) {
      state.alert = { type: 'success', ...action.payload };
    },
    closeAlert(state) {
      state.alert = null;
    },
  },
});

export const { showToast, dismissToast, showAlert, closeAlert } = uiSlice.actions;

export const selectToasts = (state) => state.ui.toasts;
export const selectAlert = (state) => state.ui.alert;

export default uiSlice.reducer;
