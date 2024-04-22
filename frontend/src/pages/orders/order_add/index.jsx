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

const OrderAdd = (props) => {
  // order_number = CharField(max_length=255)
  //   order_datetime = models.DateTimeField(
  const [loading, setLoading] = React.useState(false);
  const [hideInterface, setHideInterface] = React.useState(false);
  const [DELETE, setDELETE] = React.useState(false);
  const [selectService, setSelectService] = React.useState(false);
  const [selectWashers, setSelectWashers] = React.useState(false);
  const [saveAllowed, setSaveAllowed] = React.useState(false);
  
  const [administrator, setAdministrator] = React.useState({});
  const [vehicleList, setVehicleList] = React.useState([]);
  const [paymentMethod, setPaymentMethod] = React.useState("");
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
    setAdministrator(auth.employerInfo.id);
  }, []);


  const CreateOrder = React.useCallback(() => {
    // let data = {
    //   plate_number: plateNumber,
    //   vehicle_model: vehicleModel,
    //   owner_id: owner,
    //   vehicle_type_id: vehicleType,
    // };
    // api
    //   .createVehicle(data)
    //   .then((res) => {
    //     toast.success("ТС/ПЦ/ППЦ " + res.plate_number + " успешно добавлено");
    //     navigate(-1);
    //   })
    //   .catch((err) => {
    //     setSaveAccept(false);
    //     Object.keys(err).map((key) => toast.error(key + ": " + err[key]));
    //   });
  }, []);

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
      f_washer_salary += Math.round((item.employer_salary * (item.percentage_for_washer / 100)))
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
      setSaveAllowed(true);
    } else {
      setSaveAllowed(false);
    }

  }
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
            {!hideInterface && (
              <>
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

            {services.length > 0 && !selectService && (
              <>
                <hr></hr>
                <OderSelectedServices
                  serviceList={services}
                  onSetNewCost={setNewServiceCost}
                  onStartEditService={() => {
                    setSelectService(true);
                    setHideInterface(true);
                  }}
                />
                <div className="p-0 m-0">
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
              </>
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

            {vehicleList.length > 0 && services.length > 0 && !hideInterface && (
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
              setWashers={setWashers}
              />
            )}

            <hr></hr>
            {!hideInterface && (
              <>
                <Button
                  clickHandler={() => {}}
                  colorClass="btn-success"
                  type="button"
                  disabled={!saveAllowed}
                >
                  <>{order_id ? "Сохранить заказ" : "Создать заказ"}</>
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

                {order_id && (
                  <>
                    <div className="form-check form-switch form-check-reverse pb-2">
                      <input
                        className="form-check-input "
                        type="checkbox"
                        id="DELETE"
                        name="DELETE"
                        onChange={() => {
                          setDELETE(!DELETE);
                        }}
                      />
                      <label className="form-check-label" htmlFor="DELETE">
                        Удалить данные о ТС/ПЦ/ППЦ
                      </label>
                    </div>
                    {DELETE && (
                      <>
                        <Button
                          clickHandler={() => {
                            props
                              .setInfoStringForDelete
                              //   "ТС/ПЦ/ППЦ  " + plateNumber
                              ();
                            props.setId(order_id);
                            navigate("./delete/");
                          }}
                          colorClass="btn-danger"
                          type="button"
                          disabled={false}
                        >
                          <>УДАЛИТЬ ЗАПИСЬ О ТС/ПЦ/ППЦ</>
                        </Button>
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </form>
        </>
      )}
    </>
  );
};

OrderAdd.propTypes = {
  setInfoStringForDelete: PropTypes.func,
  setId: PropTypes.func,
};

export default OrderAdd;
