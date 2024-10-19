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

export enum TaskStatus {
	PENDING = 'PENDING',
	INPROGRESS = 'INPROGRESS',
	DONE = 'DONE',
}

export enum TaskPriority {
	LOW = 'LOW',
	MEDIUM = 'MEDIUM',
	HIGH = 'HIGH',
}

export interface Task {
	_id: string;
	title: string;
	description: string;
	priority: TaskPriority;
	status: TaskStatus;
	dueDate: Date;
}
