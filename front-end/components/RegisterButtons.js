import React from "react";
import {Box, Button, Typography, Link} from "@mui/material";

const RegisterButtons = () => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                gap: "1em"
            }}
        >
            <Typography variant="h6" gutterBottom>
                Choose Your User Type
            </Typography>
            <Button variant="contained" color="primary">
                <Link href={'/researcher/register'} sx={{textDecoration: 'none', color: 'white'}}>
                    Researcher
                </Link>
            </Button>
            <Button variant="contained" color="secondary">
                <Link href={'/business/register'} sx={{textDecoration: 'none', color: 'white'}}>
                        Business
                </Link>
            </Button>
            <Button variant="contained" color="warning">
                <Link href={'/supporter/register'} sx={{textDecoration: 'none', color: 'white'}}>
                    Supporter
                </Link>
            </Button>
        </Box>
    );
};

export default RegisterButtons;
