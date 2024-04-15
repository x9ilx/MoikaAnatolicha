import React from "react";
import { Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ProtectedRoute from "../../../components/protected-route"
import UserRoleRouter from "../../../components/user_role_router"
import DeletePage from "../../DELETE_page"
import { EmployerPosition } from "../../../constants";
import LegalEntitySettings from "../legal_entity_settings";
import LegalEntityAdd from "../legal_entity_add";
import api from "../../../api";

function LegalEntityController() {
  const [info_string_for_delete, set_info_string_for_delete] =
    React.useState("");
  const [id, set_id] = React.useState(-1);

  const navigate = useNavigate();

  const deleteLegalEntity = () => {
    api
      .deleteLegalEntity(id)
      .then((res) => {
        navigate('/legal_entity/')
        toast.success("Контрагент успешно удалён");
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
              path="/:legal_entity_id/delete"
              element={
                <>
                  <DeletePage
                    onDelete={deleteLegalEntity}
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
                    <LegalEntitySettings />
                </>
              }
            />
          </Route>
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<UserRoleRouter role={EmployerPosition.MANAGER} />}>
            <Route
              path="/add"
              element={
                <>
                    <LegalEntityAdd />
                </>
              }
            />
          </Route>
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<UserRoleRouter role={EmployerPosition.MANAGER} />}>
            <Route
              path="/:legal_entity_id/"
              element={
                <>
                  <LegalEntityAdd
                    setInfoStringForDelete={set_info_string_for_delete}
                    setId={set_id}
                  />
                </>
              }
            />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default LegalEntityController;