import { Box, Container, Grid, Typography } from '@mui/material';
import Navbar from './Navbar';
import ProjectInfoBox from './ProjectInfoBox';
import ProjectTabs from './ProjectTabs';
import { useEffect, useState } from 'react';
import axios from 'axios';

const ProjectPage = ({ projectId }) => {
  const [projectData, setProjectData] = useState(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/project_data`, {
          params: {
            id : projectId
          }
        });
        setProjectData(response.data.data);
        console.log(response.data.data)
      } catch (error) {
        console.error(error);
      }
    };

    fetchProjectData();
  }, [projectId]);

  if (!projectData) {
    // Render a loading state or handle the data not being available yet
    return <div>Loading...</div>;
  }

  const {
    title: project_name,
    owner,
    image_url,
    abstract,
    fields_of_study,
    budget: budget_items, // Rename the property to budget_items
    timeline: timeline_items, // Rename the property to timeline_items
    collected_funds,
    funding_goal
  } = projectData;

  return (
    <Box>
      <Navbar />
      <Container maxWidth="lg" mt={2}>
        <Typography variant="h4" gutterBottom>
          {project_name}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Owner: {owner}
        </Typography>
        <Grid container spacing={2} mt={2}>
          <Grid item xs={12} sm={8}>
            <img src={image_url} alt="Project" style={{ width: '100%', height: 'auto' }} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <ProjectInfoBox
              collected_funds={collected_funds}
              funding_goal={funding_goal}
              fields_of_study={fields_of_study}
            />
          </Grid>
        </Grid>
        <ProjectTabs
          abstract={abstract}
          budget_items={budget_items}
          timeline_items={timeline_items}
        />
      </Container>
    </Box>
  );
};

export default ProjectPage;
