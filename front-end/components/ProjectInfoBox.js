import { Box, Button, Chip, Typography } from '@mui/material';
import FundingProgress from './FundingProgress';

const ProjectInfoBox = ({ collected_funds, funding_goal, currency, fields_of_study }) => {
    collected_funds = 150 //test
    // funding_goal = 1000 //test
  return (
    <Box>
      <FundingProgress collected_funds={collected_funds} funding_goal={funding_goal} currency={currency} />
      <Typography variant="h5" gutterBottom>
        {`${currency} ${collected_funds}`}
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        {`Funding Goal: ${currency} ${funding_goal}`}
      </Typography>
      <Box display="flex" justifyContent="flex-start" marginBottom={1}>
        {fields_of_study.slice(0, 2).map((field, index) => (
          <Chip key={index} label={field} size="small" />
        ))}
      </Box>
      <Button variant="contained" color="primary">
        Back this project
      </Button>
    </Box>
  );
};

export default ProjectInfoBox;
