import { Button, Card, Input, Label } from "@repo/ui";
import { useState } from "react";
import { useMe } from "@/modules/auth/hooks/useMe";
import { useUpdateProfile } from "../hooks/useUpdateProfile";

export function ProfileEditForm() {
	const { data: user } = useMe();
	const updateProfile = useUpdateProfile();

	const [formData, setFormData] = useState({
		full_name: user?.full_name || "",
		avatar_url: user?.avatar_url || "",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		updateProfile.mutate({
			full_name: formData.full_name || null,
			avatar_url: formData.avatar_url || null,
		});
	};

	const handleReset = () => {
		setFormData({
			full_name: user?.full_name || "",
			avatar_url: user?.avatar_url || "",
		});
	};

	const hasChanges =
		formData.full_name !== (user?.full_name || "") ||
		formData.avatar_url !== (user?.avatar_url || "");

	return (
		<Card className="p-6">
			<form onSubmit={handleSubmit} className="space-y-6">
				<div>
					<h3 className="text-lg font-semibold mb-4">Profile Information</h3>
					<p className="text-sm text-muted-foreground mb-6">
						Update your profile information below
					</p>
				</div>

				<div className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							value={user?.email || ""}
							disabled
							className="bg-muted"
						/>
						<p className="text-xs text-muted-foreground">
							Email cannot be changed
						</p>
					</div>

					<div className="space-y-2">
						<Label htmlFor="username">Username</Label>
						<Input
							id="username"
							value={user?.username || ""}
							disabled
							className="bg-muted"
						/>
						<p className="text-xs text-muted-foreground">
							Username cannot be changed
						</p>
					</div>

					<div className="space-y-2">
						<Label htmlFor="full_name">Full Name</Label>
						<Input
							id="full_name"
							placeholder="Enter your full name"
							value={formData.full_name}
							onChange={(e) =>
								setFormData((prev) => ({ ...prev, full_name: e.target.value }))
							}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="avatar_url">Avatar URL</Label>
						<Input
							id="avatar_url"
							type="url"
							placeholder="https://example.com/avatar.jpg"
							value={formData.avatar_url}
							onChange={(e) =>
								setFormData((prev) => ({ ...prev, avatar_url: e.target.value }))
							}
						/>
						{formData.avatar_url && (
							<div className="mt-3">
								<p className="text-sm font-medium mb-2">Preview:</p>
								<img
									src={formData.avatar_url}
									alt="Avatar preview"
									className="w-20 h-20 rounded-full object-cover border"
									onError={(e) => {
										e.currentTarget.style.display = "none";
									}}
								/>
							</div>
						)}
					</div>
				</div>

				<div className="flex gap-3 pt-4 border-t">
					<Button
						type="submit"
						disabled={!hasChanges || updateProfile.isPending}
					>
						{updateProfile.isPending ? "Saving..." : "Save Changes"}
					</Button>
					<Button
						type="button"
						variant="outline"
						onClick={handleReset}
						disabled={!hasChanges || updateProfile.isPending}
					>
						Cancel
					</Button>
				</div>
			</form>
		</Card>
	);
}
