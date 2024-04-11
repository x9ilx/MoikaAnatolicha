import React from "react";
import { Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../api";
import ProtectedRoute from "../../../components/protected-route";
import { EmployerPosition } from "../../../constants";
import UserRoleRouter from "../../../components/user_role_router";
import DeletePage from "../../DELETE_page";
import VehicleClassSettings from "../vehicles_class_settings";
import VehicleClassAdd from "../vehicles_class_add";

function VehiclesController() {
  const [info_string_for_delete, set_info_string_for_delete] =
    React.useState("");
  const [id, set_id] = React.useState(-1);

  const navigate = useNavigate();

  const deleteVehicleClass = () => {
    // api
    //   .deleteVehicle(id)
    //   .then((res) => {
    //     navigate('/employees/')
    //     toast.success("Сотрудник успешно удалён");
    //   })
    //   .catch((err) => {
    //     const errors = Object.values(err);
    //     if (errors) {
    //       toast.error(errors.join(", "));
    //     }
    //   });
  };

  return (
    <>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<UserRoleRouter role={EmployerPosition.MANAGER} />}>
            <Route
              path="/classes/:class_id/delete"
              element={
                <>
                  <DeletePage
                    onDelete={deleteVehicleClass}
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
              path="/classes/"
              element={
                <>
                  <VehicleClassSettings />
                </>
              }
            />
          </Route>
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<UserRoleRouter role={EmployerPosition.MANAGER} />}>
            <Route
              path="/classes/add"
              element={
                <>
                  <VehicleClassAdd />
                </>
              }
            />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default VehiclesController;
