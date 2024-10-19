import withAuth from '@/hooks/withAuth';

function Home() {
	return <div>Home page</div>;
}

export default withAuth(Home);
