import { useRouter } from 'next/router';
import ProjectPage from '../../components/ProjectPage';

const ProjectDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return <ProjectPage projectId={id} />;
};

export default ProjectDetailsPage;
