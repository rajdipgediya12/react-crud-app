import { createSlice } from "@reduxjs/toolkit";

const dataSlice = createSlice({
  name: "data",
  initialState: {
    data: [],
  },
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
    },
    editRow: (state, action) => {
      const { id, newData } = action.payload;
      const index = state.data.findIndex((row) => row.id === id);
      if (index !== -1) {
        state.data[index] = { ...state.data[index], ...newData };
      }
    },
    deleteRow: (state, action) => {
      const { id } = action.payload;
      state.data = state.data.filter((row) => row.id !== id);
    },
  },
});

export const { setData, editRow, deleteRow } = dataSlice.actions;
export default dataSlice.reducer;
