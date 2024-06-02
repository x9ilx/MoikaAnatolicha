import React from "react";
import { Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ProtectedRoute from "../../../components/protected-route";
import UserRoleRouter from "../../../components/user_role_router";
import DeletePage from "../../DELETE_page";
import { EmployerPosition } from "../../../constants";
import LegalEntitySettings from "../legal_entity_settings";
import LegalEntityAdd from "../legal_entity_add";
import api from "../../../api";
import LegalEntitySetServices from "../legal_entity_set_service";
import LegalEntityContract from "../legal_entity_contract";
import LegalEntityContractPrint from "../../../print/legal_entity_contract";
import LegalEntityVehicleRegistryPrint from "../../../print/legal_entity_vehicle_registry";
import LegalEntityAcceptanceCertificatePrint from "../../../print/legal_entity_acceptance_certificate";
import LegalEntityInvoice from "../legal_entity_invoice";
import LegalEntityInvoicePrint from "../../../print/legal_entity_invoice";
import LegalEntityContractsList from "../legal_entity_contracts_list";
import LegalEntityInvoicesList from "../legal_entity_invoices_list";

function LegalEntityController() {
  const [info_string_for_delete, set_info_string_for_delete] =
    React.useState("");
  const [id, set_id] = React.useState(-1);

  const navigate = useNavigate();

  const deleteLegalEntity = () => {
    api
      .deleteLegalEntity(id)
      .then((res) => {
        navigate("/legal_entity/");
        toast.success("Контрагент успешно удалён");
      })
      .catch((err) => {
        const errors = Object.values(err);
        if (errors) {
          toast.error(errors.join(", "));
        }
      });
  };

  const deleteLegalEntityContract = () => {
    api
      .deleteLegalEntityContract(id)
      .then((res) => {
        navigate("/legal_entity/");
        toast.success("Договор успешно удалён");
      })
      .catch((err) => {
        const errors = Object.values(err);
        if (errors) {
          toast.error(errors.join(", "));
        }
      });
  };

  const deleteLegalEntityInvoice = () => {
    api
      .deleteLegalEntityInvoice(id)
      .then((res) => {
        navigate("/legal_entity/");
        toast.success("Счёт успешно удалён");
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
              path="/:legal_entity_id/delete/"
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
              path="/:legal_entity_id/contract/:contract_id/delete/"
              element={
                <>
                  <DeletePage
                    onDelete={deleteLegalEntityContract}
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
              path="/:legal_entity_id/invoice/:invoice_id/delete/"
              element={
                <>
                  <DeletePage
                    onDelete={deleteLegalEntityInvoice}
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
              path="/:legal_entity_id/contracts/"
              element={
                <>
                  <LegalEntityContractsList />
                </>
              }
            />
          </Route>
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<UserRoleRouter role={EmployerPosition.MANAGER} />}>
            <Route
              path="/:legal_entity_id/invoices/"
              element={
                <>
                  <LegalEntityInvoicesList />
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
        <Route element={<ProtectedRoute />}>
          <Route element={<UserRoleRouter role={EmployerPosition.MANAGER} />}>
            <Route
              path="/:legal_entity_id/services/"
              element={
                <>
                  <LegalEntitySetServices />
                </>
              }
            />
          </Route>
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<UserRoleRouter role={EmployerPosition.MANAGER} />}>
            <Route
              path="/:legal_entity_id/contract/:contract_id/"
              element={
                <>
                  <LegalEntityContract />
                </>
              }
            />
          </Route>
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<UserRoleRouter role={EmployerPosition.MANAGER} />}>
            <Route
              path="/:legal_entity_id/contract/:contract_id/print/"
              element={
                <>
                  <LegalEntityContractPrint />
                </>
              }
            />
          </Route>
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<UserRoleRouter role={EmployerPosition.MANAGER} />}>
            <Route
              path="/:legal_entity_id/vehicle_registry/print/"
              element={
                <>
                  <LegalEntityVehicleRegistryPrint />
                </>
              }
            />
          </Route>
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<UserRoleRouter role={EmployerPosition.MANAGER} />}>
            <Route
              path="/:legal_entity_id/acceptance_certificate/print/"
              element={
                <>
                  <LegalEntityAcceptanceCertificatePrint />
                </>
              }
            />
          </Route>
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<UserRoleRouter role={EmployerPosition.MANAGER} />}>
            <Route
              path="/:legal_entity_id/invoice/:invoice_id/"
              element={
                <>
                  <LegalEntityInvoice
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
              path="/:legal_entity_id/invoice/:invoice_id/print/"
              element={
                <>
                  <LegalEntityInvoicePrint />
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
