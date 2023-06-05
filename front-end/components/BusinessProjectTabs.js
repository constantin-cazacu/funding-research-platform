import { useState } from 'react';
import { Box, Tab, Tabs, Typography } from '@mui/material';

const BusinessProjectTabs = ({ abstract, objectives }) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box>
      <Tabs value={selectedTab} onChange={handleChange} indicatorColor="primary" textColor="primary">
        <Tab label="Overview" />
        <Tab label="Updates" />
        <Tab label="FAQ" />
      </Tabs>
      <Box mt={2}>
        {selectedTab === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              About
            </Typography>
            <Typography variant="body1" gutterBottom>
              {abstract}
            </Typography>

            <Typography variant="h6" gutterBottom>
              Objectives
            </Typography>
            <ul>
              {objectives.map((objective, index) => (
                <li key={index}>{objective}</li>
              ))}
            </ul>
          </Box>
        )}
        {selectedTab === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Updates
            </Typography>
            <Typography variant="body1" gutterBottom>
              Here will be updates
            </Typography>
          </Box>
        )}
        {selectedTab === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              FAQ
            </Typography>
            <Typography variant="body1" gutterBottom>
              Here are some frequently asked questions
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default BusinessProjectTabs;
