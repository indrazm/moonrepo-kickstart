import { ApiClient, type ApiClientConfig } from "../client";
import { AuthApi } from "./auth";

/**
 * Main API class with tRPC-like pattern
 *
 * Usage:
 * ```ts
 * const api = createApi({ baseUrl: 'http://localhost:8000' })
 *
 * // Login
 * const tokens = await api.auth.login({ username: 'user', password: 'pass' })
 *
 * // Get current user
 * const user = await api.auth.me()
 *
 * // Register
 * const newUser = await api.auth.register({
 *   email: 'user@example.com',
 *   username: 'user',
 *   password: 'pass'
 * })
 * ```
 */
export class Api {
	private client: ApiClient;
	public auth: AuthApi;

	constructor(config: ApiClientConfig) {
		this.client = new ApiClient(config);
		this.auth = new AuthApi(this.client);
	}

	/**
	 * Get the underlying API client for advanced usage
	 */
	getClient(): ApiClient {
		return this.client;
	}

	/**
	 * Set authentication tokens
	 */
	setTokens(accessToken: string, refreshToken?: string) {
		this.client.setTokens(accessToken, refreshToken);
	}

	/**
	 * Clear authentication tokens
	 */
	clearTokens() {
		this.client.clearTokens();
	}

	/**
	 * Get the current access token
	 */
	getAccessToken() {
		return this.client.getAccessToken();
	}

	/**
	 * Get the current refresh token
	 */
	getRefreshToken() {
		return this.client.getRefreshToken();
	}
}

/**
 * Create a new API instance
 */
export function createApi(config: ApiClientConfig): Api {
	return new Api(config);
}
