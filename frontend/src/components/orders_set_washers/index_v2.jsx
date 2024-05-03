import React from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import api from "../../api";

const SetWashersV2 = (props) => {
  const [loading, setLoading] = React.useState(false);
  const [update, setUpdate] = React.useState(false);

  const [washersList, setWashersList] = React.useState([]);
  const [selectedWashers, setSelectedWashers] = React.useState(
    props.currentWashers || []
  );

  const getWashers = React.useCallback(() => {
    setLoading(true);
    api
      .getEmployeesAllWashersOnShift()
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
    setSelectedWashers(props.currentWashers);
  }, []);

  const selectWashers = React.useCallback(() => {
    props.setWashers(selectedWashers);
    props.onCancel();
  }, [props, selectedWashers]);

  React.useEffect(() => {
    selectWashers();
  }, [selectedWashers, selectWashers]);
  


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
    <div className=" row overflow-auto mb-3" style={{ maxHeight: "450px" }}>
      <p className=" mb-2-0">Доступные мойщики:</p>
      <ul className="list-group">
        <li className="list-group-item p-1">
          <div className="input-group">
            <div className="d-flex flex-wrap gap-2">
              {washersList.map((washer, washer_index) => (
                <div key={washer.name + washer_index}>
                  <input
                    type="checkbox"
                    className="btn-check rounded"
                    name={washer.name + washer_index}
                    id={washer.name + washer_index}
                    autoComplete="off"
                    value={washer.id}
                    checked={selectedWashers.findIndex(
                      (element) => element.id == washer.id
                    ) > -1}
                    onChange={(e) => {
                      changeWasherSelect(washer, e.target.checked);
                    }} 
                    disabled={!props.enable}
                  />
                  <label
                    className={`btn  ${washer.is_busy_working ? "btn-outline-secondary" : "btn-outline-primary"} btn-sm w-100 fw-medium align-content-start rounded`}
                    style={{
                      textShadow: "1px -1px 10px rgba(0,0,0,0.45)",
                    }}
                    htmlFor={washer.name + washer_index}
                  >
                    {washer.short_name} {washer.is_busy_working && "(на заказе)"}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
};

SetWashersV2.propTypes = {
  setWashers: PropTypes.func.isRequired,
  currentWashers: PropTypes.array.isRequired,
  onCancel: PropTypes.func.isRequired,
  enable: PropTypes.bool,
};

export default SetWashersV2;
