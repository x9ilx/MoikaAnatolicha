import React from "react";
import PropTypes from "prop-types";

const VehicleInfo = (props) => {
  return (
    <div>
      {props.vehicle.hasOwnProperty("plate_number") && (
        <div className="border rounded p-2 fs-8">
          {props.showPlateNumber && (
            <p className="m-0">
              <b>Гос. номер: {props.vehicle.plate_number}</b>
            </p>
          )}
          <p className="m-0">
            <b>Марка:</b> {props.vehicle.vehicle_model}
          </p>
          <p className="m-0">
            <b>Класс:</b> {props.vehicle.vehicle_type.vehicle_class_name} (
            {props.vehicle.vehicle_type.name})
          </p>
        </div>
      )}
      {!props.vehicle.hasOwnProperty("plate_number") &&
        props.vehiclePlateNumber.length > 0 && (
          <div className="col border rounded p-2">
            <div>
              <p className="m-0 text-danger">
                <b>{props.notFoundText}</b>
              </p>
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
};

export default VehicleInfo;
