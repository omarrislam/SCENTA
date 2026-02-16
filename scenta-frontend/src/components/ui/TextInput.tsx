import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva("input", {
  variants: {
    inputSize: {
      default: "input--md",
      sm: "input--sm",
      lg: "input--lg"
    },
    intent: {
      default: "input--default",
      subtle: "input--subtle",
      error: "input--error"
    }
  },
  defaultVariants: {
    inputSize: "default",
    intent: "default"
  }
});

interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, inputSize, intent, ...props }, ref) => {
    return <input ref={ref} className={cn(inputVariants({ inputSize, intent }), className)} {...props} />;
  }
);

TextInput.displayName = "TextInput";

export default TextInput;
