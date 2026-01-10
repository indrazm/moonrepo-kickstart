import {
	Avatar,
	Button,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Textarea,
} from "@repo/ui";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowUp, Bot, Mic, Paperclip } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useMe } from "@/modules/auth/hooks/useMe";

export const Route = createFileRoute("/_dashboardLayout/dashboard/")({
	component: DashboardPage,
});

type Message = {
	id: string;
	role: "user" | "assistant";
	content: string;
};

function DashboardPage() {
	const { data: user } = useMe();
	const [input, setInput] = useState("");
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const [model, setModel] = useState("agent");

	// Mock messages
	const [messages, setMessages] = useState<Message[]>([
		{
			id: "1",
			role: "assistant",
			content: "Hello! I'm your AI assistant. How can I help you today?",
		},
		{
			id: "2",
			role: "user",
			content: "Can you help me design a dashboard?",
		},
		{
			id: "3",
			role: "assistant",
			content:
				"Absolutely! I can help you design a modern, user-friendly dashboard. Here are a few key principles to consider:\n\n1. **Clarity**: Keep the layout clean and focus on the most important metrics.\n2. **Consistency**: Use a consistent color palette and typography.\n3. **Hierarchy**: Organize information logically, with critical data at the top.\n\nWould you like to see some wireframe examples or discuss specific features?",
		},
	]);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, []);

	const handleSend = () => {
		if (!input.trim()) return;

		const newMessage: Message = {
			id: Date.now().toString(),
			role: "user",
			content: input,
		};

		setMessages((prev) => [...prev, newMessage]);
		setInput("");

		// Mock response delay
		setTimeout(() => {
			setMessages((prev) => [
				...prev,
				{
					id: (Date.now() + 1).toString(),
					role: "assistant",
					content:
						"That's a great point! I'll note that down. Is there anything else you'd like to add?",
				},
			]);
		}, 1000);
	};

	return (
		<div className="flex flex-col h-full bg-background text-foreground">
			{/* Model Selector Header */}
			<div className="flex items-center justify-between px-4 py-3 bg-background/95 backdrop-blur z-10">
				<Select value={model} onValueChange={setModel}>
					<SelectTrigger className="w-fit border-none shadow-none focus:ring-0 text-lg font-semibold px-2 bg-transparent hover:bg-accent/50 transition-colors gap-2">
						<SelectValue placeholder="Select Model" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="agent">Our AI Agent</SelectItem>
						<SelectItem value="gpt4">GPT-4</SelectItem>
						<SelectItem value="claude">Claude 3.5 Sonnet</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Chat Area */}
			<div className="flex-1 overflow-y-auto px-4 py-6 md:px-0">
				<div className="max-w-3xl mx-auto space-y-8">
					{messages.map((message) => (
						<div
							key={message.id}
							className={`flex gap-4 ${
								message.role === "assistant" ? "" : "justify-end"
							}`}
						>
							{message.role === "assistant" && (
								<div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shrink-0 text-white">
									<Bot size={18} />
								</div>
							)}

							<div
								className={`max-w-[80%] space-y-2 ${
									message.role === "user"
										? "bg-muted/50 px-5 py-3 rounded-3xl"
										: ""
								}`}
							>
								{message.role === "user" ? (
									<p className="whitespace-pre-wrap text-sm">
										{message.content}
									</p>
								) : (
									<div className="prose dark:prose-invert prose-sm max-w-none">
										<p className="whitespace-pre-wrap">{message.content}</p>
									</div>
								)}
							</div>

							{message.role === "user" && (
								<Avatar className="w-8 h-8 shrink-0">
									{user?.avatar_url ? (
										<img
											src={user.avatar_url}
											alt={user.username}
											className="object-cover"
										/>
									) : (
										<div className="w-full h-full bg-primary flex items-center justify-center text-primary-foreground text-xs">
											{user?.username?.slice(0, 2).toUpperCase() || "ME"}
										</div>
									)}
								</Avatar>
							)}
						</div>
					))}
					<div ref={messagesEndRef} />
				</div>
			</div>

			{/* Input Area */}
			<div className="p-4 bg-background">
				<div className="max-w-3xl mx-auto">
					<div className="relative flex flex-col bg-muted/50 rounded-3xl border focus-within:ring-1 focus-within:ring-ring focus-within:border-ring transition-all">
						<Textarea
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter" && !e.shiftKey) {
									e.preventDefault();
									handleSend();
								}
							}}
							placeholder="Message Our AI Agent"
							className="min-h-12.5 max-h-50 w-full resize-none border-0 bg-transparent py-4 px-4 focus-visible:ring-0 shadow-none"
						/>
						<div className="flex justify-between items-center px-2 pb-2">
							<div className="flex gap-2">
								<Button
									variant="ghost"
									size="icon"
									className="text-muted-foreground hover:bg-background rounded-full w-8 h-8"
								>
									<Paperclip size={18} />
								</Button>
							</div>
							<div className="flex gap-2">
								<Button
									variant="ghost"
									size="icon"
									className="text-muted-foreground hover:bg-background rounded-full w-8 h-8"
								>
									<Mic size={18} />
								</Button>
								<Button
									onClick={handleSend}
									disabled={!input.trim()}
									size="icon"
									className="rounded-full w-8 h-8 bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50"
								>
									<ArrowUp size={18} />
								</Button>
							</div>
						</div>
					</div>
					<div className="text-center mt-2">
						<p className="text-xs text-muted-foreground">
							Our AI Agent can make mistakes. Check important info.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
