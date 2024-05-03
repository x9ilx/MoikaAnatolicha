import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api";
import Button from "../button";

const WasherOnShiftButton = () => {
  const [loading, setLoading] = React.useState(false);
  const [update, setUpdate] = React.useState(false);

  const [washersList, setWashersList] = React.useState([]);

  const navigate = useNavigate();

  const getAllWashers = React.useCallback(() => {
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
    getAllWashers();
  }, []);

  const changeWasherOnShift = (washer_index, value, washer_id) => {
    api
      .setWasherOnShift(washer_id, value ? 1 : 0)
      .then(() => {
        let newArr = washersList;
        newArr[washer_index].on_shift = value;
        setWashersList(newArr);
        setUpdate(!update);
      })
      .catch((err) => {
        Object.keys(err).map((key) => toast.error(key + ": " + err[key]));
      });
  };

  if (loading) {
    return (
      <>
        <p className="grid h-screen place-items-center text-center">
          Загрузка списка мойщиков...
        </p>
      </>
    );
  }
  return (
    <div className="dropdown mb-3">
      <button
        className="btn btn-primary text-white w-100 dropdown-toggle "
        type="button"
        data-bs-toggle="dropdown"
        data-bs-auto-close="outside"
        aria-expanded="false"
      >
        Мойщики на смене
      </button>
      <ul className="dropdown-menu w-100 shadow-lg p-3">
        <div className="vstack gap-2">
          {washersList.map((washer, washer_index) => (
            <div key={washer.name + washer_index}>
              <li className="p-0 m-0">
                <input
                  type="checkbox"
                  className="btn-check rounded"
                  name={washer.name + washer_index}
                  id={washer.name + washer_index}
                  autoComplete="off"
                  value={washer.id}
                  checked={washer.on_shift}
                  onChange={(e) => {
                    changeWasherOnShift(
                      washer_index,
                      e.target.checked,
                      washer.id
                    );
                  }}
                />
                <label
                  className={`btn  ${
                    washer.is_busy_working
                      ? "btn-outline-secondary"
                      : "btn-outline-primary"
                  } btn-sm w-100 fw-medium align-content-start rounded`}
                  style={{
                    textShadow: "1px -1px 10px rgba(0,0,0,0.45)",
                  }}
                  htmlFor={washer.name + washer_index}
                >
                  {washer.short_name} {washer.on_shift && "/ НА СМЕНЕ"}
                </label>
              </li>
            </div>
          ))}
        </div>
      </ul>
    </div>
  );
};

export default WasherOnShiftButton;
