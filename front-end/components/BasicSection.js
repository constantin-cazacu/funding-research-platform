import React from 'react';
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

const BasicSection = () => {
    const [projectTitle, setProjectTitle] = React.useState('');
    const [fieldOfStudy, setFieldOfStudy] = React.useState([]);
    const [abstract, setAbstract] = React.useState('');

    const handleFieldOfStudyChange = (event) => {
        const selectedFields = event.target.value;
        setFieldOfStudy(selectedFields.slice(0, 2));
    };

    const handleAbstractChange = (event) => {
        setAbstract(event.target.value);
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h6" gutterBottom>
                Project Details
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                    label="Project Title"
                    value={projectTitle}
                    onChange={(event) => setProjectTitle(event.target.value)}
                    variant="outlined"
                    multiline
                    maxRows={4}
                    inputProps={{ maxLength: 600 }}
                />
                <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 2 }}>
                    {fieldOfStudies.map((field) => (
                        <FormControlLabel
                            key={field}
                            control={
                                <Checkbox
                                    checked={fieldOfStudy.includes(field)}
                                    onChange={handleFieldOfStudyChange}
                                    value={field}
                                />
                            }
                            label={field}
                        />
                    ))}
                </Box>
                <TextField
                    label="Abstract"
                    value={abstract}
                    onChange={handleAbstractChange}
                    variant="outlined"
                    multiline
                    maxRows={10}
                    inputProps={{ maxLength: 2000 }}
                />
            </Box>
        </Box>
    );
};

export default BasicSection;
