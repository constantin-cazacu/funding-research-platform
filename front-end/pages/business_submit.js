import { useState } from "react";
import BasicSection from "../components/BasicSection";
import {Box, Button} from "@mui/material";

function BusinessProjectSubmit() {
    const [formData, setFormData] = useState({
        projectTitle: '',
        selectedFields: [],
        abstract: '',
        budget: '',
        objectives: ''
    });


    const handleSubmit = (event) => {
        event.preventDefault();
        // Send the form data to the backend
        console.log('Project data submitted:', formData); // just for testing purposes
        fetch('http://localhost:5000/business/submit_project', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(response => {
                console.log(response);
                // Handle response from the API
            })
            .catch(error => {
                console.error(error);
                // Handle error
            });
    };

    const handleInputChange = (event) => {
        const target = event.target;
        if (!target) {
            return;
        }
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        console.log(name, value); // add this line to check the values

        if (!name) {
            return;
        }
        setFormData((formData) => ({
            ...formData,
            [name]: value,
        }));
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <BasicSection
                    handleInputChange={handleInputChange}
                    setFormData={setFormData}>
                </BasicSection>
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    my: 3
                }}>
                    <Button type="submit" variant="contained" color="secondary">
                        Submit
                    </Button>
                </Box>

            </form>
        </>
    );
}

export default BusinessProjectSubmit