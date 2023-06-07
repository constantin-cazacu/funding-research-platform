import ProjectSubmissionEntries from "../../components/ProjectSubmissionEntries";
import AdminProjectResearcherTable from "../../components/AdminProjectResearcherTable";
import AdminProjectBusinessTable from "../../components/AdminProjectBusinessTable";
import MetricsDashboard from "../../components/MetricsDashboard"
import {Box, Grid} from "@mui/material";
import React from "react";

function AdminPanel() {
    return (
        <>
            <Box display="flex" justifyContent="center" alignItems="center">
                <Grid display="flex" justifyContent="center" alignItems="center" container spacing={2}>

                    <Grid item xs={12}>
                        <h2 style={{ textAlign: 'center' }}>Researcher Pending Projects</h2>
                        <AdminProjectResearcherTable></AdminProjectResearcherTable>
                    </Grid>

                    <Grid item xs={12}>
                        <h2 style={{ textAlign: 'center' }} >Business Pending Projects</h2>

                        <AdminProjectBusinessTable></AdminProjectBusinessTable>
                    </Grid>
                </Grid>
            </Box>
            <MetricsDashboard></MetricsDashboard>
        </>

    )
}

export default AdminPanel
