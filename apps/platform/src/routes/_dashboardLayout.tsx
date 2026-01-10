import { Button } from "@repo/ui";
import {
	createFileRoute,
	Link,
	Outlet,
	useNavigate,
} from "@tanstack/react-router";
import { ModeToggle } from "@/components/mode-toggle";
import { Sidebar } from "@/components/sidebar";
import { api } from "@/lib/api";
import { useMe } from "@/modules/auth/hooks/useMe";

export const Route = createFileRoute("/_dashboardLayout")({
	component: DashboardLayout,
});

function DashboardLayout() {
	const navigate = useNavigate();
	const { isLoading, error } = useMe();

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
		<div className="flex h-screen">
			<Sidebar />
			<div className="flex-1 flex flex-col">
				<header className="bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
					<div className="px-6 py-4">
						<div className="flex items-center justify-end gap-4">
							<ModeToggle />
							<Button variant="outline" onClick={handleLogout}>
								Logout
							</Button>
						</div>
					</div>
				</header>

				<main className="flex-1 overflow-y-auto bg-background">
					<div className="container mx-auto px-6 py-8">
						<Outlet />
					</div>
				</main>
			</div>
		</div>
	);
}
