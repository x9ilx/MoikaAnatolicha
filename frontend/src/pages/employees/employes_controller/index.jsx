import React from "react";
import { Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ProtectedRoute from "../../../components/protected-route";
import UserRoleRouter from "../../../components/user_role_router";
import DeletePage from "../../DELETE_page";
import { EmployerPosition } from "../../../constants";
import EmployeesSettings from "../employees_settings";
import EmployerAdd from "../employer_add";
import api from "../../../api";
import { toast } from "react-toastify";

function EmployeesController() {
  const [info_string_for_delete, set_info_string_for_delete] = React.useState("");
  const [id, set_id] = React.useState(-1);

    const navigate = useNavigate();

  const deleteEmployer = () => {
    api
      .deleteEmployer(id)
      .then((res) => {
        navigate('/employees/')
        toast.success("Сотрудник успешно удалён");
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
              path="/:employer_id/delete/"
              element={
                <>
                  <DeletePage
                    onDelete={deleteEmployer}
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
              path="/"
              element={
                <>
                  <EmployeesSettings />
                </>
              }
            />
          </Route>
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<UserRoleRouter role={EmployerPosition.MANAGER} />}>
            <Route
              path="/:employer_id/"
              element={
                <>
                  <EmployerAdd
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
              path="/:employer_id/salary/"
              element={
                <>
                  
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
                  <EmployerAdd />
                </>
              }
            />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default EmployeesController;
