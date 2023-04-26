import React, { useState, useEffect } from "react";
import { Box, Button, Typography, TextField } from "@mui/material";
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from "@mui/lab";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import  { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const TimelineSection = ({ onTimelineItemsChange }) => {
    const [timelineItems, setTimelineItems] = useState([]);

    const handleAddItem = () => {
        setTimelineItems([...timelineItems, { name: "", date: null }]);
    };

    const handleRemoveItem = (index) => {
        setTimelineItems(timelineItems.filter((_, i) => i !== index));
    };

    const handleItemNameChange = (event, index) => {
        const newItems = [...timelineItems];
        newItems[index].name = event.target.value;
        setTimelineItems(newItems);
    };

    const handleDateChange = (date, index) => {
        const newItems = [...timelineItems];
        newItems[index].date = date;
        setTimelineItems(newItems);
    };

    useEffect(() => {
        onTimelineItemsChange(timelineItems);
    }, [timelineItems]);

    return (
        <Box display="flex" alignItems="center" justifyContent="center">
            <Box>
                <Typography variant="h5">Timeline section</Typography>
                <Typography>Add here your planned project timeline</Typography>
                <Box display="flex" flexDirection="column">
                    {timelineItems.map((item, index) => (
                        <Box key={index} display="flex" alignItems="center" mb={2}>
                            <Box mr={2}>
                                <TextField
                                    type="text"
                                    placeholder="Name"
                                    label="Item Name"
                                    variant="outlined"
                                    value={item.name}
                                    onChange={(event) => handleItemNameChange(event, index)}
                                />
                            </Box>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    value={item.date}
                                    onChange={(date) => handleDateChange(date, index)}
                                    renderInput={(params) => <input {...params.inputProps} />}
                                />
                            </LocalizationProvider>
                            <Box ml={2}>
                                <Button variant="contained" color="secondary" onClick={() => handleRemoveItem(index)}>Remove</Button>
                            </Box>
                        </Box>
                    ))}
                    <Button variant="contained" color="primary" onClick={handleAddItem}>Add timeline item</Button>
                </Box>
            </Box>
            <Box ml={2}>
                <Timeline>
                    {timelineItems.map((item, index) => (
                        <TimelineItem key={index}>
                            <TimelineSeparator>
                                <TimelineDot />
                                {index !== timelineItems.length - 1 && <TimelineConnector />}
                            </TimelineSeparator>
                            <TimelineContent>
                                <Typography>{item.name}</Typography>
                                <Typography>{item.date?.toLocaleDateString()}</Typography>
                            </TimelineContent>
                        </TimelineItem>
                    ))}
                </Timeline>
            </Box>
        </Box>
    );
};

export default TimelineSection;
