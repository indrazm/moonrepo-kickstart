import { createFileRoute, Link } from "@tanstack/react-router";
import { RegisterForm } from "../modules/auth/components/RegisterForm";

export const Route = createFileRoute("/register")({
	component: RegisterPage,
});

function RegisterPage() {
	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="w-full max-w-md space-y-8 rounded-lg border p-8">
				<div className="text-center">
					<h1 className="text-3xl font-bold">Register</h1>
					<p className="mt-2 text-sm text-muted-foreground">
						Create a new account to get started
					</p>
				</div>
				<RegisterForm />
				<div className="text-center text-sm">
					Already have an account?{" "}
					<Link to="/login" className="font-medium hover:underline">
						Login
					</Link>
				</div>
			</div>
		</div>
	);
}
