import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva("input", {
  variants: {
    inputSize: {
      default: "",
      sm: "",
      lg: ""
    }
  },
  defaultVariants: {
    inputSize: "default"
  }
});

interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, inputSize, ...props }, ref) => {
    return <input ref={ref} className={cn(inputVariants({ inputSize }), className)} {...props} />;
  }
);

TextInput.displayName = "TextInput";

export default TextInput;
