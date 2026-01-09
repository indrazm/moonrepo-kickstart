import { Button } from "@repo/ui";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { api } from "@/lib/api";
import { useMe } from "@/modules/auth/hooks/useMe";
import { ModeToggle } from "@/components/mode-toggle";

export const Route = createFileRoute("/dashboard/")({
	component: DashboardPage,
});

function DashboardPage() {
	const navigate = useNavigate();
	const { data: user, isLoading, error } = useMe();

	const handleLogout = () => {
		api.auth.logout();
		navigate({ to: "/login" });
	};

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center space-y-4">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
					<p className="text-muted-foreground">Loading...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center space-y-4 max-w-md">
					<h2 className="text-2xl font-bold">Authentication Required</h2>
					<p className="text-muted-foreground">
						You need to be logged in to access the dashboard.
					</p>
					<div className="flex justify-center gap-4">
						<Link to="/login">
							<Button>Go to Login</Button>
						</Link>
						<Link to="/register">
							<Button variant="outline">Register</Button>
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-linear-to-b from-background to-muted/20">
			{/* Header */}
			<header className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<Link to="/" className="text-2xl font-bold">
							Moonrepo Kickstart
						</Link>
						<div className="flex items-center gap-4">
							<span className="text-sm text-muted-foreground">
								{user?.username}
							</span>
							<ModeToggle />
							<Button variant="outline" onClick={handleLogout}>
								Logout
							</Button>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="container mx-auto px-4 py-12">
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
								<p className="text-sm font-medium text-muted-foreground">
									User ID
								</p>
								<p className="text-lg">{user?.id}</p>
							</div>
							<div className="space-y-1">
								<p className="text-sm font-medium text-muted-foreground">
									Username
								</p>
								<p className="text-lg">{user?.username}</p>
							</div>
							<div className="space-y-1">
								<p className="text-sm font-medium text-muted-foreground">
									Email
								</p>
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
							<p className="text-sm font-medium text-muted-foreground">
								Projects
							</p>
							<p className="text-3xl font-bold">0</p>
						</div>
						<div className="rounded-lg border p-6 space-y-2">
							<p className="text-sm font-medium text-muted-foreground">Tasks</p>
							<p className="text-3xl font-bold">0</p>
						</div>
						<div className="rounded-lg border p-6 space-y-2">
							<p className="text-sm font-medium text-muted-foreground">
								Activity
							</p>
							<p className="text-3xl font-bold">0</p>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
