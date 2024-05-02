import React from "react";
import OrderElement from "../order_element";
import api from "../../../api";
import Button from "../../../components/button";
import { useNavigate } from "react-router-dom";
import SelectVehicleTypeButton from "../order_select_vehicle_type_button";
import WasherOnShiftButton from "../../../components/order_washer_on_shift_button";

const WorkOrderList = () => {
  const [loading, setLoading] = React.useState(true);

  const [workerCount, setWorkerCount] = React.useState();
  const [activeOrders, setActiveOrders] = React.useState([]);

  const navigate = useNavigate();

  // const getFreeWashers = React.useCallback( () => {
  //   api.getFreeWashers().then((data) => {
  //     setWorkerCount(data.free_washers_count);
  //   });
  // }, []);

  const getOrders = React.useCallback( () => {
    api.getOrders()
    .then((data) => {
      setActiveOrders(data.results);
    });
  }, []);

  React.useEffect(() => {
    setLoading(true);
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
      <div className="row">
        <div className="vstack">
        <SelectVehicleTypeButton />
        <WasherOnShiftButton />
        </div>
      </div>
      
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
