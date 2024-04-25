import React from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { isMobile } from "react-device-detect";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../../components/button";
import SelectPaymentMethod from "../../../components/order_select_payment_method";
import DataListVehicle from "../../../components/data_list_vehicle";
import GetServicesFromVehicle from "../../../components/order_get_services_from_vehicle";
import OderSelectedServices from "../../../components/order_selected_vervices";
import OrderElementGroup from "../order_element_group";
import { useAuth } from "../../../contexts/auth-context";
import SetWashers from "../../../components/orders_set_washers";
import OrderWasherList from "../../../components/order_washer_list";
import api from "../../../api";

const OrderAdd = (props) => {
  const [loading, setLoading] = React.useState(false);
  const [hideInterface, setHideInterface] = React.useState(false);
  const [DELETE, setDELETE] = React.useState(false);
  const [selectService, setSelectService] = React.useState(false);
  const [selectWashers, setSelectWashers] = React.useState(false);
  const [saveAllowed, setSaveAllowed] = React.useState(false);


  const [administrator, setAdministrator] = React.useState(0);
  const [vehicleList, setVehicleList] = React.useState([]);
  const [paymentMethod, setPaymentMethod] = React.useState("");
  const [isPaid, setIsPaid] = React.useState(false);
  const [services, setServices] = React.useState([]);
  const [washers, setWashers] = React.useState([]);
  const [totalCost, setTotalCost] = React.useState(0);
  const [totalCostContract, setTotalCostContract] = React.useState(0);
  const [finalCostForEmployer, setFinalCostForEmployer] = React.useState(0);
  const [clientName, setClientName] = React.useState("");
  const [clinetPhone, setClinetPhone] = React.useState("");

  const navigate = useNavigate();
  const { order_id } = useParams();
  const auth = useAuth();

  React.useEffect(() => {
    setAdministrator(auth.employerInfo.employer_info.id);
  }, []);

  const CreateOrder = React.useCallback(() => {
    let data = {
      administrator: administrator,
      payment_method: paymentMethod,
      is_paid: isPaid,
      total_cost: totalCost,
      total_cost_contract: totalCostContract,
      final_cost_for_employer: finalCostForEmployer,
      client_name: clientName,
      clinet_phone: clinetPhone,
      vehicles: vehicleList,
      services: services,
      washers: washers,
    };

    api
      .createOrder(data)
      .then((res) => {
        toast.success("Заказ добавлен в работу");
        navigate("/");
      })
      .catch((err) => {
        Object.keys(err).map((key) => toast.error(key + ": " + err[key]));
      });
  }, [
    administrator,
    paymentMethod,
    totalCost,
    totalCostContract,
    finalCostForEmployer,
    clientName,
    clinetPhone,
    vehicleList,
    services,
    washers,
    isPaid,
    navigate,
  ]);

  const UpdateOrder = React.useCallback(() => {}, []);

  const changeVehicleCount = (vehicles) => {
    if (vehicles.length === 0) {
      setServices([]);
      setSaveAllowed(false);
    }

    setVehicleList(vehicles);
  };

  const ServiceChoise = (services) => {
    let t_cost = 0;
    let t_cost_contract = 0;
    let f_washer_salary = 0;
    services.map((item) => {
      if (item.legal_entity_service) {
        t_cost_contract += item.cost;
      } else {
        t_cost += item.cost;
      }
      f_washer_salary += Math.round(
        item.employer_salary * (item.percentage_for_washer / 100)
      );
    });
    setServices(services);
    setSelectService(false);
    setHideInterface(false);
    setTotalCost(t_cost);
    setTotalCostContract(t_cost_contract);
    setFinalCostForEmployer(f_washer_salary);
    if (services.length > 0) {
      //
    } else {
      setSaveAllowed(false);
      setTotalCost(0);
      setTotalCostContract(0);
      setFinalCostForEmployer(0);
    }
  };

  const setNewServiceCost = (service_index, new_cost) => {
    let newArr = services;
    newArr[service_index].cost = new_cost;
    setServices(newArr);
  };

  const washersChoises = (washers) => {
    if (washers.length > 0) {
      setWashers(washers);
      setSaveAllowed(true);
    } else {
      setWashers([]);
      setSaveAllowed(false);
    }
  };
  return (
    <>
      {loading && (
        <p className="grid h-screen place-items-center text-center">
          Загрузка...
        </p>
      )}
      {!loading && (
        <>
          {order_id ? (
            <p className="text-text-color fs-5">Информация о заказе</p>
          ) : (
            <p className="text-text-color fs-5">Создание заказа</p>
          )}
          <hr></hr>
          <form autoComplete="new-password">
            {!selectService && !selectWashers && (
              <DataListVehicle
                vehicleListFinal={vehicleList.length > 0 ? vehicleList : []}
                setVehicleListFinal={changeVehicleCount}
                onShowAdd={setHideInterface}
                editOwner={true}
                ownerId={-1}
                ownerName=""
                header={"Найти ТС/ППЦ по гос. номеру, владельцу"}
                noColor={true}
              />
            )}

            {!hideInterface && (
              <>
                {vehicleList.length > 0 && services.length <= 0 && (
                  <Button
                    clickHandler={() => {
                      setSelectService(true);
                      setHideInterface(true);
                    }}
                    colorClass="btn-info"
                    type="button"
                    disabled={false}
                  >
                    <>Выбрать услуги</>
                  </Button>
                )}
              </>
            )}

            {services.length > 0 && !selectService && !hideInterface && (
              <div className="">
                <hr></hr>
                <OderSelectedServices
                  serviceList={services}
                  onSetNewCost={setNewServiceCost}
                  onStartEditService={() => {
                    setSelectService(true);
                    setHideInterface(true);
                  }}
                />
                <div className="border">
                  <OrderElementGroup
                    header={
                      <span className="fs-5 fw-medium">Итого к оплате:</span>
                    }
                    elements_with_badge={[
                      {
                        name: "Необходимо оплатить:",
                        badge: `${totalCost}₽`,
                      },
                      paymentMethod === "CONTRACT"
                        ? {
                            name: "Оплата по договору:",
                            badge: `${totalCostContract}₽`,
                          }
                        : {},
                    ]}
                  />
                </div>
              </div>
            )}

            {vehicleList.length > 0 && selectService && (
              <>
                <SelectPaymentMethod
                  onSetPaymentMethod={setPaymentMethod}
                  currentPaymentMethod={paymentMethod}
                />

                <GetServicesFromVehicle
                  includeContractServices={paymentMethod === "CONTRACT"}
                  setCheckedServicesList={ServiceChoise}
                  currentServices={services}
                  onCancel={() => {
                    setSelectService(false);
                    setHideInterface(false);
                  }}
                  vehicleList={vehicleList}
                />
              </>
            )}

            {vehicleList.length > 0 &&
              services.length > 0 &&
              !hideInterface &&
              washers.length === 0 && (
                <Button
                  clickHandler={() => {
                    setSelectWashers(true);
                    setHideInterface(true);
                  }}
                  colorClass="btn-info my-3"
                  type="button"
                  disabled={false}
                >
                  <>Назначить мойщиков</>
                </Button>
              )}

            {selectWashers && (
              <SetWashers
                currentWashers={washers}
                onCancel={() => {
                  setSelectWashers(false);
                  setHideInterface(false);
                }}
                setWashers={washersChoises}
              />
            )}

            {vehicleList.length > 0 &&
              services.length > 0 &&
              !hideInterface &&
              washers.length > 0 && (
                <OrderWasherList
                  onStartEditWasher={() => {
                    setSelectWashers(true);
                    setHideInterface(true);
                  }}
                  washerList={washers}
                  headerColor="info"
                />
              )}

            {saveAllowed && (
              <div>
                <div className="form-floating my-3">
                  <input
                    className="form-control text"
                    id="name"
                    placeholder="name"
                    onChange={(e) => {
                      setClientName(e.target.value);
                    }}
                    value={clientName}
                    name="name"
                  />
                  <label htmlFor="name">Ф. И. О. клиента</label>
                </div>
                <div className="form-floating my-3">
                  <input
                    className="form-control text"
                    id="name"
                    placeholder="name"
                    onChange={(e) => {
                      setClinetPhone(e.target.value);
                    }}
                    value={clinetPhone}
                    name="name"
                  />
                  <label htmlFor="name">Телефон клиента</label>
                </div>
                <div className="form-check form-switch form-check-reverse pb-2">
                  <input
                    className="form-check-input "
                    type="checkbox"
                    id="isPaid"
                    name="isPaid"
                    onChange={(e) => {
                      setIsPaid(e.target.checked);
                    }}
                  />
                  <label className="form-check-label" htmlFor="isPaid">
                    Заказ оплачен
                  </label>
                </div>
              </div>
            )}

            <hr></hr>
            {!hideInterface && (
              <>
                <Button
                  clickHandler={() => {
                    order_id ? UpdateOrder() : CreateOrder();
                  }}
                  colorClass="btn-success"
                  type="button"
                  disabled={!saveAllowed}
                >
                  <>Создать заказ</>
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
              </>
            )}
          </form>
        </>
      )}
    </>
  );
};

export default OrderAdd;
