import { createFileRoute } from "@tanstack/react-router";
import { ProfileEditForm } from "@/modules/profile/components/ProfileEditForm";

export const Route = createFileRoute("/_dashboardLayout/dashboard/settings")({
	component: SettingsPage,
});

function SettingsPage() {
	return (
		<div className="mx-auto max-w-4xl space-y-8">
			<div>
				<h1 className="text-4xl font-bold">Settings</h1>
				<p className="text-muted-foreground mt-2">
					Manage your account settings and preferences
				</p>
			</div>

			<div className="space-y-6">
				<div>
					<h2 className="text-xl font-semibold mb-4">Profile</h2>
					<ProfileEditForm />
				</div>
			</div>
		</div>
	);
}
