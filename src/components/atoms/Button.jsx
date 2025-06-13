import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  loading = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const variants = {
    primary: 'bg-primary text-white hover:brightness-90 shadow-sm',
    secondary: 'bg-surface-100 text-surface-900 hover:bg-surface-200',
    success: 'bg-success text-white hover:brightness-90 shadow-sm',
    warning: 'bg-warning text-white hover:brightness-90 shadow-sm',
    error: 'bg-error text-white hover:brightness-90 shadow-sm',
    outline: 'border border-surface-300 text-surface-700 hover:bg-surface-50'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-medium rounded-lg
        transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {loading && (
        <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
      )}
      {!loading && icon && (
        <ApperIcon name={icon} className="w-4 h-4 mr-2" />
      )}
      {children}
    </motion.button>
  );
};

export default Button;