import { useAuth } from '@/context/AuthContext';
import withAuth from '@/hoc/withAuth';

function Home() {
	const { removeJWTToken } = useAuth();

	return (
		<>
			<header className='shadow flex items-center justify-between px-9 py-2'>
				<h1 className='text-xl font-semibold'>Tasks</h1>
				<button
					onClick={() => removeJWTToken()}
					className='text-white bg-violet-900 hover:bg-violet-950 px-3 py-1 rounded'
				>
					Logout
				</button>
			</header>
			<div>Home page</div>
		</>
	);
}

export default withAuth(Home);
