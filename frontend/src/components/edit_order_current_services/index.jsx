import React from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { isMobile } from "react-device-detect";
import OrderElementGroup from "../../pages/orders/order_element_group";

const EditOderCurrentServices = (props) => {
  const [services, setServices] = React.useState({});

  React.useEffect(() => {
    let newArr = {};
    props.serviceList?.map((item) => {
      newArr[item.vehicle.id] ??= {
        total_cost: 0,
        vehicle_type_name: item.vehicle.vehicle_type.name,
        vehicle_plate_number: item.vehicle.plate_number,
        vehicle_class_name: item.vehicle.vehicle_type.vehicle_class_name,
        vehicle_model: item.vehicle.vehicle_model,
        services: [],
      };
      newArr[item.vehicle.id].services.push(item);
      newArr[item.vehicle.id].total_cost += item.cost;
    });
    setServices(newArr);
  }, [props.serviceList]);

  return (
    <div className="form-floating my-4 ">
      <div
        className="d-flex m-0 border p-1 bg-primary fw-medium text-white p-2"
        style={{ textShadow: "1px -1px 7px rgba(0,0,0,0.45)" }}
      >
        <div className="flex-fill text-start">Выбранные услуги:</div>
      </div>
      <div className="border p-2">
        {Object.keys(services).map((key, index) => (
          <div key={"serviceList" + index} className="row">
            <OrderElementGroup
              header={
                <>
                  <b>{services[key].vehicle_plate_number}</b>{" "}
                  {services[key].vehicle_model}
                  <br />
                  {services[key].vehicle_class_name} (
                  {services[key].vehicle_type_name})
                </>
              }
              elements_with_badge={services[key].services.map((service) => ({
                name: (
                  <div className="row">
                    <span className="fs-6">
                      {service.service_name}
                      {service.legal_entity_service ? " (договор)" : null}:{" "}
                      {service.cost}₽
                    </span>
                  </div>
                ),
                badge: "",
              }))}
            />
            <p className="fs-6 px-3 m-0 mb-3">
              <b>Итого: {services[key].total_cost}₽</b>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

EditOderCurrentServices.propTypes = {
  serviceList: PropTypes.array.isRequired,
};

export default EditOderCurrentServices;