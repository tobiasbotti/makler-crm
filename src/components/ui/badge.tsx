import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-zinc-50 text-zinc-900 shadow",
        secondary: "border-transparent bg-zinc-800 text-zinc-50",
        destructive: "border-transparent bg-red-600 text-zinc-50 shadow",
        outline: "text-zinc-300 border-zinc-700",
        neu: "border-transparent bg-blue-500/20 text-blue-400",
        kontaktiert: "border-transparent bg-yellow-500/20 text-yellow-400",
        qualifiziert: "border-transparent bg-emerald-500/20 text-emerald-400",
        abgeschlossen: "border-transparent bg-purple-500/20 text-purple-400",
        verloren: "border-transparent bg-red-500/20 text-red-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
