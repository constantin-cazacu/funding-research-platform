import React from "react";
import Link from "next/link"
import {Box, Button, Typography} from "@mui/material";

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
                <Link href='/researcher/register'>
                        Researcher
                </Link>
            </Button>
            <Button variant="contained" color="secondary">
                <Link href='/business/register'>
                        Business
                </Link>
            </Button>
            <Button variant="contained" color="warning">
                <Link href='/supporter/register'>
                    Supporter
                </Link>
            </Button>
        </Box>
    );
};

export default RegisterButtons;
