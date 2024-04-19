import React from "react";
import { toast } from "react-toastify";
import api from "../../../api";
import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router-dom";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import Button from "../../../components/button";

const EmployerAdd = (props) => {
  const [loading, setLoading] = React.useState(true);
  const [employeesPositions, setEmployeesPositions] = React.useState({});
  const [type, setType] = React.useState("password");
  const [icon, setIcon] = React.useState(
    <FaRegEyeSlash className="absolute mr-10" size={25} />
  );
  const [DELETE, setDELETE] = React.useState(false);

  const [name, setName] = React.useState("");
  const [short_name, setShortName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [position, setPosition] = React.useState("");
  const [addUser, setAddUser] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [user_name, set_user_name] = React.useState("");

  const navigate = useNavigate();
  const { employer_id } = useParams();

  const getEmployeesPositionsList = React.useCallback(() => {
    setLoading(true);
    api
      .getEmployeesPositions()
      .then((res) => {
        setEmployeesPositions(res);
        setPosition(res[0].name);
        setLoading(false);
      })
      .catch((err) => {
        const errors = Object.values(err);
        if (errors) {
          toast.error(errors.join(", "));
        }
      });
  }, []);

  const getEmployer = React.useCallback(() => {
    setLoading(true);
    api
      .getEmployer(employer_id)
      .then((res) => {
        setName(res.name);
        setShortName(res.short_name);
        setPhone(res.phone);
        setPosition(res.position);
        setAddUser(false);
        setUsername(res.user_name);
        setPassword("");
        set_user_name(res.user_name);
        setLoading(false);
      })
      .catch((err) => {
        const errors = Object.values(err);
        if (errors) {
          toast.error(errors.join(", "));
        }
      });
  }, []);

  const handleToggle = () => {
    if (type === "password") {
      setIcon(<FaRegEye className="absolute mr-10" size={25} />);
      setType("text");
    } else {
      setIcon(<FaRegEyeSlash className="absolute mr-10" size={25} />);
      setType("password");
    }
  };

  React.useEffect(() => {
    getEmployeesPositionsList();

    if (employer_id) {
      getEmployer();
    }
  }, [getEmployeesPositionsList, employer_id, getEmployer]);

  const CreateEmployer = () => {
    const data = {
      name: name,
      short_name: short_name,
      phone: phone,
      position: position,
      add_user: addUser,
      username: username,
      password: password,
    };
    api
      .createEmployer(data)
      .then((data) => {
        toast.success("Сотрудник " + data.name + " успешно добавлен");
        navigate(-1);
      })
      .catch((err) => {
        Object.keys(err).map((key) => toast.error(key + ": " + err[key]));
      });
  };

  const UpdateEmployer = () => {
    const data = {
      id: employer_id,
      name: name,
      short_name: short_name,
      phone: phone,
      position: position,
      add_user: addUser,
      username: username,
      password: password,
    };
    api
      .updateEmployer(data)
      .then((data) => {
        toast.success("Данные сотрудника " + data.name + " обновлены");
        navigate(-1);
      })
      .catch((err) => {
        Object.keys(err).map((key) => toast.error(key + ": " + err[key]));
      });
  };

  return (
    <>
      {loading && (
        <p className="grid h-screen place-items-center text-center">
          Загрузка...
        </p>
      )}
      {!loading && (
        <>
          {employer_id ? (
            <p className="text-text-color fs-5">
              Редактирование данных сотрудника
            </p>
          ) : (
            <p className="text-text-color fs-5">Добавление нового сотрудника</p>
          )}
          <hr></hr>
          <form
            autoComplete="new-password"
            onSubmit={(e) => {
              e.preventDefault();
              {
                employer_id ? UpdateEmployer() : CreateEmployer();
              }
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
              <label htmlFor="name">Ф. И. О.</label>
            </div>
            <div className="form-floating  mb-3 ">
              <input
                required
                className="form-control text "
                id="short_name"
                placeholder="short_name"
                value={short_name}
                title={"Короткое имя отображается в CRM"}
                onChange={(e) => {
                  setShortName(e.target.value);
                }}
                name="short_name"
              />
              <label htmlFor="short_name">Короткое имя</label>
            </div>
            <div className="form-floating  mb-3 ">
              <input
                type="number"
                className="form-control text "
                id="phone"
                placeholder="phone"
                value={phone}
                title={"Без пробелов, скобок и дефисов"}
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
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
                value={position}
                onChange={(e) => {
                  setPosition(e.target.value);
                }}
                name="position"
              >
                {employeesPositions?.map((position, ind) => (
                  <option key={ind} value={position.name}>
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
                checked={addUser}
                onChange={() => {
                  setAddUser(!addUser);
                }}
              />
              <label className="form-check-label" htmlFor="add_user">
                {user_name
                  ? "Изменить имя пользователя в CRM или пароль"
                  : "Добавить пользователя для CRM"}
              </label>
            </div>

            {addUser && (
              <>
                <div className="form-floating  mb-3 ">
                  <input
                    className="form-control text "
                    id="username"
                    placeholder="username"
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                    name="username"
                    value={username}
                    title={
                      user_name
                        ? "Новое имя пользователя"
                        : "Имя пользователя для входа в CRM"
                    }
                    autoComplete="new-password"
                  />
                  <label htmlFor="username">Имя пользователя</label>
                </div>
                <div className="input-group mb-3">
                  <div className="form-floating  mb-3 ">
                    <input
                      className="form-control text "
                      type={type}
                      id="password"
                      placeholder="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                      name="password"
                      title={
                        user_name
                          ? "Ввести новый пароль, для изменения старого"
                          : "Пароль для входа в CRM"
                      }
                      autoComplete="new-password"
                    />
                    <label htmlFor="password">
                      {user_name
                        ? "Ввести новый пароль, для изменения старого"
                        : "Пароль (можно изменить позже)"}
                    </label>
                  </div>
                  <div className="input-group-prepend">
                    <span
                      className="input-group-text p-3"
                      onClick={handleToggle}
                    >
                      {icon}
                    </span>
                  </div>
                </div>
              </>
            )}
<hr></hr>
            <Button
              clickHandler={() => {}}
              colorClass="btn-success"
              type="submit"
              disabled={false}
            >
              <>{employer_id
                ? "Сохранить информацию о сотруднике"
                : "Добавить нового сотрудника"}</>
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

            {employer_id && (
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
                    Удалить данные о сотруднике
                  </label>
                </div>
                {DELETE && (
                  <>
                    <Button
                      clickHandler={() => {
                        props.setInfoStringForDelete("сотрудника " + name);
                        props.setId(employer_id);
                        navigate("./delete/");
                      }}
                      colorClass="btn-danger"
                      type="button"
                      disabled={false}
                    >
                       <>УДАЛИТЬ ЗАПИСЬ О СОТРУДНИКЕ</>
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

EmployerAdd.propTypes = {
  setInfoStringForDelete: PropTypes.func,
  setId: PropTypes.func,
};

export default EmployerAdd;
