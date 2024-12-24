import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { useAppSelector } from './hooks';

const Layout = () => {
  const { user } = useAppSelector((state) => state.user);
  const location = useLocation();

  return user?.token ? (
    <Outlet></Outlet>
  ) : (
    <Navigate to={'/login'} state={{ from: location }} replace></Navigate>
  );
};

export default Layout;
