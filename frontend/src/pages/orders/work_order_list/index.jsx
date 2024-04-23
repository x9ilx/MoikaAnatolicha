import React from "react";
import OrderElement from "../order_element";
import api from "../../../api";
import Button from "../../../components/button";
import { useNavigate } from "react-router-dom";

const WorkOrderList = () => {
  const [loading, setLoading] = React.useState(true);

  const [workerCount, setWorkerCount] = React.useState();
  const [activeOrders, setActiveOrders] = React.useState([]);

  const navigate = useNavigate();

  const getFreeWashers = React.useCallback(async () => {
    api.getFreeWashers().then((data) => {
      setWorkerCount(data.free_washers_count);
    });
  }, []);

  const getOrders = React.useCallback(async () => {
    api.getOrders()
    .then((data) => {
      setActiveOrders(data.results);
    });
  }, []);

  React.useEffect(() => {
    setLoading(true);
    getFreeWashers();
    getOrders();
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
          {activeOrders.map((order, index) => (
            <OrderElement 
            key={"activeOrders"+index}
            order={order}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default WorkOrderList;
