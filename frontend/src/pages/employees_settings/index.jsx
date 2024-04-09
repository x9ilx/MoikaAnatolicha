import React from "react";
import { isMobile } from "react-device-detect";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";
import { prettyPhone } from "../../utils/string_utils";

const EmployeesSettings = () => {
  const [loading, setLoading] = React.useState(true);
  const [employees, setEmployees] = React.useState({});

  const navigate = useNavigate();

  const getEmployeesList = React.useCallback(async () => {
    setLoading(true);
    api
      .getEmployeesList()
      .then((res) => {
        setEmployees(res.results);
        setLoading(false);
      })
      .catch((err) => {
        const errors = Object.values(err);
        if (errors) {
          alert(errors.join(", "));
        }
      });
  }, []);

  React.useEffect(() => {
    getEmployeesList();
  }, [getEmployeesList]);

  {
    document.title = "Редактирование сотрудников Чистый Грузовик";
  }
  if (isMobile) {
    return (
      <>
        <div className="row">
          <div className="vstack gap-3">
            <div className="card shadow">
              <div className="card-header bg-secondary pl-2 pr-2 pt-1 pb-1">
                <div className="row fs-8 fw-medium">
                  <div className="col-8 text-start text-body-secondary">
                    ФАМИЛИЯ ИМЯ ОТЧЕСТВО
                  </div>
                  <div className="col-4 text-end text-body-secondary">
                    ДОЛЖНОСТЬ
                  </div>
                </div>
              </div>
              <div className="card-body p-1 pb-0">
                {/* <div className="d-flex align-items-center"> */}
                <div className="row px-4 d-sm-flex flex-sm-row flex-column fs-8">
                  <p>Пользователь CRM:</p>
                  <p>Телефон:</p>
                </div>
                <div className="row mx-3 gap-1 my-2">
                  <button type="button" className="col btn btn-sm btn-primary">
                    Редактировать
                  </button>
                  <button type="button" className="col btn btn-sm btn-danger">
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        {loading && (
          <p className="grid h-screen place-items-center">
            Загрузка списка сотрудников...
          </p>
        )}
        {!loading && (
          <>
            <p className="text-text-color fs-5">Сотрудники:</p>
            <div className="table-responsive-sm">
              <table className="table table-hover border-primary text-text-color fs-7 ">
                <thead>
                  <tr>
                    <th scope="row" className="text-text-color ">
                      Ф. И. О.
                    </th>
                    <th scope="row" className="text-text-color ">
                      Короткое имя
                    </th>
                    <th scope="row" className="text-text-color text-center">
                      Должность
                    </th>
                    <th scope="row" className="text-text-color text-center">
                      Телефон
                    </th>
                    <th scope="row" className="text-text-color text-center">
                      Пользователь CRM
                    </th>
                  </tr>
                </thead>
                <tbody className="">
                  {employees?.map((employer) => (
                    <tr className="align-middle" key={employer?.id}>
                      <td>
                        <Link
                          to={"/employees/" + employer?.id}
                          className="alert-link"
                        >{employer?.name} </Link>
                      </td>
                      <td>{employer?.short_name}</td>
                      <td className="text-center">{employer?.position_verbose}</td>
                      <td className="text-center">
                        {employer?.phone ? (
                          <a
                            href={"tel:" + employer.phone}
                            className="link-dark link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                          >
                            {prettyPhone(employer.phone)}
                          </a>
                        ) : (
                          "Не указан"
                        )}
                      </td>
                      <td className="text-center">{employer?.user_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </>
    );
  }
};

export default EmployeesSettings;
