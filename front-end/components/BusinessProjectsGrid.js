import React, { useEffect } from 'react';
import { Grid, Box, CircularProgress, Button, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {
  setBusinessProjects,
  setBusinessCurrentPage,
  setBusinessTotalPages,
  setBusinessHasNextPage,
  setBusinessIsLoading,
} from '../slices/businessProjectsSlice';
import BusinessProjectCard from "./BusinessProjectCard";
import projectImage from '../public/bg-aperiodic-tilings.jpg';

const BusinessProjectsGrid = () => {
  const pageSize = 6;
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.businessProjects.projects);
  const currentPage = useSelector((state) => state.businessProjects.currentPage);
  const totalPages = useSelector((state) => state.businessProjects.totalPages);
  const hasNextPage = useSelector((state) => state.businessProjects.hasNextPage);
  const isLoading = useSelector((state) => state.businessProjects.isLoading);

  useEffect(() => {
    fetchProjects();
  }, [currentPage]);

  const fetchProjects = async () => {
    try {
      dispatch(setBusinessIsLoading(true));
      const response = await axios.get('http://localhost:5000/business_project_card_data', {
        params: {
          page: currentPage,
          pageSize: pageSize,
        },
      });
      const data = response.data.data;
      const totalPages = response.data.totalPages;
      console.log('Response:', response.data);
      console.log('Data:', data);

      let payloadData;
      if (currentPage === 1) {
        payloadData = data;
      } else {
        const prevProjects = projects.slice(0, (currentPage - 1) * pageSize);
        payloadData = prevProjects.concat(data);
      }

      dispatch(setBusinessProjects(payloadData));
      dispatch(setBusinessTotalPages(totalPages));
      dispatch(setBusinessHasNextPage(response.data.next !== null));
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      dispatch(setBusinessIsLoading(false));
    }
  };

  const handleLoadMore = async () => {
    if (hasNextPage) {
      dispatch(setBusinessCurrentPage(currentPage + 1));
    }
  };

  const renderLoadMoreButton = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
      <Button
        variant="outlined"
        onClick={handleLoadMore}
        disabled={!hasNextPage || isLoading}
      >
        {isLoading ? 'Loading...' : 'Load More'}
      </Button>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Projects Looking for Researchers
      </Typography>
      <Box sx={{ position: 'relative' }}>
      <Grid container spacing={2}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project.id}>
            <BusinessProjectCard
              id={project.id}
              image={projectImage.src}
              title={project.title}
              name={project.name}
              companyName={project.companyName}
              projectBudget={project.projectBudget}
              currency={project.currency}
              fieldsOfStudy={project.fieldsOfStudy}
            />
          </Grid>
        ))}
      </Grid>
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <CircularProgress />
        </Box>
      )}
      </Box>
      {renderLoadMoreButton()}
    </Box>
  );
};

export default BusinessProjectsGrid;
