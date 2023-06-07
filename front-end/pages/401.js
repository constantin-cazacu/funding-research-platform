import { Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/router';

const UnauthorizedPage = () => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Box textAlign="center">
        <Typography variant="h2" gutterBottom>
          401 - Unauthorized Access
        </Typography>
        <Button variant="contained" onClick={handleGoHome}>
          Back Home
        </Button>
      </Box>
    </Box>
  );
};

export default UnauthorizedPage;
