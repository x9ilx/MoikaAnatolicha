import React from "react";
import Button from "../../../components/button";
import PropTypes from "prop-types";
import OrderElementGroup from "../order_element_group";
import Stopwatch from "../../../components/stopwatch";
import { useAuth } from "../../../contexts/auth-context";
import { useNavigate, useParams } from "react-router-dom";
import OrderPastTime from "../../../components/order_past_time";

const OrderElement = (props) => {
  const [services, setServices] = React.useState([]);

  const auth = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    let newArr = {};
    props.order.services.map((item) => {
      newArr[item.vehicle.id] ??= {
        vehicle_type_name: "",
        vehicle_class_name: "",
        vehicle_plate_number: "",
        vehicle_model: "",
        without_plate_number: false,
        services: [],
      };
      newArr[item.vehicle.id].services.push(item);
      newArr[item.vehicle.id].vehicle_type_name =
        item.vehicle.vehicle_type.name;
      newArr[item.vehicle.id].vehicle_class_name =
        item.vehicle.vehicle_type.vehicle_class_name;
      newArr[item.vehicle.id].vehicle_plate_number = item.vehicle.plate_number;
      newArr[item.vehicle.id].vehicle_model = item.vehicle.vehicle_model;
      newArr[item.vehicle.id].without_plate_number = item.vehicle.without_plate_number;
    });
    setServices(newArr);
  }, [props]);

  return (
    <>
      <div className="card shadow">
        <div className="card-header bg-primary pl-2 pr-2 pt-1 pb-1">
          <div className="row fs-7 fw-medium align-middle mt-1">
            <div
              className="col-8 text-start text-white fw-medium "
              style={{ textShadow: "1px -1px 7px rgba(0,0,0,0.45)" }}
            >
              {new Date(props.order.order_datetime).toLocaleString("ru-RU")} (
              {props.order.final_cost + props.order.final_cost_contract}₽)
            </div>
            <div
              className="col-4 text-end text-white fw-medium"
              style={{ textShadow: "1px -1px 7px rgba(0,0,0,0.45)" }}
            >
              {!props.isCompletedOrder && (
                <Stopwatch
                  startValue={Math.round(
                    new Date() - new Date(props.order.order_datetime)
                  )}
                />
              )}
              {props.isCompletedOrder && (
                <OrderPastTime
                  startDate={new Date(props.order.order_datetime)}
                  endDate={new Date(props.order.order_close_datetime)}
                />
              )}
            </div>
          </div>
        </div>
        <div className="card-body p-1 pb-0">
          <div className="row d-sm-flex flex-sm-row flex-column fs-7">
            <div className="col pt-1" id="services">
              {Object.keys(services).map((key, index) => (
                <div key={"serviceList" + index} className="mb-3">
                  <OrderElementGroup
                    header={
                      <div className=" fs-6">
                        <b className="">
                          {services[key].without_plate_number ? "Без гос. номера" : services[key].vehicle_plate_number}{" "}
                          {services[key].vehicle_model}
                        </b>
                        <br />
                        {services[key].vehicle_class_name}{" "}
                        {services[key].vehicle_type_name}
                      </div>
                    }
                    elements_with_badge={services[key].services.map(
                      (service) => ({
                        name: (
                          <div className="row">
                            <span className="fs-6">
                              {service.service_name}
                              {service.legal_entity_service
                                ? " (договор)"
                                : null}
                            </span>
                          </div>
                        ),
                        badge: <div className="fs-6">{service.cost}₽</div>,
                      })
                    )}
                  />
                </div>
              ))}
            </div>
            <div className="col  pt-1" id="washers">
              <OrderElementGroup
                header={
                  <div className="fs-6">
                    Назначенные
                    <br />
                    мойщики
                  </div>
                }
                elements_with_badge={props.order.washers.map((washer) => ({
                  name: (
                    <div className="row">
                      <span className="fs-6">{washer.short_name}</span>
                    </div>
                  ),
                  badge: (
                    <div className="fs-6">
                      {auth.employerInfo.employer_info.position ===
                      "MANAGER" ? (
                        <>Получит: {props.order.each_washer_salary}₽</>
                      ) : (
                        ""
                      )}
                    </div>
                  ),
                }))}
              />
            </div>
          </div>
          {!props.isCompletedOrder && (
            <div className="row mx-3 gap-1 my-2">
              <Button
                clickHandler={() => {
                  navigate("/" + props.order.id);
                }}
                colorClass="btn-primary"
                type="button"
                disabled={false}
              >
                <>Завершить/Изменить заказ</>
              </Button>
            </div>
          )}
          {props.isSalaryInfo && (
            <div className="row mx-3 gap-1 my-2">
              <Button
                clickHandler={() => {
                  navigate("/" + props.order.id);
                }}
                colorClass="btn-primary"
                type="button"
                disabled={false}
              >
                <>Изменить заказ</>
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

OrderElement.propTypes = {
  order: PropTypes.object.isRequired,
  isCompletedOrder: PropTypes.bool,
  isSalaryInfo: PropTypes.bool,
};

export default OrderElement;
