import React from 'react';
import { Box, Grid } from '@mui/material';
import CustomCard from './CustomCard';
import HorizontalCard from './HorizontalCard';

const CardLayout = () => {
    return (
        <Box sx={{ width: '70%', margin: '0 auto' }}>
            <Grid container spacing={3}>
                <Grid item xs={8} sx={{ width: '100%' }}>
                    <CustomCard
                        image="https://example.com/big-image.jpg"
                        title="Big Card"
                        description="This is a big card that occupies half the space"
                        requiredFunds={5000}
                    />
                </Grid>
                <Grid item xs={4}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <HorizontalCard
                                image="https://example.com/image1.jpg"
                                title="Example Card 1"
                                requiredFunds={5000}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <HorizontalCard
                                image="https://example.com/image2.jpg"
                                title="Example Card 2"
                                requiredFunds={10000}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <HorizontalCard
                                image="https://example.com/image3.jpg"
                                title="Example Card 3"
                                requiredFunds={15000}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};

export default CardLayout;
