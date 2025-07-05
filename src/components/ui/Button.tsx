"use client";
import * as React from "react";
import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Button variant configuration using class-variance-authority
 * 
 * Defines the visual variants and sizes available for the Button component.
 * Each variant has different styling for different use cases.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * Versatile button component with multiple variants and states
 * 
 * This component provides a flexible button implementation with:
 * - Multiple visual variants (default, destructive, outline, etc.)
 * - Different sizes (default, small, large, icon)
 * - Loading states with spinner animation
 * - Support for left and right icons
 * - Full accessibility support
 * - TypeScript support with proper prop types
 * 
 * The component uses class-variance-authority for consistent styling
 * and provides a clean API for different use cases.
 * 
 * @param {ButtonProps} props - Component props
 * @param {string} [props.variant="default"] - Visual variant of the button
 * @param {string} [props.size="default"] - Size of the button
 * @param {boolean} [props.loading=false] - Whether to show loading state
 * @param {React.ReactNode} [props.leftIcon] - Icon to display on the left
 * @param {React.ReactNode} [props.rightIcon] - Icon to display on the right
 * @param {boolean} [props.disabled] - Whether the button is disabled
 * @param {React.ButtonHTMLAttributes} props - Standard button HTML attributes
 * 
 * @example
 * ```tsx
 * // Basic button
 * <Button>Click me</Button>
 * 
 * // Button with variant and size
 * <Button variant="destructive" size="lg">
 *   Delete Item
 * </Button>
 * 
 * // Loading button
 * <Button loading>Processing...</Button>
 * 
 * // Button with icons
 * <Button leftIcon={<PlusIcon />} rightIcon={<ArrowIcon />}>
 *   Add Item
 * </Button>
 * 
 * // Icon-only button
 * <Button variant="ghost" size="icon">
 *   <SettingsIcon />
 * </Button>
 * ```
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading = false, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const isDisabled = disabled || loading;
    
    return (
      <button
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && leftIcon && (
          <span className="mr-2" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        {children}
        {!loading && rightIcon && (
          <span className="ml-2" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants }; 