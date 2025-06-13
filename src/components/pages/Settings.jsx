import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Input from '@/components/atoms/Input';
import { useBranch } from '@/services/mockData/hooks';
import ApperIcon from '@/components/ApperIcon';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('branch');
  const { selectedBranch, branches, updateBranch } = useBranch();
  const [branchData, setBranchData] = useState({
    name: selectedBranch?.name || '',
    address: selectedBranch?.address || '',
    phone: selectedBranch?.phone || '',
    email: selectedBranch?.email || ''
  });
  const [loading, setLoading] = useState(false);

  const sections = [
    { id: 'branch', label: 'Branch Settings', icon: 'Building' },
    { id: 'staff', label: 'Staff Management', icon: 'Users' },
    { id: 'appointments', label: 'Appointment Settings', icon: 'Calendar' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'security', label: 'Security', icon: 'Shield' }
  ];

  const handleBranchUpdate = async (e) => {
    e.preventDefault();
    if (!selectedBranch) return;

    setLoading(true);
    try {
      await updateBranch(selectedBranch.id, branchData);
      toast.success('Branch settings updated successfully');
    } catch (error) {
      toast.error('Failed to update branch settings');
    } finally {
      setLoading(false);
    }
  };

  const renderBranchSettings = () => (
    <Card className="p-6">
      <h3 className="text-lg font-display font-bold text-surface-900 mb-6">
        Branch Information
      </h3>
      
      <form onSubmit={handleBranchUpdate} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Branch Name"
            value={branchData.name}
            onChange={(e) => setBranchData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
          <Input
            label="Phone Number"
            value={branchData.phone}
            onChange={(e) => setBranchData(prev => ({ ...prev, phone: e.target.value }))}
            required
          />
        </div>
        
        <Input
          label="Email Address"
          type="email"
          value={branchData.email}
          onChange={(e) => setBranchData(prev => ({ ...prev, email: e.target.value }))}
          required
        />
        
        <Input
          label="Address"
          value={branchData.address}
          onChange={(e) => setBranchData(prev => ({ ...prev, address: e.target.value }))}
          required
        />
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            loading={loading}
            disabled={!selectedBranch}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Card>
  );

  const renderStaffSettings = () => (
    <Card className="p-6">
      <h3 className="text-lg font-display font-bold text-surface-900 mb-6">
        Staff Management
      </h3>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-surface-50 rounded-lg">
          <div>
            <h4 className="font-medium text-surface-900">Working Hours</h4>
            <p className="text-sm text-surface-500">Set default working hours for staff</p>
          </div>
          <Button variant="secondary" size="sm">Configure</Button>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-surface-50 rounded-lg">
          <div>
            <h4 className="font-medium text-surface-900">Role Permissions</h4>
            <p className="text-sm text-surface-500">Manage what each role can access</p>
          </div>
          <Button variant="secondary" size="sm">Manage</Button>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-surface-50 rounded-lg">
          <div>
            <h4 className="font-medium text-surface-900">Attendance Tracking</h4>
            <p className="text-sm text-surface-500">Enable staff attendance monitoring</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>
    </Card>
  );

  const renderAppointmentSettings = () => (
    <Card className="p-6">
      <h3 className="text-lg font-display font-bold text-surface-900 mb-6">
        Appointment Configuration
      </h3>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">
              Default Appointment Duration
            </label>
            <select className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
              <option>30 minutes</option>
              <option>45 minutes</option>
              <option>60 minutes</option>
              <option>90 minutes</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">
              Booking Window
            </label>
            <select className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
              <option>30 days</option>
              <option>60 days</option>
              <option>90 days</option>
              <option>No limit</option>
            </select>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-surface-900">Auto-confirmation</h4>
              <p className="text-sm text-surface-500">Automatically confirm appointments</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-surface-900">SMS Reminders</h4>
              <p className="text-sm text-surface-500">Send SMS reminders to patients</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>
    </Card>
  );

  const renderNotificationSettings = () => (
    <Card className="p-6">
      <h3 className="text-lg font-display font-bold text-surface-900 mb-6">
        Notification Preferences
      </h3>
      
      <div className="space-y-4">
        {[
          { label: 'New Appointments', description: 'Get notified when new appointments are booked' },
          { label: 'Appointment Cancellations', description: 'Get notified when appointments are cancelled' },
          { label: 'Low Inventory Alerts', description: 'Get notified when inventory is running low' },
          { label: 'Staff Schedule Changes', description: 'Get notified when staff schedules are modified' },
          { label: 'Patient No-shows', description: 'Get notified when patients miss appointments' }
        ].map((notification, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-surface-50 rounded-lg">
            <div>
              <h4 className="font-medium text-surface-900">{notification.label}</h4>
              <p className="text-sm text-surface-500">{notification.description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked={index < 3} />
              <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        ))}
      </div>
    </Card>
  );

  const renderSecuritySettings = () => (
    <Card className="p-6">
      <h3 className="text-lg font-display font-bold text-surface-900 mb-6">
        Security Settings
      </h3>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-surface-50 rounded-lg">
            <div>
              <h4 className="font-medium text-surface-900">Two-Factor Authentication</h4>
              <p className="text-sm text-surface-500">Add an extra layer of security</p>
            </div>
            <Button variant="secondary" size="sm">Enable</Button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-surface-50 rounded-lg">
            <div>
              <h4 className="font-medium text-surface-900">Session Timeout</h4>
              <p className="text-sm text-surface-500">Automatically log out after inactivity</p>
            </div>
            <select className="px-3 py-1.5 text-sm border border-surface-300 rounded">
              <option>30 minutes</option>
              <option>1 hour</option>
              <option>2 hours</option>
              <option>Never</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-surface-50 rounded-lg">
            <div>
              <h4 className="font-medium text-surface-900">Data Backup</h4>
              <p className="text-sm text-surface-500">Automatic daily backups</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
        
        <div className="pt-4 border-t border-surface-200">
          <Button variant="error">
            Reset All Settings
          </Button>
        </div>
      </div>
    </Card>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'branch': return renderBranchSettings();
      case 'staff': return renderStaffSettings();
      case 'appointments': return renderAppointmentSettings();
      case 'notifications': return renderNotificationSettings();
      case 'security': return renderSecuritySettings();
      default: return renderBranchSettings();
    }
  };

  return (
    <div className="space-y-6 max-w-full">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-surface-900">Settings</h1>
        <p className="text-surface-500">Configure your clinic preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                    activeSection === section.id
                      ? 'bg-primary text-white'
                      : 'text-surface-700 hover:bg-surface-100'
                  }`}
                >
                  <ApperIcon name={section.icon} className="w-4 h-4 mr-3" />
                  {section.label}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;