import { useState, useEffect } from 'react';
import branchService from '../api/branchService';

export const useBranch = () => {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBranches = async () => {
      try {
        const data = await branchService.getAll();
        setBranches(data);
        if (data.length > 0 && !selectedBranch) {
          setSelectedBranch(data[0]);
        }
      } catch (error) {
        console.error('Failed to load branches:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBranches();
  }, []);

  const updateBranch = async (id, branchData) => {
    const updated = await branchService.update(id, branchData);
    setBranches(prev => prev.map(branch => 
      branch.id === id ? updated : branch
    ));
    if (selectedBranch?.id === id) {
      setSelectedBranch(updated);
    }
    return updated;
  };

  return {
    branches,
    selectedBranch,
    setSelectedBranch,
    updateBranch,
    loading
  };
};