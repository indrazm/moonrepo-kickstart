import ky, { type KyInstance, type Options } from "ky";

export interface ApiClientConfig {
	baseUrl: string;
	headers?: Record<string, string>;
	timeout?: number;
	hooks?: Options["hooks"];
}

export class ApiClient {
	private client: KyInstance;
	private static ACCESS_TOKEN_KEY = "access_token";
	private static REFRESH_TOKEN_KEY = "refresh_token";

	constructor(config: ApiClientConfig) {
		this.client = ky.create({
			prefixUrl: config.baseUrl,
			timeout: config.timeout || 30000,
			headers: {
				"Content-Type": "application/json",
				...config.headers,
			},
			hooks: {
				beforeRequest: [
					(request) => {
						// Automatically add auth token if available
						const accessToken = this.getAccessToken();
						if (accessToken) {
							request.headers.set("Authorization", `Bearer ${accessToken}`);
						}
					},
				],
				...config.hooks,
			},
		});
	}

	/**
	 * Set authentication tokens
	 */
	setTokens(accessToken: string, refreshToken?: string) {
		if (typeof window !== "undefined") {
			localStorage.setItem(ApiClient.ACCESS_TOKEN_KEY, accessToken);
			if (refreshToken) {
				localStorage.setItem(ApiClient.REFRESH_TOKEN_KEY, refreshToken);
			}
		}
	}

	/**
	 * Clear authentication tokens
	 */
	clearTokens() {
		if (typeof window !== "undefined") {
			localStorage.removeItem(ApiClient.ACCESS_TOKEN_KEY);
			localStorage.removeItem(ApiClient.REFRESH_TOKEN_KEY);
		}
	}

	/**
	 * Get the current access token
	 */
	getAccessToken() {
		if (typeof window !== "undefined") {
			return localStorage.getItem(ApiClient.ACCESS_TOKEN_KEY) || undefined;
		}
		return undefined;
	}

	/**
	 * Get the current refresh token
	 */
	getRefreshToken() {
		if (typeof window !== "undefined") {
			return localStorage.getItem(ApiClient.REFRESH_TOKEN_KEY) || undefined;
		}
		return undefined;
	}

	/**
	 * Make a GET request
	 */
	async get<T>(path: string, options?: Options): Promise<T> {
		const response = await this.client.get(path, options);
		return response.json<T>();
	}

	/**
	 * Make a POST request
	 */
	async post<T>(path: string, data?: unknown, options?: Options): Promise<T> {
		const response = await this.client.post(path, {
			json: data,
			...options,
		});
		return response.json<T>();
	}

	/**
	 * Make a POST request with form data
	 */
	async postForm<T>(
		path: string,
		data: Record<string, string>,
		options?: Options,
	): Promise<T> {
		const formData = new URLSearchParams(data);
		const response = await this.client.post(path, {
			body: formData,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			...options,
		});
		return response.json<T>();
	}

	/**
	 * Make a PUT request
	 */
	async put<T>(path: string, data?: unknown, options?: Options): Promise<T> {
		const response = await this.client.put(path, {
			json: data,
			...options,
		});
		return response.json<T>();
	}

	/**
	 * Make a PATCH request
	 */
	async patch<T>(path: string, data?: unknown, options?: Options): Promise<T> {
		const response = await this.client.patch(path, {
			json: data,
			...options,
		});
		return response.json<T>();
	}

	/**
	 * Make a DELETE request
	 */
	async delete<T>(path: string, options?: Options): Promise<T> {
		const response = await this.client.delete(path, options);
		return response.json<T>();
	}

	/**
	 * Get the raw Ky instance for advanced usage
	 */
	getRawClient(): KyInstance {
		return this.client;
	}
}
