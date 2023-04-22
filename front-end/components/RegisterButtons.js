import React from "react";
import { Box, Button } from "@mui/material";

const RegisterButtons = () => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
            }}
        >
            <Button variant="contained" color="primary">
                Researcher
            </Button>
            <Box sx={{ my: 2 }}>
                <Button variant="contained" color="secondary">
                    Business
                </Button>
            </Box>
            <Button variant="contained" color="warning">
                Supporter
            </Button>
        </Box>
    );
};

export default RegisterButtons;
