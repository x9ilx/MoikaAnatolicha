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
import AdminShiftSystem from "../employer_salary_admin_add";
import AdminShiftEdit from "../employer_salary_edit";
import EmployerSalaryListSettings from "../employer_salary_list_settings";

function EmployeesController() {
  const [info_string_for_delete, set_info_string_for_delete] = React.useState("");
  const [id, set_id] = React.useState(-1);

  const [info_string_for_delete_saary, set_info_string_for_delete_saary] = React.useState("");
  const [id_saary, set_id_saary] = React.useState(-1);

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

  const deleteSalary = () => {
    api
      .deleteSalary(id_saary)
      .then((res) => {
        navigate('/employees/salaries/')
        toast.success("ЗП успешно удалена");
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
              path="/:employer_id/salary/:salary_id/delete/"
              element={
                <>
                  <DeletePage
                    onDelete={deleteSalary}
                    info_string={info_string_for_delete_saary}
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
              element={<AdminShiftSystem />}
            />
          </Route>
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<UserRoleRouter role={EmployerPosition.MANAGER} />}>
            <Route
              path="/:employer_id/salary/:salary_id/"
              element={<AdminShiftEdit 
                setInfoStringForDelete={set_info_string_for_delete_saary}
                setId={set_id_saary}
              />}
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
        <Route element={<ProtectedRoute />}>
          <Route element={<UserRoleRouter role={EmployerPosition.MANAGER} />}>
            <Route
              path="/salaries/"
              element={
                <>
                  <EmployerSalaryListSettings />
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
