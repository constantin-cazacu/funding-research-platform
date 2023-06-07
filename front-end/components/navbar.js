import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { Button, Box } from '@mui/material';
import { logout } from '../slices/authSlice';

const Navbar = () => {
  const router = useRouter();
  const loggedIn = useSelector((state) => state.auth.loggedIn);
  const role = useSelector((state) => state.auth.role);
  const dispatch = useDispatch();

  const handleLoginClick = () => {
    router.push('/login');
  };

  const handleLogoutClick = () => {
    // Perform logout actions, e.g., clear token, role, and navigate to the login page
    dispatch(logout());
    router.push('/login');
  };

  const handleRegisterClick = () => {
    router.push('/register');
  };

  const handleSubmitProjectClick = () => {
    router.push('/submit-project');
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      padding={2}
      maxWidth={1300}
      margin="0 auto"
    >
      <Box>
        {loggedIn && (role === 'researcher' || role === 'juridical_person') && (
          <Button variant="contained" onClick={handleSubmitProjectClick}>
            Submit Project
          </Button>
        )}
      </Box>
      <Box sx={{ display: 'flex', gap: '10px' }}>
        {!loggedIn ? (
          <>
            <Button variant="contained" onClick={handleLoginClick}>
              Login
            </Button>
            <Button variant="contained" onClick={handleRegisterClick}>
              Register
            </Button>
          </>
        ) : (
          <Button variant="contained" onClick={handleLogoutClick}>
            Logout
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Navbar;
