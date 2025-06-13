import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { routeArray } from '@/config/routes';
import BranchSelector from '@/components/molecules/BranchSelector';
import { useBranch } from '@/services/mockData/hooks';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { selectedBranch } = useBranch();

  const currentRoute = routeArray.find(route => 
    location.pathname.startsWith(route.path)
  );

  return (
    <div className="h-screen flex overflow-hidden bg-surface-50">
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : '-100%'
        }}
        className="fixed lg:static inset-y-0 left-0 w-60 bg-white border-r border-surface-200 z-50 lg:translate-x-0 lg:z-40"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b border-surface-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <ApperIcon name="Heart" className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-display font-bold text-surface-900">Care & Cure</h1>
                <p className="text-xs text-surface-500">Dental Clinic</p>
              </div>
            </div>
          </div>

          {/* Branch Selector */}
          <div className="px-4 py-3 border-b border-surface-200">
            <BranchSelector />
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {routeArray.map((route) => (
              <NavLink
                key={route.id}
                to={route.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 ${
                    isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-surface-700 hover:bg-surface-100 hover:text-surface-900'
                  }`
                }
              >
                <ApperIcon name={route.icon} className="w-5 h-5 mr-3" />
                {route.label}
              </NavLink>
            ))}
          </nav>

          {/* User Info */}
          <div className="px-4 py-4 border-t border-surface-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-surface-200 rounded-full flex items-center justify-center">
                <ApperIcon name="User" className="w-4 h-4 text-surface-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-surface-900 truncate">Dr. Admin</p>
                <p className="text-xs text-surface-500 truncate">{selectedBranch?.name}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-surface-200 px-4 lg:px-6 py-4 flex items-center justify-between z-40">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-surface-600 hover:text-surface-900 hover:bg-surface-100 rounded-lg transition-colors"
            >
              <ApperIcon name="Menu" className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-display font-bold text-surface-900">
                {currentRoute?.label}
              </h2>
              <p className="text-sm text-surface-500">
                {selectedBranch?.name} - {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-surface-600 hover:text-surface-900 hover:bg-surface-100 rounded-lg transition-colors relative">
              <ApperIcon name="Bell" className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;