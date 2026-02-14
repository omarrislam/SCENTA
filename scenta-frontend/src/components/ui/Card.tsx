import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva("card", {
  variants: {
    tone: {
      default: "",
      elevated: "",
      muted: ""
    }
  },
  defaultVariants: {
    tone: "default"
  }
});

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, tone, ...props }, ref) => {
  return <div ref={ref} className={cn(cardVariants({ tone }), className)} {...props} />;
});

Card.displayName = "Card";

export default Card;
