import React from "react";
import PropTypes from "prop-types";

const Button = (props) => {
  return (
    <>
      <button
        id={props.id}
        type={props.type}
        className={`btn ${props.colorClass} text-white w-100 ${props.marginBottom != null ? "mb-"+props.marginBottom : "mb-3"} fw-medium lh-lg`}
        style={{ textShadow: "1px -1px 7px rgba(0,0,0,0.45)" }}
        onClick={props.clickHandler}
        disabled={props.disabled}
        title={props.hint}
        data-bs-toggle={props.offcanvasName ? "offcanvas": ""}
        data-bs-target={`#${props.offcanvasName}`}
        aria-controls={props.offcanvasName ? props.offcanvasName : ""}
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
  hint: PropTypes.string,
  id: PropTypes.string,
  offcanvasName: PropTypes.string,
  marginBottom: PropTypes.number,
};

export default Button;
