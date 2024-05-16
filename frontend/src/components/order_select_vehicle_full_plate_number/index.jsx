import React from "react";
import { IMaskInput } from "react-imask";
import PropTypes from "prop-types";
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import CreateNewVehicle from "../create_new_vehicle";

const SelectvehicleFullNumber = (props) => {
  const [noPlateNumber, setNoPlateNumber] = React.useState(false);
  const [vehicleNoPlateNumber, setVehicleNoPlateNumber] = React.useState(null);
  const id = React.useId();

  const addVehicle = (vehicle) => {
    setVehicleNoPlateNumber(vehicle);
    props.setVehicleWithNoPlateNumber(vehicle);
  };
  return (
    <>
      <div className="form-floating my-1">
        {!noPlateNumber && (
          <div className="form-floating my-1">
            <IMaskInput
              mask={props.mask}
              definitions={{
                "@": /[А-Яа-я]/,
                "#": /[0-9]/,
              }}
              onAccept={(value, mask) =>
                props.onAccept(value.toUpperCase().replace(" ", ""))
              }
              placeholder={props.placeholder}
              value={props.value}
              className={`form-control ${props.className}`}
              id={id}
              name={id}
            />
            <label htmlFor={id}>
              {props.header} ({props.placeholder}){" "}
              {props.ok && <FaCheck className="text-success" />}
              {props.notOk && <ImCross className="text-danger" />}
            </label>
          </div>
        )}

        {noPlateNumber && vehicleNoPlateNumber && (
          <div className="d-flex align-items-center">
            <div className="form-floating flex-grow-1">
              <IMaskInput
                placeholder={props.placeholder}
                value="Без гос. номера"
                className={`form-control ${props.className}`}
                id={id}
                name={id}
                disabled={true}
              />
              <label htmlFor={id} className="">
                {props.header} ({props.placeholder}){" "}
                {props.ok && <FaCheck className="text-success" />}
              </label>
            </div>
            <div className="align-middle">
              <ImCross
                size={20}
                className="text-danger flex-shrink-1 m-1  align-middle"
                style={{ cursor: "pointer" }}
                title={"Сброс"}
                onClick={() => {
                  setNoPlateNumber(false);
                  props.setNoPlateNumber(false);
                  setVehicleNoPlateNumber(null);
                }}
              />
            </div>
          </div>
        )}

        {!props.ok && (
          <div>
            <div className="form-check form-switch form-check-reverse pb-2">
              <input
                className="form-check-input "
                type="checkbox"
                id="NoPlateNumber"
                name="NoPlateNumber"
                onChange={() => {
                  setNoPlateNumber(!noPlateNumber);
                  props.setNoPlateNumber(!noPlateNumber);
                  setVehicleNoPlateNumber(null);
                }}
              />
              <label className="form-check-label" htmlFor="NoPlateNumber">
                Без гос. номера
              </label>
            </div>
          </div>
        )}

        {noPlateNumber && !vehicleNoPlateNumber && (
          <div>
            <CreateNewVehicle
              currentPlateNumber={"Без гос. номера"}
              editOwner={true}
              noPlateNumber={true}
              hideButtons={true}
              onCreate={addVehicle}
              onCancel={() => {
                setNoPlateNumber(false);
              }}
              currentVehicleClass={8}
              currentVehicleType={32}
            />
          </div>
        )}
      </div>
    </>
  );
};

SelectvehicleFullNumber.propTypes = {
  mask: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  header: PropTypes.string,
  className: PropTypes.string,
  onAccept: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  ok: PropTypes.bool,
  notOk: PropTypes.bool,
  setNoPlateNumber: PropTypes.func,
  setVehicleWithNoPlateNumber: PropTypes.func,
};

export default SelectvehicleFullNumber;
