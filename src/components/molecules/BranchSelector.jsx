import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { useBranch } from '@/services/mockData/hooks';

const BranchSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { branches, selectedBranch, setSelectedBranch } = useBranch();

  const handleSelect = (branch) => {
    setSelectedBranch(branch);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-sm 
                 bg-surface-50 border border-surface-200 rounded-lg
                 hover:bg-surface-100 transition-colors"
      >
        <div className="flex items-center space-x-2 min-w-0">
          <ApperIcon name="MapPin" className="w-4 h-4 text-primary flex-shrink-0" />
          <span className="font-medium text-surface-900 truncate">
            {selectedBranch?.name || 'Select Branch'}
          </span>
        </div>
        <ApperIcon 
          name="ChevronDown" 
          className={`w-4 h-4 text-surface-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-surface-200 
                     rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto"
          >
            {branches.map((branch) => (
              <button
                key={branch.id}
                onClick={() => handleSelect(branch)}
                className="w-full flex items-center px-3 py-2 text-sm text-left
                         hover:bg-surface-50 transition-colors min-w-0"
              >
                <div className="flex items-center space-x-2 min-w-0">
                  <ApperIcon name="Building" className="w-4 h-4 text-surface-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-surface-900 truncate">{branch.name}</p>
                    <p className="text-xs text-surface-500 truncate">{branch.address}</p>
                  </div>
                </div>
                {selectedBranch?.id === branch.id && (
                  <ApperIcon name="Check" className="w-4 h-4 text-primary ml-auto flex-shrink-0" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BranchSelector;