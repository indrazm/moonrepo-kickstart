import { createFileRoute } from "@tanstack/react-router";
import { useMe } from "@/modules/auth/hooks/useMe";

export const Route = createFileRoute("/_dashboardLayout/dashboard")({
	component: DashboardPage,
});

function DashboardPage() {
	const { data: user } = useMe();

	return (
		<div className="mx-auto max-w-4xl space-y-8">
			<div>
				<h1 className="text-4xl font-bold">Dashboard</h1>
				<p className="text-muted-foreground mt-2">
					Welcome back to your dashboard
				</p>
			</div>

			{/* User Information Card */}
			<div className="rounded-lg border bg-card p-6 space-y-4">
				<h2 className="text-2xl font-semibold">User Information</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-1">
						<p className="text-sm font-medium text-muted-foreground">User ID</p>
						<p className="text-lg">{user?.id}</p>
					</div>
					<div className="space-y-1">
						<p className="text-sm font-medium text-muted-foreground">
							Username
						</p>
						<p className="text-lg">{user?.username}</p>
					</div>
					<div className="space-y-1">
						<p className="text-sm font-medium text-muted-foreground">Email</p>
						<p className="text-lg">{user?.email}</p>
					</div>
					<div className="space-y-1">
						<p className="text-sm font-medium text-muted-foreground">
							Account Status
						</p>
						<p className="text-lg">
							{user?.is_active ? (
								<span className="text-green-600 font-medium">Active</span>
							) : (
								<span className="text-red-600 font-medium">Inactive</span>
							)}
						</p>
					</div>
					{user?.oauth_provider && (
						<div className="space-y-1">
							<p className="text-sm font-medium text-muted-foreground">
								OAuth Provider
							</p>
							<p className="text-lg capitalize">{user.oauth_provider}</p>
						</div>
					)}
					{user?.full_name && (
						<div className="space-y-1">
							<p className="text-sm font-medium text-muted-foreground">
								Full Name
							</p>
							<p className="text-lg">{user.full_name}</p>
						</div>
					)}
				</div>
				{user?.avatar_url && (
					<div className="pt-4 border-t">
						<p className="text-sm font-medium text-muted-foreground mb-2">
							Avatar
						</p>
						<img
							src={user.avatar_url}
							alt="User avatar"
							className="w-20 h-20 rounded-full"
						/>
					</div>
				)}
			</div>

			{/* Quick Stats */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="rounded-lg border p-6 space-y-2">
					<p className="text-sm font-medium text-muted-foreground">Projects</p>
					<p className="text-3xl font-bold">0</p>
				</div>
				<div className="rounded-lg border p-6 space-y-2">
					<p className="text-sm font-medium text-muted-foreground">Tasks</p>
					<p className="text-3xl font-bold">0</p>
				</div>
				<div className="rounded-lg border p-6 space-y-2">
					<p className="text-sm font-medium text-muted-foreground">Activity</p>
					<p className="text-3xl font-bold">0</p>
				</div>
			</div>
		</div>
	);
}
