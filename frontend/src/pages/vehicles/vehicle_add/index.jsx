import React from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../../components/button";
import CreateNewVehicle from "../../../components/create_new_vehicle";
import api from "../../../api";

const VehicleAdd = (props) => {
  const ref = React.useRef(null);

  const [loading, setLoading] = React.useState(false);
  const [saveAccept, setSaveAccept] = React.useState(false);
  const [DELETE, setDELETE] = React.useState(false);

  const [plateNumber, setPlateNumber] = React.useState("");
  const [vehicleModel, setVehicleModel] = React.useState("");
  const [owner, setOwner] = React.useState(-1);
  const [ownerName, setOwnerName] = React.useState("");
  const [vehicleType, setvehicleType] = React.useState(-1);
  const [vehicleTypeName, setvehicleTypeName] = React.useState("");
  const [vehicleClass, setvehicleClass] = React.useState("");
  const [vehicleClassName, setvehicleClassName] = React.useState("");

  const navigate = useNavigate();
  const { vehicle_id } = useParams();

  const getVehicle = React.useCallback(() => {
    setLoading(true);
    api
      .getVehicle(vehicle_id)
      .then((res) => {
        setPlateNumber(res.plate_number);
        setVehicleModel(res.vehicle_model);
        setOwner(res.owner?.id);
        setvehicleType(res.vehicle_type?.id || 0);
        setOwnerName(res.owner?.name);
        setvehicleTypeName(res.vehicle_type?.name || "Класс ТС удалён");
        setvehicleClass(res.vehicle_type?.vehicle_class || "Класс ТС удалён");
        setvehicleClassName(res.vehicle_type?.vehicle_class_name || "Класс ТС удалён");
        setLoading(false);
      })
      .catch((err) => {
        console.log(err)
        const errors = Object.values(err);
        if (errors) {
          toast.error(errors.join(", "));
        }
      });
  }, []);

  const setVehicleInfo = (vehicle) => {
    setPlateNumber(vehicle.plate_number);
    setVehicleModel(vehicle.vehicle_model);
    setOwner(vehicle.owner);
    setvehicleType(vehicle.vehicle_type);
    setOwnerName(vehicle.owner_name);
    setvehicleTypeName(vehicle.vehicle_type_name);
    setvehicleClass(vehicle.vehicle_class);
    setvehicleClassName(vehicle.vehicle_class_name);
    setSaveAccept(true);
  };

  const getRefVehicleInfo = () => {
    ref.current.preCreateVehicle();
  };

  const CreateVehicle = React.useCallback(() => {
    let data = {
      plate_number: plateNumber,
      vehicle_model: vehicleModel,
      owner_id: owner,
      vehicle_type_id: vehicleType,
      without_plate_number: false,
    };
    api
      .createVehicle(data)
      .then((res) => {
        toast.success("ТС/ПП/ППЦ " + res.plate_number + " успешно добавлено");
        navigate(-1);
      })
      .catch((err) => {
        setSaveAccept(false);
        Object.keys(err).map((key) => toast.error(key + ": " + err[key]));
      });
  }, [plateNumber, vehicleModel, owner, vehicleType, navigate]);

  const UpdateVehicle = React.useCallback(() => {
    const data = {
      plate_number: plateNumber,
      vehicle_model: vehicleModel,
      owner_id: owner,
      vehicle_type_id: vehicleType,
    };
    api
      .updateVehicle(vehicle_id, data)
      .then((res) => {
        toast.success("Данные ТС/ПП/ППЦ " + res.plate_number + " обновлены");
        navigate(-1);
      })
      .catch((err) => {
        Object.keys(err).map((key) => toast.error(key + ": " + err[key]));
        setSaveAccept(false);
      });
  }, [vehicle_id, plateNumber, vehicleModel, owner, vehicleType, navigate]);

  React.useEffect(() => {
    if (saveAccept) {
      if (vehicle_id > 0) {
        UpdateVehicle();
      } else {
        CreateVehicle();
      }
    }
  }, [saveAccept, vehicle_id, UpdateVehicle, CreateVehicle]);

  React.useEffect(() => {
    if (vehicle_id) {
      getVehicle();
    }
  }, [vehicle_id, getVehicle]);

  return (
    <>
      {loading && (
        <p className="grid h-screen place-items-center text-center">
          Загрузка...
        </p>
      )}
      {!loading && (
        <>
          {vehicle_id ? (
            <p className="text-text-color fs-5">
              Редактирование данных ТС/ПП/ППЦ
            </p>
          ) : (
            <p className="text-text-color fs-5">Добавление нового ТС/ПП/ППЦ</p>
          )}
          <hr></hr>
          <form
            autoComplete="new-password"
            onSubmit={(e) => {
              e.preventDefault();
              {
                vehicle_id ? UpdateVehicle() : CreateVehicle();
              }
            }}
          >
            {vehicle_id > 0 && (
              <CreateNewVehicle
                ref={ref}
                currentPlateNumber={plateNumber}
                editPlateNumber={true}
                currentVehicleClass={parseInt(vehicleClass)}
                currentVehicleClassName={vehicleClassName}
                currentVehicleModel={vehicleModel}
                currentVehicleType={parseInt(vehicleType)}
                currentVehicleTypeName={vehicleTypeName}
                editOwner={true}
                ownerName={ownerName}
                ownerID={owner}
                onCreate={setVehicleInfo}
                onCancel={() => {}}
                hideButtons={true}
                setVehicleFromParent={true}
              />
            )}
            {vehicle_id === undefined && (
              <CreateNewVehicle
                ref={ref}
                currentPlateNumber={""}
                editPlateNumber={true}
                editOwner={true}
                onCreate={setVehicleInfo}
                onCancel={() => {}}
                hideButtons={true}
              />
            )}
            <hr></hr>
            <Button
              clickHandler={() => {
                getRefVehicleInfo();
              }}
              colorClass="btn-success"
              type="button"
              disabled={false}
            >
              <>
                {vehicle_id
                  ? "Сохранить ТС/ПП/ППЦ"
                  : "Добавить новое ТС/ПП/ППЦ"}
              </>
            </Button>
            <Button
              clickHandler={() => {
                navigate(-1);
              }}
              colorClass="btn-primary"
              type="button"
              disabled={false}
            >
              <>Назад</>
            </Button>

            {vehicle_id && (
              <>
                <div className="form-check form-switch form-check-reverse pb-2">
                  <input
                    className="form-check-input "
                    type="checkbox"
                    id="DELETE"
                    name="DELETE"
                    onChange={() => {
                      setDELETE(!DELETE);
                    }}
                  />
                  <label className="form-check-label" htmlFor="DELETE">
                    Удалить данные о ТС/ПП/ППЦ
                  </label>
                </div>
                {DELETE && (
                  <>
                    <Button
                      clickHandler={() => {
                        props.setInfoStringForDelete(
                          "ТС/ПП/ППЦ  " + plateNumber
                        );
                        props.setId(vehicle_id);
                        navigate("./delete/");
                      }}
                      colorClass="btn-danger"
                      type="button"
                      disabled={false}
                    >
                      <>УДАЛИТЬ ЗАПИСЬ О ТС/ПП/ППЦ</>
                    </Button>
                  </>
                )}
              </>
            )}
          </form>
        </>
      )}
    </>
  );
};

VehicleAdd.propTypes = {
  setInfoStringForDelete: PropTypes.func,
  setId: PropTypes.func,
};

export default VehicleAdd;
