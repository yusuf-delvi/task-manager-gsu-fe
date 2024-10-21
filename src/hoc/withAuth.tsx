import React, { ComponentType, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
	// eslint-disable-next-line react/display-name
	return (props: P) => {
		const { user, loading } = useAuth(); // Get loading state from context
		const router = useRouter();

		useEffect(() => {
			if (!loading && user === null) {
				router.replace('/login');
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [loading, user]);

		if (loading || user === null) {
			return <div>Loading</div>;
		}

		return <WrappedComponent {...props} />;
	};
};

export default withAuth;
