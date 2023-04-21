import React, { useState } from "react";
import { Button, Grid } from "@mui/material";
import CustomCard from "./CustomCard";

const CardCarousel = ({ data }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => {
        setCurrentIndex((currentIndex - 1 + data.length) % data.length);
    };

    const handleNext = () => {
        setCurrentIndex((currentIndex + 1) % data.length);
    };

    return (
        <Grid container direction="column" alignItems="center">
            <Grid item>
                <CustomCard data={data[currentIndex]} />
            </Grid>
            <Grid item>
                <Button onClick={handlePrev}>{"<"}</Button>
                {data.map((_, index) => (
                    <span
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        style={{
                            height: "12px",
                            width: "12px",
                            borderRadius: "50%",
                            backgroundColor: index === currentIndex ? "black" : "white",
                            display: "inline-block",
                            margin: "0 8px",
                            cursor: "pointer"
                        }}
                    />
                ))}
                <Button onClick={handleNext}>{">"}</Button>
            </Grid>
        </Grid>
    );
};

export default CardCarousel;
