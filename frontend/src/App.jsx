import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/protected-route";
import { useAuth } from "./contexts/auth-context";
import SignIn from "./pages/signin/index.jsx";
import Header from "./components/header/index.jsx";
import * as bootstrap from "bootstrap";
import UserRoleRouter from "./components/user_role_router/index.jsx";
import { EmployerPosition } from "./constants.jsx";
import AccessDenidedPage from "./pages/access_denided/index.jsx";
import EmployeesController from "./pages/employees/employes_controller/index.jsx";
import VehiclesController from "./pages/vehicles/vehicles_controller/index.jsx";

import LegalEntityController from "./pages/legal_entity/legal_entity_controller/index.jsx";
import ServicesController from "./pages/services/services_controller/index.jsx";
import OrderController from "./pages/orders/order_controller/index.jsx";
import OrganistaionRequisites from "./pages/organisation_requisitions/index.jsx";
import OrganistaionSettings from "./pages/organisation_settings/index.jsx";
import Statistic from "./pages/statistic/index.jsx";

function App() {
  const auth = useAuth();
  const navigate = useNavigate();
  const headerRef = React.useRef(null);

  React.useEffect(() => {
    if (headerRef && auth?.loggedIn) {
      headerRef?.current.setUpdate(!headerRef.current.update)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate])

  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  );
  // eslint-disable-next-line no-unused-vars
  const tooltipList = [...tooltipTriggerList].map(
    (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
  );

  {
    document.title = "CRM Чистый Грузовик";
  }

  return (
    <>
      <div className="container mb-3">
        {auth?.loggedIn && <Header ref={headerRef}/>}
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route element={<ProtectedRoute />}>
            <Route
              path="/*"
              element={
                <>
                  <OrderController />
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
            <Route element={<UserRoleRouter role={EmployerPosition.MANAGER} />}>
              <Route
                path="/company/"
                element={
                  <>
                    <OrganistaionRequisites />
                  </>
                }
              />
            </Route>
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route element={<UserRoleRouter role={EmployerPosition.MANAGER} />}>
              <Route
                path="/settings/"
                element={
                  <>
                    <OrganistaionSettings />
                  </>
                }
              />
            </Route>
          </Route>
          
          <Route element={<ProtectedRoute />}>
            <Route element={<UserRoleRouter role={EmployerPosition.MANAGER} />}>
              <Route
                path="/employees/*"
                element={
                  <>
                    <EmployeesController />
                  </>
                }
              />
            </Route>
          </Route>
          <Route element={<ProtectedRoute />}>
            {/* <Route element={<UserRoleRouter role={EmployerPosition.MANAGER} />}> */}
              <Route
                path="/vehicles/*"
                element={
                  <>
                    <VehiclesController />
                  </>
                }
              />
            {/* </Route> */}
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route element={<UserRoleRouter role={EmployerPosition.MANAGER} />}>
              <Route
                path="/legal_entity/*"
                element={
                  <>
                    <LegalEntityController />
                  </>
                }
              />
            </Route>
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route element={<UserRoleRouter role={EmployerPosition.MANAGER} />}>
              <Route
                path="/services/*"
                element={
                  <>
                    <ServicesController />
                  </>
                }
              />
            </Route>
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route element={<UserRoleRouter role={EmployerPosition.MANAGER} />}>
              <Route
                path="/statistic/"
                element={
                  <>
                    <Statistic />
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
