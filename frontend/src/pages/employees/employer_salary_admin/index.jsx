import React, { useState } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { isMobile } from "react-device-detect";
import api from "../../../api";
import OrderElementGroup from "../../orders/order_element_group";

function AdminShiftSystem() {
  const [startDate, setStartDate] = useState(
    new Date().toISOString().slice(0, -5)
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, -5));
  const [shifts, setShifts] = useState([]);
  const [selectedShift, setSelectedShift] = useState(null);
  const [totalEarnings, setTotalEarnings] = useState(0);

  const { employer_id } = useParams();
  // Функция для запроса данных о сменах в выбранном диапазоне дат
  const fetchShifts = React.useCallback(() => {
    api
      .getAdministratorShiftsForPeriod(employer_id, startDate, endDate)
      .then((res) => {
        setShifts(res);
      })
      .catch((err) => {
        Object.keys(err).map((key) => toast.error(key + ": " + err[key]));
      });
  }, [employer_id, startDate, endDate]);

  const handleDateChange = () => {
    fetchShifts();
  };

  return (
    <div className="container">
      <p className="fw-medium ">Выдача ЗП администратору: {employer_id}</p>

      {/* Форма выбора диапазона дат */}
      <div className="mb-3">
        <div className="form-floating">
          <input
            type="date"
            className="form-control text"
            id="dateS"
            placeholder="dateS"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              handleDateChange();
            }}
            name="dateS"
          />
          <label htmlFor="dateS">Дата С</label>
        </div>
      </div>
      <div className="mb-3">
        <div className="form-floating">
          <input
            type="date"
            className="form-control text"
            id="dateP"
            placeholder="dateP"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              handleDateChange();
            }}
            name="dateP"
          />
          <label htmlFor="dateP">Дата ПО</label>
        </div>
      </div>

      {/* Отображение списка смен */}
      <div className="mt-4">
        <ul className="list-group overflow-auto" style={{maxHeight: "300px"}}>
          <li className="list-group-item">
            <OrderElementGroup
              header="Смены"
              elements_with_badge={shifts.map((shift, index) => ({
                name: (
                  <div key={index}>
                    <strong>Смена: </strong>{isMobile && <br/>}
                    {new Date(shift.start_shift_time).toLocaleString()} -{" "}{isMobile && <br/>}
                    {new Date(shift.end_shift_time).toLocaleString()}{isMobile && <br/>}
                    <span> |{" "}
                      Доход: {shift.total_order_cost}₽ {isMobile && <br/>}| ЗП:{" "}
                      {shift.employer_salary}₽
                    </span>
                  </div>
                ),
                badge: <div>Тут чекбокс для учёта</div>
              }))}
            />
          </li>
        </ul>
      </div>

      {/* Отображение заказов за выбранную смену */}
      {selectedShift && (
        <div className="mt-4">
          <h3>Заказы за смену:</h3>
          <ul className="list-group">
            {/* Отображение заказов, выполненных за смену */}
            {selectedShift.orders.map((order, index) => (
              <li key={index} className="list-group-item">
                <strong>Номер заказа:</strong> {order.orderNumber}
                <br />
                <strong>Описание заказа:</strong> {order.description}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Итоговая заработная плата */}
      <div className="mt-4">
        <h3>Итоговая заработная плата администратора:</h3>
        <p>{totalEarnings} руб.</p>
      </div>
    </div>
  );
}

export default AdminShiftSystem;
