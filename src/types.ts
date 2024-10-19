// types.ts
export interface User {
	_id: string;
	name: string;
	email: string;
}

export interface ApiResponse {
	statusCode: string;
	message: string;
	data: null | object;
}

export interface LoginResponse extends ApiResponse {
	data: {
		user: User;
		tokens: {
			accessToken: string;
			refreshToken: string;
		};
	};
}

export interface ApiErrorResponse extends ApiResponse {
	data: null;
}
