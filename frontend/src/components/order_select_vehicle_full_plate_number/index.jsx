import React from "react";
import { IMaskInput } from "react-imask";
import PropTypes from "prop-types";
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";

const SelectvehicleFullNumber = (props) => {
  const id = React.useId();
  return (
    <>
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
};

export default SelectvehicleFullNumber;
