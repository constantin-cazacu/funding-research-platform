import React from 'react';
import { Card, CardContent, Typography, CardMedia, Chip, Box, Link } from '@mui/material';
import FundingProgress from './FundingProgress';

const ResearcherProjectCard = ({ id, image, title, student, supervisor, collectedFunds, fundingGoal, currency, fieldsOfStudy }) => {
    // console.log(fieldsOfStudy)
    return (
    <Card sx={{ maxWidth: 400 }}>
      <CardMedia
        component="img"
        height="200"
        image={image}
        alt="Project Image"
      />
      <CardContent>
        <Link href={`/researcher-project/${id}`} variant="h6" noWrap sx={{textDecoration: 'none', color: 'black' }}>
          {title}
        </Link>
        <Typography variant="body2" color="text.secondary">
          {student} / {supervisor}
        </Typography>
        <FundingProgress collected_funds={collectedFunds} funding_goal={fundingGoal} currency={currency}/>
        <Box sx={{ display: 'flex', gap: 1, marginTop: 1 }}>
          {fieldsOfStudy.map((field, index) => (
            <Chip key={index} label={field} variant="outlined" />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ResearcherProjectCard;