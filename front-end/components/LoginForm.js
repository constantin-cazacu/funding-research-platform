import React, { useState, useEffect } from 'react';
import {Box, Button, TextField, Typography} from '@mui/material';
import { useRouter } from "next/router";
import { useDispatch } from 'react-redux';
import { login } from '../slices/authSlice';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [passwordError, setPasswordError] = useState(false);


  const isEmailValid = /\S+@\S+\.\S+/.test(email);


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

    (async () => {
    try {
      // Send data to login API
      // Replace 'api/login' with the actual endpoint URL
      const response = await fetch('http://localhost:5001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

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

      const data = await response.json();
      // Handle the API response here
      console.log('data:', data);
      console.log('Role:', role);
      await router.push('/');

    } catch (error) {
      console.error(error);
    }
    })();
  };

  return (
      <form onSubmit={handleSubmit}>
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            gap: '0.1em',
            bgcolor: '#F5F5F5',
            padding: '20px',
            borderRadius: '10px',
            minWidth: 'md',
            '& .MuiTextField-root': { m: 1, width: '32ch' }
        }}
        >
          <Typography variant="h6" gutterBottom>
             Login
          </Typography>
          <TextField
            required
            label="Email"
            variant="outlined"
            error={emailError || (submitClicked && !isEmailValid)}
            helperText={(emailError || submitClicked) && !isEmailValid && "Invalid email address"}
            value={email}
            onChange={(e) => {
            setEmail(e.target.value);
            setEmailError(!/\S+@\S+\.\S+/.test(e.target.value));
            }}
            onBlur={() => setEmailError(!/\S+@\S+\.\S+/.test(email))}
          />
          <TextField
            required
            label="Password"
            variant="outlined"
            type="password"
            error={passwordError || (submitClicked)}
            helperText={(passwordError || submitClicked) }
            value={password}
            onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(e.target.value.length < 8);
              }}
            onBlur={() => setPasswordError(password.length < 8)}
          />
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </Box>
      </form>
  );
};

export default LoginForm;
