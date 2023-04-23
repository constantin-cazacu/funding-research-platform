import React from 'react';
import { Card, CardHeader, CardMedia, CardContent, Typography } from '@mui/material';

const CustomCard = ({ image, title, description, requiredFunds }) => {
    return (
        <Card sx={{ maxWidth: 400 }}>
            <CardMedia
                component="img"
                height="194"
                image={image}
                alt={title}
            />
            <CardHeader
                title={title}
            />
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    {description}
                </Typography>
                <Typography variant="body2" color="secondary">
                    {`Required Funds: $${requiredFunds}`}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default CustomCard;



