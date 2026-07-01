import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    className,
    ...props
}) {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg active:scale-95";

    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 focus:ring-blue-500",
        secondary: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm focus:ring-gray-200",
        outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500",
        ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-200"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-5 py-2.5 text-base",
        lg: "px-8 py-3.5 text-lg"
    };

    return (
        <button
            className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
            {...props}
        >
            {children}
        </button>
    );
}
