import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import patientService from '@/services/api/patientService';

const AddPatient = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    address: ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.date_of_birth) {
      newErrors.date_of_birth = 'Date of birth is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors before submitting');
      return;
    }

    setLoading(true);
    try {
      await patientService.create(formData);
      toast.success('Patient added successfully!');
      navigate('/patients');
    } catch (error) {
      console.error('Error creating patient:', error);
      toast.error('Failed to add patient. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/patients');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      date_of_birth: '',
      address: ''
    });
    setErrors({});
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-white rounded-lg shadow-sm border border-surface-200">
        <div className="px-6 py-4 border-b border-surface-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="UserPlus" className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-surface-900">Add New Patient</h1>
              <p className="text-sm text-surface-500">Enter patient details to create a new record</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Full Name" error={errors.name} required>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter patient's full name"
                disabled={loading}
              />
            </FormField>

            <FormField label="Email Address" error={errors.email} required>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="patient@example.com"
                disabled={loading}
              />
            </FormField>

            <FormField label="Phone Number" error={errors.phone} required>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="(555) 123-4567"
                disabled={loading}
              />
            </FormField>

            <FormField label="Date of Birth" error={errors.date_of_birth} required>
              <Input
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                disabled={loading}
              />
            </FormField>
          </div>

          <FormField label="Address" error={errors.address} required>
            <Input
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter complete address"
              disabled={loading}
            />
          </FormField>

          <div className="flex items-center justify-between pt-6 border-t border-surface-200">
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={resetForm}
                disabled={loading}
              >
                Reset Form
              </Button>
            </div>

            <Button
              type="submit"
              loading={loading}
              icon="UserPlus"
            >
              Add Patient
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default AddPatient;