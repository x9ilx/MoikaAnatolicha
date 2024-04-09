import React from "react";
import PropTypes from "prop-types";

const OrderElementGroup = (props) => {
  return (
    <>
    <div className="p-1">
      <p className="px-2 pb-1 fs-7 m-0 fw-medium">{props?.header}</p>
      <ul className="list-group  px-2 ">
        {
            Object.keys(props?.elements_with_badge).map((key) => (
                <li className="list-group-item p-2 border-primary" key={key}>
                    <div className="row">
                        <div className="col text-start">{key}</div>
                        <div className="col text-end px-3">
                        {/* <span className="badge text-bg-primary text-white  text-end"> */}
                            <span className="fw-medium">{props?.elements_with_badge[key]}</span>
                        {/* </span> */}
                        </div>
                    </div>
                </li>
            ))
        }
      </ul>
      </div>
    </>
  );
};

OrderElementGroup.propTypes = {
  header: PropTypes.string.isRequired,
  elements_with_badge: PropTypes.object.isRequired,
};

export default OrderElementGroup;
