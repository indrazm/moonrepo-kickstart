import { Avatar } from "@repo/ui";
import { Link } from "@tanstack/react-router";
import { Home, Settings } from "lucide-react";
import { useMe } from "@/modules/auth/hooks/useMe";

export function Sidebar() {
	const { data: user } = useMe();

	return (
		<aside className="w-64 border-r bg-card h-screen flex flex-col pt-8">
			<div className="px-8">
				<h2 className="text-xl font-bold">Moonrepo</h2>
			</div>

			<nav className="flex-1 p-4">
				<Link
					to="/dashboard"
					className="flex text-sm items-center gap-3 px-4 py-2 rounded-lg transition-colors hover:bg-accent"
					activeProps={{
						className:
							"flex items-center gap-3 px-4 py-2 rounded-lg bg-accent text-accent-foreground",
					}}
				>
					<Home className="h-5 w-5" />
					<span className="font-medium">Dashboard</span>
				</Link>

				<Link
					to="/dashboard/settings"
					className="flex text-sm items-center gap-3 px-4 py-2 rounded-lg transition-colors hover:bg-accent"
					activeProps={{
						className:
							"flex items-center gap-3 px-4 py-2 rounded-lg bg-accent text-accent-foreground",
					}}
				>
					<Settings className="h-5 w-5" />
					<span className="font-medium">Settings</span>
				</Link>
			</nav>

			{user && (
				<div className="p-4 border-t">
					<div className="flex items-center gap-3">
						<Avatar>
							{user.avatar_url ? (
								<img
									src={user.avatar_url}
									alt={user.username}
									className="h-full w-full object-cover"
								/>
							) : (
								<div className="h-full w-full flex items-center justify-center bg-primary text-primary-foreground text-sm font-medium">
									{user.username.charAt(0).toUpperCase()}
								</div>
							)}
						</Avatar>
						<div className="flex-1 min-w-0">
							<p className="text-sm font-medium truncate">{user.username}</p>
							<p className="text-xs text-muted-foreground truncate">
								{user.email}
							</p>
						</div>
					</div>
				</div>
			)}
		</aside>
	);
}
