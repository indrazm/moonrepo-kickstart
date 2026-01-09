// Types matching the FastAPI serializers from @apps/api

export interface UserBase {
	email: string;
	username: string;
}

export interface UserCreate extends UserBase {
	password: string;
}

export interface UserResponse extends UserBase {
	id: number;
	is_active: boolean;
	oauth_provider?: string | null;
	avatar_url?: string | null;
	full_name?: string | null;
}

export interface Token {
	access_token: string;
	refresh_token: string;
	token_type: string;
}

export interface TokenData {
	username?: string | null;
}

export interface RefreshTokenRequest {
	refresh_token: string;
}

export interface AccessTokenResponse {
	access_token: string;
	token_type: string;
}

export interface OAuthUrlResponse {
	auth_url: string;
}

export interface OAuthCallbackRequest {
	code: string;
	state?: string | null;
}

// OAuth2 Password Request Form
export interface LoginRequest {
	username: string;
	password: string;
}
