import React from 'react';
import {Card, CardContent, Typography, CardMedia, Chip, Box, Link} from '@mui/material';

const BusinessProjectCard = ({id, image, title, name, companyName, projectBudget, currency, fieldsOfStudy}) => {
    return (
        <Card sx={{maxWidth: 400}}>
            <CardMedia
                component="img"
                height="200"
                image={image}
                alt="Project Image"/>
            <CardContent>
                <Link href={`/business-project/${id}`} variant="h6" noWrap sx={{textDecoration: 'none', color: 'black' }}>
                    {title}
                </Link>
                <Typography variant="body2" color="text.secondary">
                    {name} / {companyName}
                </Typography>
                <Typography variant="h6" sx={{mt: 1}}>
                    Project Budget: {currency} {projectBudget}
                </Typography>
                <Box sx={{display: 'flex', gap: 1, marginTop: 1}}>
                    {fieldsOfStudy.map((field, index) => (
                        <Chip key={index} label={field} variant="outlined"/>
                    ))}
                </Box>
            </CardContent>
        </Card>
    );
};

export default BusinessProjectCard;
