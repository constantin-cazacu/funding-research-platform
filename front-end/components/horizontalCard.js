import React from 'react';
import { Card, CardHeader, CardMedia, CardContent, Typography, Box } from '@mui/material';

const HorizontalCard = ({ image, title, requiredFunds }) => {
    return (
        <Card sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', maxWidth: 500 }}>
            <CardMedia
                component="img"
                sx={{ width: 150 }}
                image={image}
                alt={title}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <CardContent sx={{ pt: 0 }}>
                    <CardHeader
                        sx={{ pb: 0 }}
                        title={title}
                    />
                    <Typography variant="body2" color="secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '5px' }}>{`$${requiredFunds}`}</span>
                        Required Funds
                    </Typography>
                </CardContent>
            </Box>
        </Card>
    );
};

export default HorizontalCard;
