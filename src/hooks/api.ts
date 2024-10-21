import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse } from '../types';
import { useRouter } from 'next/router';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getHeaders = async (): Promise<Record<string, string>> => {
	const token = localStorage.getItem('accessToken');

	return {
		'Content-Type': 'application/json',
		Authorization: token ? `Bearer ${token}` : '',
	};
};

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export const useApiClient = () => {
	const { removeJWTToken, refreshAuthToken } = useAuth();
	const router = useRouter();

	const apiCall = useCallback(
		async (
			endpoint: string,
			method: HttpMethod = 'GET',
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			data: any = null
		): Promise<ApiResponse> => {
			try {
				const headers = await getHeaders();

				const config: AxiosRequestConfig = {
					method,
					url: `${BASE_URL}/${endpoint}`,
					headers,
				};

				if (data) {
					config.data = data;
				}

				let response: AxiosResponse<ApiResponse> | null = null;
				try {
					response = await axios(config);
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
				} catch (error: any) {
					if ([401, 403].includes(error.status)) {
						const newToken = await refreshAuthToken();

						if (!newToken) {
							await removeJWTToken();
							throw new Error('Please Login');
						}

						config.headers = {
							...config.headers,
							Authorization: `Bearer ${newToken}`,
						};

						response = await axios(config);
					}

					throw error;
				}

				if (!response) {
					throw new Error('Something went wrong');
				}

				return response.data;
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (error: any) {
				if (error.response) {
					throw new Error(
						error.response.data.message || 'Something went wrong!'
					);
				}
				throw error;
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[router]
	);

	return {
		apiCall, // Return the single apiCall function for all methods
	};
};
