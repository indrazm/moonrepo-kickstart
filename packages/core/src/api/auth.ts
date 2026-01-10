import type { ApiClient } from "../client";
import type {
	AccessTokenResponse,
	LoginRequest,
	OAuthUrlResponse,
	RefreshTokenRequest,
	Token,
	UserCreate,
	UserProfileUpdate,
	UserResponse,
	UserRole,
} from "../types";

export class AuthApi {
	constructor(private client: ApiClient) {}

	async register(data: UserCreate): Promise<UserResponse> {
		return this.client.post<UserResponse>("auth/register", data);
	}

	async login(data: LoginRequest): Promise<Token> {
		const tokens = await this.client.postForm<Token>("auth/login", {
			username: data.username,
			password: data.password,
		});

		this.client.setTokens(tokens.access_token, tokens.refresh_token);

		return tokens;
	}

	async me(): Promise<UserResponse> {
		return this.client.get<UserResponse>("auth/me");
	}

	async updateProfile(data: UserProfileUpdate): Promise<UserResponse> {
		return this.client.patch<UserResponse>("auth/me", data);
	}

	async refresh(data: RefreshTokenRequest): Promise<AccessTokenResponse> {
		const response = await this.client.post<AccessTokenResponse>(
			"auth/refresh",
			data,
		);

		this.client.setTokens(response.access_token);

		return response;
	}

	logout(): void {
		this.client.clearTokens();
	}

	async getGoogleAuthUrl(): Promise<OAuthUrlResponse> {
		return this.client.get<OAuthUrlResponse>("auth/google");
	}

	async getGithubAuthUrl(): Promise<OAuthUrlResponse> {
		return this.client.get<OAuthUrlResponse>("auth/github");
	}

	async loginWithGoogle(): Promise<void> {
		const { auth_url } = await this.getGoogleAuthUrl();
		window.location.href = auth_url;
	}

	async loginWithGithub(): Promise<void> {
		const { auth_url } = await this.getGithubAuthUrl();
		window.location.href = auth_url;
	}

	// Admin methods

	async testAdminAccess(): Promise<{
		message: string;
		user: { id: string; username: string; role: UserRole };
	}> {
		return this.client.get("auth/admin/test");
	}

	async getUsers(): Promise<UserResponse[]> {
		return this.client.get<UserResponse[]>("auth/users");
	}

	async updateUserRole(userId: string, role: UserRole): Promise<UserResponse> {
		return this.client.patch<UserResponse>(`auth/users/${userId}/role`, {
			role,
		});
	}
}
