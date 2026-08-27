import { Navigate, useRoutes } from 'react-router-dom';
import Login from '../pages/Login';
import HomePage from '../pages/Website/HomePage';
import Booking from '../pages/Website/Booking';
import DashboardLayout from '../layouts/DashboardLayout';
import Overview from '../pages/Dashboard/Overview';
import SiteMap from '../pages/Dashboard/SiteMap';
import BookingManagement from '../pages/Dashboard/BookingManagement';
import UserManagement from '../pages/Dashboard/UserManagement';
import TransactionManagement from '../pages/Dashboard/TransactionManagement';

export default function Router() {
  return useRoutes([
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/home',
      element: <HomePage />
    },
    {
      path: '/',
      element: <HomePage />
    },
    {
      path: '/booking',
      element: <Booking />,
    },
    {
      path: '/admin',
      element: <DashboardLayout />,
      children: [
        { index: true, element: <Overview /> },
        { path: 'sitemap', element: <SiteMap /> },
        { path: 'booking', element: <BookingManagement /> },
        { path: 'customers', element: <UserManagement /> },
        { path: 'revenue', element: <TransactionManagement /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/login" replace />,
    },
  ]);
}
