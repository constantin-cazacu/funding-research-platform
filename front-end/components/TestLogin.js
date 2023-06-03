import { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { useDispatch } from 'react-redux';
import { login } from '../slices/authSlice';
import { useRouter } from "next/router";


const TestLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  const dispatch = useDispatch();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate email and password
    if (email === '' || password === '') {
      alert('Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      alert('Password should be at least 8 characters long');
      return;
    }

    // Send data to login API
    // Replace 'api/login' with the actual endpoint URL
    fetch('http://localhost:5001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        // Check if the response was successful
        if (!response.ok) {
          throw new Error('Login failed');
        }

        // Extract the JWT token from the response
        const token = response.headers.get('Authorization');
        // Extract the custom Role header from the response
        const role = response.headers.get('Role');

        // Dispatch the login action with the token and role
        dispatch(login({ token, role }));

        return response.json();
      })
      .then((data) => {
        // Handle the API response here
        console.log(data);
        // Redirect to another page after successful login
        router.push('/test/home');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Box height="100vh" display="flex" justifyContent="center" alignItems="center">
      <form onSubmit={handleSubmit}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          maxWidth={400}
          padding={2}
          boxShadow={1}
        >
          <TextField
            type="email"
            label="Email"
            value={email}
            onChange={handleEmailChange}
            required
            autoComplete="off"
            margin="normal"
          />
          <TextField
            type="password"
            label="Password"
            value={password}
            onChange={handlePasswordChange}
            required
            minLength={8}
            autoComplete="new-password"
            margin="normal"
          />
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default TestLogin;
