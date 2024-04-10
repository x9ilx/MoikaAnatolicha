import React from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from "./components/protected-route";
import { useAuth } from "./contexts/auth-context";
import SignIn from "./pages/signin/index.jsx";
import Header from "./components/header/index.jsx";
import * as bootstrap from 'bootstrap'
import WorkOrderList from "./components/work_order_list/index.jsx";
import UserRoleRouter from "./components/user_role_router/index.jsx";
import { EmployerPosition } from "./constants.jsx";
import EmployeesSettings from "./pages/employees_settings/index.jsx";
import AccessDenidedPage from "./pages/access_denided/index.jsx";
import EmployerAdd from "./pages/employer_add/index.jsx";

function App() {
  const auth = useAuth();
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

  {document.title="CRM Чистый Грузовик"}
  return (
    <>
      
      <div className="container mb-3">
      {auth?.loggedIn && <Header />}
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route element={<ProtectedRoute />}>
            <Route
              path="/"
              element={
                <>
                  <WorkOrderList />
                </>
              }
            />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route
              path="/access_denided"
              element={
                <>
                  <AccessDenidedPage />
                </>
              }
            />
          </Route>
          
          <Route element={<ProtectedRoute />}>
            <Route element={<UserRoleRouter role={EmployerPosition.MANAGER}/>}>
              <Route
                path="/employees/"
                element={
                  <>
                    <EmployeesSettings />
                  </>
                }
              />
            </Route>
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route element={<UserRoleRouter role={EmployerPosition.MANAGER}/>}>
              <Route
                path="/employees/:employer_id/"
                element={
                  <>
                    <EmployerAdd />
                  </>
                }
              />
            </Route>
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route element={<UserRoleRouter role={EmployerPosition.MANAGER}/>}>
              <Route
                path="/employees/add/"
                element={
                  <>
                    <EmployerAdd />
                  </>
                }
              />
            </Route>
          </Route>
        </Routes>

        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          />
      </div>
    </>
  );
}

export default App;
