import React, { useState } from "react";
import { useRouter } from "next/router";
import {Box, TextField, Button, MenuItem, Typography} from "@mui/material";

function BusinessRegisterForm() {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [company_name, setCompanyName] = useState("");
    const [company_idno, setCompanyIDNO] = useState("");    const [submitClicked, setSubmitClicked] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [nameError, setNameError] = useState(false);
    const [companyNameError, setCompanyNameError] = useState(false);
    const [companyIDNOError, setCompanyIDNOError] = useState(false);
    const [formattedIDNO, setFormattedIDNO] = useState("");
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
        // Do something with the form data
        const formData = {
            name: name,
            surname: surname,
            email: email,
            password: password,
            company_name: company_name,
            company_idno: company_idno
        };

        const jsonFormData = JSON.stringify(formData);

        // send the jsonFormData to the API using the fetch() method
        const url = 'http://localhost:5001/business/register';
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
    const isCompanyNameValid = company_name !== ""
    const isCompanyIDNOValid = company_idno.length === 13;

    const isFormValid =
        isNameValid && isSurnameValid && isEmailValid && isPasswordValid && isCompanyNameValid && isCompanyIDNOValid !== "";

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
                Juridical User Registration
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
            <TextField
                required
                label="Company name"
                variant="outlined"
                error={companyNameError || (submitClicked && !isCompanyNameValid)}
                helperText={(companyNameError || submitClicked) && !isCompanyNameValid && "Company name is required"}
                value={company_name}
                onChange={(e) => {
                  setCompanyName(e.target.value);
                  setCompanyNameError(e.target.value.trim().length === 0);
                }}
                onBlur={() => setCompanyNameError(company_name.trim().length === 0)}
                InputProps={{
                  placeholder: "Enter the company name"
                }}
                sx={{
                  ...(companyNameError && { borderColor: 'red' }) // Apply red border color when there is an error
                }}
            />
            <TextField
                required
                label="Company IDNO"
                variant="outlined"
                error={companyIDNOError || (submitClicked && !isCompanyIDNOValid)}
                helperText={(companyIDNOError || submitClicked) && !isCompanyIDNOValid && "IDNO must be 13 digits long"}
                value={formattedIDNO}
                onChange={(e) => {
                    const inputValue = e.target.value.replace(/[^0-9]/g, "").slice(0, 13); // Remove non-numeric characters
                    let formattedValue = inputValue;


                    setCompanyIDNO(inputValue);
                    setFormattedIDNO(formattedValue);
                }}
                onBlur={() => setCompanyIDNOError(company_idno.trim().length !== 13)}
                InputProps={{
                placeholder: "Enter company's IDNO"
                }}
                sx={{
                ...(companyIDNOError && { borderColor: 'red' }) // Apply red border color when there is an error
                }}

            >
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
}

export default BusinessRegisterForm;
