import type { UserProfileUpdate } from "@repo/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";

export function useUpdateProfile() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: UserProfileUpdate) => api.auth.updateProfile(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["me"] });
			toast.success("Profile updated successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to update profile");
		},
	});
}
