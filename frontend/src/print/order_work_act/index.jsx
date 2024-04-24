import React from "react";
import ReactToPrint, { PrintContextConsumer } from "react-to-print";
import Button from "../../components/button";
import PropTypes from "prop-types";
import OrderElementGroup from "../../pages/orders/order_element_group";

const OrderWorkAct = (props) => {
  const componentRef = React.useRef();
  const [services, setServices] = React.useState([]);

  React.useEffect(() => {
    let newArr = {};
    props.serviceList.map((item, index) => {
      newArr[item.vehicle.id] ??= {
        total_cost: 0,
        services: [],
      };
      newArr[item.vehicle.id].services.push(item);
      newArr[item.vehicle.id].total_cost += item.cost;
    });
    setServices(newArr);
  }, [props.serviceList]);

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
      <div ref={componentRef} className="m-3  fw-medium print_content">
        <div className="row">
            <div className="col text-start">
                23/04/1989
            </div>
            <div className="col text-end">
                "Чистый грузовик"
            </div>
        </div>
        <p className="text-center">АКТ ВЫПОЛНЕННЫХ РАБОТ</p>
        <p className="m-0">Клиент: {props.clientName}</p>
        <p className="mb-1">Выполненные работы:</p>
        <div className="border p-2">
          {Object.keys(services).map((key, index) => (
            <div key={"serviceList" + index} className="row">
              <OrderElementGroup
                header={
                  <>
                    <b>{services[key].services[0].vehicle.plate_number}</b>{" "}
                    {services[key].services[0].vehicle.vehicle_class_name} (
                    {services[key].services[0].vehicle.vehicle_type_name})
                  </>
                }
                elements_with_badge={services[key].services.map((service) => ({
                  name: (
                    <div className="row">
                      <span className="fs-6">
                        {service.service.name}
                        {service.legal_entity_service
                          ? " (договор)"
                          : null}: {service.cost}₽
                      </span>
                    </div>
                  ),
                  badge: "",
                }))}
              />
              <p className="fs-6 px-3 m-0">
                <b>Итого: {services[key].total_cost}₽</b>
              </p>
            </div>
          ))}
        </div>
        <OrderElementGroup
          header={<span className="fs-6 fw-medium">Итого к оплате:</span>}
          elements_with_badge={[
            {
              name: "Оплачено:",
              badge: `${props.totalCost}₽`,
            },
            props.paymentMethod === "CONTRACT"
              ? {
                  name: "Оплата по договору:",
                  badge: `${props.totalCostContract}₽`,
                }
              : {},
          ]}
        />
      </div>
    </div>
  );
};

OrderWorkAct.propTypes = {
  serviceList: PropTypes.array.isRequired,
  totalCost: PropTypes.number.isRequired,
  totalCostContract: PropTypes.number.isRequired,
  paymentMethod: PropTypes.string.isRequired,
  clientName: PropTypes.string.isRequired,
};

export default OrderWorkAct;
