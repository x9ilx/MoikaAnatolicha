import React from "react";
import Button from "../../../components/button";
import PropTypes from "prop-types";
import OrderElementGroup from "../order_element_group";
import Stopwatch from "../../../components/stopwatch";
import { useAuth } from "../../../contexts/auth-context";
import { useNavigate, useParams } from "react-router-dom";
import OrderPastTime from "../../../components/order_past_time";
import api from "../../../api";

const OrderElementV2 = (props) => {
  const [services, setServices] = React.useState([]);
  const [washers, setWashers] = React.useState([]);
  const [noTime, setNoTime] = React.useState(false);
  const [overdueOrderTimer, setOverdueOrderTimer] = React.useState(60);

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
      newArr[item.vehicle.id].without_plate_number =
        item.vehicle.without_plate_number;
    });

    if (Object.keys(newArr).length == 1) {
      newArr["-1"] ??= {
        services: [],
        vehicle_type_name: "None",
        vehicle_class_name: "None",
        vehicle_plate_number: "None",
        vehicle_model: "None",
        without_plate_number: false,
      };
    }

    let washerArr = {};
    props.order.washers.map((item) => {
      washerArr[item.id] ??= {
        id: -1,
        name: "",
        short_name: "",
      };
      washerArr[item.id].id = item.id;
      washerArr[item.id].name = item.name;
      washerArr[item.id].short_name = item.short_name;
    });
    if (Object.keys(washerArr).length < 3) {
      for (let index = 0; index <= 3 - Object.keys(washerArr).length; index++) {
        washerArr[`w${index}`] ??= {
          id: "None",
          name: "None",
          short_name: "None",
        };
      }
    }
    setServices(newArr);
    setWashers(washerArr);

    api.getSettings()
    .then((res) => {
        setOverdueOrderTimer(res.overdue_order_timer)
    })

  }, [props]);

  return (
    <>
      <div className="card shadow mb-3">
        <div
          className={`card-header ${props.order.is_paid && !noTime && "bg-success"} ${
            noTime && "bg-danger"
          } ${
            !props.order.is_paid && !noTime && "bg-primary"
          } pl-2 pr-2 pt-1 pb-0`}
        >
          <div className="row fs-7 fw-medium align-middle mt-1">
            <div
              className="col-8 text-start text-white fw-medium fs-7"
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
                  overdueTimer={overdueOrderTimer}
                  setNoTime={setNoTime}
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
          <div className="row d-sm-flex flex-sm-row flex-column fs-8">
            <div className="pt-1" id="services">
              {Object.keys(services).map((key, index) => (
                <div key={"serviceList" + index} className="mb-0">
                  <OrderElementGroup
                    header={
                      <div className="d-flex">
                        <div className="flex-grow-1">
                          {index === 0 ? "ТС" : "ПП/ППЦ"}
                        </div>
                        {index === 0 && (
                          <div className="">
                            Оплата:{" "}
                            {props.order.payment_method_verbose.toUpperCase()}
                          </div>
                        )}
                      </div>
                    }
                    elements_with_badge={[
                      {
                        name: (
                          <div
                            className={`fs-7 ${
                              services[key].vehicle_class_name === "None" &&
                              "text-white"
                            }`}
                          >
                            <b className="">
                              {services[key].without_plate_number
                                ? "Без гос. номера"
                                : services[key].vehicle_plate_number}{" "}
                              {services[key].vehicle_model}
                            </b>
                            <br />
                            {services[key].vehicle_class_name}{" "}
                            {services[key].vehicle_type_name}
                          </div>
                        ),
                      },
                    ]}
                  />
                </div>
              ))}
            </div>
            <div className="col  pt-1" id="washers">
              <OrderElementGroup
                header={<div className="fs-7">Мойщики</div>}
                elements_with_badge={Object.keys(washers).map((key) => ({
                  name: (
                    <div className="row">
                      <span
                        className={`fs-7 ${
                          washers[key]?.short_name === "None" && "text-white"
                        }`}
                      >
                        {washers[key]?.short_name}
                      </span>
                    </div>
                  ),
                  badge: (
                    <div
                      className={`fs-7 ${
                        washers[key]?.short_name === "None" && "text-white"
                      }`}
                    >
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
                colorClass={`btn-sm ${props.order.is_paid && !noTime && "btn-success"} ${
                  noTime && "btn-danger"
                } ${!props.order.is_paid && !noTime && "btn-primary"}`}
                type="button"
                disabled={false}
                marginBottom={1}
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
                colorClass="btn-primary btn-sm"
                type="button"
                disabled={false}
                marginBottom={1}
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

OrderElementV2.propTypes = {
  order: PropTypes.object.isRequired,
  isCompletedOrder: PropTypes.bool,
  isSalaryInfo: PropTypes.bool,
};

export default OrderElementV2;
