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
        budgetItems: {},
        timelineItems: []
    });

    const [selectedFields, setSelectedFields] = useState([]);

    const handleSubmit = (event) => {
        event.preventDefault();
        // Send the form data to the backend
        console.log('Project data submitted:', formData); // just for testing purposes
        // Check if budget is empty
        if (Object.keys(formData.budgetItems).length === 0) {
            console.log('Budget is empty');
        } else {
            console.log('Budget is not empty');
        }
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
        } else if (name === "budgetItems") {
            const updatedBudgetItems = { ...formData.budgetItems };
            updatedBudgetItems[target.id][target.name] = value;
            setFormData((formData) => ({
                ...formData,
                budgetItems: updatedBudgetItems,
            }));
            handleBudgetChange(updatedBudgetItems);
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

    const handleBudgetChange = (newBudgetItems) => {
        setFormData((formData) => ({
            ...formData,
            budgetItems: newBudgetItems,
        }));
    };

    const handleTimelineItemsChange = (timelineItems) => {
        setFormData((formData) => ({
            ...formData,
            timelineItems: timelineItems
        }));
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <BasicSection
                    handleInputChange={handleInputChange}
                    handleFieldSelectionChange={handleFieldSelectionChange}
                    setFormData={setFormData}>
                </BasicSection>
                <BudgetSection handleInputChange={handleInputChange}
                               handleBudgetChange={handleBudgetChange}
                               formData={formData}
                               setFormData={setFormData}>
                </BudgetSection>
                <TimelineSection handleInputChange={handleInputChange}
                                 onTimelineItemsChange={handleTimelineItemsChange}>

                </TimelineSection>
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
