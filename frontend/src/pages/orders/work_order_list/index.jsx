import React from "react";
import OrderElement from "../order_element";
import api from "../../../api";
import Button from "../../../components/button";
import { useNavigate } from "react-router-dom";

const WorkOrderList = () => {
  const [loading, setLoading] = React.useState(true);
  const [workerCount, setWorkerCount] = React.useState();

  const navigate = useNavigate();

  const getFreeWashers = React.useCallback(async () => {
    api.getFreeWashers().then((data) => {
      setWorkerCount(data.free_washers_count);
    });
  }, []);

  React.useEffect(() => {
    setLoading(true);
    getFreeWashers();
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <>
        <p className="grid h-screen place-items-center text-center">
          Загрузка...
        </p>
      </>
    );
  }

  return (
    <>
      <Button
        clickHandler={() => {navigate("./add/")}}
        colorClass="btn-success"
        type="button"
        disabled={false}
      >
        <>Создать заказ (свободные мойщики: {workerCount})</>
      </Button>

      <div className="row">
        <div className="vstack gap-3">
          <OrderElement />
          <OrderElement />
          <OrderElement />
          <OrderElement />
          <OrderElement />
          <OrderElement />
        </div>
      </div>
    </>
  );
};

export default WorkOrderList;
