import React from "react";
import OrderElement from "../order_element";
import api from "../../../api";
import Button from "../../../components/button";
import { useNavigate } from "react-router-dom";
import SelectVehicleTypeButton from "../order_select_vehicle_type_button";
import WasherOnShiftButton from "../../../components/order_washer_on_shift_button";
import OrderElementV2 from "../order_element/indexV2ForMainScreen";

const WorkOrderList = () => {
  const [loading, setLoading] = React.useState(true);

  const [workerCount, setWorkerCount] = React.useState();
  const [activeOrders, setActiveOrders] = React.useState([]);

  const navigate = useNavigate();

  const getOrders = React.useCallback(() => {
    api.getOrders().then((data) => {
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
        <div className="row mb-3 border px-0 py-3">
          <span className="badge text-bg-success text-white col mx-3"  style={{ textShadow: "1px -1px 7px rgba(0,0,0,0.45)" }}>Оплачен</span>
          <span className="badge text-bg-primary text-white col mx-3"  style={{ textShadow: "1px -1px 7px rgba(0,0,0,0.45)" }}>Не оплачен</span>
          <span className="badge text-bg-danger text-white col mx-3"  style={{ textShadow: "1px -1px 7px rgba(0,0,0,0.45)" }}>Просрочен</span>
          </div>
          <SelectVehicleTypeButton />
          <WasherOnShiftButton />
         
        </div>
      </div>

      <div className="row">
        <div className="vstack gap-3">
          <div className="row">
            {activeOrders.map((order, index) => (
                <div key={`order${index}`} className="col-sm-4 col-12">
                  <OrderElementV2 key={"activeOrders" + index} order={order} />
                </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkOrderList;
