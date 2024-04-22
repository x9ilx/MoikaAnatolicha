import React from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import api from "../../api";
import Button from "../button";
import OrderElementGroup from "../../pages/orders/order_element_group";

const SetWashers = (props) => {
  const [loading, setLoading] = React.useState(false);

  const [washersList, setWashersList] = React.useState([]);
  const [selectedWashers, setSelectedWashers] = React.useState(
    props.currentWashers || []
  );

  const getWashers = React.useCallback(() => {
    setLoading(true);
    api
      .getEmployeesAllWashers()
      .then((data) => {
        setWashersList(data.results);
      })
      .catch((err) => {
        Object.keys(err).map((key) => toast.error(key + ": " + err[key]));
      });
    setLoading(false);
  }, []);

  React.useEffect(() => {
    getWashers();
  }, []);

  const selectServices = () => {
    props.setWashers(selectedServices);
    props.onCancel();
  };

  const changeServiceSelect = (service, value) => {
    if (value) {
      setSelectedServices((prev) => [...prev, service]);
    } else {
      setSelectedServices(
        selectedServices.filter(
          (item) => item.service.id !== service.service.id
        )
      );
    }
  };

  if (loading) {
    return (
      <p className="grid h-screen place-items-center text-center">
        Загрузка списка сотрудников...
      </p>
    );
  }

  return (
    <div className="form-floating mb-3">
      <div className="row">
        {console.log(washersList)}
        {/* <OrderElementGroup
              header="Доступные мойщики:"
              elements_with_badge={[
                {
                  name: service.service.name + ": " + service.cost + "₽",
                  badge: (
                    <div className="form-check form-switch form-check-reverse pb-2">
                      <input
                        className="form-check-input "
                        type="checkbox"
                        id={`service_available_${service_index}`}
                        name={`service_available_${service_index}`}
                        checked={selectedServices.find(
                          (element) =>
                            (element.service.id == service.service.id) &
                            (element.legal_entity_service ==
                              service.legal_entity_service) &
                            (element.vehicle_type_id == service.vehicle_type_id)
                        )}
                        onChange={(e) => {
                          changeServiceSelect(service, e.target.checked);
                        }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`service_available_${service_index}`}
                      ></label>
                    </div>
                  ),
                },
              ]}
            /> */}
      </div>

      <Button
        clickHandler={() => {
          selectServices();
        }}
        colorClass="btn-success"
        type="button"
        disabled={false}
      >
        <>Выбрать мойщиков</>
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

SetWashers.propTypes = {
  setWashers: PropTypes.func.isRequired,
  currentWashers: PropTypes.array.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default SetWashers;
