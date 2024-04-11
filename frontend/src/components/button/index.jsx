import React from "react";
import PropTypes from "prop-types";

const Button = (props) => {
  return (
    <>
      <button
        type={props.type}
        className={`btn ${props.colorClass} text-white w-100 mb-3 fw-medium lh-lg`}
        style={{ textShadow: "1px -1px 7px rgba(0,0,0,0.45)" }}
        onClick={props.clickHandler}
        disabled={props.disabled}
      >
        {props.children}
      </button>
    </>
  );
};

Button.propTypes = {
  children: PropTypes.object,
  colorClass: PropTypes.string.isRequired,
  clickHandler: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
};

export default Button;
