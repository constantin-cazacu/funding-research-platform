import React, { useState, useEffect } from 'react';
import {Box, Grid, Button, TextField, Typography} from '@mui/material';
import { useRouter } from "next/router";

const MetricsDashboard = () => {



    return (
        <Box display="flex" justifyContent="center" alignItems="center">
            {/*<h1>My Grafana Dashboard</h1>*/}
            {/*<iframe*/}
            {/*    src="http://localhost:3000/d/e7008b5c-f971-4c36-afea-e97c19f00536/admin-panel?orgId=1&from=1683810629264&to=1683821429264&viewPanel=6"*/}
            {/*    width="100%"*/}
            {/*    height="500px"*/}
            {/*/>*/}
            {/*<h1>Grafana Service Metrics</h1>*/}

             <Grid display="flex" justifyContent="center" alignItems="center" container spacing={2}>
                 <h1>Grafana Service Metrics</h1>

                {/* First Row: Service Availability */}
                <Grid display="flex" justifyContent="center" alignItems="center" item xs={12}>
                    <Grid item xs={4}>
                        <iframe
                        src="http://localhost:3000/d-solo/e7008b5c-f971-4c36-afea-e97c19f00536/admin-panel?orgId=1&refresh=5m&theme=light&panelId=1"
                        width="450" height="200" frameBorder="0"></iframe>
                    </Grid>
                    <Grid item xs={4}>
                     <iframe
                         src="http://localhost:3000/d-solo/e7008b5c-f971-4c36-afea-e97c19f00536/admin-panel?orgId=1&from=1686097004081&to=1686140204081&refresh=10s&theme=light&panelId=2"
                         width="450" height="200" frameBorder="0"></iframe>
                </Grid>
                </Grid>

                {/* Second Row: User Metrics */}
                <Grid item xs={4}>
                    <iframe
                        src="http://localhost:3000/d-solo/e7008b5c-f971-4c36-afea-e97c19f00536/admin-panel?orgId=1&refresh=5m&theme=light&panelId=5"
                        width="450" height="200" frameBorder="0"></iframe>
                </Grid>

                <Grid item xs={4}>
                    <iframe
                        src="http://localhost:3000/d-solo/e7008b5c-f971-4c36-afea-e97c19f00536/admin-panel?orgId=1&refresh=5m&theme=light&panelId=3"
                        width="450" height="200" frameBorder="0"></iframe>
                </Grid>

                <Grid item xs={4}>
                    <iframe
                        src="http://localhost:3000/d-solo/e7008b5c-f971-4c36-afea-e97c19f00536/admin-panel?orgId=1&refresh=5m&theme=light&panelId=4"
                        width="450" height="200" frameBorder="0"></iframe>
                </Grid>

                 <Grid item xs={4}>
                     <iframe
                         src="http://localhost:3000/d-solo/e7008b5c-f971-4c36-afea-e97c19f00536/admin-panel?orgId=1&refresh=10s&theme=light&panelId=6"
                         width="450" height="200" frameBorder="0"></iframe>
                </Grid>
                 <Grid item xs={4}>
                     <iframe
                         src="http://localhost:3000/d-solo/e7008b5c-f971-4c36-afea-e97c19f00536/admin-panel?orgId=1&refresh=10s&theme=light&panelId=7"
                         width="450" height="200" frameBorder="0"></iframe>
                </Grid>
                 <Grid item xs={4}>
                     <iframe
                         src="http://localhost:3000/d-solo/e7008b5c-f971-4c36-afea-e97c19f00536/admin-panel?orgId=1&refresh=10s&theme=light&panelId=8"
                         width="450" height="200" frameBorder="0"></iframe>
                </Grid>
              </Grid>

        </Box>
    )

};

export default MetricsDashboard