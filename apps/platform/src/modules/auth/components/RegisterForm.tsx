import { Button, Input, Label } from "@repo/ui";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useLogin } from "../hooks/useLogin";
import { useRegister } from "../hooks/useRegister";

export function RegisterForm() {
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const register = useRegister();
	const login = useLogin();
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			await register.mutateAsync({ email, username, password });
			toast.success("Account created", {
				description: "Logging you in...",
			});
			await login.mutateAsync({ username, password });
			navigate({ to: "/" });
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Unable to create account. Please try again.";
			toast.error("Registration failed", {
				description: errorMessage,
			});
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<Label htmlFor="email">Email</Label>
				<Input
					id="email"
					type="email"
					value={email}
					placeholder="me@indrazm.com"
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
			</div>
			<div>
				<Label htmlFor="username">Username</Label>
				<Input
					id="username"
					type="text"
					placeholder="indrazm"
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
					placeholder="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
			</div>
			<Button type="submit" disabled={register.isPending} className="w-full">
				{register.isPending ? "Creating account..." : "Register"}
			</Button>
		</form>
	);
}
