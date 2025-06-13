import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, startOfWeek } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import appointmentService from '@/services/api/appointmentService';
import { useBranch } from '@/services/mockData/hooks';

const AppointmentCalendar = ({ onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectedBranch } = useBranch();

useEffect(() => {
    const loadAppointments = async () => {
      if (!selectedBranch) return;
      
      setLoading(true);
      try {
        const data = await appointmentService.getAll();
        const branchAppointments = data.filter(apt => apt.branch_id.toString() === selectedBranch.id.toString());
        setAppointments(branchAppointments);
      } catch (error) {
        console.error('Failed to load appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, [selectedBranch]);

const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  
  // Get the first Sunday of the week containing the first day of the month
  const calendarStart = startOfWeek(monthStart);
  // Generate 42 days (6 weeks) to ensure proper calendar grid
  const days = eachDayOfInterval({ 
    start: calendarStart, 
    end: new Date(calendarStart.getTime() + 41 * 24 * 60 * 60 * 1000)
  });

  const getAppointmentsForDate = (date) => {
    return appointments.filter(apt => 
      isSameDay(new Date(apt.date), date)
    );
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    onDateSelect?.(date);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 bg-surface-200 rounded w-1/3"></div>
            <div className="flex space-x-2">
              <div className="w-8 h-8 bg-surface-200 rounded"></div>
              <div className="w-8 h-8 bg-surface-200 rounded"></div>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {[...Array(35)].map((_, i) => (
              <div key={i} className="h-12 bg-surface-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      {/* Calendar header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-display font-bold text-surface-900">
          {format(currentDate, 'MMMM yyyy')}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
          >
            <ApperIcon name="ChevronLeft" className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
          >
            <ApperIcon name="ChevronRight" className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-surface-600">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const dayAppointments = getAppointmentsForDate(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isSelected = isSameDay(day, selectedDate);
          const isTodayDate = isToday(day);

          return (
            <motion.button
              key={day.toISOString()}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.01 }}
              onClick={() => handleDateClick(day)}
              className={`
                relative p-2 h-16 border border-surface-200 rounded-lg
                transition-all duration-150 hover:bg-surface-50
                ${!isCurrentMonth ? 'text-surface-400 bg-surface-50' : ''}
                ${isSelected ? 'bg-primary text-white hover:bg-primary' : ''}
                ${isTodayDate && !isSelected ? 'bg-primary/10 text-primary font-bold' : ''}
              `}
            >
              <div className="text-sm">
                {format(day, 'd')}
              </div>
              
              {dayAppointments.length > 0 && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                  <Badge 
                    variant={isSelected ? 'default' : 'primary'} 
                    size="sm"
                  >
                    {dayAppointments.length}
                  </Badge>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Selected date info */}
      {selectedDate && (
        <div className="mt-4 pt-4 border-t border-surface-200">
          <p className="text-sm font-medium text-surface-900 mb-2">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </p>
          <div className="flex items-center space-x-4 text-sm text-surface-600">
            <span>{getAppointmentsForDate(selectedDate).length} appointments</span>
            <button 
              onClick={() => onDateSelect?.(selectedDate)}
              className="text-primary hover:underline"
            >
              View schedule
            </button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default AppointmentCalendar;