const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'sm',
  className = '' 
}) => {
  const variants = {
    default: 'bg-surface-100 text-surface-800',
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error',
    info: 'bg-info/10 text-info'
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  };

  return (
    <span className={`
      inline-flex items-center rounded-full font-medium
      ${variants[variant]} ${sizes[size]} ${className}
    `}>
      {children}
    </span>
  );
};

export default Badge;