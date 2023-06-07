import React, { useEffect } from 'react';
import { Grid, Box, CircularProgress, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {
  setProjects,
  setCurrentPage,
  setTotalPages,
  setHasNextPage,
  setIsLoading,
} from '../slices/researcherProjectsSlice';
import ResearcherProjectCard from "./ResearcherProjectCard";
import projectImage from '../public/bg-aperiodic-tilings.jpg';

const ResearcherProjectsGrid = () => {
  const pageSize = 6;
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.researcherProjects.projects);
  const currentPage = useSelector((state) => state.researcherProjects.currentPage);
  const totalPages = useSelector((state) => state.researcherProjects.totalPages);
  const hasNextPage = useSelector((state) => state.researcherProjects.hasNextPage);
  const isLoading = useSelector((state) => state.researcherProjects.isLoading);

  useEffect(() => {
    fetchProjects();
  }, [currentPage]);

  const fetchProjects = async () => {
    try {
      dispatch(setIsLoading(true));
      const response = await axios.get('http://localhost:5000/researcher_project_card_data', {
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

      dispatch(setProjects(payloadData));
      dispatch(setTotalPages(totalPages));
      dispatch(setHasNextPage(response.data.next !== null));
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const handleLoadMore = async () => {
    if (hasNextPage) {
      dispatch(setCurrentPage(currentPage + 1));
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
    <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
      <div>
        <Grid container spacing={2}>
          {projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
                <ResearcherProjectCard
                  id={project.id}
                  image={projectImage}
                  title={project.title}
                  student={project.student}
                  supervisor={project.supervisor}
                  collectedFunds={project.collectedFunds}
                  currency={project.currency}
                  fundingGoal={project.fundingGoal}
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
        {renderLoadMoreButton()}
      </div>
    </Box>
  );
};

export default ResearcherProjectsGrid;