import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { Input } from "../components/ui/input"; 

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const SInput = forwardRef<HTMLInputElement, InputProps>(({
  className,
  type,
  disabled,
  ...props
}, ref) => {
  return (
    <Input
      type={type}
      className={twMerge(
        `
        flex 
        w-full 
        rounded-md 
        bg-neutral-700
        border
        border-transparent
        px-3 
        py-3 
        text-sm 
        file:border-0 
        file:bg-transparent 
        file:text-sm 
        file:font-medium 
        placeholder:text-neutral-400 
        disabled:cursor-not-allowed 
        disabled:opacity-50
        focus:outline-none
        
      `,
        disabled && 'opacity-75',
        className
      )}
      disabled={disabled}
      ref={ref}
      {...props}
    />
  );
});

SInput.displayName = "Input"; 

export default SInput;
