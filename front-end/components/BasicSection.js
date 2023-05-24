import  React from 'react';
import { Box, Typography, TextField, Checkbox, FormControlLabel } from '@mui/material';

const fieldOfStudies = [
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'Mathematics',
    'Engineering',
    'Psychology',
    'Sociology',
    'Economics',
    'Political Science',
    'History',
    'Geography',
    'Philosophy',
    'Literature',
    'Art',
];

const BasicSection = ({ handleInputChange, setFormData}) => {
    const [projectTitle, setProjectTitle] = React.useState('');
    const [selectedFields, setSelectedFields] = React.useState([]);
    const [abstract, setAbstract] = React.useState('');
    const [budget, setBudget] = React.useState('');
    const [objectives, setObjectives] = React.useState('');

    const handleFieldSelectionChange = (event) => {
        const { checked, name } = event.target ?? {};
        if (!name) return;

        let updatedFields = [];
        if (checked) {
            if (selectedFields.length >= 2) {
                // If we're trying to add a third field, don't do anything
                return;
            }
            updatedFields = [...selectedFields, name];
        } else {
            updatedFields = selectedFields.filter((field) => field !== name);
        }

        setSelectedFields(updatedFields);

        // Update the form data with the new selected fields
        setFormData((prevFormData) => ({
            ...prevFormData,
            selectedFields: updatedFields,
        }));
    };

    React.useEffect(() => {
        handleInputChange({ projectTitle, selectedFields, abstract, budget, objectives });
    }, [projectTitle, selectedFields, abstract, budget, objectives, handleInputChange])

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h6" gutterBottom>
                Project Details
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                    label="Project Title"
                    value={projectTitle}
                    onChange={(event) => {
                        setProjectTitle(event.target.value);
                        handleInputChange(event);
                    }}
                    variant="outlined"
                    multiline
                    maxRows={4}
                    inputProps={{ maxLength: 600 }}
                    name="projectTitle"
                />
                <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 2 }}>
                    {fieldOfStudies.map((field) => (
                        <FormControlLabel
                            key={field}
                            control={
                                <Checkbox
                                    checked={selectedFields.includes(field)}
                                    onChange={(event) => handleFieldSelectionChange(event)}
                                    name={field}
                                />
                            }
                            label={field}
                        />
                    ))}
                </Box>
                <TextField
                    label="Abstract"
                    value={abstract}
                    onChange={(event) => {
                        setAbstract(event.target.value);
                        handleInputChange(event);
                    }}
                    variant="outlined"
                    multiline
                    maxRows={10}
                    inputProps={{ maxLength: 2000 }}
                    name="abstract"
                />

                <TextField
                    label="Budget"
                    value={budget}
                    onChange={(event) => {
                        setBudget(event.target.value);
                        handleInputChange(event);
                    }}
                    variant="outlined"
                    // multiline
                    // maxRows={10}
                    inputProps={{ maxLength: 50}}
                    name="budget"
                />

                <TextField
                    label="Project Objectives"
                    value={objectives}
                    onChange={(event) => {
                        setObjectives(event.target.value);
                        handleInputChange(event);
                    }}
                    variant="outlined"
                    multiline
                    maxRows={50}
                    inputProps={{ maxLength: 2000}}
                    name="objectives"
                />
            </Box>

        </Box>
    );
};

export default BasicSection;
