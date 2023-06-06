import React, { useState } from 'react';
import { Box, Typography, TextField, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const BusinessBasicSectionAdditions = ({ handleInputChange }) => {
  const [objectives, setObjectives] = useState(['']);

  const handleObjectiveChange = (index, event) => {
    const newObjectives = [...objectives];
    newObjectives[index] = event.target.value;
    setObjectives(newObjectives);
    handleInputChange({ target: { name: 'objectives', value: newObjectives } });
  };

  const addObjective = () => {
    const newObjectives = [...objectives, ''];
    setObjectives(newObjectives);
  };

  const removeObjective = (index) => {
    const newObjectives = [...objectives];
    newObjectives.splice(index, 1);
    setObjectives(newObjectives);
    handleInputChange({ target: { name: 'objectives', value: newObjectives } });
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Project Objectives
      </Typography>
      {objectives.map((objective, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField sx={{ my: 0.5 }}
            label={`Objective ${index + 1}`}
            value={objective}
            onChange={(event) => handleObjectiveChange(index, event)}
            variant="outlined"
            multiline
            maxRows={50}
            inputProps={{ maxLength: 2000 }}
            name={`objectives-${index}`}
          />
          {index > 0 && (
            <IconButton
              aria-label="Delete Objective"
              onClick={() => removeObjective(index)}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
      ))}
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', my: 1 }}>
        <Button variant="contained" onClick={addObjective}>
          Add Objective
        </Button>
      </Box>
    </Box>
  );
};

export default BusinessBasicSectionAdditions;
