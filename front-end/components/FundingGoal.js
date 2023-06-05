import React, { useState } from 'react';
import {TextField, Select, MenuItem, InputLabel, FormControl, Box, Typography} from '@mui/material';

const FundingGoalInput = ({handleInputChange}) => {
  const [fundingGoal, setFundingGoal] = useState('');
  const [currency, setCurrency] = useState('');

  const handleFundingGoalChange = (event) => {
    const value = event.target.value;
    const regex = /^\d*$/; // Regular expression for integers only

    if (regex.test(value) || value === '') {
      setFundingGoal(value);
    }
  };

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  };

  React.useEffect(() => {
        handleInputChange({ fundingGoal, currency});
    }, [fundingGoal, currency, handleInputChange])


  return (
      <Box sx={{ maxWidth: 600, mx: 'auto' }}>
        <Box sx={{ display: 'flex', flexDirection: 'raw', gap: 2 }}>
            <TextField
            type="number"
            label="Funding Goal"
            value={fundingGoal}
            // onChange={handleFundingGoalChange}
            onChange={(event) => {
                handleFundingGoalChange(event);
                // handleInputChange(event);
            }}
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
                // onChange={handleCurrencyChange}
                onChange={(event) => {
                    handleCurrencyChange(event);
                    // handleInputChange(event);
                }}
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
