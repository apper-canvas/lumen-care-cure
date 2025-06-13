import appointmentData from '../mockData/appointment.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class AppointmentService {
  constructor() {
    this.data = [...appointmentData];
  }

  async getAll() {
    await delay(250);
    return [...this.data];
  }

  async getById(id) {
    await delay(200);
    const item = this.data.find(appointment => appointment.id === id);
    return item ? { ...item } : null;
  }

  async create(appointment) {
    await delay(400);
    const newAppointment = {
      ...appointment,
      id: Date.now().toString()
    };
    this.data.push(newAppointment);
    return { ...newAppointment };
  }

  async update(id, appointmentData) {
    await delay(300);
    const index = this.data.findIndex(appointment => appointment.id === id);
    if (index !== -1) {
      this.data[index] = { ...this.data[index], ...appointmentData };
      return { ...this.data[index] };
    }
    throw new Error('Appointment not found');
  }

  async delete(id) {
    await delay(300);
    const index = this.data.findIndex(appointment => appointment.id === id);
    if (index !== -1) {
      const deleted = this.data.splice(index, 1)[0];
      return { ...deleted };
    }
    throw new Error('Appointment not found');
  }
}

export default new AppointmentService();