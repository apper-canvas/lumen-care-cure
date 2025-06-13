import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import StatCard from '@/components/molecules/StatCard';
import appointmentService from '@/services/api/appointmentService';
import patientService from '@/services/api/patientService';
import staffService from '@/services/api/staffService';
import { useBranch } from '@/services/mockData/hooks';

const QuickStats = () => {
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalPatients: 0,
    activeStaff: 0,
    completedToday: 0
  });
  const [loading, setLoading] = useState(true);
  const { selectedBranch } = useBranch();

  useEffect(() => {
    const loadStats = async () => {
      if (!selectedBranch) return;
      
      setLoading(true);
      try {
        const [appointments, patients, staff] = await Promise.all([
          appointmentService.getAll(),
          patientService.getAll(),
          staffService.getAll()
        ]);

        const today = new Date().toDateString();
        const branchAppointments = appointments.filter(apt => 
          apt.branchId === selectedBranch.id
        );
        const todayAppointments = branchAppointments.filter(apt => 
          new Date(apt.date).toDateString() === today
        );
        const completedToday = todayAppointments.filter(apt => 
          apt.status === 'completed'
        ).length;

        const branchStaff = staff.filter(s => s.branchId === selectedBranch.id);

        setStats({
          todayAppointments: todayAppointments.length,
          totalPatients: patients.length,
          activeStaff: branchStaff.length,
          completedToday
        });
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [selectedBranch]);

  const statsData = [
    {
      title: "Today's Appointments",
      value: stats.todayAppointments,
      icon: 'Calendar',
      change: '+12%',
      trend: 'up'
    },
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      icon: 'Users',
      change: '+5%',
      trend: 'up'
    },
    {
      title: 'Active Staff',
      value: stats.activeStaff,
      icon: 'UserCheck',
    },
    {
      title: 'Completed Today',
      value: stats.completedToday,
      icon: 'CheckCircle',
      change: '+8%',
      trend: 'up'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-surface-200">
            <div className="animate-pulse">
              <div className="h-4 bg-surface-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-surface-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-surface-200 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <StatCard {...stat} />
        </motion.div>
      ))}
    </div>
  );
};

export default QuickStats;