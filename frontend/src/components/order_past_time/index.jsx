import React from "react";
import PropTypes from "prop-types";

const OrderPastTime = (props) => {

    let delta = Math.floor((props.endDate - props.startDate) / 1000);
    let days = Math.floor(delta / 86400);
    delta -= days * 86400;
    let hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    let minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;
    let seconds = delta % 60;

  return (
    <h2 className="fs-6">
      <span>{("0" + hours).slice(-2)}:</span>
      <span>{("0" + minutes).slice(-2)}:</span>
      <span>{("0" + seconds).slice(-2)}</span>
    </h2>
  );
}

OrderPastTime.propTypes = {
    startDate: PropTypes.object.isRequired,
    endDate: PropTypes.object.isRequired,
  };

export default OrderPastTime;
