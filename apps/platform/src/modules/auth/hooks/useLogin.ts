import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useLogin() {
	return useMutation({
		mutationFn: async ({
			username,
			password,
		}: {
			username: string;
			password: string;
		}) => {
			return api.auth.login({ username, password });
		},
		onError: (error: Error) => {
			console.error("Login error:", error);
		},
	});
}
