import React from "react";
import PropTypes from "prop-types";
import VehicleModelPicker from "../vehicle_model_picker";
import Button from "../button";
import SelectVehicleClassAndType from "../select_vehicle_class_and_type";

const CreateNewVehicle = (props) => {
  const [plateNumber, setPlateNumber] = React.useState(
    props.currentPlateNumber
  );
  const [newVehiclePlateNUmber, setNewVehiclePlateNUmber] = React.useState(props.currentPlateNumber);
  const [newVehicleType, setNewVehicleType] = React.useState(-1);
  const [newVehicleModel, setNewVehicleModel] = React.useState("");
  const [newVehicleTypeName, setNewVehicleTypeName] = React.useState("");
  const [newVehicleClassName, setNewVehicleClassName] = React.useState("");
  const [newVehicleOwner, setNewVehicleOwner] = React.useState(props.ownerID);
  const [newVehicleOwnerName, setNewVehicleOwnerName] = React.useState(
    props.ownerName
  );


  const selectVehicleClass = (id, name) => {
    setNewVehicleClassName(name);
  }
  const selectVehicleType = (id, name) => {
    setNewVehicleType(id);
    setNewVehicleTypeName(name);

  }
  

  const preCreateVehicle = () => {
    const vehicle = {
        id: -1,
        plate_number: newVehiclePlateNUmber,
        vehicle_model: newVehicleModel,
        owner_name: newVehicleOwnerName,
        vehicle_type_name: newVehicleTypeName,
        vehicle_class_name: newVehicleClassName,
        owner: newVehicleOwner ? newVehicleOwner: null,
        vehicle_type: newVehicleType,
        to_be_removed: false,
        to_be_added: true,
    };
    props.onCreate(vehicle)
  }


  return (
    <>
      <p className="fw-medium">
        Гос. номер: <b>{newVehiclePlateNUmber}</b>
      </p>
      {props.ownerName && (
        <>
          <p className="blockquote-footer">Владелец: {newVehicleOwnerName}</p>
        </>
      )}
      {!props.ownerName && (
        <div className="form-floating mb-3">
          <input
            type="text"
            tabIndex={0}
            className="form-control text"
            onChange={(e) => {
              
            }}
            value={"СДЕЛАТЬ ВЫБОР ВЛАДЕЛЬЦА"}
          />
          <label htmlFor="accountent_phone">Модель ТС/ПЦ/ППЦ</label>
        </div>
      )}
      <VehicleModelPicker setVehicleModelValue={setNewVehicleModel} />
      <SelectVehicleClassAndType onSelectClass={selectVehicleClass} onSelectType={selectVehicleType}/>
      <Button
        clickHandler={() => {preCreateVehicle()}}
        colorClass="btn-success btn-sm"
        type="button"
        disabled={false}
      >
        <>Создать ТС/ПЦ/ППЦ</>
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
  );
};

CreateNewVehicle.propTypes = {
  currentPlateNumber: PropTypes.string.isRequired,
  ownerName: PropTypes.string,
  ownerID: PropTypes.number,
  onCreate: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default CreateNewVehicle;
