import * as React from "react";

import { cn } from "@/lib/utils";

codex/find-email-templates-for-dental-and-precare-coverage-bku57i
codex/find-email-templates-for-dental-and-precare-coverage-bku57i
export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

=======
 codex/find-email-templates-for-dental-and-precare-coverage-dftp26
export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>
=======
 codex/find-email-templates-for-dental-and-precare-coverage-cxc1oz
export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>
=======
 main
export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;
codex/add-skin-selector-for-color-theme
=======
main
 main

codex/integrate-revenue-and-expense-tabs-ugnmqm
 main

codex/integrate-revenue-and-expense-tabs-qmhblg
main
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
codex/integrate-revenue-and-expense-tabs-ugnmqm
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
 codex/add-skin-selector-for-color-theme
=======
codex/add-skin-selector-for-color-theme-on40yv

 main
 main
main
 main
Textarea.displayName = "Textarea";

export { Textarea };
