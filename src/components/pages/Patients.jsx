import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import SearchBar from '@/components/molecules/SearchBar';
import patientService from '@/services/api/patientService';
import appointmentService from '@/services/api/appointmentService';
import ApperIcon from '@/components/ApperIcon';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const [patientsData, appointmentsData] = await Promise.all([
        patientService.getAll(),
        appointmentService.getAll()
      ]);
      
      setPatients(patientsData);
      setFilteredPatients(patientsData);
      setAppointments(appointmentsData);
    } catch (err) {
      setError(err.message || 'Failed to load patients');
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredPatients(patients);
      return;
    }

const filtered = patients.filter(patient =>
      patient.Name.toLowerCase().includes(query.toLowerCase()) ||
      patient.email.toLowerCase().includes(query.toLowerCase()) ||
      patient.phone.includes(query)
    );
    setFilteredPatients(filtered);
  };

  const getPatientAppointmentCount = (patientId) => {
return appointments.filter(apt => apt.patient_id === patientId).length;
  };

  const getLastAppointment = (patientId) => {
    const patientAppointments = appointments
      .filter(apt => apt.patientId === patientId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return patientAppointments[0];
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-surface-200 rounded w-1/4 mb-4"></div>
          <div className="h-10 bg-surface-200 rounded w-64 mb-6"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-surface-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-surface-200 rounded w-3/4 mb-1"></div>
                    <div className="h-3 bg-surface-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="h-3 bg-surface-200 rounded w-full"></div>
                <div className="h-3 bg-surface-200 rounded w-2/3"></div>
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
        <h3 className="text-lg font-medium text-surface-900 mb-2">Failed to load patients</h3>
        <p className="text-surface-500 mb-4">{error}</p>
        <Button onClick={loadPatients}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-display font-bold text-surface-900">Patients</h1>
          <p className="text-surface-500">Manage your patient records</p>
        </div>
        <Button icon="UserPlus" variant="primary">
          Add New Patient
        </Button>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <SearchBar 
          placeholder="Search patients..." 
          onSearch={handleSearch}
        />
      </div>

      {/* Patients grid */}
      {filteredPatients.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <ApperIcon name="Users" className="w-12 h-12 text-surface-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-surface-900 mb-2">No patients found</h3>
            <p className="text-surface-500 mb-4">
              {patients.length === 0 
                ? 'Start by adding your first patient'
                : 'Try adjusting your search criteria'
              }
            </p>
            <Button icon="UserPlus" variant="primary">
              Add New Patient
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{filteredPatients.map((patient, index) => {
            const appointmentCount = getPatientAppointmentCount(patient.Id);
            const lastAppointment = getLastAppointment(patient.Id);
            
            return (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center space-x-4 mb-4">
<div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-primary">
                        {patient.Name.charAt(0)}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-surface-900 truncate">{patient.Name}</h3>
                      <p className="text-sm text-surface-500 truncate">{patient.email}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-surface-600">
                    <div className="flex items-center">
                      <ApperIcon name="Phone" className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{patient.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <ApperIcon name="MapPin" className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{patient.address}</span>
                    </div>
                    <div className="flex items-center">
                      <ApperIcon name="Calendar" className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{appointmentCount} appointments</span>
                    </div>
                  </div>

                  {lastAppointment && (
                    <div className="mt-4 pt-4 border-t border-surface-200">
                      <p className="text-xs text-surface-500 mb-1">Last visit</p>
                      <p className="text-sm text-surface-700">
                        {new Date(lastAppointment.date).toLocaleDateString()} - {lastAppointment.service}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-surface-200">
                    <Button size="sm" variant="primary">
                      Book Appointment
                    </Button>
                    <div className="flex items-center space-x-2">
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
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Patients;