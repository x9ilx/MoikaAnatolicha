import React from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import api from "../../api";

const GetServicesFromVehicle = (props) => {
  const [loading, setLoading] = React.useState(false);
  const [vehicleList, setVehicleList] = React.useState(props.vehicleList);

  const [services, setServices] = React.useState({
    common_service: [],
    contract_service: [],
  });
  const [selectedServices, setSelectedServices] = React.useState([]);

  const getServices = React.useCallback(() => {
    setLoading(true);
    const newArr = {
      common_service: [],
      contract_service: [],
    };
    vehicleList.map((vehicle) => {
      api
        .getServicesForVehicleType(vehicle.vehicle_type)
        .then((res) => {
          newArr.common_service.push({
            vehicle_type_name: vehicle.vehicle_type_name,
            services: res,
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
                  services: res,
                });
              }
            })
            .catch((err) => {
              Object.keys(err).map((key) => toast.error(key + ": " + err[key]));
            });
        })
        .catch((err) => {
          Object.keys(err).map((key) => toast.error(key + ": " + err[key]));
        });
    });
    setServices(newArr);
    setLoading(false);
  }, [vehicleList]);

  React.useEffect(() => {
    getServices();
  }, [vehicleList, getServices]);

  if (loading || services.length === 0) {
    return (
      <p className="grid h-screen place-items-center text-center">
        Загрузка списка услуг...
      </p>
    );
  }

  return (
    <>
      <div className="form-floating mb-3">
        <p className="">Доступные услуги</p>
        {props.includeContractServices && (
          <>
            <p className="">По договору:</p>
            {services.contract_service.map((service_list, index) => (
              <div key={"contract_service" + index}>
                <div className="fs-6 fw-medium">
                  {service_list.vehicle_type_name}
                </div>
                {service_list.services.map((service, service_index) => (
                  <div
                    key={"vehicleListFinal554" + service_index}
                    className="fs-6 border p-3 order_service_element hover-shadow"
                  >
                    <b>{service.service.name}: </b> {service.cost}₽
                  </div>
                ))}
              </div>
            ))}
          </>
        )}
        <p className="">По прайсу:</p>
        {services.common_service.map((service_list, index) => (
          <div key={"servicescommon_service" + index}>
            <div className="fs-6 fw-medium">
              {service_list.vehicle_type_name}
            </div>
            {service_list.services.map((service, service_index) => (
              <div
                key={"vehicleListFinal554" + service_index}
                className="fs-6 border p-3 order_service_element hover-shadow"
              >
                <b>{service.service.name}: </b> {service.cost}₽
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

GetServicesFromVehicle.propTypes = {
  vehicleList: PropTypes.array.isRequired,
  setCheckedServicesList: PropTypes.func.isRequired,
  includeContractServices: PropTypes.bool.isRequired,
};

export default GetServicesFromVehicle;
