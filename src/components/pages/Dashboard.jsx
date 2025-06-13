import { motion } from 'framer-motion';
import QuickStats from '@/components/organisms/QuickStats';
import TodaySchedule from '@/components/organisms/TodaySchedule';
import AppointmentCalendar from '@/components/organisms/AppointmentCalendar';
import { useBranch } from '@/services/mockData/hooks';

const Dashboard = () => {
  const { selectedBranch } = useBranch();

  const handleDateSelect = (date) => {
    console.log('Selected date:', date);
    // Navigate to appointments page with selected date
  };

  if (!selectedBranch) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-surface-500 mb-4">Please select a branch to view dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-full">
      {/* Welcome section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-white"
      >
        <h1 className="text-2xl font-display font-bold mb-2">
          Welcome back, Dr. Admin! 👋
        </h1>
<p className="text-primary-100">
          Here's what's happening at {selectedBranch.Name} today
        </p>
      </motion.div>

      {/* Quick stats */}
      <QuickStats />

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2">
          <TodaySchedule />
        </div>

        {/* Calendar */}
        <div>
          <AppointmentCalendar onDateSelect={handleDateSelect} />
        </div>
      </div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-surface-200"
      >
        <h3 className="text-lg font-display font-bold text-surface-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'New Appointment', icon: 'Plus', color: 'bg-primary' },
            { label: 'Add Patient', icon: 'UserPlus', color: 'bg-success' },
            { label: 'View Inventory', icon: 'Package', color: 'bg-warning' },
            { label: 'Staff Schedule', icon: 'Calendar', color: 'bg-info' }
          ].map((action, index) => (
            <motion.button
              key={action.label}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex flex-col items-center p-4 rounded-lg border border-surface-200 hover:shadow-md transition-all duration-150"
            >
              <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-2`}>
                <span className="text-white text-xl">
                  {action.icon === 'Plus' && '+'}
                  {action.icon === 'UserPlus' && '👤'}
                  {action.icon === 'Package' && '📦'}
                  {action.icon === 'Calendar' && '📅'}
                </span>
              </div>
              <span className="text-sm font-medium text-surface-900">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;