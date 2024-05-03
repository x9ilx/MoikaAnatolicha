import React from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import api from "../../api";
import { isMobile } from "react-device-detect";

const GetServicesFromVehicleV2 = (props) => {
  const [loading, setLoading] = React.useState(false);
  const [currentTab, setCurrentTab] = React.useState(
    props.includeContractServices ? "contract" : "common"
  );
  const [ownerShortName, setOwnerShortName] = React.useState("");

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
      if (vehicle.hasOwnProperty("plate_number")) {
        api
          .getServicesForVehicleType(vehicle.vehicle_type.id)
          .then((res) => {
            newArr.common_service.push({
              vehicle_type_name: vehicle.vehicle_type.name,
              vehicle_id: vehicle.id,
              vehicle_plate_number: vehicle.plate_number,
              vehicle_class_name: vehicle.vehicle_type.vehicle_class_name,
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
                vehicle.owner.id,
                vehicle.vehicle_type.id
              )
              .then((res) => {
                if (res.length > 0) {
                  newArr.contract_service.push({
                    vehicle_type_name: vehicle.vehicle_type.name,
                    vehicle_id: vehicle.id,
                    vehicle_plate_number: vehicle.plate_number,
                    vehicle_class_name: vehicle.vehicle_type.vehicle_class_name,
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
                  setOwnerShortName(vehicle.owner.short_name)
                }
                
                setServices(newArr);
              })
              .catch((err) => {
                Object.keys(err).map((key) =>
                  toast.error(key + ": " + err[key])
                );
              });
          })
          .catch((err) => {
            Object.keys(err).map((key) => toast.error(key + ": " + err[key]));
          });
      }
    });

    setLoading(false);
  }, [props.vehicleList]);

  React.useEffect(() => {
    if (props.vehicleList.length) getServices();
  }, [props.vehicleList, getServices]);

  React.useEffect(() => {
    if (props.includeContractServices === true) {
      setCurrentTab("contract");
    } else {
      setCurrentTab("common");
    }
  }, [props.includeContractServices]);

  const selectServices = React.useCallback(() => {
    props.setCheckedServicesList(selectedServices);
    props.onCancel();
  }, [props, selectedServices]);

  React.useEffect(() => {
    selectServices();
  }, [selectedServices, selectServices, update]);

  const changeServiceSelect = (service, service_index, value) => {
    if (value === true) {
      setSelectedServices((prev) => [...prev, service]);
    } else {
      let newArr = selectedServices;
      newArr[service_index].cost = service.start_cost;
      newArr.splice(service_index, 1);
      setSelectedServices(newArr);
    }
    // selectServices();
    setUpdate(!update);
  };

  const checkChecked = (service) => {
    const serv = selectedServices.find(
      (element) =>
        (element.service.id == service.service.id) &
        (element.legal_entity_service === service.legal_entity_service) &
        (element.vehicle.id == service.vehicle.id)
    );

    if (serv) {
      return true;
    }
    return false;
  };

  const setNewCost = (service_index, value) => {
    let newArr = selectedServices;
    newArr[service_index].cost = parseInt(value);
    newArr[service_index].cost_change = true;
    setSelectedServices(newArr);
    setUpdate(!update);
  };

  const generateList = (table) => {
    return (
      <div className=" row overflow-auto vh-25" style={{ maxHeight: "450px" }}>
        {services[table].map((service_list, index) => (
          <div
            key={table + index + service_list.vehicle_plate_number}
            className=""
          >
            <ul className="list-group">
              <li className="list-group-item fw-medium fs-8">
                <b>{service_list.vehicle_plate_number}</b>{" "}
                {service_list.vehicle_model} {isMobile && <br></br>}
                {service_list.vehicle_class_name} (
                {service_list.vehicle_type_name})
              </li>
              <li className="list-group-item p-1">
                <div className="input-group">
                  <div className="d-flex flex-wrap gap-2">
                    {service_list.services.map((service, service_index) => (
                      <div key={table + service_index + service.vehicle.id}>
                        <input
                          type="checkbox"
                          className="btn-check rounded"
                          name={
                            "btnradiocommon_service" +
                            service_index +
                            service.vehicle.id +
                            table
                          }
                          id={
                            "btnradiocommon_service" +
                            service_index +
                            service.vehicle.id +
                            table
                          }
                          autoComplete="off"
                          checked={checkChecked(service)}
                          value={service.id}
                          onChange={(e) => {
                            changeServiceSelect(
                              service,
                              selectedServices.findIndex(
                                (element) =>
                                  (element.service.id == service.service.id) &
                                  (element.legal_entity_service ==
                                    service.legal_entity_service) &
                                  (element.vehicle.id == service.vehicle.id)
                              ),
                              e.target.checked
                            );
                          }}
                          disabled={!props.enable}
                        />
                        <label
                          className="btn btn-outline-primary btn-sm w-100 fw-medium align-content-start rounded"
                          style={{
                            textShadow: "1px -1px 10px rgba(0,0,0,0.45)",
                          }}
                          htmlFor={
                            "btnradiocommon_service" +
                            service_index +
                            service.vehicle.id +
                            table
                          }
                        >
                          {service.service.name} ({service.cost}₽) /{" "}
                          {table === "contract_service" ? "ДОГОВОР" : "ПРАЙС"}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </li>
            </ul>
          </div>
        ))}
      </div>
    );
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
      <div className="row">
      <span className="m-0">Услуги:</span>
      {ownerShortName && <span className="m-0 border rounded border-2 border-info p-2 shadow">Доступны услуги по договору: <b>{ownerShortName}</b></span>}
      </div>
      
      <ul className="nav nav-tabs mt-3">
        {props.includeContractServices && (
          <li className="nav-item">
            <a
              className={`nav-link text-text-color ${
                currentTab === "contract" && "active"
              } ${!props.enable && "disabled"}`}
              aria-current="page"
              onClick={() => {
                setCurrentTab("contract");
              }}
              style={{ cursor: "pointer" }}
            >
              Договор
            </a>
          </li>
        )}
        <li className="nav-item">
          <a
            className={`nav-link text-text-color ${
              currentTab === "common" && "active"
            } ${!props.enable && "disabled"}`}
            aria-current="page2"
            onClick={() => {
              setCurrentTab("common");
            }}
            style={{ cursor: "pointer" }}
          >
            Прайс
          </a>
        </li>
      </ul>
      {currentTab === "contract" && (
        <div className="" id="page">
          {generateList("contract_service")}
        </div>
      )}
      {currentTab === "common" && (
        <div className="" id="page2">
          {generateList("common_service")}
        </div>
      )}
    </div>
  );
};

GetServicesFromVehicleV2.propTypes = {
  vehicleList: PropTypes.array.isRequired,
  setCheckedServicesList: PropTypes.func.isRequired,
  includeContractServices: PropTypes.bool.isRequired,
  currentServices: PropTypes.array.isRequired,
  onCancel: PropTypes.func.isRequired,
  enable: PropTypes.bool,
};

export default GetServicesFromVehicleV2;
