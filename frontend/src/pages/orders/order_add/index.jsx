import React from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { isMobile } from "react-device-detect";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../../components/button";
import SelectPaymentMethod from "../../../components/order_select_payment_method";
import DataListVehicle from "../../../components/data_list_vehicle";
import GetServicesFromVehicle from "../../../components/order_get_services_from_vehicle";

const OrderAdd = (props) => {
  const [loading, setLoading] = React.useState(false);
  const [hideInterface, setHideInterface] = React.useState(false);
  const [DELETE, setDELETE] = React.useState(false);
  const [saveAllowed, setSaveAllowed] = React.useState(false);

  const [vehicleList, setVehicleList] = React.useState([]);
  const [paymentMethod, setPaymentMethod] = React.useState("");
  const [services, setServices] = React.useState([]);

  const navigate = useNavigate();
  const { order_id } = useParams();

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

  const UpdateOrder = React.useCallback(() => {
 
  }, []);


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
            <DataListVehicle 
             vehicleListFinal={vehicleList.length > 0 ? vehicleList : []}
             setVehicleListFinal={setVehicleList}
             onShowAdd={setHideInterface}
             editOwner={true}
             ownerId={-1}
             ownerName=""
             header={"Найти ТС/ПЦ/ППЦ по гос. номеру"}
             noColor={true}
            />
          
            {vehicleList.length > 0 && (<>
              <SelectPaymentMethod onSetPaymentMethod={setPaymentMethod}/>

              <GetServicesFromVehicle
              includeContractServices={paymentMethod === "CONTRACT"}
              setCheckedServicesList={setServices}
              vehicleList={vehicleList}
              />
            </>)}

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
