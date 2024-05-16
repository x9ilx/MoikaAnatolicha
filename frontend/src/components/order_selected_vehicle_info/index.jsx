import React from "react"
import PropTypes from "prop-types";
import OrderElementGroup from "../../pages/orders/order_element_group";
import { MdModeEdit } from "react-icons/md";


const SelectedVehicleInfo = (props) => {
    return (
        <>
        <OrderElementGroup
          header={
            <>
              <div className="d-flex">
                <div className="d-flex flex-row align-middle mb-3">
                  <span>Выбранное ТС/ПП/ППЦ:</span>
                </div>
                <div className="d-flex flex-fill justify-content-end align-middle">
                  <MdModeEdit
                    size={24}
                    className="text-text-color"
                    style={{ cursor: "pointer" }}
                    title="Изменить ТС/ПП/ППЦ"
                    onClick={() => {
                      props.onSetCurrentVehicle(null);
                      props.onSetVehicleSelected(false);
                    }}
                  />
                </div>
              </div>
            </>
          }
          elements_with_badge={[
            {
              name: (
                <div className="fs-6 fw-medium">
                  {props.currentVehicle.without_plate_number ? "Без гос. номера" : props.currentVehicle.plate_number}
                </div>
              ),
              badge: "",
            },
            {
              name: (
                <div className="fs-6">
                  {props.currentVehicle?.vehicle_class_name}{" "}
                  {props.currentVehicle?.vehicle_model}
                </div>
              ),
              badge: "",
            },
            {
              name: (
                <div className="fs-6">
                  {props.currentVehicle?.vehicle_type_name}
                </div>
              ),
              badge: "",
            },
            {
              name: (
                <div className="fs-6">{props.currentVehicle?.owner_name}</div>
              ),
              badge: "",
            },
          ]}
        />
      </>
    )
}

SelectedVehicleInfo.propTypes = {
    currentVehicle: PropTypes.object.isRequired,
    onSetCurrentVehicle: PropTypes.func.isRequired,
    onSetVehicleSelected: PropTypes.func.isRequired,
  };

export default SelectedVehicleInfo;