import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { Button } from '@mui/material';
import { logout } from '../../slices/authSlice';

const HomePage = () => {
  const router = useRouter();
  const loggedIn = useSelector((state) => state.auth.loggedIn);
  const role = useSelector((state) => state.auth.role);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const handleLoginClick = () => {
    router.push('/test/login');
  };

  const handleSubmitProjectClick = () => {
    router.push('/submit-project');
  };

  const handleLogoutClick = () => {
    // Perform logout actions, e.g., clear token, role, and navigate to the home page
    fetch('http://localhost:5001/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Logout failed');
        }
        // Clear the token and role from the Redux store
        dispatch(logout());
        router.push('/test/home');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <h1>Home</h1>
      {!loggedIn && (
        <Button variant="contained" onClick={handleLoginClick}>
          Login
        </Button>
      )}
      {loggedIn && (role === 'researcher' || role === 'juridical_person') && (
        <Button variant="contained" onClick={handleSubmitProjectClick}>
          Submit Project
        </Button>
      )}
      {loggedIn && (
        <Button variant="contained" onClick={handleLogoutClick}>
          Logout
        </Button>
      )}
    </div>
  );
};

export default HomePage;
