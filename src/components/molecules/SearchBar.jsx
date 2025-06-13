import { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';

const SearchBar = ({ 
  placeholder = "Search...", 
  onSearch,
  className = '' 
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(query);
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <ApperIcon 
          name="Search" 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-4 h-4" 
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 border border-surface-300 rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                   transition-all duration-150"
        />
      </div>
    </form>
  );
};

export default SearchBar;