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
}

/**
 * Create a new API instance
 */
export function createApi(config: ApiClientConfig): Api {
	return new Api(config);
}
