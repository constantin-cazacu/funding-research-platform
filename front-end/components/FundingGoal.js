// FundingGoalInput component
import React, { useState } from 'react';
import { TextField, Select, MenuItem, InputLabel, FormControl, Box, Typography } from '@mui/material';

const FundingGoalInput = ({ handleInputChange }) => {
  const [fundingGoal, setFundingGoal] = useState('');
  const [currency, setCurrency] = useState('');

  const handleFundingGoalChange = (event) => {
    const value = event.target.value;
    const regex = /^\d*$/; // Regular expression for integers only

    if (regex.test(value) || value === '') {
      setFundingGoal(value);
      handleInputChange({ target: { name: 'fundingGoal', value } }); // Invoke the handleInputChange with the updated value
    }
  };

  const handleCurrencyChange = (event) => {
    const value = event.target.value;
    setCurrency(value);
    handleInputChange({ target: { name: 'currency', value } }); // Invoke the handleInputChange with the updated value
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
        <TextField
          type="number"
          label="Funding Goal"
          value={fundingGoal}
          onChange={handleFundingGoalChange}
          InputProps={{
            inputMode: 'numeric',
            pattern: '\\d*', // Pattern for integers only
            min: 0,
          }}
        />

        <FormControl>
          <InputLabel>Currency</InputLabel>

          <Select
            label="Currency"
            value={currency}
            onChange={handleCurrencyChange}
            style={{ minWidth: 200 }}
          >
            <MenuItem value="USD">USD</MenuItem>
            <MenuItem value="EUR">EUR</MenuItem>
            <MenuItem value="MDL">MDL</MenuItem>
            <MenuItem value="GBP">GBP</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default FundingGoalInput;
