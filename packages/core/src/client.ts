import ky, { type KyInstance, type Options } from "ky";

export interface ApiClientConfig {
	baseUrl: string;
	headers?: Record<string, string>;
	timeout?: number;
	hooks?: Options["hooks"];
	onTokenRefreshFailed?: () => void;
}

export class ApiClient {
	private client: KyInstance;
	private static ACCESS_TOKEN_KEY = "access_token";
	private static REFRESH_TOKEN_KEY = "refresh_token";
	private isRefreshing = false;
	private refreshPromise: Promise<string> | null = null;
	private onTokenRefreshFailed?: () => void;
	private baseUrl: string;

	constructor(config: ApiClientConfig) {
		this.onTokenRefreshFailed = config.onTokenRefreshFailed;
		this.baseUrl = config.baseUrl;

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
						const accessToken = this.getAccessToken();
						if (accessToken) {
							request.headers.set("Authorization", `Bearer ${accessToken}`);
						}
					},
				],
				afterResponse: [
					async (request, _options, response) => {
						if (response.status === 401) {
							const refreshToken = this.getRefreshToken();

							// Prevent infinite loop: don't refresh on the refresh endpoint itself
							if (request.url.includes("/auth/refresh") || !refreshToken) {
								return response;
							}

							try {
								const newAccessToken =
									await this.refreshAccessToken(refreshToken);

								request.headers.set(
									"Authorization",
									`Bearer ${newAccessToken}`,
								);
								return ky(request);
							} catch (error) {
								this.clearTokens();
								this.onTokenRefreshFailed?.();
								throw error;
							}
						}

						return response;
					},
				],
				...config.hooks,
			},
		});
	}

	// Deduplicates concurrent refresh requests to prevent race conditions
	private async refreshAccessToken(refreshToken: string): Promise<string> {
		if (this.isRefreshing && this.refreshPromise) {
			return this.refreshPromise;
		}

		this.isRefreshing = true;
		this.refreshPromise = (async () => {
			try {
				const response = await ky.post("auth/refresh", {
					prefixUrl: this.baseUrl,
					json: { refresh_token: refreshToken },
					headers: {
						"Content-Type": "application/json",
					},
				});

				const data = await response.json<{
					access_token: string;
					token_type: string;
				}>();

				this.setTokens(data.access_token);

				return data.access_token;
			} finally {
				this.isRefreshing = false;
				this.refreshPromise = null;
			}
		})();

		return this.refreshPromise;
	}

	setTokens(accessToken: string, refreshToken?: string) {
		if (typeof window !== "undefined") {
			localStorage.setItem(ApiClient.ACCESS_TOKEN_KEY, accessToken);
			if (refreshToken) {
				localStorage.setItem(ApiClient.REFRESH_TOKEN_KEY, refreshToken);
			}
		}
	}

	clearTokens() {
		if (typeof window !== "undefined") {
			localStorage.removeItem(ApiClient.ACCESS_TOKEN_KEY);
			localStorage.removeItem(ApiClient.REFRESH_TOKEN_KEY);
		}
	}

	getAccessToken() {
		if (typeof window !== "undefined") {
			return localStorage.getItem(ApiClient.ACCESS_TOKEN_KEY) || undefined;
		}
		return undefined;
	}

	getRefreshToken() {
		if (typeof window !== "undefined") {
			return localStorage.getItem(ApiClient.REFRESH_TOKEN_KEY) || undefined;
		}
		return undefined;
	}

	async get<T>(path: string, options?: Options): Promise<T> {
		const response = await this.client.get(path, options);
		return response.json<T>();
	}

	async post<T>(path: string, data?: unknown, options?: Options): Promise<T> {
		const response = await this.client.post(path, {
			json: data,
			...options,
		});
		return response.json<T>();
	}

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

	async put<T>(path: string, data?: unknown, options?: Options): Promise<T> {
		const response = await this.client.put(path, {
			json: data,
			...options,
		});
		return response.json<T>();
	}

	async patch<T>(path: string, data?: unknown, options?: Options): Promise<T> {
		const response = await this.client.patch(path, {
			json: data,
			...options,
		});
		return response.json<T>();
	}

	async delete<T>(path: string, options?: Options): Promise<T> {
		const response = await this.client.delete(path, options);
		return response.json<T>();
	}

	getRawClient(): KyInstance {
		return this.client;
	}
}
