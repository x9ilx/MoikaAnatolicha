import React from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { isMobile } from "react-device-detect";

const ChangeServicesCost = (props) => {
  const [update, setUpdate] = React.useState(false);
  const [servicesList, setServicesList] = React.useState(props.currentServices || []);
  const [services, setServices] = React.useState([]);

  const setNewServices = React.useCallback(() => {
    let newArr = {};
    servicesList?.map((item, index) => {
      newArr[item.vehicle.id] ??= {
        vehicle_type_name: item.vehicle.vehicle_type.name,
        vehicle_plate_number: item.vehicle.plate_number,
        vehicle_class_name: item.vehicle.vehicle_type.vehicle_class_name,
        vehicle_model: item.vehicle.vehicle_model,
        services: [],
      };
      newArr[item.vehicle.id].services.push(item);
    });
    setServices(newArr);
  }, [servicesList]);

  React.useEffect(() => {
    setNewServices();
  }, [servicesList, setNewServices]);

  React.useEffect(() => {
    setServicesList(props.currentServices);
  }, [props.currentServices]);

  return (
    <div>
      <p className="d-inline-flex gap-1 w-100">
        <button
          className="btn btn-primary text-white w-100"
          style={{ textShadow: "1px -1px 7px rgba(0,0,0,0.45)" }}
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapseExample"
          aria-expanded="false"
          aria-controls="collapseExample"
          disabled={!props.enable}
        >
          Изменить стоимость выбранных услуг
        </button>
      </p>
      <div className="collapse" id="collapseExample">
        <div className="card card-body">
          {Object.keys(services).map((key, index) => (
            <ul key={`keys(services)${index}`} className="list-group mt-2">
              <li className="list-group-item fw-medium fs-7">
                <b>{services[key].vehicle_plate_number}</b>{" "}
                {services[key].vehicle_model} {isMobile && <br />}
                {services[key].vehicle_class_name} (
                {services[key].vehicle_type_name})
              </li>
              {services[key].services?.map((service, item_index) => (
                <li
                  key={`currentServices${item_index}`}
                  className="list-group-item fs-7"
                >
                  <div className="row">
                    <div className="d-flex">
                      <div className="w-25">
                        <span className="fs-7 ">
                          {service.service_name}
                          {service.legal_entity_service ? " (договор)" : null}
                        </span>
                      </div>
                      <div className="flex-fill">
                        <input
                          type="number"
                          value={service.cost}
                          className="form-control form-control-sm"
                          placeholder="Recipient's username"
                          aria-label="Recipient's username"
                          aria-describedby="button-addon2"
                          onChange={(e) => {
                            props.onChangeCost(
                              service.id,
                              service.vehicle.id,
                              e.target.value,
                            //   setUpdate(!update)
                            );
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
};

ChangeServicesCost.propTypes = {
  currentServices: PropTypes.array.isRequired,
  onChangeCost: PropTypes.func.isRequired,
  enable: PropTypes.bool,
};

export default ChangeServicesCost;
