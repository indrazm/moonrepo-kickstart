import {
	Button,
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@repo/ui";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Sidebar } from "@/components/sidebar";
import { useMe } from "@/modules/auth/hooks/useMe";

export const Route = createFileRoute("/_dashboardLayout")({
	component: DashboardLayout,
});

function DashboardLayout() {
	const { isLoading, error } = useMe();

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
		<ResizablePanelGroup
			orientation="horizontal"
			className="h-screen overflow-hidden bg-background"
		>
			<ResizablePanel
				defaultSize="20%"
				minSize="15%"
				maxSize="50%"
				className="min-w-0"
			>
				<Sidebar />
			</ResizablePanel>
			<ResizableHandle withHandle />
			<ResizablePanel defaultSize="80%" minSize="50%" className="min-w-0">
				<main className="flex-1 flex flex-col h-full overflow-hidden">
					<Outlet />
				</main>
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
