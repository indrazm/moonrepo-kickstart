import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useMe() {
	return useQuery({
		queryKey: ["user", "me"],
		queryFn: () => api.auth.me(),
		retry: false,
	});
}
