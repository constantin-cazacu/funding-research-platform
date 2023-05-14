import { useState, useEffect } from 'react';
import { Box, Button, CircularProgress, Grid, Typography } from '@mui/material';
import axios from 'axios';
import AdminPanel from "../pages/admin_panel";

const ProjectSubmissionEntries = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nextPage, setNextPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:5000/pending_projects', {
          params: {
            page: currentPage,
            per_page: pageSize
          }
        });
        console.log('Response data:', response.data);
        setProjects(response.data.data);
        setNextPage(response.data.next);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProjects();
  }, [currentPage, pageSize]);

  const handleLoadMore = async () => {
    try {
      const response = await axios.get(nextPage);
      console.log('Load more response data:', response.data);
      setProjects(prevProjects => [...prevProjects, ...response.data.data]);
      setNextPage(response.data.next);
      setCurrentPage(currentPage + 1);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box height="100vh" display="flex" justifyContent="center" alignItems="center">
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          <Grid container spacing={2}>
            {projects.map(project => (
              <Grid item xs={12} sm={6} md={4} key={project.id}>
                {/* Render the project item */}
                <Typography variant="h6">{project.title}</Typography>
                <Typography variant="body1">{project.abstract}</Typography>
                <Typography variant="body1">{project.fields_of_study}</Typography>
                <Typography variant="body1">{project.budget}</Typography>
                <Typography variant="body1">{project.timeline}</Typography>
                <Typography variant="body1">{project.status}</Typography>
              </Grid>
            ))}
          </Grid>

          {nextPage && (
            <Box mt={4} display="flex" justifyContent="center">
              <Button variant="contained" onClick={handleLoadMore}>
                Load More
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};
export default ProjectSubmissionEntries
