import React from 'react';
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from '../../contexts/auth-context';

const UserRoleRouter = (role) => {
  const auth = useAuth();

  if (auth.employerInfo.employer_info.position != role.role) return <Navigate to="/access_denided" />;
    return <Outlet />;

}
export default UserRoleRouter;