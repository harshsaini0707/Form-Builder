import { forwardRef } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const variants = { 
  primary: 'btn-primary', 
  secondary: 'btn-secondary', 
  ghost: 'text-gray-700 hover:bg-gray-100' 
};

const sizes = { 
  sm: 'h-8 px-3 text-xs', 
  md: 'h-10', 
  lg: 'h-12 text-base' 
};

const Button = forwardRef(({ 
  variant = 'primary', 
  size = 'md', 
  className, 
  children,
  ...props 
}, ref) => {
  return (
    <button
      ref={ref}
      className={twMerge(
        clsx(
          'btn',
          variants[variant],
          sizes[size],
          className
        )
      )}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
