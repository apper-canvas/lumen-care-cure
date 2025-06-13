import branchData from '../mockData/branch.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class BranchService {
  constructor() {
    this.data = [...branchData];
  }

  async getAll() {
    await delay(200);
    return [...this.data];
  }

  async getById(id) {
    await delay(200);
    const item = this.data.find(branch => branch.id === id);
    return item ? { ...item } : null;
  }

  async create(branch) {
    await delay(300);
    const newBranch = {
      ...branch,
      id: Date.now().toString()
    };
    this.data.push(newBranch);
    return { ...newBranch };
  }

  async update(id, branchData) {
    await delay(300);
    const index = this.data.findIndex(branch => branch.id === id);
    if (index !== -1) {
      this.data[index] = { ...this.data[index], ...branchData };
      return { ...this.data[index] };
    }
    throw new Error('Branch not found');
  }

  async delete(id) {
    await delay(300);
    const index = this.data.findIndex(branch => branch.id === id);
    if (index !== -1) {
      const deleted = this.data.splice(index, 1)[0];
      return { ...deleted };
    }
    throw new Error('Branch not found');
  }
}

export default new BranchService();