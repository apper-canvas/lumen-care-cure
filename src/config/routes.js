import Dashboard from '@/components/pages/Dashboard';
import Appointments from '@/components/pages/Appointments';
import Patients from '@/components/pages/Patients';
import Staff from '@/components/pages/Staff';
import Inventory from '@/components/pages/Inventory';
import Settings from '@/components/pages/Settings';

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  appointments: {
    id: 'appointments',
    label: 'Appointments',
    path: '/appointments',
    icon: 'Calendar',
    component: Appointments
  },
  patients: {
    id: 'patients',
    label: 'Patients',
    path: '/patients',
    icon: 'Users',
    component: Patients
  },
  staff: {
    id: 'staff',
    label: 'Staff',
    path: '/staff',
    icon: 'UserCheck',
    component: Staff
  },
  inventory: {
    id: 'inventory',
    label: 'Inventory',
    path: '/inventory',
    icon: 'Package',
    component: Inventory
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    component: Settings
  }
};

export const routeArray = Object.values(routes);
export default routes;