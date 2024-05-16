import React from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { isMobile } from "react-device-detect";
import { ImCross } from "react-icons/im";
import { FaTrashRestore } from "react-icons/fa";

const VehicleTypesEditList = (props) => {
    const [vehicleList, setVehicleList] = React.useState([])
    const [newName, setNewName] = React.useState("")
    const [disableAddButton, setDisableAddButton]  = React.useState(true)
    
    React.useEffect(() => {
        setVehicleList(props.vehicleTypesList)
    }, [])

    React.useEffect(() => {
        props.setVehicleTypesList(vehicleList);
    }, [props, vehicleList])

    const markDelete = (index, mark) => {
        let newState = [...vehicleList]
        newState[index].to_be_removed = mark;
        setVehicleList(newState)
    }

    const addNew = () => {
        let newData = {
            id: -1,
            name: newName,
            to_be_removed: false,
            to_be_added: true
        }
        let newState = [...vehicleList, newData]
        setVehicleList(newState)
        setNewName("");
    }

    const cancelAddNew = (index) => {
        const copyValues= [...vehicleList];
        copyValues.splice(index, 1);
        setVehicleList(copyValues)
    }

    const onChangeAddNew = (value) => {
        setNewName(value);
        if (value.trim().length === 0)
        {
            setDisableAddButton(true);
        }
        else
        {
            setDisableAddButton(false);
        }
    }
  return (
    <>
      <p className="fw-medium">Список типов:</p>
      <form className="d-flex mb-3" role="search">
        <input
          className="form-control me-2"
          type="text"
          placeholder="Добавить тип ТС/ПП/ППЦ"
          aria-label="Search"
          value={newName}
          onChange={(e) => {
            onChangeAddNew(e.target.value);
          }}
        />
        <button
          className="btn btn-info text-white"
          style={{ textShadow: "1px -1px 7px rgba(0,0,0,0.45)" }}
          type="button"
          onClick={() => {addNew()}}
          disabled={disableAddButton}
        >
          Добавить
        </button>
      </form>
      <ul className="list-group mb-3">
        {vehicleList?.map((vehicle_type, index) => (
          <>
            <li
              key={vehicle_type.id}
              className={`list-group-item fs-7
              ${vehicle_type.to_be_removed ? " bg-danger text-white" : ""} 
              ${vehicle_type.to_be_added ? " bg-success text-white" : ""}`}
            >
              <div className="row">
                <div
                  className="col-10"
                  style={{ textShadow: "1px -1px 7px rgba(0,0,0,0.45)" }}
                >
                  {vehicle_type.name}
                </div>
                <>
                {vehicle_type.id > 0 && (
                  <>
                    {!vehicle_type.to_be_removed && (
                      <>
                        <div
                          className={`col-2 ${isMobile ? "text-center": "text-end"}`}
                          title="Пометить тип на удаление"
                          
                        >
                          <ImCross
                            size={14}
                            className="text-danger"
                            style={{ cursor: "pointer" }}
                            onClick={() => {markDelete(index, true)}}
                          />
                        </div>
                      </>
                    )}
                    {vehicle_type.to_be_removed && (
                      <>
                        <div
                          className={`col-2 ${isMobile ? "text-center": "text-end"}`}
                          title="Отменить удаление"
                        >
                          <FaTrashRestore
                            size={18}
                            className="text-white fw-medium"
                            style={{ cursor: "pointer" }}
                            onClick={() => {markDelete(index, false)}}
                          />
                        </div>
                      </>
                    )}
                  </>
                )}
                {vehicle_type.id <= 0 && (
                    <div
                    className={`col-2 ${isMobile ? "text-center": "text-end"}`}
                    title="Отменить добавление"
                    
                  >
                    <ImCross
                      size={14}
                      className="text-white"
                      style={{ cursor: "pointer" }}
                      onClick={() => {cancelAddNew(index)}}
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

VehicleTypesEditList.propTypes = {
  vehicleTypesList: PropTypes.array.isRequired,
  setVehicleTypesList: PropTypes.func.isRequired,
};

export default VehicleTypesEditList;
