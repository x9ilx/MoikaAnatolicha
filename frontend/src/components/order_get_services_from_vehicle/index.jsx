import React from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import api from "../../api";
import Button from "../button";
import OrderElementGroup from "../../pages/orders/order_element_group";

const GetServicesFromVehicle = (props) => {
  const [loading, setLoading] = React.useState(false);

  const [services, setServices] = React.useState({
    common_service: [],
    contract_service: [],
  });
  const [selectedServices, setSelectedServices] = React.useState(
    props.currentServices || []
  );
  const [update, setUpdate] = React.useState(false);

  const getServices = React.useCallback(() => {
    setLoading(true);
    const newArr = {
      common_service: [],
      contract_service: [],
    };
    props.vehicleList.map((vehicle) => {
      api
        .getServicesForVehicleType(vehicle.vehicle_type)
        .then((res) => {
          newArr.common_service.push({
            vehicle_type_name: vehicle.vehicle_type_name,
            vehicle_id: vehicle.id,
            vehicle_plate_number: vehicle.plate_number,
            vehicle_class_name: vehicle.vehicle_class_name,
            vehicle_model: vehicle.vehicle_model,
            services: res.map((item) => {
              return {
                ...item,
                vehicle: vehicle,
                cost_change: false,
                start_cost: item.cost,
              };
            }),
          });
          api
            .getLegalEntityVehicleTypeServicesList(
              vehicle.owner,
              vehicle.vehicle_type
            )
            .then((res) => {
              if (res.length > 0) {
                newArr.contract_service.push({
                  vehicle_type_name: vehicle.vehicle_type_name,
                  vehicle_id: vehicle.id,
                  vehicle_plate_number: vehicle.plate_number,
                  vehicle_class_name: vehicle.vehicle_class_name,
                  vehicle_model: vehicle.vehicle_model,
                  services: res.map((item) => {
                    return {
                      ...item,
                      vehicle: vehicle,
                      cost_change: false,
                      start_cost: item.cost,
                    };
                  }),
                });
              }
              setServices(newArr);
            })
            .catch((err) => {
              Object.keys(err).map((key) => toast.error(key + ": " + err[key]));
            });
        })
        .catch((err) => {
          Object.keys(err).map((key) => toast.error(key + ": " + err[key]));
        });
    });

    setLoading(false);
  }, [props.vehicleList]);

  React.useEffect(() => {
    getServices();
  }, [props.vehicleList, getServices]);

  const selectServices = () => {
    props.setCheckedServicesList(selectedServices);
    props.onCancel();
  };

  const changeServiceSelect = (service, service_index, value) => {
    if (value) {
      setSelectedServices((prev) => [...prev, service]);
    } else {
      let newArr = selectedServices;
      newArr[service_index].cost = service.start_cost;
      newArr.splice(service_index, 1);
      setSelectedServices(newArr);
      setUpdate(!update);
    }
  };

  const setNewCost = (service_index, value) => {
    let newArr = selectedServices;
    newArr[service_index].cost = parseInt(value);
    newArr[service_index].cost_change = true;
    setSelectedServices(newArr);
    setUpdate(!update);
  };

  if (loading) {
    return (
      <p className="grid h-screen place-items-center text-center">
        Загрузка списка услуг...
      </p>
    );
  }

  return (
    <div className="form-floating mb-3">
      {/* <p className="">Доступные услуги</p> */}
      <div
        className="accordion accordion-flush mb-3 border"
        id="accordionFlushExample"
      >
        {props.includeContractServices && (
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseOne"
                aria-expanded="false"
                aria-controls="flush-collapseOne"
              >
                Услуги по договору
              </button>
            </h2>
            <div
              id="flush-collapseOne"
              className="accordion-collapse collapse"
              data-bs-parent="#accordionFlushExample"
            >
              <div className="accordion-body">
                {services.contract_service.map((service_list, index) => (
                  <div key={"servicescommon_service" + index}>
                    <div className="fs-6 fw-medium my-2">
                      <b>{service_list.without_plate_number ? "Без гос. номера" : service_list.vehicle_plate_number}</b>{" "}
                      {service_list.vehicle_model}
                      <br />
                      {service_list.vehicle_class_name} (
                      {service_list.vehicle_type_name})
                    </div>
                    {service_list.services.map((service, service_index) => (
                      <div key={"vehicleListFinal554" + service_index}>
                        <div className="row">
                          <OrderElementGroup
                            header=""
                            elements_with_badge={[
                              {
                                name:
                                  service.service.name +
                                  ": " +
                                  service.cost +
                                  "₽",
                                badge: (
                                  <div className="form-check form-switch form-check-reverse pb-2">
                                    <input
                                      className="form-check-input "
                                      type="checkbox"
                                      id={`service_contract_service_${service_index}`}
                                      name={`service_contract_service_${service_index}`}
                                      checked={selectedServices.find(
                                        (element) =>
                                          (element.service.id ==
                                            service.service.id) &
                                          (element.legal_entity_service ==
                                            service.legal_entity_service) &
                                          (element.vehicle.id ==
                                            service.vehicle.id)
                                      )}
                                      onChange={(e) => {
                                        changeServiceSelect(
                                          service,
                                          selectedServices.findIndex(
                                            (element) =>
                                              (element.service.id ==
                                                service.service.id) &
                                              (element.legal_entity_service ==
                                                service.legal_entity_service) &
                                              (element.vehicle.id ==
                                                service.vehicle.id)
                                          ),
                                          e.target.checked
                                        );
                                      }}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor={`service_contract_service_${service_index}`}
                                    ></label>
                                  </div>
                                ),
                              },
                            ]}
                          />
                          {selectedServices.find(
                            (element) =>
                              (element.service.id == service.service.id) &
                              (element.legal_entity_service ==
                                service.legal_entity_service) &
                              (element.vehicle.id == service.vehicle.id)
                          ) && (
                            <div className="col">
                              <div className="form-floating mb-3">
                                <input
                                  key={selectedServices}
                                  required
                                  className="form-control text"
                                  id="number"
                                  min={0}
                                  type="number"
                                  placeholder="name"
                                  onChange={(e) => {
                                    setNewCost(
                                      selectedServices.findIndex(
                                        (element) =>
                                          (element.service.id ==
                                            service.service.id) &
                                          (element.legal_entity_service ==
                                            service.legal_entity_service) &
                                          (element.vehicle.id ==
                                            service.vehicle.id)
                                      ),
                                      e.target.value
                                    );
                                  }}
                                  value={
                                    selectedServices.find(
                                      (element) =>
                                        (element.service.id ==
                                          service.service.id) &
                                        (element.legal_entity_service ==
                                          service.legal_entity_service) &
                                        (element.vehicle.id ==
                                          service.vehicle.id)
                                    )?.cost
                                  }
                                  name="name"
                                />
                                <label htmlFor="name">
                                  Изменить стоимость услуги
                                </label>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#flush-collapse2"
              aria-expanded="false"
              aria-controls="flush-collapse2"
            >
              Услуги по прайсу
            </button>
          </h2>
          <div
            id="flush-collapse2"
            className="accordion-collapse collapse"
            data-bs-parent="#accordionFlushExample"
          >
            {services.common_service.map((service_list, index) => (
              <div key={"servicescommon_service" + index}>
                <div className="fs-6 fw-medium m-2">
                  <b>{service_list.without_plate_number ? "Без гос. номера" : service_list.vehicle_plate_number}</b>{" "}
                  {service_list.vehicle_model}
                  <br />
                  {service_list.vehicle_class_name} (
                  {service_list.vehicle_type_name})
                </div>
                {service_list.services.map((service, service_index) => (
                  <div key={"vehicleListFinal554" + service_index}>
                    <div className="row p-2">
                      <OrderElementGroup
                        header=""
                        elements_with_badge={[
                          {
                            name:
                              service.service.name + ": " + service.cost + "₽",
                            badge: (
                              <div className="form-check form-switch form-check-reverse pb-2">
                                <input
                                  className="form-check-input "
                                  type="checkbox"
                                  id={`service_available_${service_index}${service.vehicle.id}`}
                                  name={`service_available_${service_index}${service.vehicle.id}`}
                                  checked={selectedServices.find(
                                    (element) =>
                                      (element.service.id ==
                                        service.service.id) &
                                      (element.legal_entity_service ==
                                        service.legal_entity_service) &
                                      (element.vehicle.id == service.vehicle.id)
                                  )}
                                  onChange={(e) => {
                                    changeServiceSelect(
                                      service,
                                      selectedServices.findIndex(
                                        (element) =>
                                          (element.service.id ==
                                            service.service.id) &
                                          (element.legal_entity_service ==
                                            service.legal_entity_service) &
                                          (element.vehicle.id ==
                                            service.vehicle.id)
                                      ),
                                      e.target.checked
                                    );
                                  }}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor={`service_available_${service_index}${service.vehicle.id}`}
                                ></label>
                              </div>
                            ),
                          },
                        ]}
                      />
                      {selectedServices.find(
                        (element) =>
                          (element.service.id == service.service.id) &
                          (element.legal_entity_service ==
                            service.legal_entity_service) &
                          (element.vehicle.id == service.vehicle.id)
                      ) && (
                        <div className="col">
                          <div className="form-floating mb-3">
                            <input
                              required
                              className="form-control text"
                              id="number"
                              min={0}
                              type="number"
                              placeholder="name"
                              onChange={(e) => {
                                setNewCost(
                                  selectedServices.findIndex(
                                    (element) =>
                                      (element.service.id ==
                                        service.service.id) &
                                      (element.legal_entity_service ==
                                        service.legal_entity_service) &
                                      (element.vehicle.id == service.vehicle.id)
                                  ),
                                  e.target.value
                                );
                              }}
                              value={
                                selectedServices.find(
                                  (element) =>
                                    (element.service.id == service.service.id) &
                                    (element.legal_entity_service ==
                                      service.legal_entity_service) &
                                    (element.vehicle.id == service.vehicle.id)
                                )?.cost
                              }
                              name="name"
                            />
                            <label htmlFor="name">
                              Изменить стоимость услуги
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Button
        clickHandler={() => {
          selectServices();
        }}
        colorClass="btn-success"
        type="button"
        disabled={false}
      >
        <>Выбрать услуги</>
      </Button>
      <Button
        clickHandler={() => {
          props.onCancel();
        }}
        colorClass="btn-primary"
        type="button"
        disabled={false}
      >
        <>Отмена</>
      </Button>
    </div>
  );
};

GetServicesFromVehicle.propTypes = {
  vehicleList: PropTypes.array.isRequired,
  setCheckedServicesList: PropTypes.func.isRequired,
  includeContractServices: PropTypes.bool.isRequired,
  currentServices: PropTypes.array.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default GetServicesFromVehicle;
