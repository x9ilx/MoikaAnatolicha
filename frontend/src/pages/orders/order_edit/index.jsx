import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { isMobile } from "react-device-detect";
import { useAuth } from "../../../contexts/auth-context";
import Button from "../../../components/button";
import api from "../../../api";
import EditOrderCurrentVehicle from "../../../components/edit_order_current_vehicle";

const OrderEdit = () => {
  const [loading, setLoading] = React.useState(false);
  const [hideInterface, setHideInterface] = React.useState(false);
  const [DELETE, setDELETE] = React.useState(false);
  const [selectService, setSelectService] = React.useState(false);
  const [selectWashers, setSelectWashers] = React.useState(false);
  const [saveAllowed, setSaveAllowed] = React.useState(false);

  const [order, setOrder] = React.useState(0);

  const navigate = useNavigate();
  const { order_id } = useParams();
  const auth = useAuth();

  const getOrder = React.useCallback(() => {
    api
      .getOrder(order_id)
      .then((res) => {
        setOrder(res);
      })
      .catch((err) => {
        Object.keys(err).map((key) => toast.error(key + ": " + err[key]));
      });
  }, [order_id]);

  React.useEffect(() => {
    setLoading(true);
    getOrder(auth.employerInfo.id);
    setLoading(false);
  }, []);

  const UpdateOrder = React.useCallback(() => {}, []);

  const markVehicleDelete = (index, mark) => {
    let newState = { ...order };
    newState.vehicle[index].to_be_removed = mark;
    setOrder(newState);
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
          <p className="text-text-color fs-5">Информация о заказе</p>

          <hr></hr>
          <form autoComplete="new-password">
            <EditOrderCurrentVehicle 
            onMarkDelete={markVehicleDelete}
            vehicleList={order.vehicle}
            />
            {/* <OderSelectedServices
                    serviceList={order.services}
                    onSetNewCost={()=>{}}
                    onStartEditService={() => {
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
                          badge: `${order.final_cost}₽`,
                        },
                        order.payment_method === "CONTRACT"
                          ? {
                              name: "Оплата по договору:",
                              badge: `${order.final_cost_contract}₽`,
                            }
                          : {},
                      ]}
                    />
                  </div> */}

            {/* <OrderWasherList
                    onStartEditWasher={() => {
                    }}
                    washerList={order.washers}
                  /> */}

            {saveAllowed && (
              <div>
                <div className="form-floating my-3">
                  <input
                    className="form-control text"
                    id="name"
                    placeholder="name"
                    onChange={(e) => {}}
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
                    onChange={(e) => {}}
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
                    onChange={(e) => {}}
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
                    UpdateOrder();
                  }}
                  colorClass="btn-success"
                  type="button"
                  disabled={!saveAllowed}
                >
                  <>Сохранить заказ</>
                </Button>
                {order.is_paid && (
                  <div>
                    {/* <OrderWorkAct
                      serviceList={order.services}
                      paymentMethod={order.paymentMethod}
                      totalCost={totalCost}
                      totalCostContract={totalCostContract}
                      clientName={clientName}
                      /> */}
                  </div>
                )}
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

                {order_id &&
                  auth.employerInfo.employer_info.position === "MANAGER" && (
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
                          Удалить заказ
                        </label>
                      </div>
                      {DELETE && (
                        <>
                          <Button
                            clickHandler={() => {
                              props.setInfoStringForDelete();
                              props.setId(order_id);
                              navigate("./delete/");
                            }}
                            colorClass="btn-danger"
                            type="button"
                            disabled={false}
                          >
                            <>УДАЛИТЬ ЗАКАЗ</>
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

OrderEdit.propTypes = {
    setInfoStringForDelete: PropTypes.func,
    setId: PropTypes.func,
  };

export default OrderEdit;
