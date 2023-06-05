import React, {useState} from 'react';
import { Box, Typography, TextField } from '@mui/material';
import FundingGoal from "./FundingGoal";

const ResearcherBasicSectionAdditions = ({ handleInputChange, setFormData}) => {
    const [fundingGoal, setFundingGoal] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [emailError, setEmailError] = useState(false);
    const [submitClicked, setSubmitClicked] = useState(false);
    const isEmailValid = /\S+@\S+\.\S+/.test(email);


    React.useEffect(() => {
        handleInputChange({ fundingGoal, email });
    }, [ fundingGoal, email, handleInputChange])

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography></Typography>

                <TextField
                    required
                    label="Supervisor/Student Email"
                    variant="outlined"
                    error={emailError || (submitClicked && !isEmailValid)}
                    helperText={(emailError || submitClicked) && !isEmailValid && "Invalid email address"}
                    value={email}
                    onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError(!/\S+@\S+\.\S+/.test(e.target.value));
                    }}
                    onBlur={() => setEmailError(!/\S+@\S+\.\S+/.test(email))}
                    InputProps={{
                      placeholder: "example@example.com"
                    }}
                />
            </Box>
        </Box>
    );
};

export default ResearcherBasicSectionAdditions;
