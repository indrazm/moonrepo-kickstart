import { createApi } from "@repo/core";

const api = createApi({
	baseUrl: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

export { api };
