import React, { useState } from "react";
import { Box, Button, Typography, TextField } from "@mui/material";
import { VictoryPie } from "victory";

const BudgetSection = ({ handleInputChange, formData, handleBudgetChange  }) => {
    const [budgetItems, setBudgetItems] = useState([{ id: 0, name: "", sum: "" }]);

    const handleAddItem = () => {
        const newId = budgetItems[budgetItems.length - 1].id + 1;
        const newBudgetItems = [...budgetItems, { id: newId, name: "", sum: "" }];
        setBudgetItems(newBudgetItems);
        handleBudgetChange(newBudgetItems);
    };

    const handleRemoveItem = (id) => {
        const newItems = budgetItems.filter((item) => item.id !== id);
        setBudgetItems(newItems);
        handleBudgetChange(newItems);
    };

    const handleChange = (event, id) => {
        const { name, value } = event.target;
        const newItems = budgetItems.map((item) => {
            if (item.id === id) {
                return { ...item, [name]: value };
            }
            return item;
        });
        setBudgetItems(newItems);
        handleBudgetChange(newItems);
    };

    const data = budgetItems
        .filter((item) => item.name && item.sum)
        .map((item) => ({ x: item.name, y: parseFloat(item.sum) }));

    return (
        <Box sx={{ display: "flex", justifyContent: "center"}}>
            <Box sx={{ maxWidth: "600px", width: "100%" }}>
                <Typography variant="h5" sx={{ mt: 2 }}>
                    Budget section
                </Typography>
                <Typography variant="subtitle1" sx={{ mt: 1 }}>
                    Add here your planned expenses
                </Typography>
                {budgetItems.map((item, index) => (
                    <Box
                        key={index}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            my: 1,
                        }}
                    >
                        <TextField
                            name="name"
                            label="Item Name"
                            variant="outlined"
                            size="small"
                            value={item.name}
                            onChange={(event) => handleChange(event, index)}
                        />
                        <TextField
                            name="sum"
                            label="Sum"
                            variant="outlined"
                            size="small"
                            value={item.sum}
                            onChange={(event) => handleChange(event, index)}
                        />
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleRemoveItem(item.id)}
                        >
                            Remove
                        </Button>
                    </Box>
                ))}
                <Button variant="contained" onClick={handleAddItem}>
                    Add Budget Item
                </Button>
                {data.length > 0 && (
                    <Box sx={{ mt: 4 }}>
                        <VictoryPie data={data} />
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default BudgetSection;
