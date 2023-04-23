import React, { useState } from "react";
import { Box, Button, Typography, TextField } from "@mui/material";
import { VictoryPie } from "victory";

const BudgetSection = () => {
    const [budgetItems, setBudgetItems] = useState([{ name: "", sum: "" }]);

    const handleAddItem = () => {
        setBudgetItems([...budgetItems, { name: "", sum: "" }]);
    };

    const handleRemoveItem = (index) => {
        const newItems = [...budgetItems];
        newItems.splice(index, 1);
        setBudgetItems(newItems);
    };

    const handleChange = (event, index) => {
        const { name, value } = event.target;
        const newItems = [...budgetItems];
        newItems[index][name] = value;
        setBudgetItems(newItems);
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
                            onClick={() => handleRemoveItem(index)}
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
