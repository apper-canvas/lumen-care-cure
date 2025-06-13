import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';

const StatCard = ({ 
  title, 
  value, 
  icon, 
  change, 
  trend = 'up',
  className = '' 
}) => {
  const trendColor = trend === 'up' ? 'text-success' : 'text-error';
  const trendIcon = trend === 'up' ? 'TrendingUp' : 'TrendingDown';

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-surface-600">{title}</p>
          <p className="text-2xl font-bold text-surface-900 mt-1">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${trendColor}`}>
              <ApperIcon name={trendIcon} className="w-3 h-3 mr-1" />
              <span>{change}</span>
            </div>
          )}
        </div>
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <ApperIcon name={icon} className="w-6 h-6 text-primary" />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StatCard;