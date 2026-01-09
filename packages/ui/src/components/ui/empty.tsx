import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../../lib/utils";

const Empty = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn(
			"flex w-full flex-col items-center p-8 text-center",
			className,
		)}
		{...props}
	/>
));
Empty.displayName = "Empty";

const EmptyHeader = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn("flex flex-col items-center gap-3", className)}
		{...props}
	/>
));
EmptyHeader.displayName = "EmptyHeader";

const emptyMediaVariants = cva("", {
	variants: {
		variant: {
			default: "",
			icon: "flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

export interface EmptyMediaProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof emptyMediaVariants> {}

const EmptyMedia = React.forwardRef<HTMLDivElement, EmptyMediaProps>(
	({ className, variant, ...props }, ref) => (
		<div
			ref={ref}
			className={cn(emptyMediaVariants({ variant }), className)}
			{...props}
		/>
	),
);
EmptyMedia.displayName = "EmptyMedia";

const EmptyTitle = React.forwardRef<
	HTMLHeadingElement,
	React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
	<h3
		ref={ref}
		className={cn("text-lg font-semibold tracking-tight", className)}
		{...props}
	/>
));
EmptyTitle.displayName = "EmptyTitle";

const EmptyDescription = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
	<p
		ref={ref}
		className={cn("text-sm text-muted-foreground", className)}
		{...props}
	/>
));
EmptyDescription.displayName = "EmptyDescription";

const EmptyContent = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn("mt-4 flex flex-col items-center gap-3", className)}
		{...props}
	/>
));
EmptyContent.displayName = "EmptyContent";

export {
	Empty,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
	EmptyDescription,
	EmptyContent,
};
