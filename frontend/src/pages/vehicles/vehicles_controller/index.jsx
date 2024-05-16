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
import VehicleClassEdit from "../vehicle_class_edit";
import VehiclesList from "../vehicles_list";
import VehicleListSettings from "../vehicle_list_settings";
import VehicleAdd from "../vehicle_add";
import VehicleModelsSettings from "../vihicle_models_settings";

function VehiclesController() {
  const [info_string_for_delete, set_info_string_for_delete] =
    React.useState("");
  const [id, set_id] = React.useState(-1);

  const navigate = useNavigate();

  const deleteVehicleClass = () => {
    api
      .deleteVehicleClass(id)
      .then((res) => {
        navigate('/vehicles/classes/')
        toast.success("Класс ТС/ПП/ППЦ успешно удалён");
      })
      .catch((err) => {
        const errors = Object.values(err);
        if (errors) {
          toast.error(errors.join(", "));
        }
      });
  };

  const deleteVehicle = () => {
    api
      .deleteVehicle(id)
      .then((res) => {
        navigate('/vehicles/')
        toast.success("ТС/ПП/ППЦ успешно удалён");
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
              path="/:vehicle_id/delete"
              element={
                <>
                  <DeletePage
                    onDelete={deleteVehicle}
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
              path="/classes/:vehicle_id/delete"
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
        <Route element={<ProtectedRoute />}>
          <Route element={<UserRoleRouter role={EmployerPosition.MANAGER} />}>
            <Route
              path="/classes/:vehicle_class_id/"
              element={
                <>
                  <VehicleClassEdit
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
              path="/"
              element={
                <>
                  <VehicleListSettings />
                </>
              }
            />
          </Route>
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<UserRoleRouter role={EmployerPosition.MANAGER} />}>
            <Route
              path="/models/"
              element={
                <>
                  <VehicleModelsSettings />
                </>
              }
            />
          </Route>
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<UserRoleRouter role={EmployerPosition.MANAGER} />}>
            <Route
              path="/:vehicle_id/"
              element={
                <>
                  <VehicleAdd
                    setInfoStringForDelete={set_info_string_for_delete}
                    setId={set_id}
                  />
                </>
              }
            />
          </Route>
        </Route>
        <Route element={<ProtectedRoute />}>
          {/* <Route element={<UserRoleRouter role={EmployerPosition.MANAGER} />}> */}
            <Route
              path="/add/"
              element={
                <>
                  <VehicleAdd />
                </>
              }
            />
          </Route>
        {/* </Route> */}
      </Routes>
    </>
  );
}

export default VehiclesController;
