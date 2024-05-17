import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Watch from "./watch";

function Stopwatch(props) {
  const [duration, setDuration] = useState(props.startValue);

  useEffect(() => {

      let timePeriod = null;

      timePeriod = setInterval(() => {
        setDuration((duration) => duration + 1000);
      }, 1000);

      return () => {
        clearInterval(timePeriod);
      };
  }, []);

  return (
    <div className="stop-watch">
      <Watch 
      time={duration} 
      overdueTimer={props.overdueTimer}
      setNoTime={props.setNoTime}
      />
    </div>
  );
}

Stopwatch.propTypes = {
  startValue: PropTypes.number.isRequired,
  overdueTimer: PropTypes.number,
  setNoTime: PropTypes.func
};

export default Stopwatch;
