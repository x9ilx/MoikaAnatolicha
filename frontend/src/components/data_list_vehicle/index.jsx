import React from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import api from "../../api";
import { ImCross } from "react-icons/im";
import { FaTrashRestore } from "react-icons/fa";
import { isMobile } from "react-device-detect";
import Button from "../button";
import VehicleModelPicker from "../vehicle_model_picker";
import CreateNewVehicle from "../create_new_vehicle";

const DataListVehicle = (props) => {
  const [showList, setShowList] = React.useState(false);
  const [vehicleList, setVehicleList] = React.useState([]);
  const [vehicleListFinal, setVehicleListFinal] = React.useState([]);
  const [excludes, setExcludes] = React.useState([]);
  const [currentPlateNumber, setCurrentPlateNumber] = React.useState("");
  const [showVehicleList, setShowVehicleList] = React.useState(true);
  const [createVehicle, setCreateVehicle] = React.useState(false);

  const [noPlateNumber, setNoPlateNumber] = React.useState(false);

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
    props.setVehicleListFinal(newState);
  };

  const cancelAddNew = (index) => {
    const copyValues = [...vehicleListFinal];
    copyValues.splice(index, 1);
    props.setVehicleListFinal(copyValues);
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
      without_plate_number: vehicle.without_plate_number,
      to_be_removed: false,
      to_be_added: true,
    };
    let newState = [...vehicleListFinal, newData];
    props.setVehicleListFinal(newState);
    setCurrentPlateNumber("");
    setShowVehicleList(true);
    setCreateVehicle(false);
    props.onShowAdd(false);
  };

  const closeOpenMenus = (e) => {
    let a_click = e.target.id === "vehicleelement";
    if (!a_click) {
      setCurrentPlateNumber("");
      setShowList(false);
    }
  };

  const createNewVehicle = (vehicle) => {
    setCurrentPlateNumber("");
    setShowList(false);
    let newState = [...vehicleListFinal, vehicle];
    props.setVehicleListFinal(newState);
    setShowVehicleList(true);
    setCreateVehicle(false);
    props.onShowAdd(false);
  };

  document.addEventListener("mousedown", closeOpenMenus);
  return (
    <>
      {showVehicleList && (
        <>
          <input
            key={"vehiclexcvxczvdfh5675467456List"}
            className="form-control text"
            type="search"
            placeholder={props.header || "Привязать (поиск по гос. номеру)"}
            aria-label="Search"
            value={currentPlateNumber}
            onChange={(e) => {
              changeInput(e.target.value);
            }}
          />
          {showList && (
            <>
              {vehicleList.length > 0 && (
                <div
                  key="lolololol12"
                  id="vehicleelement"
                  className="shadow p-2 m-0 vehicle_datalist_container"
                >
                  <div
                    key="vehisdfsdfasd2q3423cleList"
                    id="vehicleelement"
                    className="list-group vehicle_datalist_listgroup"
                  >
                    {vehicleList?.map((vehicle, index) => (
                      <div key={"vehicleList" + vehicle?.plate_number + index}>
                        <a
                          id="vehicleelement"
                          key={"vehicleList" + vehicle?.plate_number + index}
                          style={{ cursor: "pointer" }}
                          className="list-group-item list-group-item-action"
                          aria-current="true"
                          onClick={() => vehicleChange(vehicle)}
                        >
                          <b>
                            {vehicle?.without_plate_number
                              ? "Без гос. номера"
                              : vehicle?.plate_number}
                            :
                          </b>{" "}
                          {vehicle?.vehicle_type?.vehicle_class_name}{" "}
                          {vehicle?.vehicle_model} (
                          {vehicle?.vehicle_type?.name})
                          {vehicle?.owner ? " / " + vehicle?.owner?.name : ""}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {vehicleList.length === 0 && currentPlateNumber.length >= 8 && (
                <>
                  <div
                    key="ololololol25"
                    id="vehicleelement"
                    className="shadow p-2 m-0 vehicle_datalist_container"
                  >
                    <div
                      key={"vehicleListFina123sdfl5675675752323421342"}
                      id="vehicleelement"
                      className="list-group vehicle_datalist_listgroup"
                    >
                      <Button
                        key={"vehicleListFina123scvvbb222378887dfl"}
                        id="vehicleelement"
                        clickHandler={() => {
                          setShowVehicleList(false);
                          setCreateVehicle(true);
                          props.onShowAdd(true);
                        }}
                        colorClass="btn-info btn-sm"
                        disabled={false}
                        type="button"
                        hint={"Добавить новый ТС/ПП/ППЦ " + currentPlateNumber}
                      >
                        <>Создать ТС/ПП/ППЦ {currentPlateNumber}</>
                      </Button>
                      <div id="vehicleelement" className="form-check form-switch form-check-reverse pb-2">
                        <input
                          className="form-check-input "
                          type="checkbox"
                          id="vehicleelement"
                          name="NoPlateNumber"
                          onChange={() => {
                            setNoPlateNumber(!noPlateNumber);
                          }}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="vehicleelement"
                        >
                          Без гос. номера
                        </label>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          <p key={"vehicleListFina123sdfsdfsdfsdfl"} className="fw-medium mt-3">
            Список ТС/ПП/ППЦ:
          </p>
          <ul key={"vehicleListF345345ina123sdfl"} className="list-group my-3">
            {vehicleListFinal?.map((vehicle, index) => (
              <div key={"vehicleListFinal" + vehicle.plate_number + index}>
                <li
                  key={"vehicleListFinal" + vehicle.plate_number + index}
                  className={`list-group-item fs-7
              ${vehicle.to_be_removed ? " bg-danger text-white" : ""} 
              ${
                vehicle.to_be_added && !props.noColor
                  ? " bg-success text-white"
                  : ""
              }`}
                >
                  <div
                    key={"vehicleListFinal123" + vehicle.plate_number + index}
                    className="row"
                  >
                    <div className="d-flex">
                      <div
                        key={
                          "vehicleListFinal3332" + vehicle.plate_number + index
                        }
                        className="flex-grow-1 flex-fill"
                      >
                        <b
                          key={
                            "vehicleListFinal554" + vehicle.plate_number + index
                          }
                        >
                          {vehicle?.without_plate_number
                            ? "Без гос. номера"
                            : vehicle?.plate_number}
                          :
                        </b>{" "}
                        {vehicle?.vehicle_class_name} {vehicle?.vehicle_model}{" "}
                        {isMobile && <br />}({vehicle?.vehicle_type_name !== null ? vehicle?.vehicle_type_name : <><span className={`text-${vehicle.to_be_removed ? "white" : "danger"} fs-6 fw-bold`}>Класс ТС удалён. ТС будет удалено из списка, при сохранении.</span></>})
                        <br></br>
                        {vehicle?.owner_name}
                      </div>
                      <>
                        {!vehicle.to_be_added > 0 && (
                          <>
                            {!vehicle.to_be_removed && (
                              <>
                                <div
                                  key={
                                    "vehicleListFina434343434l" +
                                    vehicle.plate_number +
                                    index
                                  }
                                  className={`align-items-end`}
                                  title="Пометить на удаление"
                                >
                                  <ImCross
                                    key={
                                      "vehicleListFinweweweal" +
                                      vehicle.plate_number +
                                      index
                                    }
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
                                  key={
                                    "vehicleListFinjhjjal" +
                                    vehicle.plate_number +
                                    index
                                  }
                                  className={`col-2 ${
                                    isMobile ? "text-center" : "text-end"
                                  }`}
                                  title="Отменить удаление"
                                >
                                  <FaTrashRestore
                                    key={
                                      "vehicleListFinxcvxzcvzal" +
                                      vehicle.plate_number +
                                      index
                                    }
                                    size={18}
                                    className={`${
                                      !props.noColor
                                        ? "text-white"
                                        : "text-text-color"
                                    } fw-medium`}
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
                            key={
                              "vehicleListFina123sdfl" +
                              vehicle.plate_number +
                              index
                            }
                            className={`col-2 ${
                              isMobile ? "text-center" : "text-end"
                            }`}
                            title="Отменить добавление"
                          >
                            <ImCross
                              key={
                                "vehicleListFinalcvbn3432" +
                                vehicle.plate_number +
                                index
                              }
                              size={14}
                              className={`${
                                !props.noColor
                                  ? "text-white"
                                  : "text-text-color"
                              }`}
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                cancelAddNew(index);
                              }}
                            />
                          </div>
                        )}
                      </>
                    </div>
                  </div>
                </li>
              </div>
            ))}
          </ul>
        </>
      )}
      {createVehicle && (
        <>
          <CreateNewVehicle
            currentPlateNumber={noPlateNumber ? "Без гос. номера" : currentPlateNumber}
            noPlateNumber={noPlateNumber}
            ownerName={props.ownerName}
            ownerID={props.ownerId}
            onCreate={createNewVehicle}
            editOwner={props.editOwner || false}
            onCancel={() => {
              setShowVehicleList(true);
              setCreateVehicle(false);
              props.onShowAdd(false);
            }}
          />
        </>
      )}
    </>
  );
};

DataListVehicle.propTypes = {
  vehicleListFinal: PropTypes.array.isRequired,
  setVehicleListFinal: PropTypes.func.isRequired,
  ownerId: PropTypes.number.isRequired,
  ownerName: PropTypes.string.isRequired,
  editOwner: PropTypes.bool,
  onShowAdd: PropTypes.func,
  header: PropTypes.string,
  noColor: PropTypes.bool,
};

export default DataListVehicle;
