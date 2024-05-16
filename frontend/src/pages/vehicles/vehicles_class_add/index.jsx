import React from "react";
import { toast } from "react-toastify";
import api from "../../../api";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../../components/button";

const VehicleClassAdd = (props) => {
  const [name, setName] = React.useState("");

  const navigate = useNavigate();


  const CreateVehicleClass = () => {
    const data = {
      name: name,
    };
    api
      .createVehicleClass(data)
      .then((data) => {
        toast.success("Класс ТС/ПП/ППЦ " + data.name + " успешно добавлен");
        navigate(`../classes/${data.id}`);
      })
      .catch((err) => {
        Object.keys(err).map((key) => toast.error(key + ": " + err[key]));
      });
  };

  return (
        <>
          <p className="text-text-color fs-5">Добавление нового класса ТС/ПП/ППЦ</p>
          <hr></hr>
          <form
            autoComplete="new-password"
            onSubmit={(e) => {
              e.preventDefault();
              CreateVehicleClass();
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
            <Button
              clickHandler={() => {}}
              colorClass="btn-success"
              type="submit"
              disabled={false}
            >
              <>Добавить новый класс ТС/ПП/ППЦ</>
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
          </form>
        </>
  );
};

export default VehicleClassAdd;
