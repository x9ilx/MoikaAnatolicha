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
      {loading && (
        <p className="grid h-screen place-items-center text-center">
          Загрузка списка сотрудников...
        </p>
      )}
      {!loading && (
      <>
        <div className="row">
          <div className="vstack gap-3">
          {employees?.map((employer) => (
            <div className="card shadow" key={employer?.id}>
              <div className="card-header bg-secondary pl-2 pr-2 pt-1 pb-1">
                <div className="row fs-8 fw-medium">
                  <div className="col-8 text-start text-body-secondary">
                    {employer?.short_name}
                  </div>
                  <div className="col-4 text-end text-body-secondary">
                    {employer?.position_verbose}
                  </div>
                </div>
              </div>
              <div className="card-body p-1 pb-0">
                <div className="row px-4 d-sm-flex flex-sm-row flex-column fs-8">
                  <p className="pt-1 mx-1 my-0"><b>Имя:</b> {employer?.name}</p>
                  <p className="py-0 mx-1 my-0"><b>Телефон:</b> {employer?.phone ? (
                          <a
                            href={"tel:" + employer.phone}
                            className="alert-link"
                          >
                            {prettyPhone(employer.phone)}
                          </a>
                        ) : (
                          "Не указан"
                        )}</p>
                  <p className="py-0 mx-1 my-0"><b>Пользователь CRM:</b> {employer?.user_name}</p>
                </div>
                <div className="row mx-3 gap-1 my-2">
                  <button type="button" className="col btn btn-sm btn-primary" onClick={()=>navigate("/employees/" + employer?.id)}>
                    Редактировать
                  </button>
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>
        </>)}
      </>
    );
  } else {
    return (
      <>
        {loading && (
          <p className="grid h-screen place-items-center text-center">
            Загрузка списка сотрудников...
          </p>
        )}
        {!loading && (
          <>
          <div className="row">
            <div className="col"><p className="text-text-color fs-5">Сотрудники:</p></div>
            <div className="col text-end">
            <button type="button" className="btn btn-sm btn-success text-white" onClick={()=>navigate("/employees/add")}>
                   Добавить сотрудника
            </button>
            </div>
          </div>
            
            <div className="table-responsive-sm">
              <table className="table table-hover  text-text-color fs-7 ">
                <thead>
                  <tr>
                    <th scope="row" className="text-text-color ">
                      Имя
                    </th>
                    <th scope="row" className="text-text-color ">
                      Короткое имя
                    </th>
                    <th scope="row" className="text-text-color ">
                      Должность
                    </th>
                    <th scope="row" className="text-text-color">
                      Телефон
                    </th>
                    <th scope="row" className="text-text-color ">
                      Пользователь CRM
                    </th>
                  </tr>
                </thead>
                <tbody className="">
                  {employees?.map((employer) => (
                    <tr className="align-middle" key={employer?.id} style={{cursor: 'pointer'}} onClick={() => navigate("/employees/" + employer?.id)}>
                      <td>{employer?.name}</td>
                      <td>{employer?.short_name}</td>
                      <td className="">{employer?.position_verbose}</td>
                      <td className="">
                        {employer?.phone ? prettyPhone(employer.phone)
                        : (
                          "Не указан"
                        )}
                      </td>
                      <td className="">{employer?.user_name}</td>
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
