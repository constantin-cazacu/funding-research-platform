import ResearcherProjectCard from '../components/ResearcherProjectCard';
import BusinessProjectCard from '../components/BusinessProjectCard'
import projectImage from '../public/bg-aperiodic-tilings.jpg';
import ResearcherProjectsGrid from "../components/ResearcherProjectsGrid";
import BusinessProjectsGrid from "../components/BusinessProjectsGrid";


function Home() {
    return (
        <>
            <ResearcherProjectCard
                image={projectImage.src}
                title={'Title1aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaafffffffffffffffffffffffffffffffffffbbbbbbbbbbbbbbbbbbbbbbbbbbbb'}
                student={'Stduent1'}
                supervisor={'Superisor1'}
                collectedFunds={'150'}
                fundingGoal={'2000'}
                currency={'USD'}
                fieldsOfStudy={['Math', 'Engineering']}>
            </ResearcherProjectCard>
            <BusinessProjectCard
                image={projectImage.src}
                title={'Title1aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaafffffffffffffffffffffffffffffffffffbbbbbbbbbbbbbbbbbbbbbbbbbbbb'}
                name={'BusuienssUser1'}
                companyName={'Company1'}
                projectBudget={'15000'}
                currency={'USD'}
                fieldsOfStudy={['Math', 'Engineering']}>
            </BusinessProjectCard>
            <ResearcherProjectsGrid></ResearcherProjectsGrid>
            <BusinessProjectsGrid></BusinessProjectsGrid>
        </>

    )
}

export default Home