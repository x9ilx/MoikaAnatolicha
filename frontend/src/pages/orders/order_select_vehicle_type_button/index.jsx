import React from "react";
import Button from "../../../components/button";
import { useNavigate } from "react-router-dom";

const SelectVehicleTypeButton = () => {
  const navigate = useNavigate();

  return (
    <div className="dropdown">
      <button
        className="btn btn-success text-white w-100 dropdown-toggle my-3"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Создать заказ
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
