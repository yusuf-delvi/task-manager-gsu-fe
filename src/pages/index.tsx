import withAuth from '@/hoc/withAuth';

function Home() {
	return <div>Home page</div>;
}

export default withAuth(Home);
