import React, { useState } from "react";
import { toast } from "react-toastify";
import { isMobile } from "react-device-detect";
import OrderElementGroup from "../orders/order_element_group";
import api from "../../api";

function Statistic() {
  const [loading, setLoading] = React.useState(false);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().slice(0, -14)
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().slice(0, -14)
  );
  const [ordersCount, setOrdersCount] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [paymentMethods, setPaymentMethods] = useState({});
  const [employeesSalary, setEmployeesSalary] = useState({});
  const [adminOrder, setAdminOrder] = useState({});

  const getOrders = React.useCallback(() => {
    setLoading(true);
    api
      .getOrders(
        1,
        999999,
        true,
        `&order_datetime__gte=${
          startDate ? new Date(startDate).toISOString().slice(0, -14) : ""
        }&order_datetime__lte=${
          endDate ? new Date(endDate).toISOString().slice(0, -14) : ""
        }`
      )
      .then((res) => {
        let total_income = 0;
        let paymenth_methods = {};
        let admin_order = {};

        res.results.map((order) => {
          total_income += order.final_cost + order.final_cost_contract;
          paymenth_methods[order.payment_method_verbose] ??= {
            total_income: 0,
            order_count: 0,
          };
          paymenth_methods[order.payment_method_verbose].total_income +=
            order.final_cost + order.final_cost_contract;
          paymenth_methods[order.payment_method_verbose].order_count += 1;

          admin_order[order.administrator.id] ??= {
            short_name: "",
            total_income: 0,
            order_count: 0,
          };
          admin_order[order.administrator.id].total_income +=
            order.final_cost + order.final_cost_contract;
          admin_order[order.administrator.id].order_count += 1;
          admin_order[order.administrator.id].short_name =
            order.administrator.short_name;
        });
        setTotalIncome(total_income);
        setPaymentMethods(paymenth_methods);
        setAdminOrder(admin_order);
        setOrdersCount(res.count);
        setLoading(false);
      })
      .catch((err) => {
        const errors = Object.values(err);
        if (errors) {
          toast.error(errors.join(", "));
        }
      });
  }, [startDate, endDate]);

  const getSalaries = React.useCallback(() => {
    setLoading(true);
    let admin_salary = {}
    let washer_salary = {}
    api
      .getAllSalaries(
        1,
        999999,
        "",
        startDate ? new Date(startDate).toISOString().slice(0, -14) : "",
        endDate ? new Date(endDate).toISOString().slice(0, -14) : ""
      )
      .then((res) => {
        res.results.map((salary) => {
            if (salary.employer.position === "ADMINISTRATOR") {
                admin_salary[salary.employer.id] ??= {
                    short_name: salary.employer.short_name,
                    total_salary: 0,
                }
                admin_salary[salary.employer.id].total_salary += salary.employer_salary
            }
            if (salary.employer.position === "WASHER") {
                washer_salary[salary.employer.id] ??= {
                    short_name: salary.employer.short_name,
                    total_salary: 0,
                }
                washer_salary[salary.employer.id].total_salary += salary.employer_salary
            }
        });
        setEmployeesSalary({
            administrators: admin_salary,
            washers: washer_salary
        })
        setLoading(false);
      })
      .catch((err) => {
        const errors = Object.values(err);
        if (errors) {
          toast.error(errors.join(", "));
        }
      });
  }, [startDate, endDate]);

  React.useEffect(() => {
    getOrders();
    getSalaries();
  }, [startDate, endDate, getOrders, getSalaries]);

  return (
    <div className="container fs-6">
      <p className="fw-medium ">Статистика</p>
      <hr></hr>
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
      <hr></hr>

      {loading && (
        <p className="grid h-screen place-items-center text-center mb-2">
          Загрузка данных о заказах...
        </p>
      )}
      {!loading && (
        <div className="row">
          <div className="col-sm-6 col-12 fs-8 p-2 ">
            <p className="fs-6 fw-medium ">Заказы</p>
            <OrderElementGroup
              header="Доход"
              elements_with_badge={[
                {
                  //₽
                  name: <span>Всего заказов</span>,
                  badge: <span>{ordersCount}шт.</span>,
                },
                {
                  //₽
                  name: <span>Общий доход</span>,
                  badge: <span>{totalIncome.toLocaleString()}₽</span>,
                },
              ]}
            />
            <OrderElementGroup
              header="Методы оплаты"
              elements_with_badge={Object.keys(paymentMethods).map((key) => ({
                name: (
                  <span>
                    {key} (заказы: {paymentMethods[key].order_count})
                  </span>
                ),
                badge: (
                  <span>
                    {paymentMethods[key].total_income.toLocaleString()}₽ (
                    {(
                      (paymentMethods[key].total_income / totalIncome) *
                      100
                    ).toFixed(2)}
                    %)
                  </span>
                ),
              }))}
            />
          </div>
          <div className="col-sm-6 col-12 fs-8 p-2 ">
            <p className="fs-6 fw-medium ">Сотрудники</p>
            <OrderElementGroup
              header="Заказы администраторов"
              elements_with_badge={Object.keys(adminOrder).map((key) => ({
                name: (
                  <span>
                    {adminOrder[key].short_name} (заказы:{" "}
                    {adminOrder[key].order_count})
                  </span>
                ),
                badge: (
                  <span>
                    {adminOrder[key].total_income.toLocaleString()}₽ (
                    {(
                      (adminOrder[key].order_count / ordersCount) *
                      100
                    ).toFixed(2)}
                    %)
                  </span>
                ),
              }))}
            />
            {employeesSalary?.administrators && <OrderElementGroup
              header="ЗП администраторов"
              elements_with_badge={Object.keys(employeesSalary?.administrators)?.map((key) => ({
                name: (
                  <span>
                    {employeesSalary.administrators[key].short_name}
                  </span>
                ),
                badge: (
                  <span>
                    {employeesSalary.administrators[key].total_salary.toLocaleString()}₽
                  </span>
                ),
              }))}
            />}
            {employeesSalary?.washers && <OrderElementGroup
              header="ЗП мойщиков"
              elements_with_badge={Object.keys(employeesSalary?.washers)?.map((key) => ({
                name: (
                  <span>
                    {employeesSalary.washers[key].short_name}
                  </span>
                ),
                badge: (
                  <span>
                    {employeesSalary.washers[key].total_salary.toLocaleString()}₽
                  </span>
                ),
              }))}
            />}
          </div>
        </div>
      )}
    </div>
  );
}

export default Statistic;
