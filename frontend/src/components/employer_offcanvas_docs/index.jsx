import React from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { FaMoneyBill } from "react-icons/fa";

const EmployerOffcanvasDocs = (props) => {
  const navigate = useNavigate();

  return (
    <>
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id={props.offcanvasName}
        aria-labelledby={`${props.offcanvasName}Label`}
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id={`${props.offcanvasName}Label`}>
            {props.employer.short_name}
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <hr></hr>
        <div className="offcanvas-body">
          <div className="row">
            <button className="btn btn-light" onClick={() => {navigate(`${props.employer.id}/salary/`)}} style={{textAlign: "left"}}>
              <span>
                <FaMoneyBill size={22} />  Выдать заработную плату за период
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

EmployerOffcanvasDocs.propTypes = {
  offcanvasName: PropTypes.string.isRequired,
  employer: PropTypes.object.isRequired,
};

export default EmployerOffcanvasDocs;
