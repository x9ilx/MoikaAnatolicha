import React from "react";
import { Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../api";
import ProtectedRoute from "../../../components/protected-route"
import UserRoleRouter from "../../../components/user_role_router"
import { EmployerPosition } from "../../../constants";
import DeletePage from "../../DELETE_page"
import ServicesSettings from "../services_settings";
import ServiceAdd from "../service_add";

function ServicesController() {
  const [info_string_for_delete, set_info_string_for_delete] =
    React.useState("");
  const [id, set_id] = React.useState(-1);

  const navigate = useNavigate();

  const deleteService = () => {
    api
      .deleteService(id)
      .then((res) => {
        navigate('/services/')
        toast.success("Услуга успешно удалена");
      })
      .catch((err) => {
        const errors = Object.values(err);
        if (errors) {
          toast.error(errors.join(", "));
        }
      });
  };

  return (
    <>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<UserRoleRouter role={EmployerPosition.MANAGER} />}>
            <Route
              path="/:service_id/delete"
              element={
                <>
                  <DeletePage
                    onDelete={deleteService}
                    info_string={info_string_for_delete}
                  />
                </>
              }
            />
          </Route>
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<UserRoleRouter role={EmployerPosition.MANAGER} />}>
            <Route
              path="/:service_id/"
              element={
                <>
                  <ServiceAdd
                    setInfoStringForDelete={set_info_string_for_delete}
                    setId={set_id}
                  />
                </>
              }
            />
          </Route>
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<UserRoleRouter role={EmployerPosition.MANAGER} />}>
            <Route
              path="/add/"
              element={
                <>
                  <ServiceAdd />
                </>
              }
            />
          </Route>
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<UserRoleRouter role={EmployerPosition.MANAGER} />}>
            <Route
              path="/"
              element={
                <>
                  <ServicesSettings />
                </>
              }
            />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default ServicesController;
