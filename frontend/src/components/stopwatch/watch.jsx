import React from "react";
function Watch(t) {
  return (
    <h2 className="fs-7">
      <span>{("0" + Math.floor((t.time / 3600000) % 60)).slice(-2)}:</span>
      <span>{("0" + Math.floor((t.time / 60000) % 60)).slice(-2)}:</span>
      <span>{("0" + Math.floor((t.time / 1000) % 60)).slice(-2)}</span>
    </h2>
  );
}
export default Watch;
