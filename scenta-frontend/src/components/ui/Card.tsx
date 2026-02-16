import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva("card", {
  variants: {
    tone: {
      default: "card--default",
      elevated: "card--elevated",
      muted: "card--muted"
    },
    density: {
      default: "card--md",
      compact: "card--sm",
      spacious: "card--lg"
    }
  },
  defaultVariants: {
    tone: "default",
    density: "default"
  }
});

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, tone, density, ...props }, ref) => {
    return <div ref={ref} className={cn(cardVariants({ tone, density }), className)} {...props} />;
  }
);

Card.displayName = "Card";

export default Card;
