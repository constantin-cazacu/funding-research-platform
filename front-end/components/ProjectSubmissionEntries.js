import { useState, useEffect } from 'react';
import { Box, Button, CircularProgress, Grid, Select, MenuItem, Typography } from '@mui/material';
import axios from 'axios';

const ProjectSubmissionEntries = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nextPage, setNextPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [selectedStatus, setSelectedStatus] = useState({});

  const handleStatusChange = (projectId, event) => {
    const newSelectedStatus = { ...selectedStatus, [projectId]: event.target.value };
    setSelectedStatus(newSelectedStatus);
  };

  const updateProjectStatus = async (projectId, status) => {
    try {
      await axios.post(`http://localhost:5000/evaluate_projects`, { status }, {
        params: {
            id: projectId,
            status: status
          }
      });
      console.log(`Project ${projectId} status updated: ${status}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    for (const projectId in selectedStatus) {
      const status = selectedStatus[projectId];
      await updateProjectStatus(projectId, status);
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:5000/pending_projects', {
          params: {
            page: currentPage,
            pageSize: pageSize
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
  }, [currentPage, pageSize, selectedStatus]);

  const handleLoadNext = async () => {
    try {
      const nextPageToFetch = currentPage + 1;
      const response = await axios.get('http://localhost:5000/pending_projects', {
        params: {
          page: nextPageToFetch,
          pageSize: pageSize
        }
      });
      console.log('Load next response data:', response.data);
      setProjects(response.data.data);
      setNextPage(response.data.next);
      setCurrentPage(nextPageToFetch);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLoadPrevious = async () => {
    try {
      const previousPageToFetch = currentPage - 1;
      const response = await axios.get('http://localhost:5000/pending_projects', {
        params: {
          page: previousPageToFetch,
          pageSize: pageSize
        }
      });
      console.log('Load previous response data:', response.data);
      setProjects(response.data.data);
      setNextPage(response.data.next);
      setCurrentPage(previousPageToFetch);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          <Grid container spacing={2}>
            {projects.map((project) => (
              <Grid item xs={12} sm={6} md={4} key={project.id}>
                {/* Render the project item */}
                <Typography variant="h6">{project.title}</Typography>
                <Typography variant="body1">{project.abstract}</Typography>
                <Typography variant="body1">
                  Fields of Study: {project.fields_of_study.join(', ')}
                </Typography>
                {project.budget.map((item) => (
                  <Typography variant="body1" key={item.id}>
                    Budget: {item.name}: {item.sum}
                  </Typography>
                ))}
                {project.timeline.map((item) => (
                  <Typography variant="body1" key={item.name}>
                    Timeline: {item.name}: {new Date(item.date).toLocaleDateString()}
                  </Typography>
                ))}
                <Select
                  value={selectedStatus[project.id] || project.status}
                  onChange={(event) => handleStatusChange(project.id, event)}
                >
                  <MenuItem value="accepted">Accepted</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
                <Typography variant="body1">{project.status}</Typography>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
            {currentPage > 1 && (
              <Button variant="contained" onClick={handleLoadPrevious}>
                Load Previous
              </Button>
            )}
            {currentPage <= nextPage && (
              <Button variant="contained" onClick={handleLoadNext}>
                Load Next
              </Button>
            )}
            <Button variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>

        </>
      )}
    </Box>
  );
};

export default ProjectSubmissionEntries;
