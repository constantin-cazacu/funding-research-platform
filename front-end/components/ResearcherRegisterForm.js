import { useState } from "react";
import { Box, TextField, Button, MenuItem } from "@mui/material";

const ResearcherRegisterForm = () => {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [orcid, setOrcid] = useState("");
    const [position, setPosition] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Do something with the form data
    };

    const isNameValid = name !== "";
    const isSurnameValid = surname !== "";
    const isEmailValid = /\S+@\S+\.\S+/.test(email);
    const isPasswordValid = password.length >= 8;
    const isOrcidValid = orcid.length === 16;

    const isFormValid =
        isNameValid && isSurnameValid && isEmailValid && isPasswordValid && isOrcidValid && position !== "";

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            height: '100vh',
            gap: '0.1em',
            bgcolor: '#F5F5F5',
            padding: '20px',
            borderRadius: '10px',
            minWidth: 'md',
            '& .MuiTextField-root': { m: 1, width: '32ch' }
        }}
        >
            <TextField
                required
                label="Name"
                variant="outlined"
                error={!isNameValid}
                helperText={!isNameValid && "Name is required"}
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <TextField
                required
                label="Surname"
                variant="outlined"
                error={!isSurnameValid}
                helperText={!isSurnameValid && "Surname is required"}
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
            />
            <TextField
                required
                label="Email"
                variant="outlined"
                error={!isEmailValid}
                helperText={!isEmailValid && "Invalid email address"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
                required
                label="Password"
                variant="outlined"
                type="password"
                error={!isPasswordValid}
                helperText={!isPasswordValid && "Password must be at least 8 characters long"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
                required
                label="ORCID"
                variant="outlined"
                error={!isOrcidValid}
                helperText={!isOrcidValid && "ORCID must be 16 digits long"}
                value={orcid}
                onChange={(e) => setOrcid(e.target.value)}
            />
            <TextField
                required
                label="Position"
                select
                variant="outlined"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
            >
                <MenuItem value="student">Student</MenuItem>
                <MenuItem value="supervisor">Supervisor</MenuItem>
            </TextField>
            <Button
                variant="contained"
                disabled={!isFormValid}
                onClick={handleSubmit}
            >
                Register
            </Button>
        </Box>
    );
};

export default ResearcherRegisterForm;
