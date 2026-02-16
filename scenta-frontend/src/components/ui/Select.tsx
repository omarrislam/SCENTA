import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const selectVariants = cva("select", {
  variants: {
    selectSize: {
      default: "select--md",
      sm: "select--sm",
      lg: "select--lg"
    },
    intent: {
      default: "select--default",
      subtle: "select--subtle",
      error: "select--error"
    }
  },
  defaultVariants: {
    selectSize: "default",
    intent: "default"
  }
});

interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement>,
    VariantProps<typeof selectVariants> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, selectSize, intent, ...props }, ref) => {
    return <select ref={ref} className={cn(selectVariants({ selectSize, intent }), className)} {...props} />;
  }
);

Select.displayName = "Select";

export default Select;
