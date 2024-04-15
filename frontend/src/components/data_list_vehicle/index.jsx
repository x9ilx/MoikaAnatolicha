import React from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import api from "../../api";
import { ImCross } from "react-icons/im";
import { FaTrashRestore } from "react-icons/fa";
import { isMobile } from "react-device-detect";
import Button from "../button";


const DataListVehicle = (props) => {
  const [showList, setShowList] = React.useState(false);
  const [vehicleList, setVehicleList] = React.useState([]);
  const [vehicleListFinal, setVehicleListFinal] = React.useState([]);
  const [excludes, setExcludes] = React.useState([]);
  const [currentPlateNumber, setCurrentPlateNumber] = React.useState("");
  const [myModal, setMyModal] = React.useState(null)

  React.useEffect(() => {
    setVehicleListFinal(props.vehicleListFinal);
    let excludes_plate_number = [];
    props.vehicleListFinal?.map((vehicle) =>
      excludes_plate_number.push(vehicle.plate_number)
    );
    setExcludes(excludes_plate_number);
  }, [props.vehicleListFinal]);

  React.useEffect(() => {
    let excludes_plate_number = [];
    vehicleListFinal.map((vehicle) =>
      excludes_plate_number.push(vehicle.plate_number)
    );
    setExcludes(excludes_plate_number);
  }, [vehicleListFinal]);

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

  const getVehicles = React.useCallback(
    (search) => {
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
    },
    [excludes]
  );

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
      vehicle_model: vehicle.vehicle_model,
      owner_name: vehicle.owner?.name ? vehicle.owner?.name : "",
      vehicle_type_name: vehicle.vehicle_type.name,
      vehicle_class_name: vehicle.vehicle_type.vehicle_class_name,
      owner: vehicle.owner?.id ? vehicle.owner?.id : props.ownerId,
      vehicle_type: vehicle.vehicle_type.id,
      to_be_removed: false,
      to_be_added: true,
    };
    let newState = [...vehicleListFinal, newData];
    props.setVehicleListFinal(newState);
  };

  const closeOpenMenus = (e) => {
    let a_click = e.target.id === "vehicleelement";
    if (!a_click) {
      setCurrentPlateNumber("");
      setShowList(false);
    }
  };

  document.addEventListener("mousedown", closeOpenMenus);
  return (
    <>
      <input
        className="form-control text"
        type="search"
        placeholder="Привязать (поиск по гос. номеру)"
        aria-label="Search"
        value={currentPlateNumber}
        onChange={(e) => {
          changeInput(e.target.value);
        }}
      />
      {showList && (
        <>
          {vehicleList.length > 0 && (
            <div id="vehicleelement" className="shadow p-2 m-0 vehicle_datalist_container">
              <div id="vehicleelement" className="list-group vehicle_datalist_listgroup">
                {vehicleList?.map((vehicle, index) => {
                  return (
                    <a
                      id="vehicleelement"
                      key={"vehicleList" + vehicle?.plate_number + index}
                      style={{ cursor: "pointer" }}
                      className="list-group-item list-group-item-action"
                      aria-current="true"
                      onClick={() => vehicleChange(vehicle)}
                    >
                      <b>{vehicle?.plate_number}:</b>{" "}
                      {vehicle?.vehicle_type?.vehicle_class_name}{" "}
                      {vehicle?.vehicle_model} ({vehicle?.vehicle_type?.name})
                      {vehicle?.owner ? " / " + vehicle?.owner?.name : ""}
                    </a>
                  );
                })}
              </div>
            </div>
          )}
          {vehicleList.length === 0 && currentPlateNumber.length >= 8 && (
            <>
              <div id="vehicleelement" className="shadow p-2 m-0 vehicle_datalist_container">
                <div id="vehicleelement" className="list-group vehicle_datalist_listgroup">
                  <Button
                    id="vehicleelement"
                    clickHandler={() => {alert("test")}}
                    colorClass="btn-success btn-sm"
                    disabled={false}
                    type="button"
                    hint={"Добавить новый ТС/ПЦ/ППЦ " + currentPlateNumber}
                  >
                    Создать ТС/ПЦ/ППЦ {currentPlateNumber }
                  </Button>
                </div>
              </div>
            </>
          )}
        </>
      )}

      <p className="fw-medium mt-3">Список ТС/ПЦ/ППЦ:</p>
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
                  <b>{vehicle?.plate_number}:</b> {vehicle?.vehicle_class_name}{" "}
                  {vehicle?.vehicle_model} ({vehicle?.vehicle_type_name})
                  <br></br>
                  {vehicle?.owner_name}
                </div>
                <>
                  {!vehicle.to_be_added > 0 && (
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
                  {vehicle.to_be_added && (
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
  ownerId: PropTypes.number.isRequired,
};

export default DataListVehicle;
