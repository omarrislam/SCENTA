import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const SectionTitle = React.forwardRef<HTMLHeadingElement, SectionTitleProps>(
  ({ className, as = "h2", children, ...props }, ref) => {
    const Comp = as;
    return (
      <Comp ref={ref} className={cn("section-title", `section-title--${as}`, className)} {...props}>
        {children}
      </Comp>
    );
  }
);
SectionTitle.displayName = "SectionTitle";

export { SectionTitle };
export default SectionTitle;
