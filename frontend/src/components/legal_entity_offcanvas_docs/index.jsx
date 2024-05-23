import React from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { GrDocumentText } from "react-icons/gr";
import { RiHistoryFill } from "react-icons/ri";

const LegalEntityOffcanvasDocs = (props) => {
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
            {props.legalEntity.short_name}
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <hr></hr>
        <div className="offcanvas-body text-start">
          <div className="row">
            <button
              className="btn btn-light"
              onClick={() => {
                navigate(`${props.legalEntity.id}/contract/-1/`);
              }}
              style={{ textAlign: "left" }}
            >
              <span>
                <GrDocumentText size={22} /> Сформировать договор
              </span>
            </button>
            <button
              className="btn btn-light"
              onClick={() => {
                navigate(`${props.legalEntity.id}/salary/`);
              }}
              style={{ textAlign: "left" }}
            >
              <span>
                <GrDocumentText size={22} /> Сформировать акт сдачи-приёмки
              </span>
            </button>
            <button
              className="btn btn-light mb-3"
              onClick={() => {
                navigate(`${props.legalEntity.id}/salary/`);
              }}
              style={{ textAlign: "left" }}
            >
              <span>
                <GrDocumentText size={22} /> Печать реестра ТС
              </span>
            </button>
            <hr></hr>
            <button
              className="btn btn-light"
              onClick={() => {
                navigate(`${props.legalEntity.id}/salary/`);
              }}
              style={{ textAlign: "left" }}
            >
              <span>
                <RiHistoryFill size={22} /> История договоров
              </span>
            </button>
            <button
              className="btn btn-light"
              onClick={() => {
                navigate(`${props.legalEntity.id}/salary/`);
              }}
              style={{ textAlign: "left" }}
            >
              <span>
                <RiHistoryFill size={22} /> История заказов
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

LegalEntityOffcanvasDocs.propTypes = {
  offcanvasName: PropTypes.string.isRequired,
  legalEntity: PropTypes.object.isRequired,
};

export default LegalEntityOffcanvasDocs;
