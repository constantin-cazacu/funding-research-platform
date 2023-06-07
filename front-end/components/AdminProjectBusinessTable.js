import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Select,
  MenuItem,
  Link
} from '@mui/material';
import axios from 'axios';

const ProjectSubmissionEntries = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nextPage, setNextPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [selectedStatus, setSelectedStatus] = useState({});
  const [updatedProjects, setUpdatedProjects] = useState([]);

  const handleStatusChange = (projectId, event) => {
    const newSelectedStatus = { ...selectedStatus, [projectId]: event.target.value };
    setSelectedStatus(newSelectedStatus);
  };

  const updateProjectStatus = async (projectId, status) => {
    try {
      await axios.post(
          'http://localhost:5000/evaluate_business_projects',
          { id: projectId, status: status } // Send an object with both 'id' and 'status'
      );
      console.log(`Project ${projectId} status updated: ${status}`);
    } catch (error) {
      console.error(error);
    }
  };


  const handleSubmit = async () => {
    const updatedProjectIds = [];
    const requests = [];

    for (const projectId in selectedStatus) {
      const status = selectedStatus[projectId];

      if (status !== '') {
        updatedProjectIds.push(projectId);
        requests.push(updateProjectStatus(projectId, status));
      }
    }

    try {
      await Promise.all(requests);
      console.log('Projects updated successfully');
      setSelectedStatus({});
      setUpdatedProjects(updatedProjectIds);
    } catch (error) {
      console.error('Failed to update projects', error);
    }
  };


  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:5000/business_pending_projects', {
          params: {
            page: currentPage,
            pageSize: pageSize,
            exclude: updatedProjects.join(','), // Exclude the updated projects
          },
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
  }, [currentPage, updatedProjects]);


  const handleLoadNext = async () => {
    try {
      const nextPageToFetch = currentPage + 1;
      const response = await axios.get('http://localhost:5000/business_pending_projects', {
        params: {
          page: nextPageToFetch,
          pageSize: pageSize,
          exclude: updatedProjects.join(','), // Exclude the updated projects
        },
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
      const response = await axios.get('http://localhost:5000/business_pending_projects', {
        params: {
          page: previousPageToFetch,
          pageSize: pageSize,
          exclude: updatedProjects.join(','), // Exclude the updated projects
        },
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
    <Box height="80vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          <TableContainer component={Box} sx={{ width: '80%' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>Project ID</TableCell>
                  <TableCell sx={{ borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>Title</TableCell>
                  <TableCell sx={{ borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>Company Email</TableCell>
                  <TableCell sx={{ borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>{project.id}</TableCell>
                    <TableCell>
                      <Link href={`/business-project/${project.id}`} sx={{textDecoration: 'none', color: 'black' }}>
                        {project.title}
                      </Link>
                    </TableCell>
                    <TableCell>{project.email}</TableCell>
                    <TableCell>
                      <Select
                        value={selectedStatus[project.id] || ''}
                        onChange={(event) => handleStatusChange(project.id, event)}
                      >
                        <MenuItem value="">
                          <em>Select status</em>
                        </MenuItem>
                        <MenuItem value="accepted">Accepted</MenuItem>
                        <MenuItem value="rejected">Rejected</MenuItem>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box display="flex" justifyContent="center" mt={2}>
            <Button variant="contained" disabled={currentPage === 1} onClick={handleLoadPrevious}>
              Previous
            </Button>
            <Button variant="contained" disabled={!nextPage} onClick={handleLoadNext}>
              Next
            </Button>
          </Box>
          <Box display="flex" justifyContent="center" mt={2}>
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
