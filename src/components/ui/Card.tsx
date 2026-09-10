import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

interface CardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
}

export function Card({ children, className = '', onClick, interactive = false, ...props }: CardProps) {
  const baseStyle = "bg-surface rounded-3xl overflow-hidden shadow-sm border border-divider";
  const interactiveStyle = interactive ? "cursor-pointer hover:shadow-md transition-shadow" : "";
  
  if (interactive || onClick) {
    return (
      <motion.div 
        whileTap={{ scale: 0.98 }}
        className={`${baseStyle} ${interactiveStyle} ${className}`}
        onClick={onClick}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
  
  return (
    <motion.div 
      className={`${baseStyle} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
