import { Box, Chip, Typography, Button } from '@mui/material';

const BusinessProjectInfoBox = ({ budget, fields_of_study, currency }) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={2}>
      <Typography variant="h5" gutterBottom>
        {`${currency} ${budget}`}
      </Typography>
      <Box display="flex" justifyContent="flex-start" marginBottom={1}>
        {fields_of_study.slice(0, 2).map((field, index) => (
          <Chip key={index} label={field} size="small" />
        ))}
      </Box>
      <Button variant="contained" color="primary">
        Apply for project
      </Button>
    </Box>
  );
};

export default BusinessProjectInfoBox;
