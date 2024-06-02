import React from "react";
import { toast } from "react-toastify";
import api from "../../../api";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import Button from "../../../components/button";
import VehicleTypesEditList from "../../../components/vehicle_types_edit_list";

const VehicleClassEdit = (props) => {
  const [loading, setLoading] = React.useState(true);
  const [name, setName] = React.useState("");
  const [vehicleTypes, setVehicleTypes] = React.useState([]);
  const [DELETE, setDELETE] = React.useState(false);

  const navigate = useNavigate();
  const { vehicle_class_id } = useParams();

  const UpdateVehicleClass = () => {
    const data = {
      id: vehicle_class_id,
      name: name,
      vehicle_types: vehicleTypes,
    };
    api
      .updateVehicleClass(data)
      .then((data) => {
        toast.success("Класс ТС/ПП/ППЦ " + data.name + " успешно обновлён");
        navigate(0)
      })
      .catch((err) => {
        Object.keys(err).map((key) => toast.error(key + ": " + err[key]));
      });
  };

  const getVehicleClass = React.useCallback(() => {
    setLoading(true);
    api
      .getVehicleClass(vehicle_class_id)
      .then((res) => {
        setName(res.name);
        setVehicleTypes(res.vehicle_types);
        setLoading(false);
      })
      .catch((err) => {
        const errors = Object.values(err);
        if (errors) {
          toast.error(errors.join(", "));
        }
      });
  }, [vehicle_class_id]);

  React.useEffect(() => {
    getVehicleClass();
  }, [getVehicleClass, vehicle_class_id]);

  if (loading) {
    return (
      <>
        <p className="grid h-screen place-items-center text-center">
          Загрузка...
        </p>
      </>
    );
  }
  return (
    <>
      <p className="text-text-color fs-5">Редактирование класса ТС/ПП/ППЦ</p>
      <hr></hr>
      <form
        autoComplete="new-password"
        onSubmit={(e) => {
          e.preventDefault();
          UpdateVehicleClass();
        }}
      >
        <div className="form-floating mb-3">
          <input
            required
            className="form-control text"
            id="name"
            placeholder="name"
            onChange={(e) => {
              setName(e.target.value);
            }}
            value={name}
            name="name"
          />
          <label htmlFor="name">Название класса ТС/ПП/ППЦ</label>
        </div>
        <VehicleTypesEditList
          vehicleTypesList={vehicleTypes}
          setVehicleTypesList={setVehicleTypes}
        />
        <hr></hr>
        <Button
          clickHandler={() => {}}
          colorClass="btn-success"
          type="submit"
          disabled={false}
        >
          <>Сохранить</>
        </Button>
        <Button
          clickHandler={() => {
            navigate("/vehicles/classes/");
          }}
          colorClass="btn-primary"
          type="button"
          disabled={false}
        >
          <>Назад</>
        </Button>
        
        {vehicle_class_id && (
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
                    Удалить данные о классе ТС
                  </label>
                </div>
                {DELETE && (
                  <>
                    <Button
                      clickHandler={() => {
                        props.setInfoStringForDelete("класс ТС/ПП/ППЦ \"" + name + "\"? Все связные типы так же будут удалены");
                        props.setId(vehicle_class_id);
                        navigate("./delete/");
                      }}
                      colorClass="btn-danger"
                      type="button"
                      disabled={false}
                    >
                       <>УДАЛИТЬ ЗАПИСЬ КЛАСС ТС/ПП/ППЦ</>
                    </Button>
                  </>
                )}
                </>)}
      </form>
      
    </>
  );
};

VehicleClassEdit.propTypes = {
  setInfoStringForDelete: PropTypes.func,
  setId: PropTypes.func,
};

export default VehicleClassEdit;
