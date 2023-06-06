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

  const handleSubmitProjectClick = () => {
    router.push('/submit-project');
  };

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" padding={2}>
      <Box>
        {loggedIn && (role === 'researcher' || role === 'juridical_person') && (
          <Button variant="contained" onClick={handleSubmitProjectClick}>
            Submit Project
          </Button>
        )}
      </Box>
      <Box>
        {loggedIn ? (
          <Button variant="contained" onClick={handleLogoutClick}>
            Logout
          </Button>
        ) : (
          <Button variant="contained" onClick={handleLoginClick}>
            Login
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Navbar;
