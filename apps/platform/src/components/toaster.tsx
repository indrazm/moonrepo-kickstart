import { Toaster as SonnerToaster } from "sonner";
import { useTheme } from "./theme-provider";

export function Toaster() {
	const { theme } = useTheme();

	return (
		<SonnerToaster
			theme={theme === "system" ? undefined : theme}
			className="toaster group"
			toastOptions={{
				classNames: {
					toast:
						"group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
					description: "group-[.toast]:text-muted-foreground",
					actionButton:
						"group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
					cancelButton:
						"group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
				},
			}}
		/>
	);
}
