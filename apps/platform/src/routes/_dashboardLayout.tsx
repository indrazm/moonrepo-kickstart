import { Button } from "@repo/ui";
import {
	createFileRoute,
	Link,
	Outlet,
	useNavigate,
} from "@tanstack/react-router";
import { ModeToggle } from "@/components/mode-toggle";
import { api } from "@/lib/api";
import { useMe } from "@/modules/auth/hooks/useMe";

export const Route = createFileRoute("/_dashboardLayout")({
	component: DashboardLayout,
});

function DashboardLayout() {
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
			<header className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<Link to="/" className="text-2xl font-bold">
							Moonrepo Kickstart
						</Link>

						<nav className="flex items-center gap-6">
							<Link
								to="/dashboard"
								className="text-sm font-medium transition-colors hover:text-primary"
								activeProps={{
									className: "text-foreground",
								}}
								inactiveProps={{
									className: "text-muted-foreground",
								}}
							>
								Dashboard
							</Link>
						</nav>

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

			<main className="container mx-auto px-4 py-12">
				<Outlet />
			</main>
		</div>
	);
}
