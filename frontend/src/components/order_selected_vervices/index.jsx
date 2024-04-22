import React from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { isMobile } from "react-device-detect";
import OrderElementGroup from "../../pages/orders/order_element_group";
import { TbReportMoney } from "react-icons/tb";
import { MdModeEdit } from "react-icons/md";

const OderSelectedServices = (props) => {
  const [services, setServices] = React.useState([]);

  React.useEffect(() => {
    let newArr = {};
    props.serviceList.map((item, index) => {
      newArr[item.vehicle.id] ??= {
        total_cost: 0,
        services: [],
      };
      newArr[item.vehicle.id].services.push(item);
      newArr[item.vehicle.id].total_cost += item.cost;
    });
    setServices(newArr);
  }, [props.serviceList]);

  return (
    <div className="form-floating mb-3 ">
      <div className="d-flex">
        <div className="flex-fill text-start">Выбранные услуги:</div>
        <div className="flex-shrink-1 text-end px-2">
          <MdModeEdit
            size={24}
            className="text-text-color"
            style={{ cursor: "pointer" }}
            title="Редактировать услуги"
            onClick={() => {
              props.onStartEditService();
            }}
          />
        </div>
      </div>
      <div className="row border py-1 mt-3">
        {Object.keys(services).map((key, index) => (
          <div key={"serviceList" + index} className="row">
            <OrderElementGroup
              header={
                <>
                  {services[key].services[0].vehicle.vehicle_class_name}{" "}
                  {isMobile && <br />} (
                  {services[key].services[0].vehicle.vehicle_type_name})
                </>
              }
              elements_with_badge={services[key].services.map((service) => ({
                name: (
                  <div className="row">
                  <span className="fs-7">
                    {service.service.name}
                    {service.legal_entity_service ? " (договор)" : null}:{" "}
                    {service.cost}₽
                  </span>
                  </div>
                ),
                badge: "",
              }))}
            />
            <p className="fs-6 px-3 m-0">
              <b>Итого: {services[key].total_cost}₽</b>
            </p>
          
          </div>
        ))}
      </div>
    </div>
  );
};

OderSelectedServices.propTypes = {
  serviceList: PropTypes.array.isRequired,
  onStartEditService: PropTypes.func.isRequired,
  onSetNewCost: PropTypes.func.isRequired,
};

export default OderSelectedServices;
