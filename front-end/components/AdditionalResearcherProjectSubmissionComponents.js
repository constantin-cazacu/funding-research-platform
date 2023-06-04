import  React from 'react';
import { Box, Typography, TextField } from '@mui/material';

const ResearcherBasicSectionAdditions = ({ handleInputChange, setFormData}) => {
    const [fundingGoal, setFundingGoal] = React.useState('');
    const [coordinatorName, setCoordinatorName] = React.useState('');


    React.useEffect(() => {
        handleInputChange({ fundingGoal, coordinatorName });
    }, [ fundingGoal, coordinatorName, handleInputChange])

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography></Typography>
                <TextField
                    label="Funding Goal"
                    value={fundingGoal}
                    onChange={(event) => {
                        setFundingGoal(event.target.value);
                        handleInputChange(event);
                    }}
                    variant="outlined"
                    // multiline
                    // maxRows={10}
                    inputProps={{ maxLength: 50}}
                    name="fundingGoal"
                />

                <TextField
                    label="Coordinator Name"
                    value={coordinatorName}
                    onChange={(event) => {
                        setCoordinatorName(event.target.value);
                        handleInputChange(event);
                    }}
                    variant="outlined"
                    multiline
                    maxRows={50}
                    inputProps={{ maxLength: 2000}}
                    name="coordinatorName"
                />
            </Box>
        </Box>
    );
};

export default ResearcherBasicSectionAdditions;
