import { configureStore } from "@reduxjs/toolkit";
import gameDateReducer from "./slices/gameDataSlice";

export default configureStore({
  reducer: {
    gameData: gameDateReducer,
  },
});
