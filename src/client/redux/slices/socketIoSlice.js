import { createSlice } from "@reduxjs/toolkit";

const socketIoSlice = createSlice({
  name: "socket",
  initialState: {
    socket: false,
  },
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
  },
});

export const { setSocket } = socketIoSlice.actions;
export default socketIoSlice.reducer;
