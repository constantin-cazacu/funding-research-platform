import ProjectSubmissionEntries from "../../components/ProjectSubmissionEntries";

function AdminPanel() {
    return (
        <>
            <ProjectSubmissionEntries></ProjectSubmissionEntries>
            <h1>My Grafana Dashboard</h1>
            <iframe
                src="http://localhost:3000/d/e7008b5c-f971-4c36-afea-e97c19f00536/admin-panel?orgId=1&from=1683810629264&to=1683821429264&viewPanel=6"
                width="100%"
                height="500px"
            />
        </>

    )
}

export default AdminPanel
