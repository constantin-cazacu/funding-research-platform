import { configureStore } from '@reduxjs/toolkit';
import authReducer from 'slices/authSlice';
import researcherProjectsReducer from "./slices/researcherProjectsSlice";
import businessProjectsReducer from "./slices/businessProjectsSlice"

const store = configureStore({
  reducer: {
    // Add your reducers here
    auth: authReducer,
    researcherProjects: researcherProjectsReducer,
    businessProjects: businessProjectsReducer,
  },
});

export default store;
