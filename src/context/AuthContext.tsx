import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from 'react';
import { useRouter } from 'next/router';
import { User } from '../types';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type UserWithToken = User & {
	token: string;
};

interface AuthContextType {
	user: UserWithToken | null;
	saveJWTToken: (
		data: UserWithToken & { refreshToken: string }
	) => Promise<void>;
	removeJWTToken: () => Promise<void>;
	refreshAuthToken: () => Promise<string | null>;
	loading: boolean; // Added loading state
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<UserWithToken | null>(null);
	const [loading, setLoading] = useState(true); // Track loading state
	const router = useRouter();

	useEffect(() => {
		const loadUser = async () => {
			try {
				const token = localStorage.getItem('accessToken');
				const _id = localStorage.getItem('_id');
				const name = localStorage.getItem('name');
				const email = localStorage.getItem('email');

				if (token && _id && name && email) {
					setUser({ _id, name, email, token });
				}
			} catch (error) {
				console.error('Failed to load user token', error);
			} finally {
				setLoading(false); // Finish loading after token check
			}
		};

		loadUser();
	}, []);

	const saveJWTToken = async (
		data: UserWithToken & { refreshToken: string }
	) => {
		const { token, refreshToken, _id, name, email } = data;

		localStorage.setItem('accessToken', token);
		localStorage.setItem('refreshToken', refreshToken);
		localStorage.setItem('_id', _id.toString());
		localStorage.setItem('name', name);
		localStorage.setItem('email', email);

		setUser({ token, _id, name, email });

		router.replace('/'); // Redirect to the home page
	};

	const removeJWTToken = async () => {
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
		localStorage.removeItem('_id');
		localStorage.removeItem('name');
		localStorage.removeItem('email');

		setUser(null);

		router.replace('/login');
	};

	const refreshAuthToken = async (): Promise<string | null> => {
		const accessToken = localStorage.getItem('accessToken');
		const refreshToken = localStorage.getItem('refreshToken');

		if (!refreshToken) {
			removeJWTToken();
			return null;
		}

		try {
			const response = await fetch(`${BASE_URL}/token/refresh`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: accessToken ? `Bearer ${accessToken}` : '',
				},
				body: JSON.stringify({
					refreshToken,
				}),
			});

			const data = await response.json();

			if (response.ok) {
				localStorage.setItem('accessToken', data.accessToken);
				localStorage.setItem('refreshToken', data.refreshToken);

				const userData = user || ({} as UserWithToken);

				setUser({ ...userData, token: data.accessToken });
				return data.accessToken;
			} else {
				removeJWTToken();
				return null;
			}
		} catch (error) {
			console.error(error);
			removeJWTToken();
			return null;
		}
	};

	return (
		<AuthContext.Provider
			value={{ user, saveJWTToken, removeJWTToken, refreshAuthToken, loading }}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);

	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}

	return context;
};
