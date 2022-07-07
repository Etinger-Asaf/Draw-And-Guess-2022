import { createSlice } from "@reduxjs/toolkit";

const gameDataSlice = createSlice({
  name: "gameData",
  initialState: {
    word: "",
    draw: "",
  },
  reducers: {
    updateWord: (state, action) => {
      state.word = action.payload;
    },
    updateDraw: (state, action) => {
      state.draw = action.payload;
    },
  },
});

export const { updateDraw, updateWord } = gameDataSlice.actions;
export default gameDataSlice.reducer;
