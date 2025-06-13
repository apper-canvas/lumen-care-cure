import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import SearchBar from '@/components/molecules/SearchBar';
import AppointmentCalendar from '@/components/organisms/AppointmentCalendar';
import appointmentService from '@/services/api/appointmentService';
import patientService from '@/services/api/patientService';
import staffService from '@/services/api/staffService';
import { useBranch } from '@/services/mockData/hooks';
import ApperIcon from '@/components/ApperIcon';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [statusFilter, setStatusFilter] = useState('all');
  const { selectedBranch } = useBranch();

  useEffect(() => {
    loadAppointments();
  }, [selectedBranch]);

  useEffect(() => {
    filterAppointments();
  }, [appointments, selectedDate, statusFilter]);

  const loadAppointments = async () => {
    if (!selectedBranch) return;
    
    setLoading(true);
    setError(null);
    try {
      const [appointmentsData, patientsData, staffData] = await Promise.all([
        appointmentService.getAll(),
        patientService.getAll(),
        staffService.getAll()
      ]);

      const enrichedAppointments = appointmentsData
        .filter(apt => apt.branchId === selectedBranch.id)
        .map(apt => {
          const patient = patientsData.find(p => p.id === apt.patientId);
          const doctor = staffData.find(s => s.id === apt.doctorId);
          return {
            ...apt,
            patientName: patient?.name || 'Unknown Patient',
            patientPhone: patient?.phone || '',
            doctorName: doctor?.name || 'Unknown Doctor'
          };
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      setAppointments(enrichedAppointments);
    } catch (err) {
      setError(err.message || 'Failed to load appointments');
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = appointments;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(apt => apt.status === statusFilter);
    }

    setFilteredAppointments(filtered);
  };

  const handleSearch = (query) => {
    if (!query.trim()) {
      filterAppointments();
      return;
    }

    const filtered = appointments.filter(apt =>
      apt.patientName.toLowerCase().includes(query.toLowerCase()) ||
      apt.doctorName.toLowerCase().includes(query.toLowerCase()) ||
      apt.service.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredAppointments(filtered);
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      const appointment = appointments.find(apt => apt.id === appointmentId);
      await appointmentService.update(appointmentId, { ...appointment, status: newStatus });
      
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId ? { ...apt, status: newStatus } : apt
        )
      );
      
      toast.success(`Appointment ${newStatus} successfully`);
    } catch (error) {
      toast.error('Failed to update appointment status');
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'primary',
      confirmed: 'info',
      completed: 'success',
      cancelled: 'error',
      'no-show': 'warning'
    };
    return colors[status] || 'default';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-surface-200 rounded w-1/4 mb-4"></div>
          <div className="flex space-x-4 mb-6">
            <div className="h-10 bg-surface-200 rounded w-64"></div>
            <div className="h-10 bg-surface-200 rounded w-32"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                <div className="h-3 bg-surface-200 rounded w-1/2"></div>
                <div className="h-3 bg-surface-200 rounded w-1/4"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
        <h3 className="text-lg font-medium text-surface-900 mb-2">Failed to load appointments</h3>
        <p className="text-surface-500 mb-4">{error}</p>
        <Button onClick={loadAppointments}>Try Again</Button>
      </div>
    );
  }

  if (!selectedBranch) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="MapPin" className="w-12 h-12 text-surface-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-surface-900 mb-2">No branch selected</h3>
        <p className="text-surface-500">Please select a branch to view appointments</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-display font-bold text-surface-900">Appointments</h1>
          <p className="text-surface-500">Manage your clinic appointments</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button icon="Plus" variant="primary">
            New Appointment
          </Button>
          <div className="flex bg-surface-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                viewMode === 'list' ? 'bg-white text-primary shadow-sm' : 'text-surface-600'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                viewMode === 'calendar' ? 'bg-white text-primary shadow-sm' : 'text-surface-600'
              }`}
            >
              Calendar
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex-1">
          <SearchBar 
            placeholder="Search appointments..." 
            onSearch={handleSearch}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          <option value="all">All Status</option>
          <option value="scheduled">Scheduled</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="no-show">No Show</option>
        </select>
      </div>

      {/* Content */}
      {viewMode === 'calendar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AppointmentCalendar onDateSelect={handleDateSelect} />
          </div>
          <div>
            <Card className="p-6">
              <h3 className="font-display font-bold text-surface-900 mb-4">
                {format(selectedDate, 'MMMM d, yyyy')}
              </h3>
              {/* Selected date appointments would go here */}
              <p className="text-surface-500 text-sm">
                Select a date to view appointments
              </p>
            </Card>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <Card className="p-12">
              <div className="text-center">
                <ApperIcon name="Calendar" className="w-12 h-12 text-surface-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-surface-900 mb-2">No appointments found</h3>
                <p className="text-surface-500 mb-4">
                  {statusFilter !== 'all' 
                    ? `No ${statusFilter} appointments found`
                    : 'No appointments scheduled yet'
                  }
                </p>
                <Button icon="Plus" variant="primary">
                  Schedule New Appointment
                </Button>
              </div>
            </Card>
          ) : (
            filteredAppointments.map((appointment, index) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-bold text-primary">
                          {appointment.patientName.charAt(0)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-medium text-surface-900">{appointment.patientName}</h4>
                        <p className="text-sm text-surface-500">{appointment.service}</p>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-surface-600">
                          <div className="flex items-center">
                            <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
                            <span>{format(new Date(appointment.date), 'MMM d, yyyy')}</span>
                          </div>
                          <div className="flex items-center">
                            <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
                            <span>{appointment.time}</span>
                          </div>
                          <div className="flex items-center">
                            <ApperIcon name="User" className="w-4 h-4 mr-1" />
                            <span>{appointment.doctorName}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                      <Badge variant={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                      <div className="flex items-center space-x-2">
                        {appointment.status === 'scheduled' && (
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                          >
                            Confirm
                          </Button>
                        )}
                        {appointment.status === 'confirmed' && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleStatusChange(appointment.id, 'completed')}
                          >
                            Complete
                          </Button>
                        )}
                        <button className="p-1.5 text-surface-400 hover:text-surface-600 transition-colors">
                          <ApperIcon name="Phone" className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-surface-400 hover:text-surface-600 transition-colors">
                          <ApperIcon name="MessageSquare" className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-surface-400 hover:text-surface-600 transition-colors">
                          <ApperIcon name="MoreVertical" className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Appointments;