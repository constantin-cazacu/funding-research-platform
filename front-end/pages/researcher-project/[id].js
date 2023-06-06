import { useRouter } from 'next/router';
import ResearcherProjectPage from '../../components/ResearcherProjectPage';

const ProjectDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return <ResearcherProjectPage projectId={id} />;
};

export default ProjectDetailsPage;
