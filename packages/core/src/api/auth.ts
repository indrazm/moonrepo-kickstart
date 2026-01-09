import type { ApiClient } from "../client";
import type {
	AccessTokenResponse,
	LoginRequest,
	OAuthUrlResponse,
	RefreshTokenRequest,
	Token,
	UserCreate,
	UserResponse,
} from "../types";

export class AuthApi {
	constructor(private client: ApiClient) {}

	/**
	 * Register a new user
	 * POST /auth/register
	 */
	async register(data: UserCreate): Promise<UserResponse> {
		return this.client.post<UserResponse>("auth/register", data);
	}

	/**
	 * Login with username and password
	 * POST /auth/login
	 */
	async login(data: LoginRequest): Promise<Token> {
		const tokens = await this.client.postForm<Token>("auth/login", {
			username: data.username,
			password: data.password,
		});

		// Automatically store tokens in the client
		this.client.setTokens(tokens.access_token, tokens.refresh_token);

		return tokens;
	}

	/**
	 * Get current user
	 * GET /auth/me
	 */
	async me(): Promise<UserResponse> {
		return this.client.get<UserResponse>("auth/me");
	}

	/**
	 * Refresh access token
	 * POST /auth/refresh
	 */
	async refresh(data: RefreshTokenRequest): Promise<AccessTokenResponse> {
		const response = await this.client.post<AccessTokenResponse>(
			"auth/refresh",
			data,
		);

		// Update the access token
		this.client.setTokens(response.access_token);

		return response;
	}

	/**
	 * Logout (clear tokens)
	 */
	logout(): void {
		this.client.clearTokens();
	}

	/**
	 * Get Google OAuth URL
	 * GET /auth/google
	 */
	async getGoogleAuthUrl(): Promise<OAuthUrlResponse> {
		return this.client.get<OAuthUrlResponse>("auth/google");
	}

	/**
	 * Get GitHub OAuth URL
	 * GET /auth/github
	 */
	async getGithubAuthUrl(): Promise<OAuthUrlResponse> {
		return this.client.get<OAuthUrlResponse>("auth/github");
	}

	/**
	 * Initiate Google OAuth flow (redirect to Google)
	 */
	async loginWithGoogle(): Promise<void> {
		const { auth_url } = await this.getGoogleAuthUrl();
		window.location.href = auth_url;
	}

	/**
	 * Initiate GitHub OAuth flow (redirect to GitHub)
	 */
	async loginWithGithub(): Promise<void> {
		const { auth_url } = await this.getGithubAuthUrl();
		window.location.href = auth_url;
	}
}
