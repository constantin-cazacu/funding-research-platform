import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField } from '@mui/material';

const CoOwnerMailField = ({ handleInputChange }) => {
  const [supervisorEmail, setSupervisorEmail] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [supervisorEmailError, setSupervisorEmailError] = useState(false);
  const [studentEmailError, setStudentEmailError] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(false);
  const isSupervisorEmailValid = /\S+@\S+\.\S+/.test(supervisorEmail);
  const isStudentEmailValid = /\S+@\S+\.\S+/.test(studentEmail);

  const handleBlur = () => {
    setSupervisorEmailError(!/\S+@\S+\.\S+/.test(supervisorEmail));
    setStudentEmailError(!/\S+@\S+\.\S+/.test(studentEmail));
  };

  useEffect(() => {
    handleInputChange({ target: { name: 'supervisorEmail', value: supervisorEmail } });
    handleInputChange({ target: { name: 'studentEmail', value: studentEmail } });
  }, [supervisorEmail, studentEmail, handleInputChange]);


  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h5" gutterBottom sx={{mt:2}}>Contact Info</Typography>
        <TextField
          required
          label="Supervisor Email"
          variant="outlined"
          error={supervisorEmailError || (submitClicked && !isSupervisorEmailValid)}
          helperText={(supervisorEmailError || submitClicked) && !isSupervisorEmailValid && 'Invalid email address'}
          value={supervisorEmail}
          onChange={(e) => {
            setSupervisorEmail(e.target.value);
            setSupervisorEmailError(!/\S+@\S+\.\S+/.test(e.target.value));
          }}
          onBlur={handleBlur}
          InputProps={{
            placeholder: 'example@example.com',
          }}
        />

        <TextField
          required
          label="Student Email"
          variant="outlined"
          error={studentEmailError || (submitClicked && !isStudentEmailValid)}
          helperText={(studentEmailError || submitClicked) && !isStudentEmailValid && 'Invalid email address'}
          value={studentEmail}
          onChange={(e) => {
            setStudentEmail(e.target.value);
            setStudentEmailError(!/\S+@\S+\.\S+/.test(e.target.value));
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

export default CoOwnerMailField;
