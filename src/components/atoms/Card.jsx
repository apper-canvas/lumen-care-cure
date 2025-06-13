import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = true,
  ...props 
}) => {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02 } : {}}
      className={`
        bg-white rounded-xl shadow-sm border border-surface-200 
        transition-all duration-150 max-w-full overflow-hidden
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;