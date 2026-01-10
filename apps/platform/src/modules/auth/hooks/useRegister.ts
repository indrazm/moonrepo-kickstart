import type { UserCreate } from "@repo/core";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useRegister() {
	return useMutation({
		mutationFn: async (data: UserCreate) => {
			return api.auth.register(data);
		},
		onError: (error: Error) => {
			console.error("Registration error:", error);
		},
	});
}
