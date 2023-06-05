import { useState } from "react";
import BasicSection from "../../components/BasicSection";
import {Box, Button} from "@mui/material";
import BusinessBasicSectionAdditions from "../../components/BusinessBasicSectionAdditions";
import OfferedFundingInput from '../../components/OfferedFunds';
import OwnerMailField from '../../components/OwnerMailField';


function ProjectSubmit() {
    const [formData, setFormData] = useState({
        projectTitle: '',
        selectedFields: [],
        abstract: '',
        objectives: [],
        offeredFunds: '',
        currency: '',
        email: '',
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

        if (!name) {
            return;
        }

        if (name === 'selectedFields') {
            setFormData((formData) => ({
                ...formData,
                [name]: value,
            }));
        } else if (name === 'offeredFunds' || name === 'currency') {
            setFormData((formData) => ({
                ...formData,
                [name]: value,
            }));
        } else if (name === 'email') {
            setFormData((formData) => ({
                ...formData,
                email: value,
            }));
        } else if (name === 'objectives') {
            const objectives = value.filter((objective) => objective !== '');
            setFormData((formData) => ({
                ...formData,
                objectives: objectives,
            }));
        } else {
            setFormData((formData) => ({
                ...formData,
                [name]: value,
            }));
        }
    };


    return (
        <>
            <form onSubmit={handleSubmit}>
                <BasicSection
                    handleInputChange={handleInputChange}
                    setFormData={setFormData}>
                </BasicSection>
                <BusinessBasicSectionAdditions
                    handleInputChange={handleInputChange}
                    setFormData={setFormData}>
                </BusinessBasicSectionAdditions>
                <Box sx={{ my: 2 }}>
                    <OfferedFundingInput handleInputChange={handleInputChange} />
                </Box>
                <OwnerMailField
                    handleInputChange={handleInputChange} />
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

export default ProjectSubmit

