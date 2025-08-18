export interface User {
	id: string;
	email: string;
	name: string;
	emailVerified?: boolean;
	image?: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface SignInRequest {
	email: string;
	password: string;
}

export interface SignInResponse {
	user: User;
	session: {
		token: string;
		expiresAt: string;
	};
}

export interface SessionResponse {
	user: User | null;
	session: {
		token: string;
		expiresAt: string;
	} | null;
}

export class AuthServiceError extends Error {
	public code?: string;
	public status?: number;

	constructor(message: string, code?: string, status?: number) {
		super(message);
		this.name = "AuthServiceError";
		this.code = code;
		this.status = status;
	}
}

export class AuthService {
	private baseURL: string;

	constructor(baseURL?: string) {
		this.baseURL =
			baseURL || process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3003";
	}

	private async request<T>(
		endpoint: string,
		options: RequestInit = {}
	): Promise<T> {
		const url = `${this.baseURL}${endpoint}`;

		const config: RequestInit = {
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				...options.headers,
			},
			...options,
		};

		try {
			const response = await fetch(url, config);

			if (!response.ok) {
				const errorText = await response.text();
				let errorMessage = `Request failed: ${response.status}`;

				try {
					const errorData = JSON.parse(errorText);
					errorMessage = errorData.message || errorData.error || errorMessage;
				} catch {
					errorMessage = errorText || errorMessage;
				}

				throw new AuthServiceError(
					errorMessage,
					response.status.toString(),
					response.status
				);
			}

			const data = await response.json();
			return data;
		} catch (error) {
			if (error instanceof AuthServiceError) {
				throw error;
			}

			// Network or other errors
			throw new AuthServiceError(
				error instanceof Error ? error.message : "Network error occurred",
				"NETWORK_ERROR"
			);
		}
	}

	async signIn(credentials: SignInRequest): Promise<SignInResponse> {
		console.log("Attempting to sign in with credentials:", credentials);
		return this.request<SignInResponse>("/api/auth/sign-in", {
			method: "POST",
			body: JSON.stringify(credentials),
		});
	}

	async signOut(): Promise<void> {
		return this.request<void>("/api/auth/sign-out", {
			method: "POST",
		});
	}

	async getSession(): Promise<SessionResponse> {
		return this.request<SessionResponse>("/api/auth/get-session");
	}

	async healthCheck(): Promise<{ status: string; timestamp: string }> {
		return this.request<{ status: string; timestamp: string }>("/api/health");
	}
}

// Singleton instance
export const authService = new AuthService();
