import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';

const AppointmentCard = ({ appointment, onClick }) => {
  const statusColors = {
    scheduled: 'primary',
    confirmed: 'success',
    completed: 'success',
    cancelled: 'error',
    'no-show': 'warning'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className="p-4 cursor-pointer hover:shadow-md transition-all duration-150"
        onClick={() => onClick?.(appointment)}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-primary">
                {appointment.patientName?.charAt(0)}
              </span>
            </div>
            <div>
              <h4 className="font-medium text-surface-900">{appointment.patientName}</h4>
              <p className="text-sm text-surface-500">{appointment.service}</p>
            </div>
          </div>
          <Badge variant={statusColors[appointment.status]}>
            {appointment.status}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between text-sm text-surface-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
              <span>{appointment.time}</span>
            </div>
            <div className="flex items-center">
              <ApperIcon name="User" className="w-4 h-4 mr-1" />
              <span>{appointment.doctorName}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <ApperIcon name="Phone" className="w-4 h-4 text-surface-400" />
            <ApperIcon name="MessageSquare" className="w-4 h-4 text-surface-400" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default AppointmentCard;