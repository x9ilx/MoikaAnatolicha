import React, { useState } from "react";

function EmployeeShiftsAndOrders({ employees, shifts, orders }) {
  // Состояние для выбранного сотрудника
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Фильтр смен и заказов для выбранного сотрудника
  const employeeShifts = shifts.filter(
    (shift) => shift.employeeId === selectedEmployee
  );
  const employeeOrders = orders.filter(
    (order) => order.employeeId === selectedEmployee
  );

  return (
    <div>
      <h1>Список смен и заказов для выбранного сотрудника</h1>

      {/* Селектор для выбора сотрудника */}
      <div>
        <label>Выберите сотрудника:</label>
        <select onChange={(e) => setSelectedEmployee(e.target.value)}>
          <option value="">--Выберите сотрудника--</option>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.name}
            </option>
          ))}
        </select>
      </div>

      {/* Отображение смен для выбранного сотрудника */}
      {selectedEmployee && (
        <div>
          <h2>Смены сотрудника:</h2>
          <ul>
            {employeeShifts.map((shift, index) => (
              <li key={index}>
                <p>Дата: {shift.date}</p>
                <p>Продолжительность смены: {shift.duration} ч</p>
                <p>Тип смены: {shift.shiftType}</p>
                <h3>Заказы, выполненные за смену:</h3>
                <ul>
                  {/* Отображение заказов, выполненных за смену */}
                  {employeeOrders
                    .filter((order) => order.shiftId === shift.id)
                    .map((order, index) => (
                      <li key={index}>
                        <p>Номер заказа: {order.orderNumber}</p>
                        <p>Описание заказа: {order.description}</p>
                        {/* Отображение дополнительной информации о заказе */}
                      </li>
                    ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default EmployeeShiftsAndOrders;
