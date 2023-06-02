import { Box, Container, Grid, Typography } from '@mui/material';
import Navbar from './Navbar';
import ProjectInfoBox from './ProjectInfoBox';
import ProjectTabs from './ProjectTabs';
import { useEffect, useState } from 'react';

const ProjectPage = ({ projectId }) => {
  const [projectData, setProjectData] = useState(null);

  useEffect(() => {
    // Fetch project data based on the projectId from the backend API
    // Replace 'api/projects/${projectId}' with the actual endpoint URL
    fetch(`http://localhost:5001/api/projects/${projectId}`)
      .then((response) => response.json())
      .then((data) => setProjectData(data))
      .catch((error) => console.error(error));
  }, [projectId]);

  if (!projectData) {
    // Render a loading state or handle the data not being available yet
    return <div>Loading...</div>;
  }

  const { project_name, owner, image_url, abstract, fields_of_study, budget_items, timeline_items, collected_funds, funding_goal } = projectData;

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
