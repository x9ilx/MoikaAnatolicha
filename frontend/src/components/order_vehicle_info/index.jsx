import React from "react";
import PropTypes from "prop-types";
import Button from "../button";
import { useNavigate } from "react-router-dom";

const VehicleInfo = (props) => {
  const navigate = useNavigate();

  return (
    <div>
      {props.vehicle.hasOwnProperty("plate_number") && (
        <div className="border rounded p-2 fs-8">
          {props.showPlateNumber && (
            <p className="m-0">
              <b>
                Гос. номер:{" "}
                {props.vehicle.without_plate_number
                  ? "Без гос. номера"
                  : props.vehicle.plate_number}
              </b>
            </p>
          )}
          <p className="m-0">
            <b>Марка:</b> {props.vehicle.vehicle_model}
          </p>
          <p className="m-0">
            <b>Класс:</b>{" "}
            {props.vehicle.vehicle_type != null && (
              <>
                {props.vehicle.vehicle_type?.vehicle_class_name ||
                  props.vehicle?.vehicle_class_name}{" "}
                (
                {props.vehicle.vehicle_type?.name ||
                  props.vehicle?.vehicle_type_name}
                )
              </>
            )}
            {props.vehicle.vehicle_type === null && <span className="text-danger">Класс ТС удалён</span>}
          </p>
        </div>
      )}
      {!props.vehicle.hasOwnProperty("plate_number") &&
        !props.isNoPlateNumber &&
        props.vehiclePlateNumber.length > 7 && (
          <div className="col border rounded p-2">
            <div>
              <p className="text-danger">
                <b>{props.notFoundText}</b>
              </p>
              <Button
                clickHandler={() => {
                  navigate("/vehicles/add/");
                }}
                colorClass="btn-info btn-sm"
                disabled={false}
                type="button"
              >
                <>Добавить новые: ТС/ПП/ППЦ</>
              </Button>
            </div>
          </div>
        )}
    </div>
  );
};

VehicleInfo.propTypes = {
  vehicle: PropTypes.object.isRequired,
  vehiclePlateNumber: PropTypes.string.isRequired,
  notFoundText: PropTypes.string.isRequired,
  showOwner: PropTypes.bool,
  showPlateNumber: PropTypes.bool,
  isNoPlateNumber: PropTypes.bool,
  setNoPlateNumberChange: PropTypes.func,
};

export default VehicleInfo;
