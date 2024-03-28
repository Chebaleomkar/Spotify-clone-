import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { Button } from "./ui/button";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{}


const SButton = forwardRef<HTMLButtonElement , ButtonProps >(({
    className,
    children,
    disabled,
    type = "button",
    ...props
}, ref) =>{
    return(
        <Button
         type={type}
         className={twMerge(` w-full rounded-full hover:bg-green-500 bg-green-600 border-transparent px-3 py-3 disabled:opacity-50 text-black font-bold hover:opacity-75 transition  `, className )}
          disabled={disabled}
          ref={ref}
          {...props}
        >
            {children}
        </Button>
    )
} )

SButton.displayName = "SButton";

export default SButton;
