import { toast } from 'react-toastify';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class AppointmentService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    await delay(250);
    try {
      const params = {
        Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'date', 'time', 'duration', 'service', 'status', 'patient_id', 'doctor_id', 'branch_id']
      };
      
      const response = await this.apperClient.fetchRecords('appointment', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching appointments:", error);
      throw error;
    }
  }

  async getById(id) {
    await delay(200);
    try {
      const params = {
        fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'date', 'time', 'duration', 'service', 'status', 'patient_id', 'doctor_id', 'branch_id']
      };
      
      const response = await this.apperClient.getRecordById('appointment', id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching appointment with ID ${id}:`, error);
      throw error;
    }
  }

  async create(appointment) {
    await delay(400);
    try {
      const params = {
        records: [{
          Name: appointment.name,
          date: appointment.date,
          time: appointment.time,
          duration: appointment.duration,
          service: appointment.service,
          status: appointment.status,
          patient_id: parseInt(appointment.patient_id),
          doctor_id: parseInt(appointment.doctor_id),
          branch_id: parseInt(appointment.branch_id)
        }]
      };
      
      const response = await this.apperClient.createRecord('appointment', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      throw error;
    }
  }

  async update(id, appointmentData) {
    await delay(300);
    try {
      const params = {
        records: [{
          Id: id,
          Name: appointmentData.name,
          date: appointmentData.date,
          time: appointmentData.time,
          duration: appointmentData.duration,
          service: appointmentData.service,
          status: appointmentData.status,
          patient_id: parseInt(appointmentData.patient_id),
          doctor_id: parseInt(appointmentData.doctor_id),
          branch_id: parseInt(appointmentData.branch_id)
        }]
      };
      
      const response = await this.apperClient.updateRecord('appointment', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
      throw error;
    }
  }

  async delete(id) {
    await delay(300);
    try {
      const params = {
        RecordIds: [id]
      };
      
      const response = await this.apperClient.deleteRecord('appointment', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
      throw error;
    }
  }
}

export default new AppointmentService();