import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import SearchBar from '@/components/molecules/SearchBar';
import inventoryService from '@/services/api/inventoryService';
import { useBranch } from '@/services/mockData/hooks';
import ApperIcon from '@/components/ApperIcon';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const { selectedBranch } = useBranch();

  useEffect(() => {
    loadInventory();
  }, [selectedBranch]);

  useEffect(() => {
    filterInventory();
  }, [inventory, categoryFilter, stockFilter]);

  const loadInventory = async () => {
    if (!selectedBranch) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await inventoryService.getAll();
const branchInventory = data.filter(item => item.branch_id === selectedBranch.id);
      setInventory(branchInventory);
    } catch (err) {
      setError(err.message || 'Failed to load inventory');
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const filterInventory = () => {
    let filtered = inventory;

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => 
item.category.toLowerCase() === categoryFilter
      );
    }

    if (stockFilter === 'low') {
filtered = filtered.filter(item => item.quantity <= item.min_stock);
    } else if (stockFilter === 'out') {
      filtered = filtered.filter(item => item.quantity === 0);
    }

    setFilteredInventory(filtered);
  };

  const handleSearch = (query) => {
    if (!query.trim()) {
      filterInventory();
      return;
    }

const filtered = inventory.filter(item =>
      item.Name.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredInventory(filtered);
  };

  const getStockStatus = (item) => {
    if (item.quantity === 0) return { status: 'Out of Stock', variant: 'error' };
    if (item.quantity <= item.minStock) return { status: 'Low Stock', variant: 'warning' };
    return { status: 'In Stock', variant: 'success' };
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'dental-tools': 'Wrench',
      'medications': 'Pill',
      'consumables': 'Package',
      'equipment': 'Monitor',
      'office-supplies': 'Paperclip'
    };
    return icons[category.toLowerCase()] || 'Package';
  };

  const getUniqueCategories = () => {
    const categories = [...new Set(inventory.map(item => item.category))];
    return categories.sort();
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
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-surface-200">
                {[...Array(6)].map((_, i) => (
                  <th key={i} className="px-6 py-3">
                    <div className="h-4 bg-surface-200 rounded"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-surface-200">
                  {[...Array(6)].map((_, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 bg-surface-200 rounded"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
        <h3 className="text-lg font-medium text-surface-900 mb-2">Failed to load inventory</h3>
        <p className="text-surface-500 mb-4">{error}</p>
        <Button onClick={loadInventory}>Try Again</Button>
      </div>
    );
  }

  if (!selectedBranch) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="MapPin" className="w-12 h-12 text-surface-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-surface-900 mb-2">No branch selected</h3>
        <p className="text-surface-500">Please select a branch to view inventory</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-display font-bold text-surface-900">Inventory</h1>
          <p className="text-surface-500">Manage stock at {selectedBranch.name}</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button icon="Download" variant="secondary">
            Export
          </Button>
          <Button icon="Plus" variant="primary">
            Add Item
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="Package" className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-surface-600">Total Items</p>
              <p className="text-xl font-bold text-surface-900">{inventory.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="AlertTriangle" className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-surface-600">Low Stock</p>
              <p className="text-xl font-bold text-surface-900">
{inventory.filter(item => item.quantity <= item.min_stock && item.quantity > 0).length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="XCircle" className="w-5 h-5 text-error" />
            </div>
            <div>
              <p className="text-sm text-surface-600">Out of Stock</p>
              <p className="text-xl font-bold text-surface-900">
                {inventory.filter(item => item.quantity === 0).length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="CheckCircle" className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-surface-600">Categories</p>
              <p className="text-xl font-bold text-surface-900">{getUniqueCategories().length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="flex-1">
          <SearchBar 
            placeholder="Search inventory..." 
            onSearch={handleSearch}
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          <option value="all">All Categories</option>
          {getUniqueCategories().map(category => (
            <option key={category} value={category.toLowerCase()}>
              {category}
            </option>
          ))}
        </select>
        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          <option value="all">All Stock Levels</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>

      {/* Inventory table */}
      {filteredInventory.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <ApperIcon name="Package" className="w-12 h-12 text-surface-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-surface-900 mb-2">No items found</h3>
            <p className="text-surface-500 mb-4">
              {inventory.length === 0 
                ? 'Start by adding your first inventory item'
                : 'Try adjusting your search criteria'
              }
            </p>
            <Button icon="Plus" variant="primary">
              Add Item
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-surface-200">
              <thead className="bg-surface-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                    Min Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-surface-200">
                {filteredInventory.map((item, index) => {
                  const stockStatus = getStockStatus(item);
                  
                  return (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className="hover:bg-surface-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-surface-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                            <ApperIcon 
                              name={getCategoryIcon(item.category)} 
                              className="w-5 h-5 text-surface-600" 
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-surface-900 truncate">
{item.Name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="default" size="sm">
                          {item.category}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-900">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-500">
{item.min_stock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={stockStatus.variant} size="sm">
                          {stockStatus.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="primary">
                            Update
                          </Button>
                          <button className="p-1.5 text-surface-400 hover:text-surface-600 transition-colors">
                            <ApperIcon name="MoreVertical" className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Inventory;