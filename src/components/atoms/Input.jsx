import { useState, forwardRef } from 'react';
import { motion } from 'framer-motion';

const Input = forwardRef(({ 
  label, 
  error, 
  type = 'text', 
  className = '',
  ...props 
}, ref) => {
  const [focused, setFocused] = useState(false);
  const hasValue = props.value || props.defaultValue;

  return (
    <div className={`relative ${className}`}>
      <input
        ref={ref}
        type={type}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`
          w-full px-3 py-3 border rounded-lg transition-all duration-150
          focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
          ${error ? 'border-error' : 'border-surface-300'}
          ${hasValue || focused ? 'pt-6 pb-2' : ''}
        `}
        placeholder={focused ? '' : ' '}
        {...props}
      />
      
      {label && (
        <motion.label
          initial={false}
          animate={{
            y: (hasValue || focused) ? -8 : 0,
            scale: (hasValue || focused) ? 0.85 : 1,
            color: error ? '#EF4444' : focused ? '#0891B2' : '#64748B'
          }}
          className="absolute left-3 top-3 pointer-events-none origin-left transition-all duration-150"
        >
          {label}
        </motion.label>
      )}
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-error"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;