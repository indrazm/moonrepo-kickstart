import { Button, Textarea } from "@repo/ui";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	return (
		<div>
			<Textarea />
			<Button>Hello!</Button>
		</div>
	);
}
