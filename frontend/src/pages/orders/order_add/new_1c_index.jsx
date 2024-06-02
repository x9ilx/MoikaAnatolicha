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

const OrderAdd1C = (props) => {
  const { is_tractor, have_trailer } = useParams();

  const [loading, setLoading] = React.useState(false);
  const [hideInterface, setHideInterface] = React.useState(false);

  const [isTractor, setIsTractor] = React.useState(is_tractor);
  const [haveTrailer, setHaveTrailer] = React.useState(have_trailer);

  const [administrator, setAdministrator] = React.useState(0);
  const [tractorPlateNumber, setTractorPlateNumber] = React.useState("");
  const [trailerPlateNumber, setTrailerPlateNumber] = React.useState("");
  const [tractor, setTractor] = React.useState({});
  const [trailer, setTrailer] = React.useState({});
  const [tractorNoPlateNumber, setTractorNoPlateNumber] = React.useState(false);
  const [trailerNoPlateNumber, setTrailerNoPlateNumber] = React.useState(false);
  const [vehicleList, setVehicleList] = React.useState([]);
  const [paymentMethod, setPaymentMethod] = React.useState("CASH");
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
    setIsTractor(is_tractor);
    setHaveTrailer(have_trailer);
  }, []);

  const CreateOrder = React.useCallback(() => {

    let tt = ""

    if (tractor.hasOwnProperty("plate_number") && trailer.hasOwnProperty("plate_number")) {
      tt = `${tractor.plate_number} + ${trailer.plate_number}`;
    } else {
      tt = `${tractor.plate_number}`;
    }

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
      tractor_trailer: tt,
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
    setHideInterface(false);
    setTotalCost(t_cost);
    setTotalCostContract(t_cost_contract);
    setFinalCostForEmployer(f_washer_salary);
    if (services.length > 0) {
      //
    } else {
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

  const getVehicleInfo = React.useCallback((plate_number, onSet) => {
    api
      .getVehicleFromPlateNumber(plate_number)
      .then((res) => {
        onSet(res);

        const exisitingVehicle = vehicleList.findIndex((a) => a.id === res.id);
        if (exisitingVehicle == -1) {
          let newArr = vehicleList;
          newArr.push(res);
          setVehicleList(newArr);
        }
      })
      .catch((err) => {
        Object.keys(err).map((key) => toast.error(key + ": " + err[key]));
      });
  }, []);

  const changeVehicleList = React.useCallback(() => {
    let newArr = [];
    if (tractor.hasOwnProperty("plate_number")) {
      newArr.push(tractor);
    }
    if (trailer.hasOwnProperty("plate_number")) {
      newArr.push(trailer);
    }

    setVehicleList(newArr);
  }, [tractor, trailer]);

  React.useEffect(() => {
    changeVehicleList();
  }, [tractor, trailer, changeVehicleList]);

  React.useEffect(() => {
    setTractor({});
  }, [tractorNoPlateNumber]);

  React.useEffect(() => {
    setTrailer({});
  }, [trailerNoPlateNumber]);

  const onChangeTrailerPlateNumber = (value) => {
    if (value.length >= 8) {
      getVehicleInfo(value, setTrailer);
    } else {
      setTrailer({});
    }
    setTrailerPlateNumber(value);
  };
  const onChangeTractorPlateNumber = (value) => {
    if (value.length >= 8) {
      getVehicleInfo(value, setTractor);
    } else {
      setTractor({});
    }
    setTractorPlateNumber(value);
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
          <p className="text-text-color fs-5">Создание заказа</p>
          <hr></hr>
          <div className="row d-sm-flex flex-sm-row flex-column m-0">
            <div className="col mx-1">
              {isTractor === "1" && (
                <SelectvehicleFullNumber
                  mask="####@@ ###"
                  onAccept={onChangeTractorPlateNumber}
                  value={tractorPlateNumber}
                  placeholder={"0000АА 000"}
                  header="Гос. номер ТС"
                  ok={tractor.hasOwnProperty("plate_number")}
                  notOk={!tractor.hasOwnProperty("plate_number")}
                  setNoPlateNumber={setTractorNoPlateNumber}
                  setVehicleWithNoPlateNumber={setTractor}
                />
              )}
              {isTractor === "0" && (
                <SelectvehicleFullNumber
                  mask="@###@@ ###"
                  onAccept={onChangeTractorPlateNumber}
                  value={tractorPlateNumber}
                  placeholder={"А000АА 000"}
                  header="Гос. номер ТС"
                  ok={tractor.hasOwnProperty("plate_number")}
                  notOk={
                    !tractor.hasOwnProperty("plate_number") &&
                    tractorPlateNumber.length >= 8
                  }
                  setNoPlateNumber={setTractorNoPlateNumber}
                  setVehicleWithNoPlateNumber={setTractor}
                />
              )}

              {tractor && (
                <VehicleInfo
                  notFoundText="ТС не найдено"
                  vehicle={tractor}
                  vehiclePlateNumber={tractorPlateNumber}
                  showOwner={paymentMethod === "CONTRACT"}
                  isNoPlateNumber={tractorNoPlateNumber}
                  setNoPlateNumberChange={() => {
                    setTractor({});
                  }}
                />
              )}
            </div>
            {haveTrailer === "1" && (
              <div className="col mx-1">
                <SelectvehicleFullNumber
                  mask="@@#### ###"
                  onAccept={onChangeTrailerPlateNumber}
                  value={trailerPlateNumber}
                  placeholder={"АА0000 000"}
                  header="Гос. номер ПП/ППЦ"
                  ok={trailer.hasOwnProperty("plate_number")}
                  notOk={
                    !trailer.hasOwnProperty("plate_number") &&
                    trailerPlateNumber.length >= 8
                  }
                  setNoPlateNumber={setTrailerNoPlateNumber}
                  setVehicleWithNoPlateNumber={setTrailer}
                />

                {trailer && (
                  <VehicleInfo
                    notFoundText="ПП/ППЦ не найден"
                    vehicle={trailer}
                    vehiclePlateNumber={trailerPlateNumber}
                    showOwner={paymentMethod === "CONTRACT"}
                    isNoPlateNumber={trailerNoPlateNumber}
                    setNoPlateNumberChange={() => {
                      setTrailer({});
                    }}
                  />
                )}
              </div>
            )}
          </div>

          <div className="">
            <SelectPaymentMethodRadioGroup
              currentPaymentMethod={paymentMethod}
              onSetPaymentMethod={setPaymentMethod}
              enable={
                (haveTrailer == "1" &&
                  tractor.hasOwnProperty("plate_number") &&
                  trailer.hasOwnProperty("plate_number")) ||
                (haveTrailer == "0" &&
                  (tractor.hasOwnProperty("plate_number") ||
                    trailer.hasOwnProperty("plate_number")))
              }
            />
            <GetServicesFromVehicleV2
              currentServices={services}
              includeContractServices={paymentMethod === "CONTRACT"}
              onCancel={() => {}}
              setCheckedServicesList={ServiceChoise}
              vehicleList={vehicleList}
              enable={
                (haveTrailer == "1" &&
                  tractor.hasOwnProperty("plate_number") &&
                  trailer.hasOwnProperty("plate_number")) ||
                (haveTrailer == "0" &&
                  (tractor.hasOwnProperty("plate_number") ||
                    trailer.hasOwnProperty("plate_number")))
              }
            />
          </div>

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
              onChange={() => {
                setIsPaid(!isPaid);
              }}
            />
            <label className="form-check-label" htmlFor="isPaid">
              Заказ оплачен
            </label>
          </div>
          {!hideInterface && (
            <>
              <Button
                clickHandler={() => {
                  order_id ? UpdateOrder() : CreateOrder();
                }}
                colorClass="btn-success"
                type="button"
                disabled={washers.length == 0}
              >
                <>
                  Создать заказ {isMobile && <br />}(к оплате: {totalCost}₽
                  {paymentMethod === "CONTRACT" &&
                    `, оплата по договору: ${totalCostContract}₽`}
                  )
                </>
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
        </>
      )}
    </>
  );
};

// OrderAdd1C.propTypes = {
//   isTractor: PropTypes.bool.isRequired,
//   haveTrailer: PropTypes.bool.isRequired,
// };

export default OrderAdd1C;
