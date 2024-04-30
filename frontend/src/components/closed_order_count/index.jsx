import React from "react";
import api from "../../api";
import { toast } from "react-toastify";

const ClosedOrderCount = React.forwardRef(function MyInput(props, ref) {
  const [closedOrderCount, setClosedOrderCount] = React.useState(0);
  const [update, setUpdate] = React.useState(false);


  React.useImperativeHandle(ref, () => ({
    setUpdate,
  }));

  const getClosedOrderCount = React.useCallback(() => {
    api
      .getClosedOrderCount()
      .then((res) => {
        setClosedOrderCount(res);
      })
      .catch((err) => {
        Object.keys(err).map((key) => toast.error(key + ": " + err[key]));
      });
  }, []);

  React.useEffect(() => {
    getClosedOrderCount();
  }, [update])

  return <span key={update} className="badge bg-success ms-1">{closedOrderCount}</span>;
});

export default ClosedOrderCount;
