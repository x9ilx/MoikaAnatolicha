import React from "react";
import ReactToPrint, { PrintContextConsumer } from "react-to-print";
import Button from "../../components/button";
import PropTypes from "prop-types";
import OrderElementGroup from "../../pages/orders/order_element_group";
import api from "../../api";
import { prettyPhone } from "../../utils/string_utils";

const OrderWorkAct = (props) => {
  const componentRef = React.useRef();
  const [services, setServices] = React.useState([]);
  const [requisites, setRequisites] = React.useState({});

  React.useEffect(() => {
    let newArr = {};
    props.order.services.map((item) => {
      newArr[item.vehicle.id] ??= {
        total_cost: 0,
        vehicle_type_name: item.vehicle.vehicle_type.name,
        vehicle_plate_number: item.vehicle.plate_number,
        vehicle_class_name: item.vehicle.vehicle_type.vehicle_class_name,
        vehicle_model: item.vehicle.vehicle_model,
        services: [],
      };
      newArr[item.vehicle.id].services.push(item);
      newArr[item.vehicle.id].total_cost += item.cost;
    });
    setServices(newArr);
    api
      .getCompanyRequisites()
      .then((res) => {
        setRequisites(res);
      })
      // eslint-disable-next-line no-unused-vars
      .catch((err) => {});
  }, [props.order]);

  return (
    <div>
      <ReactToPrint content={() => componentRef.current} removeAfterPrint>
        <PrintContextConsumer>
          {({ handlePrint }) => (
            <Button
              clickHandler={handlePrint}
              colorClass="btn-info"
              type="button"
            >
              <>Печать акта выполненых работ</>
            </Button>
          )}
        </PrintContextConsumer>
      </ReactToPrint>
      <div ref={componentRef} className="m-3 fs-7 fw-medium print_content">
        <div className="row">
          <div className="col text-start fs-7">
            {new Date(props.order.order_datetime).toLocaleDateString()}{" "}
            {new Date(props.order.order_datetime).toLocaleTimeString()}
          </div>
          <div className="col text-end fs-7">&ldquo;Чистый грузовик&rdquo;</div>
        </div>
        <p className="text-center fs-7 ь-0">
          АКТ ВЫПОЛНЕННЫХ РАБОТ К ЗАКАЗУ №{props.order.order_number}
        </p>
        <p>Исполнитель: </p>
        <table className="table table-sm table-bordered">
          <tbody>
            <tr>
              <td>{requisites.name}</td>
            </tr>
            <tr>
              <td>{"ИНН: " + requisites.inn}</td>
            </tr>
            <tr>
              <td>{"ОГРНИП: " + requisites.ogrn}</td>
            </tr>
            <tr>
              <td>{"Телефон: " + prettyPhone(requisites.phone)}</td>
            </tr>
          </tbody>
        </table>
        <p className="m-0 fs-7">
          {props.order.client_name
            ? "Клиент: " + props.order.client_name
            : null}
        </p>
        <p className="mb-1 fs-7 my-1">Выполненные работы:</p>
        <div className="border p-2 fs-7 mt-2">
          {Object.keys(services).map((key, index) => (
            <div key={"serviceList" + index} className="">
              <p>
                <b>{services[key].without_plate_number ? "Без гос. номера" : services[key].vehicle_plate_number}</b>{" "}
                {services[key].vehicle_model} {services[key].vehicle_class_name}{" "}
                ({services[key].vehicle_type_name})
              </p>
              <table className="table table-sm table-bordered">
                <tbody>
                  {services[key].services.map((service, s_index) => (
                    <tr key={"services[key]." + s_index}>
                      <td>
                        <span className="fs-7">
                          {service.service_name}
                          {service.legal_entity_service
                            ? " (договор)"
                            : null}: {service.cost}₽
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p className="fs-7 px-3 m-0 mb-3">
                <b>Итого: {services[key].total_cost}₽</b>
              </p>
            </div>
          ))}
        </div>
        <OrderElementGroup
          header={<span className="fs-7 fw-medium">Итого к оплате:</span>}
          elements_with_badge={[
            {
              name: "Оплачено:",
              badge: `${props.order.final_cost}₽`,
            },
            props.order.payment_method === "CONTRACT"
              ? {
                  name: "Оплата по договору:",
                  badge: `${props.order.final_cost_contract}₽`,
                }
              : {},
          ]}
        />
        <br />

        <div className="row my-3">
          <div className="col-1 text-start fs-7">
            {new Date(props.order.order_datetime).toLocaleDateString()}г.
          </div>
          <div className="col-11 text-end fs-7">
            Администратор {props.order.administrator.name}{" "}
            _____________________________
          </div>
        </div>
      </div>
    </div>
  );
};

OrderWorkAct.propTypes = {
  order: PropTypes.object.isRequired,
};

export default OrderWorkAct;
