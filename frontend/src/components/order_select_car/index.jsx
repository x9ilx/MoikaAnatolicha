import React from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import api from "../../api";

import CreateNewVehicle from "../create_new_vehicle";
import Button from "../button";

const OrderSelectCar = (props) => {
  const [loading, setLoading] = React.useState(false);
  const [createVehicle, setCreateVehicle] = React.useState(false);
  const [showList, setShowList] = React.useState(false);

  const [currentPlateNumber, setCurrentPlateNumber] = React.useState("");
  const [currentVehicle, setCurrentVehicle] = React.useState(null);
  const [vehicleList, setVehicleList] = React.useState([]);

  const getVehicles = React.useCallback((search) => {
    api
      .getVehicles(search, "")
      .then((res) => {
        setVehicleList(res.results);
      })
      .catch((err) => {
        const errors = Object.values(err);
        if (errors) {
          toast.error(errors.join(", "));
        }
      });
  }, []);

  React.useEffect(() => {
    setLoading(true);
    getVehicles(currentPlateNumber);
    setLoading(false);
  }, []);

  const changeInput = (value) => {
    setCurrentPlateNumber(value);
    if (value.length > 0) {
      setShowList(true);
      getVehicles(value);
    } else {
      setShowList(false);
    }
  };

  const changeCurrentVehicle = (vehicle, addded_new) => {
    const newvehicle = {
      id: vehicle.id,
      plate_number: vehicle.plate_number,
      vehicle_model: vehicle.vehicle_model,
      owner_name: vehicle.owner.name || vehicle.owner_name,
      vehicle_type_name: vehicle.vehicle_type.name || vehicle.vehicle_type_name,
      vehicle_class_name: vehicle.vehicle_type.vehicle_class_name || vehicle.vehicle_class_name,
      vehicle_class: vehicle.vehicle_type.vehicle_class || vehicle.vehicle_class,
      owner: vehicle.owner.id || vehicle.owner,
      vehicle_type: vehicle.vehicle_type.id || vehicle.vehicle_type,
      to_be_removed: false,
      to_be_added: addded_new,
    };
    setCurrentVehicle(newvehicle);
    setCurrentPlateNumber(newvehicle.plate_number);
    props.onSelect(newvehicle);
    props.setShowInteface(true);
  };
  return (
    <>
      {loading && (
        <p className="grid h-screen place-items-center text-center">
          Загрузка списка ТС/ПП/ППЦ...
        </p>
      )}
      {!loading && (
        <>
          {!createVehicle && (
            <>
              <input
                key={"vehiclexcvxczvdfh5675467456List"}
                className="form-control text"
                type="search"
                placeholder="Гос. номер ТС/ПП/ППЦ"
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
                          <div
                            key={"vehicleList" + vehicle?.plate_number + index}
                          >
                            <a
                              id="vehicleelement"
                              key={
                                "vehicleList" + vehicle?.plate_number + index
                              }
                              style={{ cursor: "pointer" }}
                              className="list-group-item list-group-item-action"
                              aria-current="true"
                              onClick={() => {
                                changeCurrentVehicle(vehicle, false);
                                setShowList(false);
                              }}
                            >
                              <b>{vehicle?.without_plate_number ? "Без. гос. номера" : vehicle?.plate_number}:</b>{" "}
                              {vehicle?.vehicle_type?.vehicle_class_name}{" "}
                              {vehicle?.vehicle_model} (
                              {vehicle?.vehicle_type?.name})
                              {vehicle?.owner
                                ? " / " + vehicle?.owner?.name
                                : ""}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {vehicleList.length === 0 &&
                    currentPlateNumber.length >= 8 && (
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
                                setCreateVehicle(true);
                                props.setShowInteface(false);
                              }}
                              colorClass="btn-info btn-sm"
                              disabled={false}
                              type="button"
                              hint={
                                "Добавить новый ТС/ПП/ППЦ " + currentPlateNumber
                              }
                            >
                              <>Создать ТС/ПП/ППЦ {currentPlateNumber}</>
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                </>
              )}
            </>
          )}
          {createVehicle && (
            <>
              <CreateNewVehicle
                currentPlateNumber={currentPlateNumber}
                editOwner={true}
                onCreate={(vehicle) => {changeCurrentVehicle(vehicle, true)}}
                onCancel={() => {
                  setCreateVehicle(false);
                  setShowList(false);
                  props.setShowInteface(true);
                }}
              />
            </>
          )}
        </>
      )}
    </>
  );
};

OrderSelectCar.propTypes = {
  onSelect: PropTypes.func.isRequired,
  setShowInteface: PropTypes.func.isRequired,
};

export default OrderSelectCar;
