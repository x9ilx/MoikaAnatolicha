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

  const selectWashers = () => {
    props.setWashers(selectedWashers);
    props.onCancel();
  };

  const changeWasherSelect = (washer, value) => {
    if (value) {
      setSelectedWashers((prev) => [...prev, washer]);
    } else {
      setSelectedWashers(
        selectedWashers.filter((item) => item.id !== washer.id)
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
        <OrderElementGroup
          header="Доступные мойщики:"
          elements_with_badge={washersList.map((washer, washer_index) => ({
            name: washer.short_name,
            badge: (
              <div className="form-check form-switch form-check-reverse pb-2">
                <input
                  className="form-check-input "
                  type="checkbox"
                  id={`washersList_available_${washer_index}`}
                  name={`washersList_available_${washer_index}`}
                  checked={selectedWashers.find(
                    (element) => element.id == washer.id
                  )}
                  onChange={(e) => {
                    changeWasherSelect(washer, e.target.checked);
                  }}
                />
                <label
                  className="form-check-label"
                  htmlFor={`washersList_available_${washer_index}`}
                ></label>
              </div>
            ),
          }))}
        />
      </div>
      <Button
        clickHandler={() => {
          selectWashers();
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
