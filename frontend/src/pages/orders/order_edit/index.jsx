import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { isMobile } from "react-device-detect";
import { useAuth } from "../../../contexts/auth-context";
import Button from "../../../components/button";
import api from "../../../api";
import EditOrderCurrentVehicle from "../../../components/edit_order_current_vehicle";
import OrderWasherList from "../../../components/order_washer_list";
import EditOderCurrentServices from "../../../components/edit_order_current_services/index.jsx";
import OrderElementGroup from "../order_element_group/index.jsx";
import OrderWorkAct from "../../../print/order_work_act/index.jsx";

const OrderEdit = () => {
  const [loading, setLoading] = React.useState(false);

  const [order, setOrder] = React.useState(0);
  const [orderVehicles, setOrderVehicles] = React.useState([]);

  const navigate = useNavigate();
  const { order_id } = useParams();
  const auth = useAuth();

  const getOrder = React.useCallback(() => {
    let vehicles = [];
    api
      .getOrder(order_id)
      .then((res) => {
        setOrder(res);
        res.services?.map((item) => {
          vehicles.push({...item.vehicle, to_be_removed: false});
        });
        const newVehicle = Array.from(new Set(vehicles))
        setOrderVehicles(newVehicle);
      })
      .catch((err) => {
        Object.keys(err).map((key) => toast.error(key + ": " + err[key]));
      });
  }, [order_id]);

  React.useEffect(() => {
    setLoading(true);
    getOrder();
    setLoading(false);
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

  const markVehicleDelete = (index, mark) => {
    let newState = { ...order };
    newState.vehicle[index].to_be_removed = mark;
    setOrder(newState);
  };

  const changeIsPaid = (value) => {
    setOrder((prev) => ({
      ...prev,
      is_paid: value,
    }));
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
              vehicleList={orderVehicles || []}
              onlyShow={true}
            />
            <EditOderCurrentServices serviceList={order.services} />

            <div className="border">
              <OrderElementGroup
                header={<span className="fs-5 fw-medium">Итого к оплате:</span>}
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
            </div>

            <OrderWasherList
              onStartEditWasher={() => {}}
              washerList={order.washers}
              onlyShow={true}
              headerColor="primary"
            />
            <div>
              <div className="form-floating my-3">
                <input
                  readOnly={true}
                  className="form-control text"
                  id="name"
                  placeholder="name"
                  value={order.client_name}
                  name="name"
                />
                <label htmlFor="name">Ф. И. О. клиента</label>
              </div>
              <div className="form-floating my-3">
                <input
                  readOnly={true}
                  className="form-control text"
                  id="name"
                  placeholder="name"
                  value={order.phone}
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
                  checked={order.is_paid}
                  onChange={(e) => {
                    changeIsPaid(e.target.checked);
                  }}
                />
                <label className="form-check-label" htmlFor="isPaid">
                  Заказ оплачен
                </label>
              </div>
              {order.is_paid && (
                <div>
                  <OrderWorkAct order={order} />
                </div>
              )}
            </div>

            <hr></hr>

            <>
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
