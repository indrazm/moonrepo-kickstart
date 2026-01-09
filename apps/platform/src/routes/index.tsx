import { Button } from "@repo/ui";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: LandingPage,
});

function LandingPage() {
	return (
		<div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
			{/* Header */}
			<header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="text-2xl font-bold">Moonrepo Kickstart</div>
						<nav className="flex items-center gap-4">
							<Link to="/login" className="text-sm font-medium hover:underline">
								Login
							</Link>
							<Link to="/register">
								<Button>Get Started</Button>
							</Link>
						</nav>
					</div>
				</div>
			</header>

			{/* Hero Section */}
			<main className="container mx-auto px-4 py-20">
				<div className="mx-auto max-w-4xl text-center space-y-8">
					<h1 className="text-5xl font-bold tracking-tight">
						Modern Full-Stack Monorepo Template
					</h1>
					<p className="text-xl text-muted-foreground">
						A production-ready monorepo powered by{" "}
						<span className="font-semibold">moonrepo</span>, featuring FastAPI
						backend, React 19 frontend with TanStack ecosystem, and type-safe
						API communication.
					</p>
					<div className="flex justify-center gap-4">
						<Link to="/register">
							<Button size="lg">Get Started</Button>
						</Link>
						<Link to="/login">
							<Button variant="outline" size="lg">
								Sign In
							</Button>
						</Link>
					</div>
				</div>

				{/* Features Grid */}
				<div className="mx-auto max-w-6xl mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					<FeatureCard
						title="Monorepo Architecture"
						description="Organized with moonrepo for efficient task orchestration and dependency management"
					/>
					<FeatureCard
						title="Type-Safe API Client"
						description="Shared TypeScript package for seamless frontend-backend communication"
					/>
					<FeatureCard
						title="Modern Frontend"
						description="React 19 with TanStack Router, Query, and Tailwind CSS 4"
					/>
					<FeatureCard
						title="Async Python Backend"
						description="FastAPI with SQLAlchemy, PostgreSQL, and JWT authentication"
					/>
					<FeatureCard
						title="Real-time Communication"
						description="WebSocket support with Redis-backed connection management"
					/>
					<FeatureCard
						title="Background Jobs"
						description="Celery integration for asynchronous task processing"
					/>
				</div>

				{/* Tech Stack Section */}
				<div className="mx-auto max-w-4xl mt-20 space-y-6">
					<h2 className="text-3xl font-bold text-center">Tech Stack</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="rounded-lg border p-6 space-y-3">
							<h3 className="text-xl font-semibold">Frontend</h3>
							<ul className="space-y-2 text-sm text-muted-foreground">
								<li>React 19 with concurrent features</li>
								<li>TanStack Router for type-safe routing</li>
								<li>TanStack Query for server state</li>
								<li>Tailwind CSS 4 for styling</li>
								<li>Vite 7 for fast builds</li>
							</ul>
						</div>
						<div className="rounded-lg border p-6 space-y-3">
							<h3 className="text-xl font-semibold">Backend</h3>
							<ul className="space-y-2 text-sm text-muted-foreground">
								<li>FastAPI with async support</li>
								<li>SQLAlchemy 2.0 async ORM</li>
								<li>PostgreSQL database</li>
								<li>JWT authentication</li>
								<li>Celery for background jobs</li>
							</ul>
						</div>
					</div>
				</div>
			</main>

			{/* Footer */}
			<footer className="border-t mt-20 py-8">
				<div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
					<p>Built with moonrepo, FastAPI, and React</p>
				</div>
			</footer>
		</div>
	);
}

function FeatureCard({
	title,
	description,
}: {
	title: string;
	description: string;
}) {
	return (
		<div className="rounded-lg border p-6 space-y-2 hover:border-primary/50 transition-colors">
			<h3 className="text-lg font-semibold">{title}</h3>
			<p className="text-sm text-muted-foreground">{description}</p>
		</div>
	);
}
