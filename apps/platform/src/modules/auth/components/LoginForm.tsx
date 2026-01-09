import { Button, Input, Label } from "@repo/ui";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { api } from "@/lib/api";
import { useLogin } from "../hooks/useLogin";

export function LoginForm() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const login = useLogin();
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await login.mutateAsync({ username, password });
			navigate({ to: "/" });
		} catch (error) {
			console.error("Login failed:", error);
		}
	};

	const handleGoogleLogin = async () => {
		await api.auth.loginWithGoogle();
	};

	const handleGithubLogin = async () => {
		await api.auth.loginWithGithub();
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<Label htmlFor="username">Username</Label>
				<Input
					id="username"
					type="text"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					required
				/>
			</div>
			<div>
				<Label htmlFor="password">Password</Label>
				<Input
					id="password"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
			</div>
			<Button type="submit" disabled={login.isPending} className="w-full">
				{login.isPending ? "Logging in..." : "Login"}
			</Button>
			<div className="relative">
				<div className="absolute inset-0 flex items-center">
					<span className="w-full border-t" />
				</div>
				<div className="relative flex justify-center text-xs uppercase">
					<span className="bg-background px-2 text-muted-foreground">
						Or continue with
					</span>
				</div>
			</div>
			<div className="grid grid-cols-2 gap-4">
				<Button
					type="button"
					variant="outline"
					onClick={handleGoogleLogin}
					className="w-full"
				>
					Google
				</Button>
				<Button
					type="button"
					variant="outline"
					onClick={handleGithubLogin}
					className="w-full"
				>
					GitHub
				</Button>
			</div>
		</form>
	);
}
