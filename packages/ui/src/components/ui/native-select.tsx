import { ChevronDownIcon } from "lucide-react";
import * as React from "react";

import { cn } from "../../lib/utils";

export interface NativeSelectProps
	extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const NativeSelect = React.forwardRef<HTMLSelectElement, NativeSelectProps>(
	({ className, ...props }, ref) => {
		return (
			<div className="relative">
				<select
					ref={ref}
					className={cn(
						"flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>option]:bg-background md:text-sm",
						"appearance-none pr-8",
						className,
					)}
					{...props}
				/>
				<ChevronDownIcon
					className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50"
					aria-hidden="true"
				/>
			</div>
		);
	},
);
NativeSelect.displayName = "NativeSelect";

export interface NativeSelectOptionProps
	extends React.OptionHTMLAttributes<HTMLOptionElement> {}

const NativeSelectOption = React.forwardRef<
	HTMLOptionElement,
	NativeSelectOptionProps
>(({ className, ...props }, ref) => {
	return <option ref={ref} className={cn(className)} {...props} />;
});
NativeSelectOption.displayName = "NativeSelectOption";

export interface NativeSelectOptGroupProps
	extends React.OptgroupHTMLAttributes<HTMLOptGroupElement> {}

const NativeSelectOptGroup = React.forwardRef<
	HTMLOptGroupElement,
	NativeSelectOptGroupProps
>(({ className, ...props }, ref) => {
	return <optgroup ref={ref} className={cn(className)} {...props} />;
});
NativeSelectOptGroup.displayName = "NativeSelectOptGroup";

export { NativeSelect, NativeSelectOption, NativeSelectOptGroup };
