import { configureStore } from "@reduxjs/toolkit";
import gameDateReducer from "./slices/gameDataSlice";
import socketIoReducer from "./slices/socketIoSlice";

export default configureStore({
  reducer: {
    gameData: gameDateReducer,
    socket: socketIoReducer,
  },
});
