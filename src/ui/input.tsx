import clsx from "clsx";
import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, type, ...props }, ref) => {
    return (
      <div className="flex flex-col w-full">
        {label && <div className="text-dark mb-1">{label}</div>}
        <input
          type={type}
          className={clsx(
            props.disabled ? "opacity-60" : "opacity-100",
            "without-ring bg-gray  placeholder:text-border text-dark border-border w-full px-2 py-2 border rounded-md",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
