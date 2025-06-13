import staffData from '../mockData/staff.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class StaffService {
  constructor() {
    this.data = [...staffData];
  }

  async getAll() {
    await delay(220);
    return [...this.data];
  }

  async getById(id) {
    await delay(200);
    const item = this.data.find(staff => staff.id === id);
    return item ? { ...item } : null;
  }

  async create(staff) {
    await delay(350);
    const newStaff = {
      ...staff,
      id: Date.now().toString()
    };
    this.data.push(newStaff);
    return { ...newStaff };
  }

  async update(id, staffData) {
    await delay(300);
    const index = this.data.findIndex(staff => staff.id === id);
    if (index !== -1) {
      this.data[index] = { ...this.data[index], ...staffData };
      return { ...this.data[index] };
    }
    throw new Error('Staff member not found');
  }

  async delete(id) {
    await delay(300);
    const index = this.data.findIndex(staff => staff.id === id);
    if (index !== -1) {
      const deleted = this.data.splice(index, 1)[0];
      return { ...deleted };
    }
    throw new Error('Staff member not found');
  }
}

export default new StaffService();