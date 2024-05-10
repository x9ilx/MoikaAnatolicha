import React, { useState } from "react";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";
import api from "../../../api";
import OrderElementGroup from "../../orders/order_element_group";
import Button from "../../../components/button";
import OrderElement from "../../orders/order_element";

function AdminShiftSystem() {
  const [loading, setLoading] = React.useState(false);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().slice(0, -14)
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().slice(0, -14)
  );
  const [shifts, setShifts] = useState([]);
  const [selectedShift, setSelectedShift] = useState(null);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalOrderCommonCost, setTotalOrderCommonCost] = useState(0);
  const [totalOrderContractCost, setTotalOrderContractCost] = useState(0);
  const [shiftCount, setShiftCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [shitsDescription, setShitsDescription] = useState("");
  const [ordersDescription, setOrdersDescription] = useState("0");

  const [showShift, setShowShift] = React.useState(false);
  const [showOrders, setShowOrders] = React.useState(false);

  const { employer_id } = useParams();

  const navigate = useNavigate();

  const CreateSalary = React.useCallback(() => {
    api
      .createSalary(
        parseInt(employer_id),
        startDate,
        endDate,
        totalEarnings,
        totalOrderCommonCost + totalOrderContractCost,
        shitsDescription,
        ordersDescription
      )
      .then((res) => {
        toast.success(
          `Заработная плата, от ${new Date(
            res.date_of_issue
          ).toLocaleDateString()}г., успешно сохранена`
        );
        navigate(`./${res.id}`);
      })
      .catch((err) => {
        Object.keys(err).map((key) => toast.error(key + ": " + err[key]));
      });
  }, [
    employer_id,
    startDate,
    endDate,
    totalEarnings,
    totalOrderCommonCost,
    totalOrderContractCost,
    shitsDescription,
    ordersDescription,
    navigate,
  ]);

  const fetchShifts = React.useCallback(() => {
    setLoading(true);
    api
      .getAdministratorShiftsForPeriod(employer_id, startDate, endDate)
      .then((res) => {
        let totalCost = 0;
        let orderCostContract = 0;
        let orderCostCommon = 0;
        let shiftC = 0;
        let orderC = 0;
        let sh_desc = "";
        let ord_desc = "";
        setShifts(res);
        res.map((shift) => {
          totalCost += shift.employer_salary;
          shiftC += 1;
          sh_desc += `$s$Смена: ${new Date(shift.start_shift_time)} - ${new Date(shift.end_shift_time)}; Сумма заказов: ${shift.total_order_cost}₽; ЗП: ${shift.employer_salary}₽\n`;
          ord_desc += sh_desc + "\n"
          shift.orders.map((order) => {
            orderC += 1;
            ord_desc += `$o$Заказ №${order.order_number}, от ${new Date(order.order_datetime)}.\nСумма: ${order.final_cost + order.final_cost_contract}`
            orderCostCommon += order.final_cost;
            orderCostContract += order.final_cost_contract;
          });
        });
        setTotalEarnings(totalCost);
        setTotalOrderCommonCost(orderCostCommon);
        setTotalOrderContractCost(orderCostContract);
        setShiftCount(shiftC);
        setOrderCount(orderC);
        setShitsDescription(sh_desc);
        setOrdersDescription(ord_desc);
        setLoading(false);
      })
      .catch((err) => {
        Object.keys(err).map((key) => toast.error(key + ": " + err[key]));
      });
  }, [employer_id, startDate, endDate]);

  React.useEffect(() => {
    fetchShifts();
  }, [startDate, endDate, fetchShifts]);

  const getOrdersFromShift = (shift_id) => {
    const orders = shifts.filter((item) => item.id === shift_id);
    setSelectedShift(orders[0]);
  };

  return (
    <div className="container fs-7">
      <p className="fw-medium ">Выдача ЗП администратору: {employer_id}</p>

      {/* Форма выбора диапазона дат */}
      <div className="row">
        <div className="col-sm-6 col-12 mb-3">
          <div className="form-floating">
            <input
              type="date"
              className="form-control text"
              id="dateS"
              placeholder="dateS"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
              }}
              name="dateS"
            />
            <label htmlFor="dateS">Дата С</label>
          </div>
        </div>
        <div className="col-sm-6 col-12">
          <div className="form-floating">
            <input
              type="date"
              className="form-control text"
              id="dateP"
              placeholder="dateP"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
              }}
              name="dateP"
            />
            <label htmlFor="dateP">Дата ПО</label>
          </div>
        </div>
      </div>

      {loading && (
        <p className="grid h-screen place-items-center text-center mb-2">
          Загрузка списка смен...
        </p>
      )}
      {!loading && (
        <div className="">
          <OrderElementGroup
            header="Информация"
            elements_with_badge={[
              {
                name: <span>Всего смен</span>,
                badge: <span>{shiftCount}</span>,
              },
              {
                name: <span>Всего заказов</span>,
                badge: <span>{orderCount}</span>,
              },
            ]}
          />
          <button
            className="btn btn-primary text-white w-100 mt-3"
            type="button"
            style={{ textShadow: "1px -1px 7px rgba(0,0,0,0.45)" }}
            data-bs-toggle="collapse"
            data-bs-target="#collapseShift"
            aria-expanded="false"
            aria-controls="collapseShift"
            onClick={() => {
              setShowShift(!showShift);
            }}
          >
            Информация о сменах ({showShift ? "свернуть" : "развернуть"})
          </button>
          <div className="collapse" id="collapseShift">
            <div className="card card-body">
              <ul
                className="list-group overflow-auto"
                style={{ maxHeight: "300px" }}
              >
                <li className="list-group-item">
                  <OrderElementGroup
                    header=""
                    elements_with_badge={shifts.map((shift, index) => ({
                      name: (
                        <div key={index}>
                          <strong>Смена: </strong>
                          {isMobile && <br />}
                          {new Date(
                            shift.start_shift_time
                          ).toLocaleString()} - {isMobile && <br />}
                          {new Date(shift.end_shift_time).toLocaleString()}
                          {isMobile && <br />}
                          <span>
                            {!isMobile && <br />}
                            Доход: {shift.total_order_cost}₽{" "}
                            {isMobile && <br />}
                            {!isMobile && "| "}
                            ЗП: {shift.employer_salary}₽
                          </span>
                          {isMobile && (
                            <Button
                              clickHandler={() => {
                                getOrdersFromShift(shift.id);
                              }}
                              colorClass={`btn-info btn-sm ${
                                isMobile && "mt-3"
                              }`}
                              disabled={false}
                              type="button"
                            >
                              <>Заказы</>
                            </Button>
                          )}
                        </div>
                      ),
                      badge:
                        isMobile == false ? (
                          <div className="mt-3">
                            <Button
                              clickHandler={() => {
                                getOrdersFromShift(shift.id);
                              }}
                              colorClass="btn-info btn-sm"
                              disabled={false}
                              type="button"
                            >
                              <>Заказы</>
                            </Button>
                          </div>
                        ) : null,
                    }))}
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
      {/* Отображение заказов за выбранную смену */}
      {selectedShift && (
        <div className="mt-3">
          <button
            className="btn btn-primary text-white w-100"
            type="button"
            style={{ textShadow: "1px -1px 7px rgba(0,0,0,0.45)" }}
            data-bs-toggle="collapse"
            data-bs-target="#collapseExample"
            aria-expanded="false"
            aria-controls="collapseExample"
            onClick={() => {
              setShowOrders(!showOrders);
            }}
          >
            Информация о заказах ({showOrders ? "свернуть" : "развернуть"})
          </button>
          <ul
            className="list-group overflow-auto"
            style={{ maxHeight: "500px" }}
          >
            {/* Отображение заказов, выполненных за смену */}
            <div className="collapse" id="collapseExample">
              <div className="card card-body">
                {selectedShift.orders.map((order, index) => (
                  <div key={"activeOrders" + index + order.id} className="mb-3">
                    <OrderElement
                      order={order}
                      isCompletedOrder={true}
                      isSalaryInfo={true}
                    />
                  </div>
                ))}
              </div>
            </div>
          </ul>
        </div>
      )}

      {/* Итоговая заработная плата */}
      <div className="my-3">
        <OrderElementGroup
          header="Итого"
          elements_with_badge={[
            {
              name: <span>Доход за все смены</span>,
              badge: (
                <span>{totalOrderCommonCost + totalOrderContractCost}₽</span>
              ),
            },
            {
              name: <span>По договору</span>,
              badge: <span>{totalOrderContractCost}₽</span>,
            },
            {
              name: <span>Остальное</span>,
              badge: <span>{totalOrderCommonCost}₽</span>,
            },
            {
              name: <span className="fw-medium">ЗП администратора</span>,
              badge: <span className="fw-medium">{totalEarnings}₽</span>,
            },
          ]}
        />
      </div>
      <Button
        clickHandler={() => {
          CreateSalary();
        }}
        colorClass="btn-success"
        type="button"
        disabled={false}
      >
        <>Сохранить ЗП</>
      </Button>
      <Button
        clickHandler={() => {
          navigate(-1);
        }}
        colorClass="btn-primary"
        type="button"
        disabled={false}
      >
        <>Назад</>
      </Button>
    </div>
  );
}

export default AdminShiftSystem;
