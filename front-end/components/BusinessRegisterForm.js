import { useState } from "react";
import { useRouter } from "next/router";
import { Box, TextField, Button, MenuItem } from "@mui/material";

function BusinessRegisterForm() {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [company_name, setCompanyName] = useState("");
    const [company_idno, setCompanyIDNO] = useState("");

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
    const isCompanyIDValid = company_idno.length === 13;

    const isFormValid =
        isNameValid && isSurnameValid && isEmailValid && isPasswordValid && isCompanyNameValid && isCompanyIDValid !== "";

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
                label="Company name"
                variant="outlined"
                error={!isCompanyNameValid}
                helperText={!isCompanyNameValid && "Company name is required"}
                value={company_name}
                onChange={(e) => setCompanyName(e.target.value)}
            />
            <TextField
                required
                label="Company ID"
                variant="outlined"
                error={!isCompanyIDValid}
                helperText={!isCompanyIDValid && "ID must be 13 characters long"}
                value={company_idno}
                onChange={(e) => setCompanyIDNO(e.target.value)}
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
