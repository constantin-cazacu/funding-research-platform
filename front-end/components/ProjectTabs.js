import { useState } from 'react';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';
import { VictoryPie } from 'victory';

const ProjectTabs = ({ abstract, budget_items, timeline_items }) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const renderBudgetChart = () => {
    const data = budget_items.map(item => ({
      x: item.name,
      y: parseInt(item.sum),
    }));

    return (
      <Box width={200} height={200}>
        <VictoryPie
          data={data}
          innerRadius={100}
          // colorScale={['#FF6384', '#36A2EB', '#FFCE56']} // Customize the colors as needed
          colorScale="qualitative" // Customize the colors as needed
        />
      </Box>
    );
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
              Budget
            </Typography>
            {budget_items.map((item, index) => (
              <Typography key={index} variant="body1" gutterBottom>
                {`${item.name}: $${item.sum}`}
              </Typography>
            ))}
            {renderBudgetChart()}

            <Typography variant="h6" gutterBottom>
              Timeline
            </Typography>
            <Timeline>
              {timeline_items.map((item, index) => (
                <TimelineItem key={index}>
                  <TimelineSeparator>
                    <TimelineDot />
                    {index !== timeline_items.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="body1">{item.name}</Typography>
                    <Typography variant="body2" color="textSecondary">{item.date}</Typography>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
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

export default ProjectTabs;
