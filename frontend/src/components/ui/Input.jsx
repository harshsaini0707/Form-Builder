import { forwardRef } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const Input = forwardRef(({ 
  className, 
  type = 'text',
  ...props 
}, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={twMerge(
        clsx(
          'input',
          'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          'placeholder-gray-400',
          className
        )
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input;

