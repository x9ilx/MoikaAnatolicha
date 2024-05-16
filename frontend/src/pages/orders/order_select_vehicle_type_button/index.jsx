import React from "react";
import Button from "../../../components/button";
import { useNavigate } from "react-router-dom";
import api from "../../../api";

const SelectVehicleTypeButton = () => {
  const [activeOrders, setActiveOrders] = React.useState(0)

  const getActiveOrders = React.useCallback(() => {
    api.getActiveOrderCount()
    .then((res) => {
      setActiveOrders(res)
    })
  }, [])

  React.useEffect(() => {
    getActiveOrders();
  }, [])

  const navigate = useNavigate();

  return (
    <div className="dropdown">
      <button
        className="btn btn-success text-white w-100 dropdown-toggle my-3"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        disabled={activeOrders >= 6}
      >
        {activeOrders < 6 ? "Cоздать заказ" : "Создано максимум заказов"}
      </button>
      <ul className="dropdown-menu w-100 shadow p-3">
        <li className="p-0 m-0">
          <Button
            colorClass="btn-info btn-sm shadow"
            disabled={false}
            type="button"
            clickHandler={() => {navigate("/add/0/0/")}}
            marginBottom={2}
          >
            Только ТС
          </Button>
        </li>
        <li>
          <Button
            colorClass="btn-info btn-sm shadow"
            disabled={false}
            type="button"
            clickHandler={() => {navigate("/add/0/1/")}}
            marginBottom={2}
          >
            ТС + ПП/ППЦ
          </Button>
        </li>
        <li>
          <Button
            colorClass="btn-info btn-sm shadow"
            disabled={false}
            type="button"
            clickHandler={() => {navigate("/add/1/0/")}}
            marginBottom={0}
          >
            Спецтехника или военное ТС
          </Button>
        </li>
      </ul>
    </div>
  );
};

export default SelectVehicleTypeButton;
