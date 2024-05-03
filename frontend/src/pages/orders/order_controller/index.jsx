import React from "react";
import { Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../api";
import { EmployerPosition } from "../../../constants";
import OrderAdd from "../order_add";
import ProtectedRoute from "../../../components/protected-route"
import UserRoleRouter from "../../../components/user_role_router"
import WorkOrderList from "../work_order_list"
import DeletePage from "../../DELETE_page"
import OrderEdit from "../order_edit";
import CompletedOrderList from "../completed_order_list";
import OrderAdd1C from "../order_add/new_1c_index";
import OrderEditV2 from "../order_edit/indexv2";

function OrderController() {
  const [info_string_for_delete, set_info_string_for_delete] =
    React.useState("");
  const [id, set_id] = React.useState(-1);

  const navigate = useNavigate();

  const deleteVehicleClass = () => {
    api
      .deleteVehicleClass(id)
      .then((res) => {
        navigate('/vehicles/classes/')
        toast.success("Класс ТС/ПЦ/ППЦ успешно удалён");
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
        toast.success("ТС/ПЦ/ППЦ успешно удалён");
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
              path="/:order_id/delete"
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
            <Route
              path="/add/:is_tractor/:have_trailer/"
              element={
                <>
                 <OrderAdd1C 
                 />
                </>
              }
            />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route
              path="/:order_id/"
              element={
                <>
                 <OrderEditV2 />
                </>
              }
            />
          </Route>
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
              path="/completed/"
              element={
                <>
                 <CompletedOrderList />
                </>
              }
            />
          </Route>
      </Routes>
    </>
  );
}

export default OrderController;
