import React from "react";
import { toast } from "react-toastify";
import { isMobile } from "react-device-detect";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../../components/button";
import { useAuth } from "../../../contexts/auth-context";
import api from "../../../api";
import SelectvehicleFullNumber from "../../../components/order_select_vehicle_full_plate_number";
import SelectPaymentMethodRadioGroup from "../../../components/order_select_payment_method_radio_group";
import VehicleInfo from "../../../components/order_vehicle_info";
import GetServicesFromVehicleV2 from "../../../components/order_get_service_from_vehicle_v2";
import SetWashersV2 from "../../../components/orders_set_washers/index_v2";
import ChangeServicesCost from "../../../components/order_change_service_cost";

const OrderEditV2 = (props) => {
  const [loading, setLoading] = React.useState(false);
  const [update, setUpdate] = React.useState(false);

  const [order, setOrder] = React.useState(0);
  const [isCompleted, setIsCompleted] = React.useState(false);
  const [administrator, setAdministrator] = React.useState(0);
  const [vehicleList, setVehicleList] = React.useState([]);
  const [paymentMethod, setPaymentMethod] = React.useState("CASH");
  const [isPaid, setIsPaid] = React.useState(false);
  const [services, setServices] = React.useState([]);
  const [washers, setWashers] = React.useState([]);
  const [totalCost, setTotalCost] = React.useState(0);
  const [totalCostContract, setTotalCostContract] = React.useState(0);
  const [finalCostForEmployer, setFinalCostForEmployer] = React.useState(0);

  const navigate = useNavigate();
  const { order_id } = useParams();
  const auth = useAuth();

  const getOrder = React.useCallback(() => {
    setLoading(true);
    let vehicles = [];
    let serv = [];
    api
      .getOrder(order_id)
      .then((res) => {
        setOrder(res);
        setIsCompleted(res.is_completed);
        setPaymentMethod(res.payment_method);
        res.services?.map((item) => {
          if (!vehicles.find((element) => element.id == item.vehicle.id)) {
            vehicles.push({ ...item.vehicle });
          }

          serv.push({ ...item, service: { ...item }, start_cost: item.cost });
        });
        const newVehicle = Array.from(new Set(vehicles));
        setVehicleList(newVehicle);
        setServices(serv);
        setWashers(res.washers);
        setLoading(false);
      })
      .catch((err) => {
        Object.keys(err).map((key) => toast.error(key + ": " + err[key]));
      });
  }, [order_id]);

  React.useEffect(() => {
    getOrder();
  }, []);

  const closeOrder = React.useCallback(() => {
    if (!order.is_paid) {
      toast.error(
        'Необходимо убедиться, что заказ оплачен и у становить "Заказ оплачен"'
      );
      return;
    }

    api
      .setOrderClose(order_id)
      .then((res) => {
        toast.success(`Заказ №${res.order_number} завершён`);
        navigate("/");
      })
      .catch((err) => {
        Object.keys(err).map((key) => toast.error(key + ": " + err[key]));
      });
  }, [order.is_paid, order_id, navigate]);

  const deleteOrder = React.useCallback(() => {
    if (
      confirm(`Действительно отменить заказ №${order.order_number}?`) == false
    ) {
      return;
    }

    api
      .cancelOrder(order_id)
      .then((res) => {
        toast.success("Заказ успешно отменён");
        navigate("/");
      })
      .catch((err) => {
        Object.keys(err).map((key) => toast.error(key + ": " + err[key]));
      });
  }, [navigate, order_id, order.order_number]);

  const changeIsPaid = (value) => {
    setOrder((prev) => ({
      ...prev,
      is_paid: value,
    }));
  };

  React.useEffect(() => {
    getOrder();
  }, []);

  const UpdateOrder = React.useCallback(() => {
    let data = {
      payment_method: paymentMethod,
      services: services,
      washers: washers,
    };

    api
      .updateOrder(order_id, data)
      .then(() => {
        toast.success(`Заказ ${order.order_number} изменён`);
        navigate(0);
      })
      .catch((err) => {
        Object.keys(err).map((key) => toast.error(key + ": " + err[key]));
      });
  }, [
    navigate,
    order.order_number,
    order_id,
    paymentMethod,
    services,
    washers,
  ]);

  const CalculateCost = React.useCallback(() => {
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
    setTotalCost(t_cost);
    setTotalCostContract(t_cost_contract);
    setFinalCostForEmployer(f_washer_salary);
  }, [services, update]);

  React.useEffect(() => {
    CalculateCost();
  }, [services, CalculateCost]);

  const ServiceChoise = (services) => {
    if (services.length > 0) {
      setServices(services);
    } else {
      setTotalCost(0);
      setTotalCostContract(0);
      setFinalCostForEmployer(0);
    }
  };

  const setNewServiceCost = React.useCallback(
    (service_id, vehicle_id, new_cost) => {
      services.map((item) => {
        if (item.id === service_id && item.vehicle.id === vehicle_id) {
          item.cost = parseInt(new_cost);
        }
      });
      setUpdate(!update);
    },
    [services, update]
  );

  return (
    <>
      {loading && (
        <p className="grid h-screen place-items-center text-center">
          Загрузка...
        </p>
      )}
      {!loading && (
        <>
          <p className="text-text-color fs-5">
            Редактирование заказа №{order.order_number} (заказ создал: {order?.administrator?.short_name})
          </p>
          <hr></hr>
          <div className="row d-sm-flex flex-sm-row flex-column m-0 mb-3">
            {vehicleList.length > 0 && (
              <div className="col mx-1">
                <VehicleInfo
                  notFoundText="ТС не найдено"
                  vehicle={vehicleList[0]}
                  vehiclePlateNumber={vehicleList[0].without_plate_number ? "Без гос. номера" : vehicleList[0].plate_number}
                  showOwner={paymentMethod === "CONTRACT"}
                  showPlateNumber={true}
                />
              </div>
            )}
            {vehicleList.length > 1 && (
              <div className="col mx-1">
                <VehicleInfo
                  notFoundText="ПП/ППЦ не найден"
                  vehicle={vehicleList[1]}
                  vehiclePlateNumber={vehicleList[0].without_plate_number ? "Без гос. номера" : vehicleList[1].plate_number}
                  showOwner={paymentMethod === "CONTRACT"}
                  showPlateNumber={true}
                />
              </div>
            )}
          </div>

          <div className="">
            <SelectPaymentMethodRadioGroup
              currentPaymentMethod={paymentMethod}
              onSetPaymentMethod={setPaymentMethod}
              enable={true}
            />

            {vehicleList.length > 0 && (
              <GetServicesFromVehicleV2
                currentServices={services}
                includeContractServices={paymentMethod === "CONTRACT"}
                onCancel={() => {}}
                setCheckedServicesList={ServiceChoise}
                vehicleList={vehicleList}
                enable={true}
              />
            )}
          </div>

          {services.length > 0 && (
            <div>
              <ChangeServicesCost
                currentServices={services}
                onChangeCost={setNewServiceCost}
                enable={services.length > 0}
              />
            </div>
          )}

          <div>
            <SetWashersV2
              currentWashers={washers}
              onCancel={() => {}}
              setWashers={setWashers}
              enable={services.length > 0}
            />
          </div>
          <div className="form-check form-switch form-check-reverse pb-2">
            <input
              className="form-check-input "
              type="checkbox"
              id="isPaid"
              name="isPaid"
              checked={order.is_paid}
              onChange={(e) => {
                changeIsPaid(e.target.checked);
              }}
            />
            <label className="form-check-label" htmlFor="isPaid">
              Заказ оплачен
            </label>
          </div>
          <div className="row">
            <div className="col-12 col-sm-6">
              <Button
                clickHandler={() => {
                  UpdateOrder();
                }}
                colorClass="btn-info"
                type="button"
                disabled={services.length <= 0 || washers.length <= 0}
              >
                <>
                  Изменить заказ {isMobile && <br />}(к оплате: {totalCost}₽
                  {paymentMethod === "CONTRACT" &&
                    `, оплата по договору: ${totalCostContract}₽`}
                  )
                </>
              </Button>
            </div>
            {!isCompleted && (
              <div className="col">
                <Button
                  clickHandler={() => {
                    closeOrder();
                  }}
                  colorClass="btn-success"
                  type="button"
                  disabled={false}
                >
                  <>Завершить заказ</>
                </Button>
              </div>
            )}
          </div>
          <div className="row">
            <div className="col">
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
            <div className="col">
              <Button
                clickHandler={() => {
                  deleteOrder();
                }}
                colorClass="btn-danger"
                type="button"
                disabled={false}
              >
                <>Отменить заказ</>
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

// OrderAdd1C.propTypes = {
//   isTractor: PropTypes.bool.isRequired,
//   haveTrailer: PropTypes.bool.isRequired,
// };

export default OrderEditV2;
