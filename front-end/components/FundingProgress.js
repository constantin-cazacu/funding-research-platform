import { Box, LinearProgress, Typography } from '@mui/material';

const FundingProgress = ({ collected_funds, funding_goal }) => {
  const progress = (collected_funds / funding_goal) * 100;

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Funding Progress
      </Typography>
      <LinearProgress
          variant="determinate"
          value={progress}
          color="success" />
      <Box display="flex" justifyContent="space-between">
        <Typography variant="caption">{`Collected Funds: $${collected_funds}`}</Typography>
        <Typography variant="caption">{`Funding Goal: $${funding_goal}`}</Typography>
      </Box>
    </Box>
  );
};

export default FundingProgress;
