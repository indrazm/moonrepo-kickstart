import { Avatar, Button } from "@repo/ui";
import { Link, useNavigate } from "@tanstack/react-router";
import { Home, LogOut, Settings, SquarePen } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { api } from "@/lib/api";
import { useMe } from "@/modules/auth/hooks/useMe";

export function Sidebar() {
	const { data: user } = useMe();
	const navigate = useNavigate();

	const handleLogout = () => {
		api.auth.logout();
		navigate({ to: "/login" });
	};

	const mockSessions = [
		{ id: "1", title: "Design a dashboard", date: "Today" },
		{ id: "2", title: "Refactor auth logic", date: "Yesterday" },
		{ id: "3", title: "TanStack Router help", date: "Yesterday" },
		{ id: "4", title: "Python FastAPI tips", date: "Previous 7 days" },
	];

	return (
		<aside className="w-64 border-r bg-card h-screen flex flex-col pt-4">
			<div className="px-4 flex items-center justify-between mb-4">
				<h2 className="text-xl font-bold px-2">Moonrepo</h2>
				<ModeToggle />
			</div>

			<div className="px-4 mb-4">
				<Button
					variant="outline"
					className="w-full justify-start gap-2 shadow-sm"
				>
					<SquarePen className="h-4 w-4" />
					<span className="font-medium">New Chat</span>
				</Button>
			</div>

			<div className="flex-1 overflow-y-auto px-4 py-2">
				<div className="space-y-6">
					<div>
						<p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 mb-2">
							Recent
						</p>
						<div className="space-y-0.5">
							{mockSessions.map((session) => (
								<button
									key={session.id}
									type="button"
									className="w-full flex items-center px-2 py-1.5 text-sm rounded-lg transition-colors hover:bg-accent text-left group"
								>
									<span className="truncate flex-1">{session.title}</span>
								</button>
							))}
						</div>
					</div>
				</div>
			</div>

			<div className="mt-auto p-2 border-t bg-accent/5">
				<div className="space-y-1">
					<Link
						to="/dashboard"
						className="flex text-sm items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-accent text-muted-foreground hover:text-foreground"
						activeProps={{
							className:
								"flex items-center gap-3 px-3 py-2 rounded-lg bg-accent text-accent-foreground",
						}}
					>
						<Home className="h-4 w-4" />
						<span className="font-medium">Dashboard</span>
					</Link>

					<Link
						to="/dashboard/settings"
						className="flex text-sm items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-accent text-muted-foreground hover:text-foreground"
						activeProps={{
							className:
								"flex items-center gap-3 px-3 py-2 rounded-lg bg-accent text-accent-foreground",
						}}
					>
						<Settings className="h-4 w-4" />
						<span className="font-medium">Settings</span>
					</Link>

					{user && (
						<div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors group mt-1">
							<Avatar className="h-7 w-7">
								{user.avatar_url ? (
									<img
										src={user.avatar_url}
										alt={user.username}
										className="h-full w-full object-cover"
									/>
								) : (
									<div className="h-full w-full flex items-center justify-center bg-primary text-primary-foreground text-[10px] font-bold">
										{user.username.charAt(0).toUpperCase()}
									</div>
								)}
							</Avatar>
							<div className="flex-1 min-w-0">
								<p className="text-xs font-semibold truncate leading-none mb-1">
									{user.username}
								</p>
								<p className="text-[10px] text-muted-foreground truncate leading-none">
									{user.email}
								</p>
							</div>
							<Button
								variant="ghost"
								size="icon"
								onClick={handleLogout}
								title="Logout"
								className="shrink-0 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
							>
								<LogOut className="h-3.5 w-3.5" />
							</Button>
						</div>
					)}
				</div>
			</div>
		</aside>
	);
}
