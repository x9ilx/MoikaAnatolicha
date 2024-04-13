import React from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import api from "../../api";
import { ImCross } from "react-icons/im";
import { FaTrashRestore } from "react-icons/fa";
import { isMobile } from "react-device-detect";

const DataListVehicle = (props) => {
  const [showList, setShowList] = React.useState(false);
  const [vehicleList, setVehicleList] = React.useState([]);
  const [vehicleListFinal, setVehicleListFinal] = React.useState([]);
  const [excludes, setExcludes] = React.useState([]);
  const [currentPlateNumber, setCurrentPlateNumber] = React.useState("");

  React.useEffect(() => {
    setVehicleListFinal(props.vehicleListFinal);
    let excludes_plate_number = [];
    props.vehicleListFinal?.map((vehicle) => (
      excludes_plate_number.push(vehicle.plate_number)
    ))
    setExcludes(excludes_plate_number)
  }, [props.vehicleListFinal]);

  const markDelete = (index, mark) => {
    let newState = [...vehicleListFinal];
    newState[index].to_be_removed = mark;
    setVehicleListFinal(newState);
  };

  const cancelAddNew = (index) => {
    const copyValues = [...vehicleListFinal];
    copyValues.splice(index, 1);
    setVehicleListFinal(copyValues);
  };

  const getVehicles = React.useCallback((search) => {
    
    api
      .getVehicles(search, excludes)
      .then((res) => {
        setVehicleList(res.results);
      })
      .catch((err) => {
        const errors = Object.values(err);
        if (errors) {
          toast.error(errors.join(", "));
        }
      });
  }, [excludes]);

  const changeInput = (value) => {
    setCurrentPlateNumber(value);
    if (value.length > 0) {
      setShowList(true);
      getVehicles(value);
    } else {
      setShowList(false);
    }
  };

  const vehicleChange = (vehicle) => {
    setCurrentPlateNumber("");
    setShowList(false);
    let newData = {
      id: vehicle.id ? vehicle.id : -1,
      plate_number: vehicle.plate_number,
      owner_name: props.ownerName,
      vehicle_type_name: vehicle.vehicle_type.name,
      vehicle_class_name: vehicle.vehicle_type.vehicle_class_name,
      to_be_removed: false,
      to_be_added : true,

    };
    let newState = [...vehicleListFinal, newData];
    props.setVehicleListFinal(newState)
  };

  return (
    <>
      <p className="fw-medium"></p>
      <div className="form-floating ">
        <input
          className="form-control text"
          id="name"
          placeholder="name"
          onChange={(e) => {
            changeInput(e.target.value);
          }}
          value={currentPlateNumber}
          name="name"
        />
        <label htmlFor="name">Привязать (введите гос. номер)</label>
      </div>

      {showList && vehicleList.length > 0 && (
        <div className="shadow p-2 m-0">
          <div className="list-group">
            {vehicleList?.map((vehicle, index) => {
              return (
                <a
                  key={"vehicleList" + vehicle?.plate_number + index}
                  href="#"
                  className="list-group-item list-group-item-action"
                  aria-current="true"
                  onClick={() =>
                    vehicleChange(vehicle)
                  }
                >
                  {vehicle?.plate_number}:{" "}
                  {vehicle?.vehicle_type?.vehicle_class_name}{" "}
                  {vehicle?.vehicle_model} ({vehicle?.vehicle_type?.name})
                </a>
              );
            })}
          </div>
        </div>
      )}

      <p className="fw-medium">Список ТС/ПЦ/ППЦ:</p>
      <ul className="list-group my-3">
        {vehicleListFinal?.map((vehicle, index) => (
          
          <>
            <li
              key={"vehicleListFinal" + vehicle.plate_number + index}
              className={`list-group-item fs-7
              ${vehicle.to_be_removed ? " bg-danger text-white" : ""} 
              ${vehicle.to_be_added ? " bg-success text-white" : ""}`}
            >
              <div className="row">
                <div
                  className="col-10"
                  style={{ textShadow: "1px -1px 7px rgba(0,0,0,0.45)" }}
                >
                  {vehicle?.plate_number}:{" "}
                  {vehicle?.vehicle_class_name}{" "}
                  {vehicle?.vehicle_model} ({vehicle?.vehicle_type_name})
                </div>
                <>
                  {vehicle.id > 0 && (
                    <>
                      {!vehicle.to_be_removed && (
                        <>
                          <div
                            className={`col-2 ${
                              isMobile ? "text-center" : "text-end"
                            }`}
                            title="Пометить на удаление"
                          >
                            <ImCross
                              size={14}
                              className="text-danger"
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                markDelete(index, true);
                              }}
                            />
                          </div>
                        </>
                      )}
                      {vehicle.to_be_removed && (
                        <>
                          <div
                            className={`col-2 ${
                              isMobile ? "text-center" : "text-end"
                            }`}
                            title="Отменить удаление"
                          >
                            <FaTrashRestore
                              size={18}
                              className="text-white fw-medium"
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                markDelete(index, false);
                              }}
                            />
                          </div>
                        </>
                      )}
                    </>
                  )}
                  {vehicle.id <= 0 && (
                    <div
                      className={`col-2 ${
                        isMobile ? "text-center" : "text-end"
                      }`}
                      title="Отменить добавление"
                    >
                      <ImCross
                        size={14}
                        className="text-white"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          cancelAddNew(index);
                        }}
                      />
                    </div>
                  )}
                </>
              </div>
            </li>
          </>
        ))}
      </ul>
    </>
  );
};

DataListVehicle.propTypes = {
  vehicleListFinal: PropTypes.array.isRequired,
  setVehicleListFinal: PropTypes.func.isRequired,
  ownerName: PropTypes.string.isRequired,
};

export default DataListVehicle;
