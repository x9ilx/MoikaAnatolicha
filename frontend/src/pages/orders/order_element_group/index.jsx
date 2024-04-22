import React from "react";
import PropTypes from "prop-types";

const OrderElementGroup = (props) => {
  return (
    <>
      <div className="p-1">
        <p className="px-2 pb-1 fs-7 m-0 fw-medium ">{props?.header}</p>
        <ul className="list-group  px-2 ">
          {props?.elements_with_badge?.map((value, index) => (
            <li className="list-group-item p-2 " key={value.name + index}>
              <div className="row ">
                <div className="d-flex">
                  <div className="flex-fill text-start">{value.name}</div>
                  {value.badge && (
                    <>
                      <div className="flex-shrink-1 text-end px-3">
                        <span className="fw-medium">{value.badge}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

OrderElementGroup.propTypes = {
  header: PropTypes.string.isRequired,
  elements_with_badge: PropTypes.array.isRequired,
};

export default OrderElementGroup;
