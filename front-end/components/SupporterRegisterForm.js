import React, { useState } from "react";
import { useRouter } from "next/router";
import {Box, TextField, Button, MenuItem, Typography} from "@mui/material";

function ResearcherRegisterForm() {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [orcid, setOrcid] = useState("");
    const [position, setPosition] = useState("");
    const [submitClicked, setSubmitClicked] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [nameError, setNameError] = useState(false);
    const [surnameError, setSurnameError] = useState(false);

    const router = useRouter();

    async function postData(url = '', data = {}) {
        const response = await fetch(url, {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        });
        console.log(response)
        return response.json(); // parses JSON response into native JavaScript objects
    }

    const handleSubmit = (e) => {
        e.preventDefault();
          setSubmitClicked(true);
        // Do something with the form data
        const formData = {
            name: name,
            surname: surname,
            email: email,
            password: password,
        };

        const jsonFormData = JSON.stringify(formData);

        // send the jsonFormData to the API using the fetch() method
        const url = 'http://localhost:5001/supporter/register';
        postData(url, jsonFormData)
            .then(jsonFormData => {
                console.log(jsonFormData); // JSON data from response
                router.push('/login');
            })
            .catch(error => {
                console.error(error);
            });
    };

    const isNameValid = name !== "";
    const isSurnameValid = surname !== "";
    const isEmailValid = /\S+@\S+\.\S+/.test(email);
    const isPasswordValid = password.length >= 8;
    const isFormValid =
        isNameValid && isSurnameValid && isEmailValid && isPasswordValid !== "";

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            gap: '0.1em',
            bgcolor: '#F5F5F5',
            padding: '20px',
            borderRadius: '10px',
            minWidth: 'md',
            '& .MuiTextField-root': { m: 1, width: '32ch' }
        }}
        >
            <Typography variant="h6" gutterBottom>
                Supporter Registration
            </Typography>
            <TextField
                required
                label="Name"
                variant="outlined"
                error={nameError || (submitClicked && !isNameValid)}
                helperText={(nameError || submitClicked) && !isNameValid && "Name is required"}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setNameError(e.target.value.trim().length === 0);
                }}
                onBlur={() => setNameError(name.trim().length === 0)}
                InputProps={{
                  placeholder: "Enter your name"
                }}
                sx={{
                  ...(nameError && { borderColor: 'red' }) // Apply red border color when there is an error
                }}
            />
            <TextField
                required
                label="Surname"
                variant="outlined"
                error={surnameError || (submitClicked && !isSurnameValid)}
                helperText={(surnameError || submitClicked) && !isSurnameValid && "Surname is required"}
                value={surname}
                onChange={(e) => {
                setSurname(e.target.value);
                setSurnameError(e.target.value.trim().length === 0);
                }}
                onBlur={() => setSurnameError(surname.trim().length === 0)}
                InputProps={{
                placeholder: "Enter your surname"
                }}
                sx={{
                ...(surnameError && { borderColor: 'red' }) // Apply red border color when there is an error
                }}
            />
            <TextField
                required
                label="Email"
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
            <TextField
                required
                label="Password"
                variant="outlined"
                type="password"
                error={passwordError || (submitClicked && !isPasswordValid)}
                helperText={(passwordError || submitClicked) && !isPasswordValid && "Password must be at least 8 characters long"}
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError(e.target.value.length < 8);
                  }}
                onBlur={() => setPasswordError(password.length < 8)}
                InputProps={{
                placeholder: "Enter your password"
                }}
            />


            <Button
                variant="contained"
                disabled={!isFormValid}
                onClick={handleSubmit}
            >
                Register
            </Button>
        </Box>
    );
}

export default ResearcherRegisterForm;
