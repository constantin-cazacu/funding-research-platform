import  React from 'react';
import { Box, Typography, TextField } from '@mui/material';

const BusinessBasicSectionAdditions = ({ handleInputChange, setFormData}) => {
    const [budget, setBudget] = React.useState('');
    const [objectives, setObjectives] = React.useState('');


    React.useEffect(() => {
        handleInputChange({ budget, objectives });
    }, [ budget, objectives, handleInputChange])

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h6" gutterBottom>
                Project Details
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                    label="Budget"
                    value={budget}
                    onChange={(event) => {
                        setBudget(event.target.value);
                        handleInputChange(event);
                    }}
                    variant="outlined"
                    // multiline
                    // maxRows={10}
                    inputProps={{ maxLength: 50}}
                    name="budget"
                />

                <TextField
                    label="Project Objectives"
                    value={objectives}
                    onChange={(event) => {
                        setObjectives(event.target.value);
                        handleInputChange(event);
                    }}
                    variant="outlined"
                    multiline
                    maxRows={50}
                    inputProps={{ maxLength: 2000}}
                    name="objectives"
                />
            </Box>

        </Box>
    );
};

export default BusinessBasicSectionAdditions;
