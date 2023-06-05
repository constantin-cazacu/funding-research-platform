import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField } from '@mui/material';

const OwnerMailField = ({ handleInputChange }) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(false);
  const isEmailValid = /\S+@\S+\.\S+/.test(email);

  const handleBlur = () => {
    setEmailError(!/\S+@\S+\.\S+/.test(email));
  };

  useEffect(() => {
    handleInputChange({ target: { name: 'email', value: email } });
  }, [email, handleInputChange]);


  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h5" gutterBottom>Contact Info</Typography>

        <TextField
          required
          label="Email"
          variant="outlined"
          error={emailError || (submitClicked && !isEmailValid)}
          helperText={(emailError || submitClicked) && !isEmailValid && 'Invalid email address'}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError(!/\S+@\S+\.\S+/.test(e.target.value));
          }}
          onBlur={handleBlur}
          InputProps={{
            placeholder: 'example@example.com',
          }}
        />
      </Box>
    </Box>
  );
};

export default OwnerMailField;
