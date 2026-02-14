import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const selectVariants = cva("select", {
  variants: {
    selectSize: {
      default: "",
      sm: "",
      lg: ""
    }
  },
  defaultVariants: {
    selectSize: "default"
  }
});

interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement>,
    VariantProps<typeof selectVariants> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, selectSize, ...props }, ref) => {
    return <select ref={ref} className={cn(selectVariants({ selectSize }), className)} {...props} />;
  }
);

Select.displayName = "Select";

export default Select;
