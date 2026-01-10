import { UserRole } from "@repo/core";
import { useMe } from "./useMe";

export function useRole() {
	const { data: user } = useMe();
	return user?.role;
}

export function useIsAdmin() {
	const role = useRole();
	return role === UserRole.ADMIN;
}

export function useIsModerator() {
	const role = useRole();
	return role === UserRole.MODERATOR || role === UserRole.ADMIN;
}

export function useHasRole(requiredRole: UserRole): boolean {
	const role = useRole();

	const roleHierarchy = {
		[UserRole.USER]: 0,
		[UserRole.MODERATOR]: 1,
		[UserRole.ADMIN]: 2,
	};

	if (!role) return false;

	return roleHierarchy[role] >= roleHierarchy[requiredRole];
}
