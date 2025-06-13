import inventoryData from '../mockData/inventory.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class InventoryService {
  constructor() {
    this.data = [...inventoryData];
  }

  async getAll() {
    await delay(280);
    return [...this.data];
  }

  async getById(id) {
    await delay(200);
    const item = this.data.find(inventory => inventory.id === id);
    return item ? { ...item } : null;
  }

  async create(inventory) {
    await delay(350);
    const newInventory = {
      ...inventory,
      id: Date.now().toString()
    };
    this.data.push(newInventory);
    return { ...newInventory };
  }

  async update(id, inventoryData) {
    await delay(300);
    const index = this.data.findIndex(inventory => inventory.id === id);
    if (index !== -1) {
      this.data[index] = { ...this.data[index], ...inventoryData };
      return { ...this.data[index] };
    }
    throw new Error('Inventory item not found');
  }

  async delete(id) {
    await delay(300);
    const index = this.data.findIndex(inventory => inventory.id === id);
    if (index !== -1) {
      const deleted = this.data.splice(index, 1)[0];
      return { ...deleted };
    }
    throw new Error('Inventory item not found');
  }
}

export default new InventoryService();