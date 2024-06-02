import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../../api";
import { toast } from "react-toastify";
import EditOrderCurrentVehicle from "../../../components/edit_order_current_vehicle";
import PropTypes from "prop-types";
import OrderElementGroup from "../../orders/order_element_group";
import Button from "../../../components/button";

const LegalEntityInvoice = (props) => {
  const [DELETE, setDELETE] = React.useState(false);

  const [dateStart, setDateStart] = React.useState(
    new Date().toISOString().slice(0, -14)
  );
  const [dateEnd, setDateEnd] = React.useState(
    new Date().toISOString().slice(0, -14)
  );
  const [invoice, setInvoice] = React.useState({});
  const [legalEntity, setLegalEntity] = React.useState("");
  const [legalEntityServices, setLegalEntityServices] = React.useState([]);
  const [finalServices, setFinalServices] = React.useState([]);
  const [totalCost, setTotalCost] = React.useState(0);

  const { legal_entity_id } = useParams();
  const { invoice_id } = useParams();

  const navigate = useNavigate();

  const getInvoice = () => {
    api
      .getInvoice(invoice_id)
      .then((res) => {
        setInvoice(res);
        setDateStart(res.start_date);
        setDateEnd(res.end_date);
        setFinalServices(res.services);

        let total_cost = 0;
        res?.services?.map((service) => {
          total_cost += parseInt(service.total_cost);
        });
        setTotalCost(total_cost);
      })
      .catch((err) => {
        Object.keys(err).map((key) => toast.error(key + ": " + err[key]));
        navigate(`/legal_entity/`, {
          replace: true,
        });
      });
  };

  const getLegalEntityServicesForPeriod = () => {
    api
      .getLegalEntityServicesForPeriod(legal_entity_id, dateStart, dateEnd)
      .then((res) => {
        let newArr = [];
        let total_cost = 0;
        let total_service = {};
        res.map((order) => {
          let newArrItem = {
            order_number: order.order_number,
            date: null,
            services: [],
          };

          newArrItem.date = order.order_datetime;

          order?.services?.map((service) => {
            if (service.legal_entity_service === true) {
              newArrItem.services.push(service);
              let key = service.service_name + service.cost.toString();
              if (!total_service.hasOwnProperty(key)) {
                total_service[key] ??= {
                  count: 0,
                  cost: service.cost,
                  total_cost: 0,
                  name: service.service_name,
                };
              }
              total_service[key].count += 1;
              total_service[key].total_cost += total_service[key].cost;
              total_cost += total_service[key].cost;
            }
          });

          newArrItem.services.sort(function (a, b) {
            return b.vehicle.id - a.vehicle.id;
          });

          newArr.push(newArrItem);
        });
        setFinalServices(total_service);
        setTotalCost(total_cost);
        setLegalEntityServices(newArr);
      })
      .catch((err) => {
        Object.keys(err).map((key) => toast.error(key + ": " + err[key]));
      });
  };

  const createInvoice = () => {
    if (dateStart === "" || dateStart == undefined) {
      toast.error("Необходимо выбрать дату начала получения услуг");
      return;
    }
    if (dateEnd === "" || dateEnd == undefined) {
      toast.error("Необходимо выбрать дату окончания получения услуг");
      return;
    }

    let services = [];

    Object.keys(finalServices).map((key) => {
      services.push(finalServices[key]);
    });

    api
      .createInvoice(
        legal_entity_id,
        new Date(dateStart).toISOString().split("T")[0],
        new Date(dateEnd).toISOString().split("T")[0],
        services
      )
      .then((res) => {
        navigate(`/legal_entity/${legal_entity_id}/invoice/${res}/`, {
          replace: true,
        });
        toast.success("Счёт успешно сохранён");
      })
      .catch((err) => {
        Object.keys(err).map((key) => toast.error(key + ": " + err[key]));
      });
  };

  const getLegalEntity = React.useCallback(() => {
    api
      .getLegalEntity(legal_entity_id)
      .then((res) => {
        setLegalEntity(res);
      })
      .catch((err) => {
        Object.keys(err).map((key) => toast.error(key + ": " + err[key]));
      });
  }, [legal_entity_id]);

  React.useEffect(() => {
    if (invoice_id <= 0) {
      getLegalEntity();
    } else {
      getInvoice();
    }
  }, []);

  React.useEffect(() => {
    if (invoice_id <= 0) {
      getLegalEntityServicesForPeriod();
    }
  }, [dateStart, dateEnd]);

  return (
    <div>
      <p className="fw-medium">
        {invoice_id > 0
          ? "Информация о счёте №" +
            invoice?.id +
            ": " +
            invoice?.legal_entity?.short_name +
            ", от " +
            new Date(invoice.date_of_issue).toLocaleDateString() +
            "г."
          : "Формирование счёта: " + legalEntity?.short_name}
      </p>
      <div className="row">
        <div className="col-sm-6 col-12 mb-3">
          <div className="form-floating">
            <input
              type="date"
              className="form-control text"
              id="dateS"
              placeholder="dateS"
              value={dateStart}
              onChange={(e) => {
                setDateStart(e.target.value);
              }}
              disabled={invoice_id > 0}
              name="dateS"
            />
            <label htmlFor="dateS">Услуги С</label>
          </div>
        </div>
        <div className="col-sm-6 col-12">
          <div className="form-floating">
            <input
              type="date"
              className="form-control text"
              id="dateP"
              placeholder="dateP"
              value={dateEnd}
              onChange={(e) => {
                setDateEnd(e.target.value);
              }}
              disabled={invoice_id > 0}
              name="dateP"
            />
            <label htmlFor="dateP">Услуги ПО</label>
          </div>
        </div>
      </div>

      <div className="mb-0">
        {invoice_id < 0 && (
          <div className="accordion" id="accordionExample">
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded="false"
                  aria-controls="collapseOne"
                >
                  Услуги
                </button>
              </h2>
              <div
                id="collapseOne"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionExample"
                style={{ maxHeight: "400px", overflow: "auto" }}
              >
                {legalEntityServices?.map((item, index) => (
                  <div key={`legalEntityServices${index}`}>
                    <OrderElementGroup
                      key={`item.vehicle_type${index}`}
                      header={
                        <span className="fs-8">
                          Заказ №{item.order_number}, от{" "}
                          {new Date(item.date).toLocaleDateString()}
                        </span>
                      }
                      elements_with_badge={item.services?.map((service) => ({
                        name: (
                          <div className="row">
                            <span className="fs-8">
                              <b>
                                {service.vehicle.without_plate_number
                                  ? "Без гос. номера"
                                  : service.vehicle.plate_number}
                              </b>{" "}
                              {service?.vehicle.vehicle_model}{" "}
                              {service?.vehicle.vehicle_type.vehicle_class_name}{" "}
                              - {service?.vehicle.vehicle_type.name}:{" "}
                              {service?.service_name}
                            </span>
                          </div>
                        ),
                        badge: <div className="fs-8">{service.cost}₽</div>,
                      }))}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <div>
        <OrderElementGroup
          header={<span className="fs-8">Информация о счёте</span>}
          elements_with_badge={Object.keys(finalServices).map((key) => ({
            name: (
              <div className="row">
                <span className="fs-8">
                  {finalServices[key].name}: {finalServices[key].count}шт. по{" "}
                  {finalServices[key].cost}₽
                </span>
              </div>
            ),
            badge: <div className="fs-8">{finalServices[key].total_cost}₽</div>,
          }))}
        />
        <OrderElementGroup
          header={``}
          elements_with_badge={[
            {
              name: <span>Итого по счёту</span>,
              badge: <span>{totalCost}₽</span>,
            },
          ]}
        />
      </div>
      <hr></hr>
      {invoice_id <= 0 && (
        <Button
          clickHandler={() => {
            createInvoice();
          }}
          colorClass="btn-success"
          type="button"
          disabled={false}
        >
          <>Сохранить</>
        </Button>
      )}

      {invoice_id > 0 && (
        <div>
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
              Удалить данные о счёте
            </label>
          </div>
          <Link to="./print/" target="_blank">
            <Button
              clickHandler={() => {}}
              colorClass="btn-info"
              type="button"
              disabled={false}
            >
              <>Печать счёта</>
            </Button>
          </Link>

          {DELETE && (
            <>
              <Button
                clickHandler={() => {
                  props.setInfoStringForDelete(
                    "Cчёт №" +
                      invoice?.id +
                      ": " +
                      invoice?.legal_entity?.short_name +
                      ", от " +
                      new Date(invoice.date_of_issue).toLocaleDateString() +
                      "г."
                  );
                  props.setId(invoice_id);
                  navigate("./delete/");
                }}
                colorClass="btn-danger"
                type="button"
                disabled={false}
              >
                <>УДАЛИТЬ ЗАПИСЬ О СЧЁТЕ</>
              </Button>
            </>
          )}
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
    </div>
  );
};

LegalEntityInvoice.propTypes = {
  setInfoStringForDelete: PropTypes.func,
  setId: PropTypes.func,
};

export default LegalEntityInvoice;
