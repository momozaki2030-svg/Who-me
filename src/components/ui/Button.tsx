import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false, 
  className = '', 
  ...props 
}: ButtonProps) {
  const baseStyle = "inline-flex items-center justify-center font-bold rounded-2xl transition-colors select-none";
  
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 shadow-md",
    secondary: "bg-slate-800 text-white hover:bg-slate-900 active:bg-black shadow-md",
    outline: "bg-transparent border-2 border-divider text-content hover:bg-base active:bg-surface-hover",
    danger: "bg-rose-500 text-white hover:bg-rose-600 active:bg-rose-700 shadow-md",
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-4 text-lg",
    lg: "px-8 py-5 text-xl",
    xl: "px-10 py-6 text-2xl",
  };
  
  const widthStyle = fullWidth ? "w-full" : "";
  
  return (
    <motion.button 
      whileTap={{ scale: 0.96 }}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
