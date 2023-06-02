import { Box, Button, Chip, Typography } from '@mui/material';
import FundingProgress from './FundingProgress';

const ProjectInfoBox = ({ collected_funds, funding_goal, fields_of_study }) => {
  return (
    <Box>
      <FundingProgress collected_funds={collected_funds} funding_goal={funding_goal} />
      <Typography variant="h5" gutterBottom>
        {`$${collected_funds}`}
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        {`Funding Goal: $${funding_goal}`}
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
