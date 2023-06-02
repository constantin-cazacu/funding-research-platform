import { Box, Tab, Tabs, Typography } from '@mui/material';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';
import { Doughnut } from 'react-chartjs-2';

const ProjectTabs = ({ abstract, budget_items, timeline_items }) => {
  const handleChange = (event, newValue) => {
    // Handle tab change if needed
  };

  const renderBudgetChart = () => {
    const labels = budget_items.map(item => item.budget_item);
    const data = budget_items.map(item => item.sum);
    const chartData = {
      labels,
      datasets: [
        {
          data,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // Customize the colors as needed
        },
      ],
    };

    return (
      <Box width={200} height={200}>
        <Doughnut data={chartData} />
      </Box>
    );
  };

  return (
    <Box>
      <Tabs value={0} onChange={handleChange} indicatorColor="primary" textColor="primary">
        <Tab label="Overview" />
        <Tab label="Updates" />
        <Tab label="FAQ" />
      </Tabs>
      <Box mt={2}>
        <Box>
          <Typography variant="h6" gutterBottom>
            About
          </Typography>
          <Typography variant="body1" gutterBottom>
            {abstract}
          </Typography>
        </Box>
        <Box mt={2}>
          <Typography variant="h6" gutterBottom>
            Budget
          </Typography>
          {budget_items.map((item, index) => (
            <Typography key={index} variant="body1" gutterBottom>
              {`${item.budget_item}: $${item.sum}`}
            </Typography>
          ))}
          {renderBudgetChart()}
        </Box>
        <Box mt={2}>
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
                  <Typography variant="body1">{item.timeline_item}</Typography>
                  <Typography variant="body2" color="textSecondary">{item.date}</Typography>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </Box>
      </Box>
    </Box>
  );
};

export default ProjectTabs;
