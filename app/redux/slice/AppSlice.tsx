import { createSlice } from '@reduxjs/toolkit';

const AppSlice = createSlice({
  name: 'app',
  initialState: {
    audioList: [],
  },
  reducers: {
    setAudioList: (state, action) => {
      state.audioList = action.payload;
    },
  },
});

export const { setAudioList } = AppSlice.actions;
export default AppSlice.reducer;
