import { createFileRoute, Link } from "@tanstack/react-router";
import { LoginForm } from "../modules/auth/components/LoginForm";

export const Route = createFileRoute("/login")({
	component: LoginPage,
});

function LoginPage() {
	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="w-full max-w-md space-y-8 rounded-lg border p-8">
				<div className="text-center">
					<h1 className="text-3xl font-bold">Login</h1>
					<p className="mt-2 text-sm text-muted-foreground">
						Sign in to your account to continue
					</p>
				</div>
				<LoginForm />
				<div className="text-center text-sm">
					Don't have an account?{" "}
					<Link to="/register" className="font-medium hover:underline">
						Register
					</Link>
				</div>
			</div>
		</div>
	);
}
