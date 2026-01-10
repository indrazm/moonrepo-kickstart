import { createApi } from "@repo/core";

const api = createApi({
	baseUrl: import.meta.env.VITE_API_URL || "http://localhost:8000",
	onTokenRefreshFailed: () => {
		// Clear tokens and redirect to login when refresh fails
		console.warn("Token refresh failed, redirecting to login...");

		// Only redirect if we're in the browser and not already on login page
		if (
			typeof window !== "undefined" &&
			!window.location.pathname.startsWith("/login")
		) {
			window.location.href = "/login";
		}
	},
});

export { api };
