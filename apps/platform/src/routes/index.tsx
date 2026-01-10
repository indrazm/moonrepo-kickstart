import { Button } from "@repo/ui";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ModeToggle } from "@/components/mode-toggle";

export const Route = createFileRoute("/")({
	component: LandingPage,
});

function LandingPage() {
	return (
		<div className="min-h-screen">
			{/* Header */}
			<header className="border-b sticky top-0 z-50 bg-background/80 backdrop-blur-xl">
				<div className="max-w-7xl mx-auto px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="text-xl font-bold">Moonrepo Kickstart Template</div>
						<nav className="flex items-center gap-6">
							<a
								href="https://github.com/indrazm/moonrepo-kickstart"
								target="_blank"
								rel="noopener noreferrer"
								className="text-sm font-medium hover:underline underline-offset-4"
							>
								GitHub
							</a>
							<Link
								to="/login"
								className="text-sm font-medium hover:underline underline-offset-4"
							>
								Login
							</Link>
							<ModeToggle />
							<Link to="/register">
								<Button size="sm">Get Started</Button>
							</Link>
						</nav>
					</div>
				</div>
			</header>

			{/* Hero Section */}
			<section className="border-b bg-gradient-to-b from-background via-muted/30 to-background">
				<div className="max-w-7xl mx-auto px-6 py-24">
					<div className="max-w-xl">
						<h1 className="text-5xl font-bold tracking-tight mb-6">
							Moonrepo Kickstart
						</h1>
						<p className="text-lg text-muted-foreground mb-8 leading-relaxed">
							A modern, production-ready full-stack monorepo template powered by{" "}
							<a
								href="https://moonrepo.dev"
								target="_blank"
								rel="noopener noreferrer"
								className="font-semibold underline decoration-dotted underline-offset-4"
							>
								moonrepo
							</a>
							, featuring <strong>FastAPI</strong> backend,{" "}
							<strong>React 19</strong> frontend with <strong>TanStack</strong>{" "}
							ecosystem, type-safe API communication, and built-in{" "}
							<strong>RBAC</strong>.
						</p>
						<div className="flex gap-3">
							<Link to="/register">
								<Button size="lg">Get Started</Button>
							</Link>
							<a
								href="https://github.com/indrazm/moonrepo-kickstart"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Button variant="outline" size="lg">
									View on GitHub
								</Button>
							</a>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="border-b">
				<div className="max-w-7xl mx-auto px-6 py-20">
					<div className="max-w-xl mb-12">
						<h2 className="text-3xl font-bold mb-3">Features</h2>
						<p className="text-muted-foreground">
							Everything you need to build modern full-stack applications
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
						<FeatureCard
							title="Monorepo Architecture"
							description="Organized with moonrepo for efficient task orchestration"
						/>
						<FeatureCard
							title="Type-Safe API Client"
							description="Shared TypeScript package (@repo/core) for frontend-backend communication"
						/>
						<FeatureCard
							title="Modern Frontend"
							description="React 19 with TanStack Router (file-based routing), Query, and Tailwind CSS 4"
						/>
						<FeatureCard
							title="Async Python Backend"
							description="FastAPI with SQLModel, PostgreSQL, JWT + OAuth authentication via Authlib"
						/>
						<FeatureCard
							title="OAuth Integration"
							description="Google and GitHub OAuth with automatic user linking and account creation"
						/>
						<FeatureCard
							title="Real-time Communication"
							description="WebSocket support with Redis-backed connection management for horizontal scaling"
						/>
						<FeatureCard
							title="Background Jobs"
							description="Celery integration for asynchronous task processing with Redis broker"
						/>
						<FeatureCard
							title="Database Migrations"
							description="Alembic for version-controlled schema changes with auto-generation"
						/>
						<FeatureCard
							title="Role-Based Access Control"
							description="Built-in RBAC with USER, MODERATOR, and ADMIN roles for permission management"
						/>
						<FeatureCard
							title="Developer Experience"
							description="Hot reload, DevTools, type checking, Biome formatting, and Husky pre-commit hooks"
						/>
					</div>
				</div>
			</section>

			{/* Tech Stack Section */}
			<section className="border-b bg-muted/30">
				<div className="max-w-7xl mx-auto px-6 py-20">
					<div className="max-w-xl mb-12">
						<h2 className="text-3xl font-bold mb-3">Tech Stack</h2>
						<p className="text-muted-foreground">
							Built with the latest and most powerful technologies
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<TechStackCard
							title="Frontend"
							items={[
								"React 19.2",
								"TanStack Router 1.132",
								"TanStack Query 5.66",
								"Vite 5",
								"Tailwind CSS 4",
								"TypeScript 5.7",
								"Testing Library 16",
							]}
						/>
						<TechStackCard
							title="Backend"
							items={[
								"FastAPI 0.128",
								"SQLModel + SQLAlchemy 2",
								"PostgreSQL 14+",
								"Alembic 1.17",
								"JWT + OAuth (Authlib)",
								"Celery 5.6",
								"Redis 7.1",
								"Uvicorn 0.40",
							]}
						/>
						<TechStackCard
							title="Shared & Tools"
							items={[
								"Ky (HTTP client)",
								"Moonrepo",
								"PNPM",
								"UV (Python)",
								"Biome",
								"Husky",
							]}
						/>
					</div>
				</div>
			</section>

			{/* Getting Started Section */}
			<section className="border-b">
				<div className="max-w-7xl mx-auto px-6 py-20">
					<div className="max-w-xl mb-12">
						<h2 className="text-3xl font-bold mb-3">Getting Started</h2>
						<p className="text-muted-foreground">
							Get up and running in minutes
						</p>
					</div>

					<div className="space-y-8 max-w-3xl">
						<div>
							<h3 className="text-lg font-semibold mb-4">Prerequisites</h3>
							<div className="flex flex-wrap gap-3">
								<Badge>Node.js 18+</Badge>
								<Badge>Python 3.14+</Badge>
								<Badge>PostgreSQL 14+</Badge>
								<Badge>Redis 6+</Badge>
								<Badge>PNPM, UV, Moonrepo</Badge>
							</div>
						</div>

						<div className="space-y-6">
							<Step
								number="1"
								title="Install dependencies"
								command="pnpm install && cd apps/api && uv sync"
							/>
							<Step
								number="2"
								title="Setup environment & database"
								command={`cp .env.example .env
createdb moonrepo_dev
cd apps/api && uv run alembic upgrade head`}
							/>
							<Step
								number="3"
								title="Start development servers"
								command={`moon run api:dev      # Terminal 1 (Backend at :8000)
moon run platform:dev  # Terminal 2 (Frontend at :3000)`}
							/>
						</div>

						<div className="bg-muted/50 rounded-lg p-6 space-y-3">
							<h4 className="font-semibold">Available Endpoints</h4>
							<div className="space-y-2 text-sm">
								<div className="flex items-center gap-3">
									<span className="font-mono text-xs bg-background px-2 py-1 rounded">
										:3000
									</span>
									<span className="text-muted-foreground">
										Frontend Application
									</span>
								</div>
								<div className="flex items-center gap-3">
									<span className="font-mono text-xs bg-background px-2 py-1 rounded">
										:8000
									</span>
									<span className="text-muted-foreground">Backend API</span>
								</div>
								<div className="flex items-center gap-3">
									<span className="font-mono text-xs bg-background px-2 py-1 rounded">
										:8000/docs
									</span>
									<span className="text-muted-foreground">
										API Documentation
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Architecture Section */}
			<section className="border-b bg-muted/30">
				<div className="max-w-7xl mx-auto px-6 py-20">
					<div className="max-w-xl mb-12">
						<h2 className="text-3xl font-bold mb-3">Architecture Highlights</h2>
						<p className="text-muted-foreground">
							Built on solid architectural decisions
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
						<ArchitectureCard
							title="Monorepo with Moonrepo"
							description="Efficient task orchestration, caching, and dependency management across multiple projects"
						/>
						<ArchitectureCard
							title="FastAPI + SQLModel"
							description="Modern Python async framework with SQLModel combining SQLAlchemy ORM and Pydantic validation"
						/>
						<ArchitectureCard
							title="TanStack Ecosystem"
							description="Best-in-class routing and data fetching for React with type safety"
						/>
						<ArchitectureCard
							title="Shared Type-Safe API Client"
							description="Single source of truth for types, IDE autocomplete, tRPC-like DX"
						/>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-muted/30">
				<div className="max-w-7xl mx-auto px-6 py-12">
					<div className="flex flex-col md:flex-row justify-between items-center gap-4">
						<div className="text-sm text-muted-foreground">
							Built with moonrepo, FastAPI, and React
						</div>
						<a
							href="https://github.com/indrazm/moonrepo-kickstart"
							target="_blank"
							rel="noopener noreferrer"
							className="text-sm font-medium hover:underline underline-offset-4"
						>
							github.com/indrazm/moonrepo-kickstart
						</a>
					</div>
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
		<div className="space-y-2">
			<h3 className="font-semibold">{title}</h3>
			<p className="text-sm text-muted-foreground leading-relaxed">
				{description}
			</p>
		</div>
	);
}

function TechStackCard({ title, items }: { title: string; items: string[] }) {
	return (
		<div className="space-y-4">
			<h3 className="text-xl font-semibold">{title}</h3>
			<ul className="space-y-2">
				{items.map((item) => (
					<li
						key={item}
						className="text-sm text-muted-foreground flex items-center gap-2"
					>
						<span className="w-1 h-1 rounded-full bg-foreground/40" />
						{item}
					</li>
				))}
			</ul>
		</div>
	);
}

function Badge({ children }: { children: React.ReactNode }) {
	return (
		<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-muted border">
			{children}
		</span>
	);
}

function Step({
	number,
	title,
	command,
}: {
	number: string;
	title: string;
	command: string;
}) {
	return (
		<div className="space-y-3">
			<div className="flex items-center gap-3">
				<div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
					{number}
				</div>
				<h4 className="font-semibold">{title}</h4>
			</div>
			<pre className="bg-muted/80 p-4 rounded-lg text-xs font-mono overflow-x-auto border">
				{command}
			</pre>
		</div>
	);
}

function ArchitectureCard({
	title,
	description,
}: {
	title: string;
	description: string;
}) {
	return (
		<div className="bg-background border rounded-lg p-6 space-y-2 hover:border-primary/50 transition-colors">
			<h4 className="font-semibold">{title}</h4>
			<p className="text-sm text-muted-foreground leading-relaxed">
				{description}
			</p>
		</div>
	);
}
