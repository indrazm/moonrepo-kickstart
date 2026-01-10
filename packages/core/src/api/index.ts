import { ApiClient, type ApiClientConfig } from "../client";
import { AuthApi } from "./auth";

export class Api {
	private client: ApiClient;
	public auth: AuthApi;

	constructor(config: ApiClientConfig) {
		this.client = new ApiClient(config);
		this.auth = new AuthApi(this.client);
	}

	getClient(): ApiClient {
		return this.client;
	}

	setTokens(accessToken: string, refreshToken?: string) {
		this.client.setTokens(accessToken, refreshToken);
	}

	clearTokens() {
		this.client.clearTokens();
	}

	getAccessToken() {
		return this.client.getAccessToken();
	}

	getRefreshToken() {
		return this.client.getRefreshToken();
	}
}

export function createApi(config: ApiClientConfig): Api {
	return new Api(config);
}
