import ResearcherProjectCard from '../components/ResearcherProjectCard';
import BusinessProjectCard from '../components/BusinessProjectCard'
import projectImage from '../public/bg-aperiodic-tilings.jpg';
import ResearcherProjectsGrid from "../components/ResearcherProjectsGrid";
import BusinessProjectsGrid from "../components/BusinessProjectsGrid";
import Navbar from "../components/Navbar";


function Home() {
    return (
        <>
            <Navbar></Navbar>
            <ResearcherProjectsGrid></ResearcherProjectsGrid>
            <BusinessProjectsGrid></BusinessProjectsGrid>
        </>

    )
}

export default Home