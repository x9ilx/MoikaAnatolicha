import React from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import api from "../../api";

const VehicleModelPicker = (props) => {
  const [currentModel, setCurrentModel] = React.useState(props.currentVehicleModel);
  const [showList, setShowList] = React.useState(false);
  const [vehicleModelsList, setVehicleModelsList] = React.useState([]);

  const getVehicleModels = React.useCallback((value) => {
    api
    .getVehicleModels(value)
    .then((res) => {
        setVehicleModelsList(res)
    })
    .catch((err) => {
      const errors = Object.values(err);
      if (errors) {
        toast.error(errors.join(", "));
      }
    });
  }, [])

  const changeInput = (value) => {
    setCurrentModel(value);
    if (value.length > 0) {
      setShowList(true);
      getVehicleModels(value);
    } else {
      setShowList(false);
    }
  };

  const vehicleModelChoise = (name) => {
    props.setVehicleModelValue(name);
  }

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
            value={currentModel}
          />
          <label htmlFor="accountent_phone">Модель ТС/ПП/ППЦ</label>
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
                {vehicleModelsList.length > 0 && (
                  <>
                    {vehicleModelsList?.map((vehicleModel, index) => (
                    <>
                      <a
                        id="vehicleelement"
                        key={"vehicleModels1112" + vehicleModel.name + index}
                        style={{ cursor: "pointer" }}
                        className="list-group-item list-group-item-action"
                        aria-current="true"
                        onClick={() => {
                          setCurrentModel(vehicleModel.name);
                          vehicleModelChoise(vehicleModel.name)
                          setShowList(false);
                        }}
                      >
                        <>{vehicleModel.name}</>
                      </a>
                      </>
                    ))}
                  </>
                )}
                {vehicleModelsList.length === 0 && (
                  <>
                    <a
                      id="vehicleelement"
                      key={"vehicleMode234234ls1112"}
                      style={{ cursor: "pointer" }}
                      className="list-group-item list-group-item-action"
                      aria-current="true"
                      onClick={() => {
                        setShowList(false);
                        vehicleModelChoise(currentModel)
                      }}
                    >
                      {currentModel}
                    </a>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

VehicleModelPicker.propTypes = {
  setVehicleModelValue: PropTypes.func.isRequired,
  currentVehicleModel: PropTypes.string
};

export default VehicleModelPicker;
