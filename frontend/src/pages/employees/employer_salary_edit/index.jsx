import React from "react";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import api from "../../../api";
import OrderElementGroup from "../../orders/order_element_group";
import Button from "../../../components/button";


function AdminShiftEdit(props) {
  const [loading, setLoading] = React.useState(false);
  const [salary, setSalary] = React.useState(null);
  const [DELETE, setDELETE] = React.useState(false);

  const { employer_id, salary_id } = useParams();

  const navigate = useNavigate();

  const getSalary = React.useCallback(() => {
    setLoading(true);
    api
      .getAdministratorSalary(salary_id)
      .then((res) => {
        setSalary(res);
        setLoading(false);
      })
      .catch((err) => {
        Object.keys(err).map((key) => toast.error(key + ": " + err[key]));
      });
  }, [salary_id]);

  React.useEffect(() => {
    getSalary();
  }, []);

  if (loading) {
    return (
      <p className="grid h-screen place-items-center text-center mb-2">
        Загрузка данных о ЗП...
      </p>
    );
  }

  if (!loading) {
    return (
      <div className="container fs-6">
        <p className="fw-medium ">
          ЗП {salary?.employer.position === "ADMINISTRATOR" ? "админстратора" : "мойщика"}: {salary?.employer?.name}
        </p>
        <hr></hr>
        <OrderElementGroup
          header="Информация о ЗП"
          elements_with_badge={[
            {
              name: (
                <span>
                  Дата выдачи:{" "}
                  {new Date(salary?.date_of_issue).toLocaleDateString()}г.
                </span>
              ),
            },
            {
              name: (
                <span>
                  Диапазон смен: c{" "}
                  {new Date(salary?.start_date).toLocaleDateString()}г. по{" "}
                  {new Date(salary?.end_date).toLocaleDateString()}г.
                </span>
              ),
            },
            {
              name: (
                <span>Доход от заказов: {salary?.total_order_income}₽</span>
              ),
            },
            {
              name: (
                <span>
                  <strong>ЗП {salary?.employer.position === "ADMINISTRATOR" ? "админстратора" : "мойщика"}: {salary?.employer_salary}₽</strong>
                </span>
              ),
            },
          ]}
        />
                <hr></hr>
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
            Удалить данные о ЗП
          </label>
        </div>
        <Button
          clickHandler={() => {
            // window.open(`${api.getSalaryDocPDFURL(employer_id, salary_id)}`,'_blank', 'rel=noopener noreferrer')
            api.getSalaryDocPDFURL(employer_id, salary_id);
          }}
          colorClass="btn-info"
          type="button"
          disabled={false}
        >
          <>Печать квитанции</>
        </Button>

        {DELETE && (
          <>
            <Button
              clickHandler={() => {
                props.setInfoStringForDelete("ЗП администратора " + salary?.employer.name);
                props.setId(salary_id);
                navigate("./delete/");
              }}
              colorClass="btn-danger"
              type="button"
              disabled={false}
            >
              <>УДАЛИТЬ ЗАПИСЬ О ЗП</>
            </Button>
          </>
        )}
        <Button
          clickHandler={() => {
            navigate("/employees/salaries/");
          }}
          colorClass="btn-primary"
          type="button"
          disabled={false}
        >
          <>Назад</>
        </Button>
      </div>
    );
  }
}

AdminShiftEdit.propTypes = {
    setInfoStringForDelete: PropTypes.func,
    setId: PropTypes.func,
  };

export default AdminShiftEdit;
