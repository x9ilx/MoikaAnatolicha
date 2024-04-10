import React from "react";
import { toast } from 'react-toastify'
import { useFormWithValidation } from "../../utils/validation";
import api from "../../api";
import { useNavigate } from "react-router-dom";

const EmployerAdd = () => {
  const [loading, setLoading] = React.useState(true);
  const [employeesPositions, setEmployeesPositions] = React.useState({});

  const [name, setName] = React.useState("");
  const [short_name, setShortName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [position, setPosition] = React.useState("");
  const [addUser, setAddUser] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const navigate = useNavigate();

  const getEmployeesPositionsList = React.useCallback(async () => {
    setLoading(true);
    api
      .getEmployeesPositions()
      .then((res) => {
        setEmployeesPositions(res);
        setPosition(res[0].name)
        setLoading(false);
      })
      .catch((err) => {
        console.log(err)
        const errors = Object.values(err);
        if (errors) {
          alert(errors.join(", "));
        }
      });
  }, []);

  React.useEffect(() => {
    getEmployeesPositionsList();
  }, [getEmployeesPositionsList]);

  return (
    <>
      {loading && (
        <p className="grid h-screen place-items-center text-center">
          Загрузка...
        </p>
      )}
      {!loading && (
        <>
          <p className="text-text-color fs-5">Добавление нового сотрудника</p>
          <hr></hr>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const data = {
                name: name,
                short_name: short_name,
                phone: phone,
                position: position,
                add_user: addUser,
                username: username,
                password: password,
              }
              api.createEmployer(data)
              .then((data) => {
                toast.success("Сотрудник " + data.name + " успешно добавлен");
                navigate(-1)
              })
              .catch((err) => {
                Object.keys(err).map((key) => (
                    alert(key + ": " + err[key])
                  ));
              })
            }}
          >
            <div className="form-floating mb-3">
              <input
                required
                className="form-control text"
                id="name"
                placeholder="name"
                onChange={(e) => {setName(e.target.value)}}
                name="name"
              />
              <label htmlFor="name">Ф. И. О.</label>
            </div>
            <div className="form-floating  mb-3 ">
              <input
                required
                className="form-control text "
                id="short_name"
                placeholder="short_name"
                onChange={(e) => {setShortName(e.target.value)}}
                name="short_name"
              />
              <label htmlFor="short_name">Короткое имя</label>
            </div>
            <div className="form-floating  mb-3 ">
              <input
                className="form-control text "
                id="phone"
                placeholder="phone"
                onChange={(e) => {setPhone(e.target.value)}}
                name="phone"
              />
              <label htmlFor="phone">Телефон</label>
            </div>
            <div className="mb-3 ">
              <p className="">Должность</p>
              <select
                required
                className="form-select text p-3"
                id="position"
                placeholder="position"
                onChange={(e) => {setPosition(e.target.value)}}
                name="position"
                defaultValue={position}
              >
                {employeesPositions?.map((position, ind) => (
                    <option key={ind} value={position.name} >
                      {position.verbose_name}
                    </option>
                ))}
              </select>
            </div>

            <div className="form-check form-switch form-check-reverse pb-2">
              <input
                className="form-check-input "
                type="checkbox"
                id="add_user"
                value={true}
                name="add_user"
                onChange={(e) => {setAddUser(!addUser)}}
              />
              <label
                className="form-check-label"
                htmlFor="add_user"
              >
                Добавить пользователя для CRM
              </label>
            </div>

            {addUser && (
              <>
                <div className="form-floating  mb-3 ">
                  <input
                    className="form-control text "
                    id="username"
                    placeholder="username"
                    onChange={(e) => {setUsername(e.target.value)}}
                    name="username"
                  />
                  <label htmlFor="username">Имя пользователя</label>
                </div>
                <div className="form-floating  mb-3 ">
                  <input
                    className="form-control text "
                    id="password"
                    placeholder="password"
                    onChange={(e) => {setPassword(e.target.value)}}
                    name="password"
                  />
                  <label htmlFor="password">
                    Пароль (можно изменить позже)
                  </label>
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-100 btn btn-success mt-3 text-white"
            >
              Добавить нового сотрудника
            </button>
            <button
              type="button"
              className="w-100 btn btn-primary mt-1 mb-5 text-white"
              onClick={() => {
                navigate(-1);
              }}
            >
              Отмена
            </button>
          </form>
        </>
      )}
    </>
  );
};

export default EmployerAdd;
