import { createSlice } from '@reduxjs/toolkit';

const researcherProjectsSlice = createSlice({
  name: 'researcherProjects',
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
  setProjects: setResearcherProjects,
  setCurrentPage: setResearcherCurrentPage,
  setTotalPages: setResearcherTotalPages,
  setHasNextPage: setResearcherHasNextPage,
  setIsLoading: setResearcherIsLoading,
} = researcherProjectsSlice.actions;

export default researcherProjectsSlice.reducer;
