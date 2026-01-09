import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { api } from "@/lib/api";

export const Route = createFileRoute("/auth/callback")({
	component: OAuthCallback,
});

function OAuthCallback() {
	const navigate = useNavigate();

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const accessToken = params.get("access_token");
		const refreshToken = params.get("refresh_token");

		if (accessToken && refreshToken) {
			api.setTokens(accessToken, refreshToken);
			navigate({ to: "/" });
		} else {
			navigate({ to: "/" });
		}
	}, [navigate]);

	return <div>Authenticating...</div>;
}
