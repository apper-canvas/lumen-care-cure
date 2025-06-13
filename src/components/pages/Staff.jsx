import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import SearchBar from '@/components/molecules/SearchBar';
import staffService from '@/services/api/staffService';
import appointmentService from '@/services/api/appointmentService';
import { useBranch } from '@/services/mockData/hooks';
import ApperIcon from '@/components/ApperIcon';

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roleFilter, setRoleFilter] = useState('all');
  const { selectedBranch } = useBranch();

  useEffect(() => {
    loadStaff();
  }, [selectedBranch]);

  useEffect(() => {
    filterStaff();
  }, [staff, roleFilter]);

  const loadStaff = async () => {
    if (!selectedBranch) return;
    
    setLoading(true);
    setError(null);
    try {
      const [staffData, appointmentsData] = await Promise.all([
        staffService.getAll(),
        appointmentService.getAll()
      ]);
      
      const branchStaff = staffData.filter(s => s.branchId === selectedBranch.id);
      setStaff(branchStaff);
      setAppointments(appointmentsData);
    } catch (err) {
      setError(err.message || 'Failed to load staff');
      toast.error('Failed to load staff');
    } finally {
      setLoading(false);
    }
  };

  const filterStaff = () => {
    let filtered = staff;

    if (roleFilter !== 'all') {
      filtered = filtered.filter(s => s.role.toLowerCase() === roleFilter);
    }

    setFilteredStaff(filtered);
  };

  const handleSearch = (query) => {
    if (!query.trim()) {
      filterStaff();
      return;
    }

    const filtered = staff.filter(member =>
      member.name.toLowerCase().includes(query.toLowerCase()) ||
      member.role.toLowerCase().includes(query.toLowerCase()) ||
      member.specialization?.toLowerCase().includes(query.toLowerCase()) ||
      member.email.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredStaff(filtered);
  };

  const getTodayAppointments = (staffId) => {
    const today = new Date().toDateString();
    return appointments.filter(apt => 
      apt.doctorId === staffId && 
      new Date(apt.date).toDateString() === today
    );
  };

  const getUpcomingAppointments = (staffId) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return appointments.filter(apt => 
      apt.doctorId === staffId && 
      new Date(apt.date) >= tomorrow
    ).length;
  };

  const getRoleColor = (role) => {
    const colors = {
      doctor: 'primary',
      dentist: 'primary',
      hygienist: 'success',
      receptionist: 'info',
      assistant: 'warning'
    };
    return colors[role.toLowerCase()] || 'default';
  };

  const getRoleIcon = (role) => {
    const icons = {
      doctor: 'Stethoscope',
      dentist: 'Stethoscope',
      hygienist: 'Heart',
      receptionist: 'Phone',
      assistant: 'Users'
    };
    return icons[role.toLowerCase()] || 'User';
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
        <h3 className="text-lg font-medium text-surface-900 mb-2">Failed to load staff</h3>
        <p className="text-surface-500 mb-4">{error}</p>
        <Button onClick={loadStaff}>Try Again</Button>
      </div>
    );
  }

  if (!selectedBranch) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="MapPin" className="w-12 h-12 text-surface-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-surface-900 mb-2">No branch selected</h3>
        <p className="text-surface-500">Please select a branch to view staff</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-display font-bold text-surface-900">Staff</h1>
          <p className="text-surface-500">Manage your team at {selectedBranch.name}</p>
        </div>
        <Button icon="UserPlus" variant="primary">
          Add Staff Member
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex-1">
          <SearchBar 
            placeholder="Search staff..." 
            onSearch={handleSearch}
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          <option value="all">All Roles</option>
          <option value="doctor">Doctors</option>
          <option value="dentist">Dentists</option>
          <option value="hygienist">Hygienists</option>
          <option value="receptionist">Receptionists</option>
          <option value="assistant">Assistants</option>
        </select>
      </div>

      {/* Staff grid */}
      {filteredStaff.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <ApperIcon name="Users" className="w-12 h-12 text-surface-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-surface-900 mb-2">No staff members found</h3>
            <p className="text-surface-500 mb-4">
              {staff.length === 0 
                ? 'Start by adding your first staff member'
                : 'Try adjusting your search criteria'
              }
            </p>
            <Button icon="UserPlus" variant="primary">
              Add Staff Member
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff.map((member, index) => {
            const todayAppointments = getTodayAppointments(member.id);
            const upcomingCount = getUpcomingAppointments(member.id);
            
            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6 hover:shadow-md transition-shadow">
                  {/* Header */}
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <ApperIcon name={getRoleIcon(member.role)} className="w-6 h-6 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-surface-900 truncate">{member.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={getRoleColor(member.role)} size="sm">
                          {member.role}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-sm text-surface-600 mb-4">
                    {member.specialization && (
                      <div className="flex items-center">
                        <ApperIcon name="Award" className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{member.specialization}</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <ApperIcon name="Mail" className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{member.email}</span>
                    </div>
                    <div className="flex items-center">
                      <ApperIcon name="Phone" className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{member.phone}</span>
                    </div>
                  </div>

                  {/* Schedule info */}
                  <div className="bg-surface-50 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="text-surface-600">Today</p>
                        <p className="font-medium text-surface-900">
                          {todayAppointments.length} appointments
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-surface-600">Upcoming</p>
                        <p className="font-medium text-surface-900">
                          {upcomingCount} scheduled
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <Button size="sm" variant="primary">
                      View Schedule
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

export default Staff;