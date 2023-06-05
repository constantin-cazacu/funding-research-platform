import { useRouter } from 'next/router';
import BusinessProjectPage from '../../components/BusinessProjectPage';

const BusinessProjectDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return <BusinessProjectPage projectId={id} />;
};

export default BusinessProjectDetailsPage;