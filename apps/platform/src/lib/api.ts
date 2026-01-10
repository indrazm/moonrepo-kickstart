import { createApi } from "@repo/core";

const api = createApi({
	baseUrl: import.meta.env.VITE_API_URL || "http://localhost:8000",
	onTokenRefreshFailed: () => {
		console.warn("Token refresh failed, redirecting to login...");

		if (
			typeof window !== "undefined" &&
			!window.location.pathname.startsWith("/login")
		) {
			window.location.href = "/login";
		}
	},
});

export { api };
