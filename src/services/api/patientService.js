import patientData from '../mockData/patient.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class PatientService {
  constructor() {
    this.data = [...patientData];
  }

  async getAll() {
    await delay(200);
    return [...this.data];
  }

  async getById(id) {
    await delay(200);
    const item = this.data.find(patient => patient.id === id);
    return item ? { ...item } : null;
  }

  async create(patient) {
    await delay(350);
    const newPatient = {
      ...patient,
      id: Date.now().toString()
    };
    this.data.push(newPatient);
    return { ...newPatient };
  }

  async update(id, patientData) {
    await delay(300);
    const index = this.data.findIndex(patient => patient.id === id);
    if (index !== -1) {
      this.data[index] = { ...this.data[index], ...patientData };
      return { ...this.data[index] };
    }
    throw new Error('Patient not found');
  }

  async delete(id) {
    await delay(300);
    const index = this.data.findIndex(patient => patient.id === id);
    if (index !== -1) {
      const deleted = this.data.splice(index, 1)[0];
      return { ...deleted };
    }
    throw new Error('Patient not found');
  }
}

export default new PatientService();