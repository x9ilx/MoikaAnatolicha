import React from "react";
import PropTypes from "prop-types";

function Watch(props) {
  const days = Math.floor((props.time / (3600000 * 24)) % 60)
  const hours = Math.floor((props.time / 3600000) % 60)
  const minutes = Math.floor((props.time / 60000) % 60)
  const seconds = Math.floor((props.time / 1000) % 60)
  const overdue = Math.floor(props.overdueTimer * 60 * 1000)


  if (props.time >= overdue) {
    props.setNoTime(true)
  }

  return (
    <h2 className="fs-7">
      {/* {days > 0 && <span>{(days + "д. ")}</span>} */}
      <span>{("0" + hours).slice(-2)}:</span>
      <span>{("0" + minutes).slice(-2)}:</span>
      <span>{("0" + seconds).slice(-2)}</span>
    </h2>
  );
}

Watch.propTypes = {
  time: PropTypes.number.isRequired,
  overdueTimer: PropTypes.number,
  setNoTime: PropTypes.func
};

export default Watch;
