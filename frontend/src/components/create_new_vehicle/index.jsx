import React from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import VehicleModelPicker from "../vehicle_model_picker";
import Button from "../button";
import SelectVehicleClassAndType from "../select_vehicle_class_and_type";
import VehicleOwnerPicker from "../vehicle_owner_picker";

const CreateNewVehicle = React.forwardRef(function MyInput(props, ref) {
  const [newVehiclePlateNUmber, setNewVehiclePlateNUmber] = React.useState(
    props.currentPlateNumber
  );
  const [newVehicleType, setNewVehicleType] = React.useState(
    props.currentVehicleType
  );
  const [newVehicleModel, setNewVehicleModel] = React.useState(
    props.currentVehicleModel
  );
  const [newVehicleTypeName, setNewVehicleTypeName] = React.useState(
    props.currentVehicleTypeName
  );
  const [newVehicleClass, setNewVehicleClass] = React.useState(0);
  const [oldVehicleClass, setOldVehicleClass] = React.useState(
    props.currentVehicleClass
  );
  const [newVehicleClassName, setNewVehicleClassName] = React.useState(
    props.currentVehicleClassName
  );
  const [newVehicleOwner, setNewVehicleOwner] = React.useState(props.ownerID);
  const [newVehicleOwnerName, setNewVehicleOwnerName] = React.useState(
    props.ownerName
  );

  const id = React.useId();

  React.useImperativeHandle(ref, () => ({
    preCreateVehicle,
  }));

  const selectVehicleOwner = (id, name) => {
    setNewVehicleOwner(id);
    setNewVehicleOwnerName(name);
  };
  const selectVehicleClass = (id, name) => {
    setNewVehicleClass(id);
    setNewVehicleClassName(name);
  };
  const selectVehicleType = (id, name) => {
    setNewVehicleType(id);
    setNewVehicleTypeName(name);
  };

  const preCreateVehicle = () => {
    if (!newVehicleModel || newVehicleModel.length <= 0) {
      toast.error("Необходимо указать модель");
      return;
    }
    if (props.editOwner && (!newVehicleOwner || newVehicleOwner <= 0)) {
      toast.error("Необходимо выбрать владельца из списка");
      return;
    }
    if (!newVehiclePlateNUmber || newVehiclePlateNUmber.length === 0) {
      toast.error("Необходимо указать гос. номер");
      return;
    }
    if (newVehiclePlateNUmber.length < 8) {
      toast.error("Гос. номер должен содержать не меньше 8 символов");
      return;
    }
    const vehicle = {
      id: -1,
      plate_number: newVehiclePlateNUmber,
      vehicle_model: newVehicleModel,
      owner_name: newVehicleOwnerName,
      vehicle_type_name: newVehicleTypeName,
      vehicle_class_name: newVehicleClassName,
      vehicle_class: newVehicleClass,
      owner: newVehicleOwner ? newVehicleOwner : null,
      vehicle_type: newVehicleType,
      to_be_removed: false,
      to_be_added: true,
      without_plate_number: props.noPlateNumber,
      unique_id: id,
    };

    props.onCreate(vehicle);
  };

  React.useEffect(() => {
    if (props.setVehicleFromParent) {
      setNewVehicleClass(parseInt(props.currentVehicleClass));
      setNewVehicleClassName(props.currentVehicleClassName);
      setNewVehicleModel(props.currentVehicleModel);
      setNewVehicleType(parseInt(props.currentVehicleType));
      setNewVehicleTypeName(props.currentVehicleTypeName);
    }
  }, []);

  return (
    <>
      {props.editPlateNumber ? (
        <>
          <div className="form-floating mb-3">
            <input
              type="text"
              tabIndex={0}
              className="form-control text"
              onChange={(e) => {
                setNewVehiclePlateNUmber(e.target.value);
              }}
              value={newVehiclePlateNUmber}
            />
            <label htmlFor="accountent_phone">Гос. Номер</label>
          </div>
        </>
      ) : (
        <>
          <p className="fw-medium">
            Гос. номер: <b>{newVehiclePlateNUmber}</b>
          </p>
        </>
      )}

      {props.ownerName && !props.editOwner && (
        <>
          <p className="blockquote-footer">Владелец: {newVehicleOwnerName}</p>
        </>
      )}
      {props.editOwner && (
        <VehicleOwnerPicker
          setVehicleOwnerValue={selectVehicleOwner}
          currentVehicleOwner={newVehicleOwner}
          currentVehicleOwnerName={newVehicleOwnerName}
        />
      )}
      <VehicleModelPicker
        currentVehicleModel={newVehicleModel}
        setVehicleModelValue={setNewVehicleModel}
      />

      <SelectVehicleClassAndType
        currentVehicleClass={oldVehicleClass}
        currentVehicleClassName={newVehicleClassName}
        currentVehicleType={newVehicleType}
        currentVehicleTypeName={newVehicleTypeName}
        onSelectClass={selectVehicleClass}
        onSelectType={selectVehicleType}
        setVehicleFromParent={props.setVehicleFromParent}
      />

      {!props.hideButtons && (
        <>
          <Button
            clickHandler={() => {
              preCreateVehicle();
            }}
            colorClass="btn-success btn-sm"
            type="button"
            disabled={false}
          >
            <>Создать ТС/ПП/ППЦ</>
          </Button>
          <Button
            clickHandler={() => {
              props.onCancel();
            }}
            colorClass="btn-primary btn-sm"
            type="button"
            disabled={false}
          >
            <>Отмена</>
          </Button>
        </>
      )}
      {props.noPlateNumber && props.hideButtons && (
        <Button
          clickHandler={() => {
            preCreateVehicle();
          }}
          colorClass="btn-success btn-sm"
          type="button"
          disabled={false}
        >
          <>Применить</>
        </Button>
      )}
    </>
  );
});

CreateNewVehicle.propTypes = {
  currentPlateNumber: PropTypes.string.isRequired,
  editPlateNumber: PropTypes.bool,
  currentVehicleClass: PropTypes.number,
  currentVehicleClassName: PropTypes.string,
  currentVehicleModel: PropTypes.string,
  currentVehicleType: PropTypes.number,
  currentVehicleTypeName: PropTypes.string,
  editOwner: PropTypes.bool,
  ownerName: PropTypes.string,
  ownerID: PropTypes.number,
  hideButtons: PropTypes.bool,
  onCreate: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  noPlateNumber: PropTypes.bool,
  setVehicleFromParent: PropTypes.bool,
};

export default CreateNewVehicle;
