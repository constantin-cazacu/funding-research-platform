import { createSlice } from '@reduxjs/toolkit';

const businessProjectsSlice = createSlice({
  name: 'businessProjects',
  initialState: {
    projects: [],
    currentPage: 1,
    totalPages: 0,
    hasNextPage: true,
    isLoading: false,
  },
  reducers: {
    setProjects: (state, action) => {
      state.projects = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setTotalPages: (state, action) => {
      state.totalPages = action.payload;
    },
    setHasNextPage: (state, action) => {
      state.hasNextPage = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setProjects: setBusinessProjects,
  setCurrentPage: setBusinessCurrentPage,
  setTotalPages: setBusinessTotalPages,
  setHasNextPage: setBusinessHasNextPage,
  setIsLoading: setBusinessIsLoading,
} = businessProjectsSlice.actions;

export default businessProjectsSlice.reducer;
