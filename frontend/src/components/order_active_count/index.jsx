import React from "react";
import api from "../../api";
import { toast } from "react-toastify";

const ActiveOrderCount = React.forwardRef(function MyInput(props, ref) {
  const [activeOrderCount, setActiveOrderCount] = React.useState(0);
  const [update, setUpdate] = React.useState(false);


  React.useImperativeHandle(ref, () => ({
    setUpdate,
  }));

  const getActiveOrderCount = React.useCallback(() => {
    api
      .getActiveOrderCount()
      .then((res) => {
        setActiveOrderCount(res);
      })
      .catch((err) => {
        Object.keys(err).map((key) => toast.error(key + ": " + err[key]));
      });
  }, []);

  React.useEffect(() => {
    getActiveOrderCount();
  }, [update])

  return <span key={update} className="badge bg-danger ms-1">{activeOrderCount}</span>;
});

export default ActiveOrderCount;
