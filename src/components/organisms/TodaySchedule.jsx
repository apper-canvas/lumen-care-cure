import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import AppointmentCard from '@/components/molecules/AppointmentCard';
import appointmentService from '@/services/api/appointmentService';
import patientService from '@/services/api/patientService';
import staffService from '@/services/api/staffService';
import { useBranch } from '@/services/mockData/hooks';

const TodaySchedule = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { selectedBranch } = useBranch();

  useEffect(() => {
    const loadTodayAppointments = async () => {
      if (!selectedBranch) return;
      
      setLoading(true);
      setError(null);
      try {
        const [appointmentsData, patientsData, staffData] = await Promise.all([
          appointmentService.getAll(),
          patientService.getAll(),
          staffService.getAll()
        ]);

const today = new Date().toDateString();
        const todayAppointments = appointmentsData
          .filter(apt => 
            new Date(apt.date).toDateString() === today && 
            apt.branch_id === selectedBranch.id
          )
          .map(apt => {
            const patient = patientsData.find(p => p.id === apt.patientId);
            const doctor = staffData.find(s => s.id === apt.doctorId);
            return {
              ...apt,
              patientName: patient?.name || 'Unknown Patient',
              doctorName: doctor?.name || 'Unknown Doctor'
            };
          })
          .sort((a, b) => a.time.localeCompare(b.time));

        setAppointments(todayAppointments);
      } catch (err) {
        setError(err.message || 'Failed to load appointments');
        toast.error('Failed to load today\'s schedule');
      } finally {
        setLoading(false);
      }
    };

    loadTodayAppointments();
  }, [selectedBranch]);

  const handleAppointmentClick = (appointment) => {
    toast.info(`Viewing appointment for ${appointment.patientName}`);
  };

  if (loading) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-display font-bold text-surface-900 mb-4">
          Today's Schedule
        </h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse p-4 bg-surface-50 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-surface-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-surface-200 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-surface-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="flex justify-between">
                <div className="h-3 bg-surface-200 rounded w-1/4"></div>
                <div className="h-3 bg-surface-200 rounded w-1/6"></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-display font-bold text-surface-900 mb-4">
          Today's Schedule
        </h3>
        <div className="text-center py-8">
          <p className="text-error mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="text-primary hover:underline"
          >
            Try again
          </button>
        </div>
      </Card>
    );
  }

  if (appointments.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-display font-bold text-surface-900 mb-4">
          Today's Schedule
        </h3>
        <div className="text-center py-8">
          <p className="text-surface-500 mb-4">No appointments scheduled for today</p>
          <button className="text-primary hover:underline">
            Schedule an appointment
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-display font-bold text-surface-900">
          Today's Schedule
        </h3>
        <span className="text-sm text-surface-500">
          {appointments.length} appointments
        </span>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {appointments.map((appointment, index) => (
          <motion.div
            key={appointment.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <AppointmentCard 
              appointment={appointment}
              onClick={handleAppointmentClick}
            />
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

export default TodaySchedule;