import React from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { GrDocumentText } from "react-icons/gr";
import { RiHistoryFill } from "react-icons/ri";
import { HiOutlineDocumentPlus } from "react-icons/hi2";
import Button from "../button";

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
                <HiOutlineDocumentPlus size={22} /> Сформировать договор
              </span>
            </button>
            <button
              className="btn btn-light"
              onClick={() => {
                navigate(`${props.legalEntity.id}/invoice/-1/`);
              }}
              style={{ textAlign: "left" }}
            >
              <span>
                <HiOutlineDocumentPlus size={22} /> Сформировать счёт на оплату
              </span>
            </button>
            <hr></hr>
            <Link
              to={`${props.legalEntity.id}/acceptance_certificate/print/`}
              target="_blank"
              className="m-0 p-0"
            >
              <button
                className="btn btn-light"
                onClick={() => {}}
                style={{ textAlign: "left" }}
              >
                <span>
                  <GrDocumentText size={22} /> Печать акта сдачи-приёмки
                </span>
              </button>
            </Link>
            <Link
              to={`${props.legalEntity.id}/vehicle_registry/print/`}
              target="_blank"
              className="m-0 p-0"
            >
              <button
                className="btn btn-light"
                onClick={() => {}}
                style={{ textAlign: "left" }}
              >
                <span>
                  <GrDocumentText size={22} /> Печать реестра ТС
                </span>
              </button>
            </Link>

            <hr></hr>
            <button
              className="btn btn-light"
              onClick={() => {
                navigate(`${props.legalEntity.id}/contracts/`);
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
                navigate(`${props.legalEntity.id}/invoices/`);
              }}
              style={{ textAlign: "left" }}
            >
              <span>
                <RiHistoryFill size={22} /> История счетов на оплату
              </span>
            </button>
            <button
              className="btn btn-light"
              onClick={() => {
                navigate("/completed/", { state: { search: props.legalEntity.short_name } });
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
