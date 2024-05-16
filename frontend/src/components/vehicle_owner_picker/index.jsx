import React from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import api from "../../api";

const VehicleOwnerPicker = (props) => {
  const [currentOwner, setCurrentOwner] = React.useState(props.currentVehicleOwner);
  const [currentOwnerName, setCurrentOwnerName] = React.useState(props.currentVehicleOwnerName);
  const [showList, setShowList] = React.useState(false);
  const [vehicleOwnersList, setVehicleOwnersList] = React.useState([]);

  const getVehicleOwners = React.useCallback((value) => {
    api
    .getVehicleOwners(1, 99999, value)
    .then((res) => {
        setVehicleOwnersList(res.results)
    })
    .catch((err) => {
      const errors = Object.values(err);
      if (errors) {
        toast.error(errors.join(", "));
      }
    });
  }, [])

  const changeInput = (value) => {
    setCurrentOwnerName(value);
      setShowList(true);
      getVehicleOwners(value);
  };

  const vehicleOwnerChoise = (id, name) => {
    props.setVehicleOwnerValue(id, name);
  }

  React.useEffect(() => {
    getVehicleOwners("");
  }, [])

  return (
    <>
      <div className="mb-3">
        <div className="form-floating mb-3">
          <input
            type="text"
            tabIndex={0}
            className="form-control text"
            onChange={(e) => {
                changeInput(e.target.value);
            }}
            onFocus={(e) => changeInput(e.target.value)}

            value={currentOwnerName}
          />
          <label htmlFor="accountent_phone">Владелец ТС/ПП/ППЦ</label>
        </div>
        {showList && (
          <>
            <div
              id="vehicleelement"
              className="shadow p-2 m-0 vehicle_datalist_container"
            >
              <div
                id="vehicleelement"
                className="list-group vehicle_datalist_listgroup"
              >
                    {vehicleOwnersList?.map((owner, index) => (
                    <>
                      <a
                        id="ownerelement"
                        key={"ownerelement23232" + owner.id + index}
                        style={{ cursor: "pointer" }}
                        className="list-group-item list-group-item-action"
                        aria-current="true"
                        onClick={() => {
                          setCurrentOwner(owner.id);
                          setCurrentOwnerName(owner.name);
                          vehicleOwnerChoise(owner.id, owner.name)
                          setShowList(false);
                        }}
                      >
                        <>{owner.name}</>
                      </a>
                      </>
                    ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

VehicleOwnerPicker.propTypes = {
  setVehicleOwnerValue: PropTypes.func.isRequired,
  currentVehicleOwner: PropTypes.number,
  currentVehicleOwnerName: PropTypes.string
};

export default VehicleOwnerPicker;
