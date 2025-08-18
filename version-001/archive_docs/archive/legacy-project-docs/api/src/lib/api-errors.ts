export class AuthenticationError extends Error {
	constructor(message: string = "Authentication required") {
		super(message);
		this.name = "AuthenticationError";
	}
}

export class ValidationError extends Error {
	public readonly fields?: Record<string, string>;

	constructor(
		message: string = "Validation failed",
		fields?: Record<string, string>
	) {
		super(message);
		this.name = "ValidationError";
		this.fields = fields;
	}
}

export class NotFoundError extends Error {
	constructor(message: string = "Resource not found") {
		super(message);
		this.name = "NotFoundError";
	}
}

export class InsufficientCreditsError extends Error {
	public readonly creditsRequired?: number;
	public readonly creditsAvailable?: number;

	constructor(
		message: string = "Insufficient credits",
		creditsRequired?: number,
		creditsAvailable?: number
	) {
		super(message);
		this.name = "InsufficientCreditsError";
		this.creditsRequired = creditsRequired;
		this.creditsAvailable = creditsAvailable;
	}
}

export class ExternalServiceError extends Error {
	constructor(
		message: string,
		public service: string
	) {
		super(message);
		this.name = "ExternalServiceError";
	}
}

export class RateLimitError extends Error {
	constructor(message: string = "Rate limit exceeded") {
		super(message);
		this.name = "RateLimitError";
	}
}

export function handleApiError(error: any): { status: number; body: any } {
	console.error("API Error:", error);

	if (error instanceof AuthenticationError) {
		return { status: 401, body: { error: error.message } };
	}

	if (error instanceof ValidationError) {
		return {
			status: 400,
			body: {
				error: error.message,
				fields: error.fields,
			},
		};
	}

	if (error instanceof NotFoundError) {
		return { status: 404, body: { error: error.message } };
	}

	if (error instanceof InsufficientCreditsError) {
		return {
			status: 402,
			body: {
				error: error.message,
				creditsRequired: error.creditsRequired,
				creditsAvailable: error.creditsAvailable,
			},
		};
	}

	if (error instanceof ExternalServiceError) {
		return {
			status: 503,
			body: { error: error.message, service: error.service },
		};
	}

	if (error instanceof RateLimitError) {
		return { status: 429, body: { error: error.message } };
	}

	// Default error
	return {
		status: 500,
		body: { error: "Internal server error" },
	};
}
