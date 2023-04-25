import { useState } from "react";
import BasicSection from "../components/BasicSection";
import BudgetSection from "../components/BudgetSection";
import TimelineSection from "../components/TimelineSection";
import {Box, Button} from "@mui/material";

function Submit() {
    const [formData, setFormData] = useState({
        projectTitle: '',
        selectedFields: [],
        abstract: '',
        budget: {},
        timeline: []
    });

    const [selectedFields, setSelectedFields] = useState([]);

    const handleSubmit = (event) => {
        event.preventDefault();
        // Send the form data to the backend
        console.log('Project data submitted:', formData); // just for testing purposes
        setFormData((prevFormData) => ({
            ...prevFormData,
            ...formData,
        }));
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

        if (name === "selectedFields") {
            setFormData((formData) => ({
                ...formData,
                [name]: value,
            }));
        } else {
            setFormData((formData) => ({
                ...formData,
                [name]: value,
            }));
        }
    };

    const handleFieldSelectionChange = (selectedFields) => {
        setFormData((formData) => ({
            ...formData,
            selectedFields: selectedFields
        }));
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <BasicSection
                    handleInputChange={handleInputChange}
                    handleFieldSelectionChange={handleFieldSelectionChange}
                    setFormData={setFormData}>
                </BasicSection>
                <BudgetSection handleInputChange={handleInputChange}></BudgetSection>
                <TimelineSection handleInputChange={handleInputChange}></TimelineSection>
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
    )
}

export default Submit
